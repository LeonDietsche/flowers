const openBtn = document.getElementById('openBtn');
const closeBtn = document.getElementById('closeBtn');
const front = document.getElementById('front');
const inside = document.getElementById('inside');
const shareBtn = document.getElementById('shareBtn');

openBtn.onclick = () => {
  front.hidden = true;
  inside.hidden = false;
};

closeBtn.onclick = () => {
  inside.hidden = true;
  front.hidden = false;
};

shareBtn.onclick = async (e) => {
  e.preventDefault();
  if(navigator.share){
    await navigator.share({
      title:"flowers 🌷",
      text:"open this",
      url:location.href
    });
  } else {
    await navigator.clipboard.writeText(location.href);
    shareBtn.textContent="Link copied";
  }
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

  const petals=6+Math.floor(random()*5);

  let petalsSVG="";
  for(let i=0;i<petals;i++){
    const angle=(360/petals)*i;
    petalsSVG+=`<ellipse cx="35" cy="35" rx="18" ry="34"
      fill="#ff5ea8"
      transform="rotate(${angle} 35 35)"/>`;
  }

  stage.innerHTML=`
  <svg viewBox="0 0 360 260">

    <!-- stem -->
    <path class="stem"
      d="M180 210 C170 150 190 110 180 80"
      fill="none"
      stroke="green"
      stroke-width="8"
      stroke-linecap="round"/>

    <!-- bloom -->
    <g class="bloom" transform="translate(145 45)">
      ${petalsSVG}
      <circle cx="35" cy="35" r="14" fill="#ffd166"/>
    </g>

    <!-- pot -->
    <rect x="120" y="210" width="120" height="50"
      rx="10"
      fill="#8b5e3c"/>

    <text x="180" y="240"
      font-size="14"
      text-anchor="middle"
      fill="white"
      font-family="system-ui">
      For Veronika
    </text>

  </svg>
  `;

  const messages=[
    "Juhu, es Blüemli für dii",
    "Juhu, vermiss dich"
  ];

  caption.textContent =
    messages[Math.floor(random()*messages.length)] +
    " • " + key;
}

renderFlower();
