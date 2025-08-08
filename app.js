// Tempi Cottura - v7 (layout & UI tweaks)
// --- Dishes (dropdown only)
const DISHES = [
  "Arancini di riso","Arrosto di maiale","Arrosto di vitello","Bastoncini di pesce","Calamari fritti",
  "Cannelloni ricotta e spinaci","Cordon Bleu","Cotolette di pollo","Crostata di marmellata","Crocchette di patate",
  "Focaccia","Frittata al forno","Frittelle dolci","Lasagna vegetariana","Lasagne al ragù","Mini pizze",
  "Mozzarella in carrozza","Orata al forno","Pane casereccio","Parmigiana di melanzane","Patate al forno","Patatine fritte",
  "Pesce al forno con patate","Pizza margherita","Pizza surgelata","Pizza tonda","Pollo fritto","Polpette di carne",
  "Quiche lorraine","Salmone al forno","Salsiccia al forno","Sofficini","Torta al cioccolato","Torta margherita",
  "Torta salata","Verdure grigliate","Zucchine ripiene"
];

// --- Presets (unchanged)
const PRESETS = {
  forno: {
    "Lasagne al ragù": 35, "Pizza margherita": 12, "Pane casereccio": 40, "Parmigiana di melanzane": 35,
    "Torta al cioccolato": 35, "Arrosto di vitello": 60, "Arrosto di maiale": 55, "Pesce al forno con patate": 30,
    "Patate al forno": 45, "Cannelloni ricotta e spinaci": 35, "Crostata di marmellata": 30, "Pizza surgelata": 14,
    "Pizza tonda": 12, "Pollo fritto": 25, "Patatine fritte": 25, "Bastoncini di pesce": 15, "Sofficini": 18,
    "Cordon Bleu": 20, "Polpette di carne": 30, "Cotolette di pollo": 20, "Crocchette di patate": 20,
    "Calamari fritti": 15, "Verdure grigliate": 20, "Arancini di riso": 20, "Mozzarella in carrozza": 12,
    "Mini pizze": 12, "Frittelle dolci": 12, "Focaccia": 20, "Frittata al forno": 20, "Lasagna vegetariana": 35,
    "Orata al forno": 25, "Quiche lorraine": 35, "Salmone al forno": 20, "Salsiccia al forno": 35,
    "Torta margherita": 35, "Torta salata": 30, "Zucchine ripiene": 30
  },
  airfryer: {
    "Lasagne al ragù": 22, "Pizza margherita": 8, "Pane casereccio": 25, "Parmigiana di melanzane": 20,
    "Torta al cioccolato": 22, "Arrosto di vitello": 45, "Arrosto di maiale": 45, "Pesce al forno con patate": 22,
    "Patate al forno": 25, "Cannelloni ricotta e spinaci": 22, "Crostata di marmellata": 20, "Pizza surgelata": 10,
    "Pizza tonda": 8, "Pollo fritto": 18, "Patatine fritte": 15, "Bastoncini di pesce": 10, "Sofficini": 11,
    "Cordon Bleu": 12, "Polpette di carne": 14, "Cotolette di pollo": 12, "Crocchette di patate": 12,
    "Calamari fritti": 8, "Verdure grigliate": 12, "Arancini di riso": 12, "Mozzarella in carrozza": 7,
    "Mini pizze": 9, "Frittelle dolci": 8, "Focaccia": 15, "Frittata al forno": 12, "Lasagna vegetariana": 22,
    "Orata al forno": 18, "Quiche lorraine": 22, "Salmone al forno": 12, "Salsiccia al forno": 20,
    "Torta margherita": 22, "Torta salata": 20, "Zucchine ripiene": 18
  }
};

// --- Persistence
const PREF_METHOD_KEY = 'tc-pref-method';
let prefMethod = localStorage.getItem(PREF_METHOD_KEY) || null;
const AIR_MODE_KEY = 'tc-air-mode';
let airMode = localStorage.getItem(AIR_MODE_KEY) || 'potente';

// --- UI refs
const dishSel = document.getElementById('dishSel');
const minutesInput = document.getElementById('minutes');
const minus1Btn = document.getElementById('minus1');
const plus1Btn = document.getElementById('plus1');
const display = document.getElementById('display');
const startBtn = document.getElementById('start');
const pauseBtn = document.getElementById('pause');
const resetBtn = document.getElementById('reset');
const shareBtn = document.getElementById('share');
const airModeSel = document.getElementById('airModeSel');
const airRow = document.getElementById('airRow');
const cardForno = document.getElementById('cardForno');
const cardAir = document.getElementById('cardAir');
const favForno = document.getElementById('favForno');
const favAir = document.getElementById('favAir');

// --- State
let method = 'forno';
let secondsLeft = 0;
let timerId = null;
let endAt = null;
let running = false;

// Populate dishes w/ larger font
DISHES.sort((a,b)=>a.localeCompare(b)).forEach(n => {
  const opt = document.createElement('option');
  opt.value = n; opt.textContent = n;
  dishSel.appendChild(opt);
});

function applyPreferredMethod(){
  if (prefMethod === 'airfryer') {
    setSelected(cardAir, cardForno);
    favAir.classList.add('on'); favForno.classList.remove('on');
    method = 'airfryer';
  } else {
    setSelected(cardForno, cardAir);
    favForno.classList.add('on'); favAir.classList.remove('on');
    method = 'forno';
  }
  airModeSel.value = airMode;
  applyPreset();
}
applyPreferredMethod();

