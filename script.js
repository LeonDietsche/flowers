const openBtn = document.getElementById('openBtn');
const closeBtn = document.getElementById('closeBtn');
const front = document.getElementById('front');
const inside = document.getElementById('inside');

openBtn.onclick = () => {
  front.hidden = true;
  inside.hidden = false;
};

closeBtn.onclick = () => {
  inside.hidden = true;
  front.hidden = false;
};

/* DAILY SEEDED FLOWER */

function hash(str){
  let h=2166136261;
  for(let i=0;i<str.length;i++){
    h^=str.charCodeAt(i);
    h=Math.imul(h,16777619);
  }
  return h>>>0;
}

function rng(seed){
  return function(){
    seed+=0x6D2B79F5;
    let t=seed;
    t=Math.imul(t^t>>>15,t|1);
    t^=t+Math.imul(t^t>>>7,t|61);
    return((t^t>>>14)>>>0)/4294967296;
  }
}

function todayKey(){
  const d=new Date();
  return d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate();
}

function renderFlower(){
  const key=todayKey();
  const random=rng(hash(key));
  const stage=document.getElementById("flowerStage");
  const caption=document.getElementById("dailyCaption");

  // how many flowers in the bouquet (2–4)
  const count = 2 + Math.floor(random()*3);

  // daily palette
  const palettes=[
    ["#ff5ea8","#ffd166","#16a34a"], // pink + yellow + green
    ["#fb7185","#fde047","#15803d"], // rosy + warm yellow + green
    ["#a855f7","#fbbf24","#166534"], // purple + amber + green
    ["#4cc9f0","#ffd166","#15803d"], // blue + yellow + green
  ];
  const pal = palettes[Math.floor(random()*palettes.length)];
  const petalColor = pal[0];
  const centerColor = pal[1];
  const stemColor   = pal[2];

  // base positions spread around center
  const baseXs = [150, 180, 210, 240];

  // build SVG parts
  let stems = "";
  let blooms = "";

  for(let i=0;i<count;i++){
    const baseX = baseXs[i];
    const wobble = (random()*18 - 9);         // small daily variation
    const x = baseX + wobble;

    // stem end point (where bloom must sit)
    const endX = x + (random()*8 - 4);
    const endY = 85 + (random()*20 - 10);

    // control points for curve
    const c1x = x - 12 + (random()*8 - 4);
    const c1y = 150;
    const c2x = x + 12 + (random()*8 - 4);
    const c2y = 115;

    // vary petal count a bit per flower
    const petals = 6 + Math.floor(random()*5);

    // petals around (35,35) local
    let petalsSVG = "";
    for(let p=0;p<petals;p++){
      const angle=(360/petals)*p;
      petalsSVG += `<ellipse cx="35" cy="35" rx="18" ry="34"
        fill="${petalColor}"
        transform="rotate(${angle} 35 35)"/>`;
    }

    // IMPORTANT: bloom position derived from stem end => perfect alignment
    const bloomTx = endX - 35;
    const bloomTy = endY - 35;

    stems += `
      <path class="stem"
        d="M${x} 210 C${c1x} ${c1y} ${c2x} ${c2y} ${endX} ${endY}"
        fill="none" stroke="${stemColor}" stroke-width="8" stroke-linecap="round"/>
    `;

    blooms += `
      <g class="bloom" transform="translate(${bloomTx} ${bloomTy})">
        ${petalsSVG}
        <circle cx="35" cy="35" r="14" fill="${centerColor}"/>
      </g>
    `;
  }

  stage.innerHTML=`
  <svg viewBox="0 0 360 290" aria-label="Daily flowers">
    ${stems}
    ${blooms}

    <!-- pot -->
    <rect x="110" y="210" width="140" height="60" rx="12" fill="#8b5e3c"/>
    <rect x="120" y="205" width="120" height="18" rx="9" fill="#6f4427" opacity="0.9"/>

    <text x="180" y="246"
      font-size="14"
      text-anchor="middle"
      fill="white"
      font-family="system-ui">
      Veronika
    </text>
  </svg>
  `;

  const messages=[
    "Juhu, es Blüemli für dii",
    "Es Strüssli bis ich izrugg bi",
    "Das isch diis hütigs Blüeml",
    "Daily, Blüemli"
  ];

  caption.textContent =
    messages[Math.floor(random()*messages.length)] +
    " • " + key;
}

renderFlower();
