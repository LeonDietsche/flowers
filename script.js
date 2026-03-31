const openBtn = document.getElementById("openBtn");
const closeBtn = document.getElementById("closeBtn");
const front = document.getElementById("front");
const inside = document.getElementById("inside");
const flowerStage = document.getElementById("flowerStage");

function showPanel(panelToShow, panelToHide){
  panelToHide.hidden = true;
  panelToShow.hidden = false;
  panelToShow.classList.remove("reveal");
  void panelToShow.offsetWidth;
  panelToShow.classList.add("reveal");
}

function openCard(){
  showPanel(inside, front);
}

function closeCard(){
  showPanel(front, inside);
}

function renderWiltedFlower(){
  if (!flowerStage){
    return;
  }

  flowerStage.innerHTML = `
    <svg viewBox="0 0 360 320" aria-label="A wilted flower in a cracked pot">
      <defs>
        <linearGradient id="stemShade" x1="0%" x2="0%" y1="0%" y2="100%">
          <stop offset="0%" stop-color="#61714b"/>
          <stop offset="100%" stop-color="#39422f"/>
        </linearGradient>
        <linearGradient id="petalShade" x1="0%" x2="100%" y1="0%" y2="100%">
          <stop offset="0%" stop-color="#96705a"/>
          <stop offset="100%" stop-color="#5b4136"/>
        </linearGradient>
        <linearGradient id="potShade" x1="0%" x2="100%" y1="0%" y2="100%">
          <stop offset="0%" stop-color="#8e6048"/>
          <stop offset="100%" stop-color="#5f3b2f"/>
        </linearGradient>
      </defs>

      <ellipse cx="180" cy="292" rx="108" ry="14" fill="rgba(0,0,0,0.18)"/>
      <path class="stem-path"
        d="M180 246 C180 216, 176 188, 195 160 C205 145, 211 134, 208 116"
        fill="none"
        stroke="url(#stemShade)"
        stroke-width="8"
        stroke-linecap="round"/>
      <path
        d="M170 208 C153 196, 149 180, 162 165"
        fill="none"
        stroke="#51613f"
        stroke-width="6"
        stroke-linecap="round"/>
      <path
        d="M188 186 C206 176, 214 164, 211 145"
        fill="none"
        stroke="#4b5939"
        stroke-width="6"
        stroke-linecap="round"/>

      <g class="head">
        <circle cx="209" cy="121" r="13" fill="#6d563f"/>
        <ellipse cx="185" cy="113" rx="18" ry="42" fill="url(#petalShade)" transform="rotate(-66 185 113)"/>
        <ellipse cx="194" cy="133" rx="17" ry="36" fill="#745446" transform="rotate(-29 194 133)"/>
        <ellipse cx="224" cy="114" rx="17" ry="36" fill="#66493b" transform="rotate(18 224 114)"/>
        <ellipse cx="232" cy="136" rx="15" ry="33" fill="#5f4438" transform="rotate(45 232 136)"/>
        <ellipse cx="214" cy="149" rx="14" ry="28" fill="#806153" transform="rotate(85 214 149)"/>
      </g>

      <ellipse cx="147" cy="266" rx="17" ry="9" fill="#6a4c3d" class="petal-fall"/>
      <ellipse cx="217" cy="275" rx="14" ry="8" fill="#7f6050" class="petal-fall delay"/>

      <path d="M122 228 h116 l-14 56 h-88 z" fill="url(#potShade)"/>
      <path d="M116 218 h128 a10 10 0 0 1 10 10 v2 h-148 v-2 a10 10 0 0 1 10-10z" fill="#704939"/>
      <path d="M177 228 l-14 25 l24 19 l-16 12" fill="none" stroke="#3f261f" stroke-width="3" stroke-linecap="round"/>
      <text x="180" y="255" text-anchor="middle" fill="#f4e4d7" font-size="15" font-family="Georgia, serif">
        
      </text>
    </svg>
  `;
}

openBtn?.addEventListener("click", openCard);
closeBtn?.addEventListener("click", closeCard);

renderWiltedFlower();
