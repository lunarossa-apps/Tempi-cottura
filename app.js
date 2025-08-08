// Tempi Cottura - v6 (user images version)
// --- Piatti (dropdown)
const DISHES = [
  "Arancini di riso","Arrosto di maiale","Arrosto di vitello","Bastoncini di pesce","Calamari fritti",
  "Cannelloni ricotta e spinaci","Cordon Bleu","Cotolette di pollo","Crostata di marmellata","Crocchette di patate",
  "Focaccia","Frittata al forno","Frittelle dolci","Lasagna vegetariana","Lasagne al ragù","Mini pizze",
  "Mozzarella in carrozza","Orata al forno","Pane casereccio","Parmigiana di melanzane","Patate al forno","Patatine fritte",
  "Pesce al forno con patate","Pizza margherita","Pizza surgelata","Pizza tonda","Pollo fritto","Polpette di carne",
  "Quiche lorraine","Salmone al forno","Salsiccia al forno","Sofficini","Torta al cioccolato","Torta margherita",
  "Torta salata","Verdure grigliate","Zucchine ripiene"
];

// --- Tempi completi
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

// --- Persistenza preferenza metodo e modalità airfryer
const PREF_METHOD_KEY = 'tc-pref-method'; // 'forno' | 'airfryer'
let prefMethod = localStorage.getItem(PREF_METHOD_KEY) || null;

const AIR_MODE_KEY = 'tc-air-mode'; // 'potente' | 'standard'
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
const recipeBtn = document.getElementById('openRecipe');

const mFornoBtn = document.getElementById('mForno');
const mAirBtn = document.getElementById('mAir');
const favForno = document.getElementById('favForno');
const favAir = document.getElementById('favAir');
const airModeSel = document.getElementById('airModeSel');

// --- State
let method = 'forno';
let secondsLeft = 0;
let timerId = null;
let endAt = null;

// Populate dishes
DISHES.sort((a,b)=>a.localeCompare(b)).forEach(n => {
  const opt = document.createElement('option');
  opt.value = n; opt.textContent = n;
  dishSel.appendChild(opt);
});

// Apply preferred method on load
function applyPreferredMethod(){
  if (prefMethod === 'airfryer') {
    favAir.classList.add('on'); favAir.textContent='★';
    favForno.classList.remove('on'); favForno.textContent='☆';
    method = 'airfryer';
  } else if (prefMethod === 'forno') {
    favForno.classList.add('on'); favForno.textContent='★';
    favAir.classList.remove('on'); favAir.textContent='☆';
    method = 'forno';
  } else {
    favForno.textContent='☆'; favAir.textContent='☆';
    method = 'forno';
  }
  airModeSel.value = airMode;
  applyPreset();
}
applyPreferredMethod();

// Favorite toggles
favForno.addEventListener('click', () => {
  prefMethod = 'forno';
  localStorage.setItem(PREF_METHOD_KEY, prefMethod);
  favForno.classList.add('on'); favForno.textContent='★';
  favAir.classList.remove('on'); favAir.textContent='☆';
});
favAir.addEventListener('click', () => {
  prefMethod = 'airfryer';
  localStorage.setItem(PREF_METHOD_KEY, prefMethod);
  favAir.classList.add('on'); favAir.textContent='★';
  favForno.classList.remove('on'); favForno.textContent='☆';
});

// Method buttons
mFornoBtn.addEventListener('click', () => { method='forno'; applyPreset(); });
mAirBtn.addEventListener('click', () => { method='airfryer'; applyPreset(); });

airModeSel.addEventListener('change', () => {
  airMode = airModeSel.value;
  localStorage.setItem(AIR_MODE_KEY, airMode);
  if (method === 'airfryer') applyPreset();
});

function applyPreset() {
  const n = dishSel.value || DISHES[0];
  const map = method==='forno' ? PRESETS.forno : PRESETS.airfryer;
  let mins = map[n];
  if (mins === undefined) {
    alert(`Tempo non definito per "${n}" (${method}).`);
    startBtn.disabled = true;
    return;
  }
  if (method === 'airfryer' && airMode === 'standard') mins += 2;
  minutesInput.value = mins;
  secondsLeft = mins * 60;
  endAt = null;
  startBtn.disabled = false;
  renderDisplay();
}

dishSel.addEventListener('change', applyPreset);

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
    new Notification('Tempi Cottura', { body: `Pronto: ${dishSel.value} (${method}${method==='airfryer'?' • '+airMode:''})` });
  }
}

// Share
shareBtn.addEventListener('click', async()=>{
  const mm=String(Math.floor(secondsLeft/60)).padStart(2,'0');
  const ss=String(secondsLeft%60).padStart(2,'0');
  const text=`Timer cottura: ${dishSel.value} (${method}${method==='airfryer'?' • '+airMode:''}) a ${mm}:${ss}.\nApri l’app: ${location.href}`;
  try{
    if(navigator.share){ await navigator.share({title:'Tempi Cottura', text}); }
    else{ await navigator.clipboard.writeText(text); alert('Copiato negli appunti.'); }
  }catch(e){}
});

// Recipe search
recipeBtn.addEventListener('click', ()=>{
  const q = `ricetta ${dishSel.value} ${method==='airfryer'?'friggitrice ad aria':'forno'}`;
  const url = `https://duckduckgo.com/?q=${encodeURIComponent(q)}`;
  window.open(url, '_blank', 'noopener');
});

dishSel.selectedIndex = 0;
applyPreset();