function setSelected(selected, other){
  selected.classList.add('selected'); other.classList.remove('selected');
  airRow.style.display = (selected.id==='cardAir') ? 'flex' : 'none';
}

// Clickable cards
cardForno.addEventListener('click', ()=>{ method='forno'; setSelected(cardForno, cardAir); applyPreset(); });
cardAir.addEventListener('click', ()=>{ method='airfryer'; setSelected(cardAir, cardForno); applyPreset(); });
cardForno.addEventListener('keypress', (e)=>{ if(e.key==='Enter' || e.key===' ') {cardForno.click(); e.preventDefault();} });
cardAir.addEventListener('keypress', (e)=>{ if(e.key==='Enter' || e.key===' ') {cardAir.click(); e.preventDefault();} });

// Favorite toggles
favForno.addEventListener('click', (e)=>{
  e.stopPropagation();
  prefMethod='forno'; localStorage.setItem(PREF_METHOD_KEY, prefMethod);
  favForno.classList.add('on'); favAir.classList.remove('on');
});
favAir.addEventListener('click', (e)=>{
  e.stopPropagation();
  prefMethod='airfryer'; localStorage.setItem(PREF_METHOD_KEY, prefMethod);
  favAir.classList.add('on'); favForno.classList.remove('on');
});

airModeSel.addEventListener('change', ()=>{
  airMode = airModeSel.value; localStorage.setItem(AIR_MODE_KEY, airMode);
  if (method==='airfryer') applyPreset();
});

dishSel.addEventListener('change', applyPreset);

function applyPreset(){
  const n = dishSel.value || DISHES[0];
  const map = method==='forno'? PRESETS.forno : PRESETS.airfryer;
  let mins = map[n];
  if (mins===undefined){ alert(`Tempo non definito per "${n}" (${method}).`); startBtn.disabled=true; return; }
  if (method==='airfryer' && airMode==='standard') mins += 2;
  minutesInput.value = mins;
  secondsLeft = mins*60;
  endAt = null;
  startBtn.disabled=false;
  renderDisplay();
}

// Timer logic + UI colors
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

function renderDisplay(){
  const mm = String(Math.floor(secondsLeft/60)).padStart(2,'0');
  const ss = String(secondsLeft%60).padStart(2,'0');
  display.textContent = `${mm}:${ss}`;
}

minus1Btn.addEventListener('click', ()=>{ secondsLeft=Math.max(0,secondsLeft-60); if(endAt) endAt-=60000; renderDisplay(); });
plus1Btn.addEventListener('click', ()=>{ secondsLeft+=60; if(endAt) endAt+=60000; renderDisplay(); });
minutesInput.addEventListener('change', ()=>{
  const v=Math.max(0, parseInt(minutesInput.value||'0')); minutesInput.value=v; secondsLeft=v*60; endAt=null; renderDisplay();
});

startBtn.addEventListener('click', ()=>{
  if (!running) { // START -> turn green->red label 'Pausa' and show pause btn? We'll toggle single button
    initAudio();
    if(!secondsLeft) secondsLeft = Math.max(0, parseInt(minutesInput.value||'0')*60);
    endAt = Date.now()+secondsLeft*1000;
    timerId = setInterval(tick,250);
    running = true;
    startBtn.textContent = 'Pausa';
    startBtn.classList.remove('primary'); startBtn.classList.add('danger');
  } else { // currently running -> PAUSE
    if(timerId) clearInterval(timerId); timerId=null;
    if(endAt){ secondsLeft=Math.max(0, Math.round((endAt-Date.now())/1000)); endAt=null; }
    running = false;
    startBtn.textContent = 'Start';
    startBtn.classList.remove('danger'); startBtn.classList.add('primary');
  }
});

resetBtn.addEventListener('click', ()=>{ if(timerId) clearInterval(timerId); timerId=null; running=false; startBtn.textContent='Start'; startBtn.className='primary start'; applyPreset(); });

function tick(){
  if(!endAt) return;
  secondsLeft=Math.max(0, Math.round((endAt-Date.now())/1000));
  renderDisplay();
  if(secondsLeft<=0){
    if(timerId) clearInterval(timerId); timerId=null; running=false;
    startBtn.textContent='Start'; startBtn.classList.remove('danger'); startBtn.classList.add('primary');
    alarm10s(); if(navigator.vibrate) navigator.vibrate([300,150,300,150,300,150,300]);
  }
}

// Share
shareBtn.addEventListener('click', async()=>{
  const mm=String(Math.floor(secondsLeft/60)).padStart(2,'0');
  const ss=String(secondsLeft%60).padStart(2,'0');
  const text=`Timer cottura: ${dishSel.value} (${method}${method==='airfryer'?' • '+airMode:''}) a ${mm}:${ss}.\nApri l’app: ${location.href}`;
  try{ if(navigator.share){ await navigator.share({title:'Tempi Cottura', text}); } else { await navigator.clipboard.writeText(text); alert('Copiato negli appunti.'); } }catch(e){}
});

// Init
dishSel.selectedIndex=0; applyPreset();
