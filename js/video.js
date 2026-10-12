// ==============================================================
// Name:    video
// Goal:    Play the original "ooga booga sr pelo" clip as the screamer,
//          from a local <video> so it starts instantly with no player UI.
// Exports: unlockVideo, playVideo, stopVideo, VIDEO_MS
// Notes:   Mobile browsers only allow sound on an element that was first
//          played inside a user gesture: unlockVideo() does a silent
//          play/pause during the start click. If sound is still refused,
//          the clip plays muted and the caller adds the synthesized scream.
//          Clip: https://www.youtube.com/watch?v=LPc-wKcKVUs
// ==============================================================

/** Clip length, used to schedule the after-scare screen. */
export const VIDEO_MS = 5900;

const video = document.getElementById('ooga');

/** Call inside the click handler: grants this element the right to play with sound. */
export function unlockVideo() {
  video.muted = false;
  const attempt = video.play();
  video.pause();
  video.currentTime = 0;
  if (attempt) attempt.catch(() => {}); // the immediate pause aborts the promise
}

/**
 * Play the clip from the start with sound.
 * Resolves true with sound, false if the browser forced it muted.
 */
export async function playVideo() {
  video.currentTime = 0;
  video.muted = false;
  try {
    await video.play();
    return true;
  } catch {
    video.muted = true;
    await video.play().catch(() => {});
    return false;
  }
}

/** Pause and rewind (after the scare or on replay). */
export function stopVideo() {
  video.pause();
  video.currentTime = 0;
}
