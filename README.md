# Block Jumper's Adventure

A browser-based platformer game. Jump, collect coins, avoid enemies, and reach the end of each level. Play on desktop or phone.

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)

### Scan to play on your phone

<img src="qrcode.png" alt="QR Code to play Block Jumper" width="180" height="180">

---

## Features

- **Platformer gameplay** — Run, jump, stomp enemies, collect coins
- **Multiple characters** — Choose **Blox**, **Verd**, or **Amber** before you start
- **Levels** — Hand-crafted first level, then procedurally generated levels with day/night themes
- **Mid-air jump** — One extra jump in the air (with cooldown)
- **High score** — Your best score is saved and shown after each game over
- **Global top 10** — Leaderboard stored on GitHub Gist; add your name when you make the top 10
- **Mobile-friendly** — Responsive layout and on-screen touch controls for phones and tablets

---

## How to play

| Action        | Desktop                    | Mobile        |
|---------------|----------------------------|---------------|
| Move left     | ← / **A**                  | ← button      |
| Move right    | → / **D**                  | → button      |
| Jump          | Space / ↑ / **W**         | ↑ button      |
| Mid-air jump  | **N** or **M** (when in air) | Tap ↑ again |

- **Stomp enemies** from above to defeat them; avoid touching them from the side.
- **Collect coins** for points. Reach the end of the level before time runs out.
- **Lives** — You lose one when hit by an enemy; game over when you run out.

---

## Run locally

1. Clone the repo:
   ```bash
   git clone https://github.com/YOUR_USERNAME/block_jumper-main.git
   cd block_jumper-main
   ```
2. Open `index.html` in your browser, or serve the folder with any static server, for example:
   ```bash
   npx serve .
   ```
   Then open the URL shown (e.g. `http://localhost:3000`).

No build step required — plain HTML, CSS, and JavaScript.

---

## Global leaderboard (GitHub Gist)

The game can show a **top 10** leaderboard stored in a public [GitHub Gist](https://gist.github.com/). The **Gist ID** lives in the code (safe to commit). The **token** lives only in **Vercel Environment Variables** — so GitHub won’t see it in the repo and won’t revoke it.

---

### Step 1: Create the Gist

1. Open **[gist.github.com](https://gist.github.com/)** and sign in.
2. **Filename:** `highscore.json`  
   **Content:** `{"scores":[]}`
3. Click **“Create public gist”**.
4. Copy the **Gist ID** from the URL (the part after the last `/`, e.g. `00d4ae0850016259ccb202568c85d8e4`).

---

### Step 2: Put the Gist ID in the game

1. Open **`block-jumper.js`** and find:
   ```js
   const LEADERBOARD_GIST_ID = '00d4ae0850016259ccb202568c85d8e4';
   ```
2. Replace the value with your Gist ID if it’s different. Save. This is safe to commit.

---

### Step 3: Create a GitHub token (for the server only)

1. Go to **[github.com/settings/tokens](https://github.com/settings/tokens)**.
2. **Classic:** “Generate new token (classic)” → tick only **gist** → Generate → copy the token (`ghp_...`).  
   **Or fine-grained:** “Fine-grained tokens” → Generate new → **Account permissions** → **Gists** = **Read and write** → Generate → copy the token (`github_pat_...`).
3. **Do not** put this token in the code or in the repo.

---

### Step 4: Add the token as a Vercel secret

1. Go to **[vercel.com](https://vercel.com)** → your project (Block Jumper).
2. Open **Settings** → **Environment Variables**.
3. Add three variables (for **Production**, and optionally Preview/Development):

   | Name          | Value                    | Sensitive |
   |---------------|--------------------------|-----------|
   | **GIST_ID**   | Your Gist ID (e.g. `00d4ae0850016259ccb202568c85d8e4`) | No        |
   | **GITHUB_TOKEN** | Your token (`ghp_...` or `github_pat_...`) | **Yes** ✓ |
   | **LEADERBOARD_BLOCKLIST** | Comma-separated words to block in leaderboard names (e.g. `word1,word2,word3`). Keep this list only in Vercel (mark Sensitive). Normalization (3→e, 1→i, etc.) is applied before checking. | **Yes** ✓ |

   The blocklist is never in the repo — only in Vercel. Add or remove words there as needed.

4. Save. **Redeploy** the project (Deployments → … on latest → Redeploy) so the new env vars are used.

---

### Done

- The game **reads** the leaderboard from the Gist (no token needed; Gist ID is in the code).
- When a player submits a score, the **browser** calls **`/api/submit-score`** (your Vercel serverless function). The **server** uses **GITHUB_TOKEN** from the env to update the Gist. The token never appears in the repo or in the browser.

Leaderboard and submit will work only when the game is deployed on Vercel (or another host that runs the `api/` route). Locally, the list still loads, but submit will fail unless you run a local server that implements `/api/submit-score`.

---

## Project structure

```
block_jumper-main/
├── api/
│   └── submit-score.js   # Vercel serverless: updates leaderboard Gist (uses GIST_ID + GITHUB_TOKEN from env)
├── index.html            # Main page
├── block-jumper.js       # Game logic & canvas
├── block-jumper.css      # Styles & layout
├── qrcode.png            # QR code to open the game
└── README.md
```

---

## Author

Developed by **Lukas** during a student internship.
