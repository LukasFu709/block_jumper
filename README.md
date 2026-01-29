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

The game can show a **top 10** leaderboard shared by all players, stored in a public [GitHub Gist](https://gist.github.com/). No Vercel or server config needed — everything is set in the code.

Follow these steps once; then the leaderboard works for everyone.

---

### Step 1: Create the Gist

1. Open **[gist.github.com](https://gist.github.com/)** in your browser and sign in to GitHub (or create an account).
2. You’ll see:
   - **Filename:** type exactly: `highscore.json`
   - **Content:** type exactly: `{"scores":[]}`
3. Choose **“Create public gist”** (not “Create secret gist”).
4. Click **“Create public gist”**.
5. After it’s created, look at the URL in the address bar. It will look like:
   - `https://gist.github.com/YourUsername/`**`a1b2c3d4e5f6...`**
   The part after the last `/` is your **Gist ID**. Copy it (e.g. `a1b2c3d4e5f6789...`) — you’ll paste it into the game in Step 3.

---

### Step 2: Create a Personal Access Token (so the game can save scores)

1. Open **[GitHub → Settings → Developer settings → Personal access tokens](https://github.com/settings/tokens)**.
   - Or: click your profile picture (top right) → **Settings** → left sidebar **Developer settings** → **Personal access tokens**.
2. Click **“Tokens (classic)”** (or “Fine-grained tokens” if you prefer).
3. Click **“Generate new token”** / **“Generate new token (classic)”**.
4. Give it a name, e.g. **Block Jumper leaderboard**.
5. Set an expiration if you want (e.g. 90 days, or “No expiration” for simplicity).
6. Under **Scopes**, tick only **`gist`** (so the token can only manage Gists, nothing else).
7. Click **“Generate token”**.
8. **Copy the token immediately** (it starts with `ghp_`). You won’t see it again. You’ll paste it into the game in Step 3.

---

### Step 3: Put the Gist ID and token into the game

1. Open **`block-jumper.js`** in your editor.
2. Near the top, find these two lines:
   ```js
   const LEADERBOARD_GIST_ID = '';   // Your public Gist ID (from the Gist URL)
   const LEADERBOARD_GIST_TOKEN = ''; // GitHub Personal Access Token with "gist" scope
   ```
3. Replace them with your values (keep the quotes):
   ```js
   const LEADERBOARD_GIST_ID = 'a1b2c3d4e5f6789...';   // paste your Gist ID here
   const LEADERBOARD_GIST_TOKEN = 'ghp_xxxxxxxx...';    // paste your token here
   ```
4. Save the file.

---

### Done

- **Gist ID** is public and safe to commit.
- **Token** is visible to anyone who views the page source. Use a token with only `gist` scope (as above). If the repo is public, you can use a separate GitHub account for the leaderboard to limit risk.

After that, the top 10 list loads from the Gist, and when a player makes the top 10 and enters their name, the score is saved and the leaderboard updates for everyone.

---

## Project structure

```
block_jumper-main/
├── index.html       # Main page
├── block-jumper.js  # Game logic & canvas
├── block-jumper.css # Styles & layout
├── qrcode.png       # QR code to open the game
└── README.md
```

---

## Author

Developed by **Lukas** during a student internship.
