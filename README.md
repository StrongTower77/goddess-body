# 👑 Goddess Body — Fitness Plan

A personalized 30-day interactive fitness web app by **Martyy B Media™**.

**Client:** Coco Love The Goddess  
**Program:** Goddess Body — Fitness Plan  
**Duration:** June 24 – July 23, 2026  
**Goal:** Muscle gain + full body toning (133 → 150 lbs, Teyana Taylor physique reference)

---

## Features

- **30-day plan** displayed by week, expandable day cards
- **Yoga Warm-Up section** — progressive flows by week, displayed before every workout
- **Gym / Home toggle** — full exercise variants for both settings
- **🌸 Flare Day mode** — one tap swaps any workout for a fibromyalgia-safe gentle protocol
- **Cardio guidance** — pooled, seeded per day and gym/home mode
- **Nutrition tab** — 30 unique daily meal plans (surplus + anti-inflammatory)
- **Start My Plan button** — sets Day 1 date in localStorage, all 30 dates recalculate
- **Progress bar + TODAY badge** — tracks active plan
- **Reset with confirmation guard**
- **Responsive** — mobile-first design

---

## Stack

- React 18 + Vite 5
- Fonts: Cormorant Garamond + Jost (Google Fonts, loaded in index.html)
- No external UI library — all styling inline
- localStorage key: `gb-start-date`

---

## Local Development

```bash
# Requires Node >= 18
npm install
npm run dev
# Opens at http://localhost:5173
```

---

## Deploy to Vercel

1. Add logo to `public/logo.png` before deploying
2. Push repo to GitHub
3. Go to [vercel.com](https://vercel.com) → **Add New Project** → Import repo
4. Vercel auto-detects Vite — click **Deploy**
5. Client gets permanent URL
6. Future updates: `git push` → auto-redeploys in ~30 seconds

---

## File Structure

```
goddess-body/
├── index.html          ← Fonts, meta tags, theme-color
├── package.json
├── vite.config.js
├── .gitignore
├── public/
│   └── logo.png        ← Add brand logo here (PNG, any size)
└── src/
    ├── main.jsx
    └── App.jsx         ← Full 30-day plan + all logic
```

---

## Client Notes

- **No overhead pressing** — shoulder injury from car accident
- **Fibromyalgia** — flare protocol available every workout day
- **No pineapple, eggs, pork, tilapia, raw fish, bananas, peanut butter** — all respected in nutrition tab
- **Caloric surplus** — this is a GAIN plan, not a deficit
- **PT 3× / week** (Mon/Wed/Fri) included as active recovery days in the plan

---

*Built by Martyy B Media™ | martyybmedia.com*
