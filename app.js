// Tempi Cottura - v4 lite (senza assets reali)
const DISHES = [
  { name: "Lasagne al ragù", file: "lasagne.jpg" },
  { name: "Pizza margherita", file: "pizza_margherita.jpg" },
  { name: "Pane casereccio", file: "pane_casereccio.jpg" },
  { name: "Parmigiana di melanzane", file: "parmigiana_melanzane.jpg" },
  { name: "Torta al cioccolato", file: "torta_cioccolato.jpg" },
  { name: "Arrosto di vitello", file: "arrosto_vitello.jpg" },
  { name: "Arrosto di maiale", file: "arrosto_maiale.jpg" },
  { name: "Pesce al forno con patate", file: "pesce_patate.jpg" },
  { name: "Patate al forno", file: "patate_al_forno.jpg" },
  { name: "Cannelloni ricotta e spinaci", file: "cannelloni_ricotta_spinaci.jpg" },
  { name: "Crostata di marmellata", file: "crostata_marmellata.jpg" },
  { name: "Pollo fritto", file: "pollo_fritto.jpg" },
  { name: "Patatine fritte", file: "patatine_fritte.jpg" },
  { name: "Bastoncini di pesce", file: "bastoncini_pesce.jpg" },
  { name: "Sofficini", file: "sofficini.jpg" },
  { name: "Cordon Bleu", file: "cordon_bleu.jpg" },
  { name: "Polpette di carne", file: "polpette_di_carne.jpg" },
  { name: "Cotolette di pollo", file: "cotolette_pollo.jpg" },
  { name: "Crocchette di patate", file: "crocchette_patate.jpg" },
  { name: "Calamari fritti", file: "calamari_fritti.jpg" },
  { name: "Verdure grigliate", file: "verdure_grigliate.jpg" },
  { name: "Arancini di riso", file: "arancini_riso.jpg" },
  { name: "Mozzarella in carrozza", file: "mozzarella_in_carrozza.jpg" },
  { name: "Mini pizze", file: "mini_pizze.jpg" },
  { name: "Frittelle dolci", file: "frittelle_dolci.jpg" },
  { name: "Pizza surgelata", file: "pizza_surgelata.jpg" },
  { name: "Pizza tonda", file: "pizza_tonda.jpg" }
];

// tempi indicativi (min) per metodo
const PRESETS = {
  forno: {
    "Lasagne al ragù": 35, "Pizza margherita": 12, "Pane casereccio": 40, "Parmigiana di melanzane": 35,
    "Torta al cioccolato": 35, "Arrosto di vitello": 60, "Arrosto di maiale": 55, "Pesce al forno con patate": 30,
    "Patate al forno": 45, "Cannelloni ricotta e spinaci": 35, "Crostata di marmellata": 30, "Pizza surgelata": 14,
    "Pizza tonda": 12
  },
  airfryer: {
    "Pollo fritto": 18, "Patatine fritte": 15, "Bastoncini di pesce": 10, "Sofficini": 11, "Cordon Bleu": 12,
    "Polpette di carne": 18, "Cotolette di pollo": 15, "Crocchette di patate": 12, "Calamari fritti": 8,
    "Verdure grigliate": 12, "Arancini di riso": 12, "Mozzarella in carrozza": 8, "Mini pizze": 9, "Frittelle dolci": 8
  }
};

// --- UI Refs
const grid = document.getElementById('grid');
const listView = document.getElementById('listView');
const detailView = document.getElementById('detailView');
const backBtn = document.getElementById('backBtn');
const heroImg = document.getElementById('heroImg');
const heroTitle = document.getElementById('heroTitle');
const mForno = document.getElementById('mForno');
const mAir = document.getElementById('mAir');
const minutesInput = document.getElementById('minutes');
const minus1Btn = document.getElementById('minus1');
const plus1Btn = document.getElementById('plus1');
const display = document.getElementById('display');
const startBtn = document.getElementById('start');
const pauseBtn = document.getElementById('pause');
const resetBtn = document.getElementById('reset');
const shareBtn = document.getElementById('share');
const recipeBtn = document.getElementById('openRecipe');

// --- State
let currentDish = null;
let method = 'forno'; // default
let secondsLeft = 0;
let timerId = null;
let endAt = null;

// --- Build grid (2 columns, alphabetical)
DISHES.sort((a,b)=>a.name.localeCompare(b.name)).forEach(d => {
  const item = document.createElement('div');
  item.className = 'grid-item';
  const src = `assets/${d.file}`;
  item.innerHTML = `<img src="${src}" alt="${d.name}" onerror="this.style.opacity='0.4'">
    <div class="label">${d.name}</div>`;
  item.addEventListener('click', () => openDish(d));
  grid.appendChild(item);
});

function openDish(d) {
  currentDish = d;
  listView.classList.add('hidden');
  detailView.classList.remove('hidden');
  heroImg.src = `assets/${d.file}`;
  heroTitle.textContent = d.name;
  setMethod('forno'); // default on open
  applyPreset();
}

function setMethod(m) {
  method = m;
  mForno.classList.toggle('active', m==='forno');
  mAir.classList.toggle('active', m==='airfryer');
}

