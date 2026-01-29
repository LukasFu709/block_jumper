/**
 * Vercel serverless API: POST /api/submit-score
 * Body: { name: string, score: number }
 * Updates the global leaderboard in a GitHub Gist (top 10).
 * Token is read from Vercel env — never in the repo.
 *
 * Required env vars (in Vercel → Project → Settings → Environment Variables):
 *   GIST_ID     — your public Gist ID (e.g. 00d4ae0850016259ccb202568c85d8e4)
 *   GITHUB_TOKEN — GitHub PAT with "gist" scope (classic or fine-grained Gists: Read and write)
 */
const LEADERBOARD_FILENAME = 'highscore.json';
const LEADERBOARD_MAX = 10;

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
