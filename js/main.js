// ==============================================================
// Name:    main
// Goal:    Run the prank: 5 s calm walk, tension, then the original
//          OOGA BOOGA clip as screamer, then the dancing cartoon with the
//          replay / share buttons.
// Exports: (none, entry point)
// Depends: scene, audio, video
// Notes:   If the browser refuses the clip's sound, the synthesized
//          scream plays on top of the muted clip.
// ==============================================================

import { populateScene } from './scene.js';
import { initAudio, playCalm, playHeartbeat, playOogaBooga, playGoofyLoop } from './audio.js';
import { unlockVideo, playVideo, stopVideo, VIDEO_MS } from './video.js';

const CALM_MS = 5000;
const TENSE_MS = 3000;
const STARE_MS = 4300;
const DANCE_MS = 2300;
const SHARE_TEXT = 'Prends 5 secondes pour te détendre 🌿 (monte le son)';

const $ = (id) => document.getElementById(id);
const scene = $('scene');
const scare = $('scare');
const after = $('after');
const pelo = $('pelo');
const caption = $('caption');
let timers = [];
let finished = false;

/** Schedule a step and remember it so a replay can cancel it. */
function later(fn, ms) {
  timers.push(setTimeout(fn, ms));
}

/** Fill an element with one popping <span> per letter. */
function setPopText(el, text) {
  el.innerHTML = [...text]
    .map((ch, i) => `<span style="animation-delay:${i * 0.04}s, ${i * 0.04}s">${ch === ' ' ? '&nbsp;' : ch}</span>`)
    .join('');
}

/** Restart a CSS animation on an element by forcing a reflow. */
function restartAnimation(el) {
  el.style.animation = 'none';
  void el.offsetWidth;
  el.style.animation = '';
}

/** White flash and phone buzz that open the screamer. */
function jolt() {
  const flash = $('flash');
  flash.classList.remove('on');
  void flash.offsetWidth;
  flash.classList.add('on');
  if (navigator.vibrate) navigator.vibrate([200, 80, 200, 80, 400]);
}

/** Show the cartoon screamer layer (fallback scare, then the dance screen). */
function showCartoon() {
  setPopText($('oogaTop'), 'OOGA');
  setPopText($('oogaBottom'), 'BOOGA!!');
  restartAnimation(pelo);
  scare.classList.add('on');
}

/** After the scare: dancing cartoon, goofy music and the buttons. Runs once. */
function finale() {
  if (finished) return;
  finished = true;
  stopVideo();
  $('yt').classList.remove('on');
  if (!scare.classList.contains('on')) showCartoon();
  scare.classList.add('calm');
  pelo.classList.add('dance');
  after.classList.add('on');
  playGoofyLoop();
}

/** The screamer: the original clip full screen, then the finale. */
function boo() {
  jolt();
  $('yt').classList.add('on');
  playVideo().then((withSound) => { if (!withSound) playOogaBooga(); });
  later(finale, VIDEO_MS);
}

/** Reset everything and play the calm walk, which ends in the screamer. */
function start() {
  initAudio();
  stopVideo();
  unlockVideo();
  timers.forEach(clearTimeout);
  timers = [];
  finished = false;
  $('yt').classList.remove('on');
  $('start').style.display = 'none';
  scare.classList.remove('on', 'calm');
  after.classList.remove('on');
  pelo.classList.remove('dance');
  scene.classList.remove('tense', 'stare');
  caption.textContent = 'Tout va bien. Les bonshommes se promènent. 🚶';
  caption.style.opacity = '1';
  playCalm();
  playHeartbeat();
  later(() => {
    scene.classList.add('tense');
    caption.textContent = 'Tout va… bien ?';
  }, TENSE_MS);
  later(() => {
    scene.classList.add('stare');
    caption.style.opacity = '0';
  }, STARE_MS);
  later(boo, CALM_MS);
}

/** Native share sheet when available, clipboard copy otherwise. */
async function share() {
  const data = { title: document.title, text: SHARE_TEXT, url: location.href };
  try {
    if (navigator.share) {
      await navigator.share(data);
    } else {
      await navigator.clipboard.writeText(location.href);
      $('share').textContent = '✅ Lien copié !';
    }
  } catch {
    // Share sheet dismissed: nothing to do.
  }
}

populateScene(scene);
$('go').addEventListener('click', start);
$('replay').addEventListener('click', start);
$('share').addEventListener('click', share);
