# Block Jumper's Adventure

A browser-based platformer game. Jump, collect coins, avoid enemies, and reach the end of each level. Play on desktop or phone.

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)

---

## Features

- **Platformer gameplay** — Run, jump, stomp enemies, collect coins
- **Multiple characters** — Choose **Blox**, **Verd**, or **Amber** before you start
- **Levels** — Hand-crafted first level, then procedurally generated levels with day/night themes
- **Mid-air jump** — One extra jump in the air (with cooldown)
- **High score** — Your best score is saved and shown after each game over
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

## Project structure

```
block_jumper-main/
├── index.html      # Main page
├── block-jumper.js # Game logic & canvas
├── block-jumper.css# Styles & layout
└── README.md
```

---

## Author

Developed by **Lukas** during a student internship.