mForno.addEventListener('click', ()=>{ setMethod('forno'); applyPreset(); });
mAir.addEventListener('click', ()=>{ setMethod('airfryer'); applyPreset(); });

backBtn.addEventListener('click', () => {
  stopTimer();
  detailView.classList.add('hidden');
  listView.classList.remove('hidden');
});

function applyPreset() {
  if (!currentDish) return;
  const n = currentDish.name;
  const mins = (method==='forno' ? PRESETS.forno[n] : PRESETS.airfryer[n]) ?? 10;
  minutesInput.value = mins;
  secondsLeft = mins * 60;
  endAt = null;
  renderDisplay();
}

function renderDisplay() {
  const mm = String(Math.floor(secondsLeft/60)).padStart(2,'0');
  const ss = String(secondsLeft%60).padStart(2,'0');
  display.textContent = `${mm}:${ss}`;
}

minus1Btn.addEventListener('click', ()=>{ secondsLeft=Math.max(0,secondsLeft-60); if(endAt) endAt-=60000; renderDisplay(); });
plus1Btn.addEventListener('click', ()=>{ secondsLeft+=60; if(endAt) endAt+=60000; renderDisplay(); });
minutesInput.addEventListener('change', ()=>{
  const v=Math.max(0, parseInt(minutesInput.value||'0')); minutesInput.value=v; secondsLeft=v*60; endAt=null; renderDisplay();
});

// --- Audio unlock & 10s alarm
let audioCtx;
function initAudio(){
  if (!audioCtx) {
    audioCtx = new (window.AudioContext||window.webkitAudioContext)();
    const o = audioCtx.createOscillator(); const g=audioCtx.createGain();
    o.connect(g); g.connect(audioCtx.destination);
    g.gain.setValueAtTime(0.00001, audioCtx.currentTime); o.start(); o.stop(audioCtx.currentTime+0.02);
  }
}
function alarm10s(){
  if(!audioCtx) return;
  const o=audioCtx.createOscillator(); const g=audioCtx.createGain();
  o.type='sine'; o.connect(g); g.connect(audioCtx.destination);
  const now=audioCtx.currentTime;
  g.gain.setValueAtTime(0.0001, now); g.gain.linearRampToValueAtTime(0.7, now+0.1);
  o.frequency.setValueAtTime(700, now);
  for(let i=0;i<10;i++){ o.frequency.linearRampToValueAtTime(1200, now+i+0.5); o.frequency.linearRampToValueAtTime(700, now+i+1.0); }
  o.start(now); o.stop(now+10.0);
  g.gain.setValueAtTime(0.7, now+9.5); g.gain.linearRampToValueAtTime(0.0001, now+10.0);
}

// --- Timer
function startTimer(){
  initAudio();
  if(timerId) clearInterval(timerId);
  if(!secondsLeft) secondsLeft=Math.max(0, parseInt(minutesInput.value||'0')*60);
  endAt = Date.now()+secondsLeft*1000;
  timerId=setInterval(tick,250);
  tick();
}
function pauseTimer(){
  if(!timerId) return;
  clearInterval(timerId); timerId=null;
  if(endAt){ secondsLeft=Math.max(0, Math.round((endAt-Date.now())/1000)); endAt=null; }
  renderDisplay();
}
function stopTimer(){ if(timerId) clearInterval(timerId); timerId=null; endAt=null; renderDisplay(); }
function resetTimer(){ stopTimer(); applyPreset(); }
function tick(){
  if(!endAt) return;
  const now=Date.now();
  secondsLeft=Math.max(0, Math.round((endAt-now)/1000));
  renderDisplay();
  if(secondsLeft<=0){
    stopTimer();
    alarm10s();
    if(navigator.vibrate) navigator.vibrate([300,150,300,150,300,150,300]);
    maybeNotify();
  }
}

startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', resetTimer);

// Notifications
if('Notification' in window && Notification.permission==='default'){ Notification.requestPermission().catch(()=>{}); }
function maybeNotify(){
  if('Notification' in window && Notification.permission==='granted'){
    new Notification('Tempi Cottura', { body: `Pronto: ${currentDish?currentDish.name:''}` });
  }
}

// Share
shareBtn.addEventListener('click', async()=>{
  const mm=String(Math.floor(secondsLeft/60)).padStart(2,'0');
  const ss=String(secondsLeft%60).padStart(2,'0');
  const text=`Timer cottura: ${currentDish?currentDish.name:''} (${method}) a ${mm}:${ss}.\nApri l’app: ${location.href}`;
  try{
    if(navigator.share){ await navigator.share({title:'Tempi Cottura', text}); }
    else{ await navigator.clipboard.writeText(text); alert('Copiato negli appunti.'); }
  }catch(e){}
});

// Recipe search
recipeBtn.addEventListener('click', ()=>{
  if(!currentDish) return;
  const q = `ricetta ${currentDish.name} ${method==='airfryer'?'friggitrice ad aria':'forno'}`;
  const url = `https://duckduckgo.com/?q=${encodeURIComponent(q)}`;
  window.open(url, '_blank', 'noopener');
});
