# oogabooga: agent notes

Static prank page (no build step, no dependencies). See `README.md` for the structure.

## Deploy
- GitHub Pages serves `main` at the repo root; `CNAME` holds `oogabooga.montfrond.work`.
- DNS lives in the OVH zone `montfrond.work`: `CNAME oogabooga -> fr-timothe.github.io.`
  (managed through the `ovhcloud` MCP server). The OVH free hosting cannot take
  this subdomain: its attached-domain limit (3) is full.

## Test
- ES modules need HTTP: `npx -y http-server -p 8766 -c-1 -s .` (`-c-1` disables
  caching, otherwise the browser keeps stale modules between edits).
- The agent Chrome (`ab`) tab is often `document.visibilityState = hidden`:
  clicks and CSS animations stall there. Test the timeline in headless
  agent-browser instead: `agent-browser --session oogatest open http://127.0.0.1:8766/`.

## Pitfalls
- The screamer is a local `<video>` (`media/oogabooga.mp4`), not a YouTube
  embed: the embed always draws its play/pause controls over the clip.
- `unlockVideo()` must run inside the start click, or mobile browsers refuse
  the clip's sound later.
