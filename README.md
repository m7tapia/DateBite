# DateBite

**Stop arguing. Start eating.**

DateBite is a couples-first dinner decider. Pick a mood, watch the deck shuffle, tap a card — dinner is decided. No negotiations, no going back.

---

## The Problem

Every couple knows the loop: *"Where do you want to eat?" "I don't know, where do you want to eat?"* — DateBite ends it.

---

## How It Works

1. **Pick a mood** — choose a preset that fits the vibe (Quick & Easy, Date Night, etc.)
2. **Watch the shuffle** — all your spots are revealed, mixed, and 2–3 are drawn
3. **Tap a card** — your fate is sealed
4. **See what you missed** — the other cards flip over after the reveal

---

## Features

- **Mood Presets** — create named lists for any occasion (Fancy Night, Late Night, Comfort Food)
- **Persistent Storage** — presets save to the browser via LocalStorage, so your spots are always ready
- **Animated Shuffle** — cards spread, scatter, gather, and deal before you pick
- **The Reveal** — full-screen particle burst when your restaurant is chosen
- **Aftermath** — shows what was behind the other cards for that extra moment of drama

---

## Tech Stack

| Tool | Purpose |
|---|---|
| React + Vite | Frontend framework |
| Framer Motion | All animations |
| Zustand + persist | State management + LocalStorage |
| Tailwind CSS v4 | Styling |

---

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

Also available at datebite.me

---

## Notes

- Presets are saved per browser — clearing site data or using incognito will reset them
- Needs at least 2 spots in a preset to play
- Mobile-first design — best experienced on a phone together
