// ---------- Open / Close ----------
const openBtn  = document.getElementById('openBtn');
const closeBtn = document.getElementById('closeBtn');
const front    = document.getElementById('front');
const inside   = document.getElementById('inside');

function openCard(){
  front.hidden = true;
  inside.hidden = false;
  inside.classList.remove('reveal');
  void inside.offsetWidth;
  inside.classList.add('reveal');
}

function closeCard(){
  inside.hidden = true;
  front.hidden = false;
  front.classList.remove('reveal');
  void front.offsetWidth;
  front.classList.add('reveal');
}

openBtn?.addEventListener('click', openCard);
closeBtn?.addEventListener('click', closeCard);

// ---------- Daily seeded RNG ----------
function todayKey(){
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const da = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${da}`;
}

// FNV-1a-ish hash -> 32-bit
function hash32(str){
  let h = 2166136261;
  for (let i = 0; i < str.length; i++){
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

// Mulberry32 RNG
function rngFromSeed(seed){
  return function(){
    let t = seed += 0x6D2B79F5;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pick(rng, arr){
  return arr[Math.floor(rng() * arr.length)];
}
function rand(rng, min, max){
  return rng() * (max - min) + min;
}
function clamp(n, a, b){
  return Math.max(a, Math.min(b, n));
}

// ---------- Render daily bouquet ----------
function renderDailyBouquet(){
  const stage = document.getElementById('flowerStage');
  const cap   = document.getElementById('dailyCaption');
  if (!stage) return;

  const key  = todayKey();
  const rng  = rngFromSeed(hash32(key));

  // Keep your exact messages ✅
  const messages=[
    "Juhu, es Blüemli für dii",
    "Es Strüssli bis ich izrugg bi",
    "Das isch diis hütigs Blüeml",
    "Daily, Blüemli"
  ];

  // Palettes: [petal, center, stem, potMain, potTop]
  const palettes = [
    ["#ff5ea8", "#ffd166", "#16a34a", "#8b5e3c", "#6f4427"],
    ["#fb7185", "#fde047", "#15803d", "#7a4a2b", "#5b331c"],
    ["#a855f7", "#fbbf24", "#166534", "#8b5e3c", "#6f4427"],
    ["#4cc9f0", "#ffd166", "#15803d", "#7a4a2b", "#5b331c"],
  ];
  const [petalColor, centerColor, stemColor, potMain, potTop] = pick(rng, palettes);

  // Bouquet size (3–4 looks nicest for overlap control)
  const count = 3 + Math.floor(rng() * 2); // 3..4

  // Wider spread to avoid overlaps
  const baseXs = [130, 170, 210, 250];

  let stems = "";
  let blooms = "";

  for (let i = 0; i < count; i++){
    const baseX = baseXs[i];

    // Less side wobble for cleanliness
    const x = baseX + rand(rng, -6, 6);

    // Stem end point (staggered height per flower to reduce overlap)
    const endX = clamp(x + rand(rng, -10, 10), 90, 270);
    const endY = 88 + (i * 7) + rand(rng, -6, 6);

    // Curve control points
    const c1x = x + rand(rng, -20, 10);
    const c1y = 168;
    const c2x = x + rand(rng, -10, 20);
    const c2y = 128;

    const stemW = rand(rng, 7.5, 10.0);

    // Petals per flower (6–10)
    const petalsCount = 6 + Math.floor(rng() * 5);

    // Slightly smaller petals to keep bouquet readable
    const rx = rand(rng, 14, 18);
    const ry = rand(rng, 26, 34);

    // Optional tiny rotation difference per flower
    const tilt = rand(rng, -8, 8);

    let petalsSVG = "";
    for (let p = 0; p < petalsCount; p++){
      const angle = (360 / petalsCount) * p + rand(rng, -6, 6);
      petalsSVG += `
        <ellipse cx="35" cy="35" rx="${rx.toFixed(1)}" ry="${ry.toFixed(1)}"
          fill="${petalColor}"
          transform="rotate(${angle.toFixed(1)} 35 35)"/>
      `;
    }

    // ✅ Anchor bloom to stem tip
    const bloomTx = endX - 35;
    const bloomTy = endY - 35;

    stems += `
      <path class="stem"
        d="M${x.toFixed(1)} 220 C${c1x.toFixed(1)} ${c1y} ${c2x.toFixed(1)} ${c2y} ${endX.toFixed(1)} ${endY.toFixed(1)}"
        fill="none" stroke="${stemColor}" stroke-width="${stemW.toFixed(1)}"
        stroke-linecap="round"/>
    `;

    // Safari-safe: outer group translates, inner group scales
    blooms += `
      <g transform="translate(${bloomTx.toFixed(1)} ${bloomTy.toFixed(1)}) rotate(${tilt.toFixed(1)} 35 35)">
        <g class="bloomScale">
          <g class="petals">${petalsSVG}</g>
          <circle class="center" cx="35" cy="35" r="14" fill="${centerColor}"/>
        </g>
      </g>
    `;
  }

  // Pot position
  const potX = 110, potY = 220, potW = 140, potH = 60;

  stage.innerHTML = `
  <svg viewBox="0 0 360 300" preserveAspectRatio="xMidYMid meet" aria-label="Daily bouquet">
    ${stems}
    ${blooms}

    <!-- pot -->
    <rect x="${potX}" y="${potY}" width="${potW}" height="${potH}" rx="12" fill="${potMain}"/>
    <rect x="${potX+10}" y="${potY-5}" width="${potW-20}" height="18" rx="9" fill="${potTop}" opacity="0.95"/>

    <!-- name -->
    <text x="180" y="${potY+36}"
      font-size="16"
      text-anchor="middle"
      fill="white"
      font-family="system-ui">
      Veronika
    </text>
  </svg>
  `;

  if (cap){
    cap.textContent = `${pick(rng, messages)} • ${key}`;
  }
}

// Render on load
renderDailyBouquet();
