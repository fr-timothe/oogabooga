# oogabooga

A tiny prank page: a 5-second "relaxing walk" with stick figures, then a cartoon
OOGA BOOGA screamer (Sr Pelo style parody). Funny, not scary.

Live at <https://oogabooga.montfrond.work>.

## Structure
- `index.html`: markup and the hand-drawn SVG character.
- `style.css`: meadow, walkers and screamer animations.
- `js/main.js`: timeline (calm walk, tension, scare, replay and share).
- `js/scene.js`: generates the walking stick figures and flowers.
- `js/audio.js`: every sound, synthesized with Web Audio (no audio files).

## Run locally
ES modules need HTTP, not `file://`:

```sh
npx http-server -p 8080 .
```

## Deploy
GitHub Pages serves the `main` branch root. The `CNAME` file sets the custom
domain; the OVH DNS zone of `montfrond.work` has a `CNAME oogabooga -> fr-timothe.github.io.`.
