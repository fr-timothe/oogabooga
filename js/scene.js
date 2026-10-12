// ==============================================================
// Name:    scene
// Goal:    Populate the calm meadow with walking stick figures and flowers.
// Exports: populateScene
// ==============================================================

const COLORS = ['#e63946', '#457b9d', '#f4a261', '#2a9d8f', '#9b5de5', '#ff70a6', '#ffb703'];
const HATS = ['', '🎩', '🧢', '', '👒', '', '🎓'];
const QUOTES = ['...', '👀', '?', '!', '😶', '...', '👀'];
const FLOWERS = ['🌼', '🌷', '🌸', '🌻'];

/** Build the SVG markup of one walking stick figure. */
function walkerSvg(index, scale) {
  const shirt = COLORS[index % COLORS.length];
  return `
    <svg width="${60 * scale}" height="${110 * scale}" viewBox="0 0 60 110">
      <g class="body">
        <text class="bubble" x="30" y="-6" font-size="18" text-anchor="middle">${QUOTES[index % QUOTES.length]}</text>
        <circle cx="30" cy="18" r="13" fill="#fff" stroke="#000" stroke-width="3"/>
        <text x="30" y="8" font-size="16" text-anchor="middle">${HATS[index % HATS.length]}</text>
        <g class="eyes"><circle cx="34" cy="16" r="2"/><circle cx="27" cy="16" r="2"/></g>
        <path d="M26 23 Q31 27 36 23" fill="none" stroke="#000" stroke-width="2" stroke-linecap="round"/>
        <line x1="30" y1="31" x2="30" y2="66" stroke="${shirt}" stroke-width="7" stroke-linecap="round"/>
        <line class="arm a" x1="30" y1="38" x2="30" y2="60" stroke="#000" stroke-width="4" stroke-linecap="round"/>
        <line class="arm" x1="30" y1="38" x2="30" y2="60" stroke="#000" stroke-width="4" stroke-linecap="round"/>
        <line class="leg" x1="30" y1="66" x2="30" y2="100" stroke="#000" stroke-width="5" stroke-linecap="round"/>
        <line class="leg b" x1="30" y1="66" x2="30" y2="100" stroke="#000" stroke-width="5" stroke-linecap="round"/>
      </g>
    </svg>`;
}

/** Create one walker element; every third one walks right to left. */
function makeWalker(index) {
  const scale = 0.8 + Math.random() * 0.6;
  const el = document.createElement('div');
  el.className = index % 3 === 2 ? 'walker rev' : 'walker';
  el.style.animationDuration = `${9 + Math.random() * 6}s`;
  el.style.animationDelay = `${-Math.random() * 4}s`;
  el.style.bottom = `${8 + Math.random() * 10}vh`;
  el.style.zIndex = String(Math.round(scale * 10));
  el.innerHTML = walkerSvg(index, scale);
  return el;
}

/** Create one swaying flower at a spread-out position. */
function makeFlower(index) {
  const el = document.createElement('div');
  el.className = 'flower';
  el.textContent = FLOWERS[index % FLOWERS.length];
  el.style.left = `${5 + index * 11 + Math.random() * 4}vw`;
  el.style.bottom = `${2 + Math.random() * 14}vh`;
  el.style.animationDelay = `${-Math.random() * 2}s`;
  return el;
}

/** Append walkers and flowers to the scene container. Returns nothing. */
export function populateScene(scene, walkers = 7, flowers = 9) {
  for (let i = 0; i < walkers; i++) scene.appendChild(makeWalker(i));
  for (let i = 0; i < flowers; i++) scene.appendChild(makeFlower(i));
}
