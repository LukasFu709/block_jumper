/**
 * Vercel serverless API: POST /api/submit-score
 * Body: { name: string, score: number }
 * Updates the global leaderboard in a GitHub Gist (top 10).
 *
 * Required env vars (Vercel → Settings → Environment Variables):
 *   GIST_ID, GITHUB_TOKEN
 *   LEADERBOARD_BLOCKLIST — comma-separated words to block. Kept in Vercel only, not in repo.
 */
const LEADERBOARD_FILENAME = 'highscore.json';
const LEADERBOARD_MAX = 10;

function getBlocklist() {
  const raw = process.env.LEADERBOARD_BLOCKLIST || '';
  return raw.split(',').map((s) => s.trim().toLowerCase()).filter(Boolean);
}

function normalize(text) {
  return String(text)
    .toLowerCase()
    .replace(/0/g, 'o')
    .replace(/1/g, 'i')
    .replace(/3/g, 'e')
    .replace(/4/g, 'a')
    .replace(/5/g, 's')
    .replace(/7/g, 't')
    .replace(/8/g, 'b')
    .replace(/@/g, 'a')
    .replace(/\$/g, 's')
    .replace(/!/g, 'i')
    .replace(/\|/g, 'i')
    .replace(/\+/g, 't')
    .replace(/\[/g, 'i')
    .replace(/\]/g, 'i')
    .replace(/[^a-z]/g, '');
}

function hasBlockedSubstring(text) {
  const blocklist = getBlocklist();
  const n = normalize(text);
  return blocklist.some((word) => n.includes(word));
}

async function isProfane(text) {
  if (!text || text.length > 1000) return false;
  if (hasBlockedSubstring(text)) return true;
  try {
    const res = await fetch('https://vector.profanity.dev', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text }),
    });
    if (!res.ok) return false;
    const data = await res.json();
    return data.isProfanity === true;
  } catch (e) {
    return false;
  }
}

function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

module.exports = async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const gistId = process.env.GIST_ID || process.env.LEADERBOARD_GIST_ID;
  const token = process.env.GITHUB_TOKEN || process.env.GIST_TOKEN;
  if (!gistId || !token) {
    res.status(500).json({ error: 'Leaderboard not configured. Set GIST_ID and GITHUB_TOKEN in Vercel Environment Variables.' });
    return;
  }

  let name = '';
  let score = 0;
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
    name = String(body.name || '').trim().slice(0, 20) || 'Anonymous';
    score = Math.max(0, parseInt(body.score, 10) || 0);
  } catch (e) {
    res.status(400).json({ error: 'Invalid body' });
    return;
  }

  if (await isProfane(name)) {
    res.status(400).json({ error: 'Please choose a different name.' });
    return;
  }

  try {
    const getRes = await fetch(`https://api.github.com/gists/${gistId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
        'User-Agent': 'BlockJumperLeaderboard/1.0',
      },
    });
    if (!getRes.ok) {
      const err = await getRes.text();
      res.status(502).json({ error: 'Failed to load leaderboard', detail: err });
      return;
    }
    const gist = await getRes.json();
    const file = gist.files && gist.files[LEADERBOARD_FILENAME];
    let scores = [];
    if (file && file.content) {
      try {
        const data = JSON.parse(file.content);
        scores = Array.isArray(data.scores) ? data.scores : [];
      } catch (e) {}
    }
    scores.push({ name, score });
    scores.sort((a, b) => b.score - a.score);
    scores = scores.slice(0, LEADERBOARD_MAX);

    const patchRes = await fetch(`https://api.github.com/gists/${gistId}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
        'Content-Type': 'application/json',
        'User-Agent': 'BlockJumperLeaderboard/1.0',
      },
      body: JSON.stringify({
        files: {
          [LEADERBOARD_FILENAME]: {
            content: JSON.stringify({ scores }, null, 2),
          },
        },
      }),
    });
    if (!patchRes.ok) {
      const err = await patchRes.text();
      res.status(502).json({ error: 'Failed to save leaderboard', detail: err });
      return;
    }
    res.status(200).json({ scores });
  } catch (e) {
    res.status(500).json({ error: e.message || 'Server error' });
  }
}
