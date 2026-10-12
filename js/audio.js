// ==============================================================
// Name:    audio
// Goal:    Synthesize every sound with Web Audio: calm tune, heartbeat,
//          the OOGA BOOGA scream and the goofy dance loop. No audio files.
// Exports: initAudio, playCalm, playHeartbeat, playOogaBooga, playGoofyLoop
// Notes:   Master gain is capped so the scare is funny, not painful.
// ==============================================================

let ctx = null;
let master = null;

/** Create the audio context on first user gesture (autoplay policy). Returns nothing. */
export function initAudio() {
  if (!ctx) {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    ctx = new AudioCtx();
    const limiter = ctx.createDynamicsCompressor();
    master = ctx.createGain();
    master.gain.value = 0.55;
    master.connect(limiter).connect(ctx.destination);
  }
  ctx.resume();
}

/** Schedule one enveloped oscillator note, optionally through a resonant low-pass. */
function tone({ type = 'sine', f = 440, f2, t = 0, d = 0.3, v = 0.2, filter }) {
  const start = ctx.currentTime + t;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(f, start);
  if (f2) osc.frequency.exponentialRampToValueAtTime(f2, start + d);
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(v, start + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + d);
  let out = osc.connect(gain);
  if (filter) {
    const lp = ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = filter;
    lp.Q.value = 6;
    out = gain.connect(lp);
  }
  out.connect(master);
  osc.start(start);
  osc.stop(start + d + 0.05);
}

/** Short decaying white-noise burst. */
function noise(duration, volume) {
  const length = Math.floor(ctx.sampleRate * duration);
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / length);
  const src = ctx.createBufferSource();
  const gain = ctx.createGain();
  src.buffer = buffer;
  gain.gain.value = volume;
  src.connect(gain).connect(master);
  src.start();
}

/** Four seconds of soft pentatonic plucks and bird chirps that slowly fade. */
export function playCalm() {
  const notes = [523, 587, 659, 784, 880, 1047];
  for (let i = 0; i < 16; i++) {
    tone({ type: 'triangle', f: notes[Math.floor(Math.random() * notes.length)], t: i * 0.25, d: 0.5, v: 0.12 * (1 - i / 22) });
    if (i % 4 === 0) tone({ f: 262, t: i * 0.25, d: 0.9, v: 0.08 });
  }
  for (const t of [0.4, 1.3, 2.2]) {
    tone({ f: 2400, f2: 3400, t, d: 0.08, v: 0.05 });
    tone({ f: 2600, f2: 3800, t: t + 0.12, d: 0.08, v: 0.05 });
  }
}

/** Lub-dub heartbeat from 3 s, faster and louder as the scare approaches. */
export function playHeartbeat() {
  [3.0, 3.6, 4.1, 4.5, 4.8].forEach((t, i) => {
    tone({ f: 70, f2: 40, t, d: 0.18, v: 0.35 + i * 0.12 });
    tone({ f: 60, f2: 35, t: t + 0.16, d: 0.16, v: 0.25 + i * 0.1 });
  });
}

/** The scream: vowel-coloured OO-GA BOO-GA blasts, stinger, drum, noise and a speech voice. */
export function playOogaBooga() {
  const syllables = [
    { f: 150, filter: 450, t: 0.0, d: 0.22 },
    { f: 210, filter: 1300, t: 0.24, d: 0.26 },
    { f: 160, filter: 450, t: 0.6, d: 0.22 },
    { f: 240, filter: 1400, t: 0.84, d: 0.45 },
  ];
  for (const s of syllables) {
    tone({ type: 'sawtooth', f: s.f, f2: s.f * 0.9, t: s.t, d: s.d, v: 0.5, filter: s.filter });
    tone({ type: 'square', f: s.f * 1.5, f2: s.f * 1.2, t: s.t, d: s.d, v: 0.15, filter: s.filter });
  }
  tone({ type: 'sawtooth', f: 110, f2: 55, d: 1.4, v: 0.35, filter: 900 });
  tone({ f: 120, f2: 30, d: 0.5, v: 0.9 });
  noise(0.5, 0.25);

  if ('speechSynthesis' in window) {
    const voice = new SpeechSynthesisUtterance('OUGA BOUGA !');
    voice.lang = 'fr-FR';
    voice.pitch = 0.2;
    voice.rate = 0.75;
    speechSynthesis.cancel();
    speechSynthesis.speak(voice);
  }
}

/** Bouncy square-wave bassline while the character dances. */
export function playGoofyLoop() {
  const seq = [196, 0, 247, 196, 294, 0, 247, 0];
  for (let bar = 0; bar < 4; bar++) {
    seq.forEach((f, i) => {
      if (f) tone({ type: 'square', f, t: bar * 1.6 + i * 0.2, d: 0.15, v: 0.07, filter: 1200 });
    });
  }
}
