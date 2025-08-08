// Tempi Cottura - v7.4.2 (core fixes)
/* ====== Config ====== */
const DISHES = [
  "Arancini di riso","Arrosto di maiale","Arrosto di vitello","Bastoncini di pesce","Calamari fritti",
  "Cannelloni ricotta e spinaci","Cordon Bleu","Cotolette di pollo","Crostata di marmellata","Crocchette di patate",
  "Focaccia","Frittata al forno","Frittelle dolci","Lasagna vegetariana","Lasagne al ragù","Mini pizze",
  "Mozzarella in carrozza","Orata al forno","Pane casereccio","Parmigiana di melanzane","Patate al forno","Patatine fritte",
  "Pesce al forno con patate","Pizza margherita","Pizza surgelata","Pizza tonda","Pollo fritto","Polpette di carne",
  "Quiche lorraine","Salmone al forno","Salsiccia al forno","Sofficini","Torta al cioccolato","Torta margherita",
  "Torta salata","Verdure grigliate","Zucchine ripiene"
];
const PRESETS = { forno: { "Lasagne al ragù": 35, "Pizza margherita": 12, "Pane casereccio": 40, "Parmigiana di melanzane": 35,
"Torta al cioccolato": 35, "Arrosto di vitello": 60, "Arrosto di maiale": 55, "Pesce al forno con patate": 30, "Patate al forno": 45,
"Cannelloni ricotta e spinaci": 35, "Crostata di marmellata": 30, "Pizza surgelata": 14, "Pizza tonda": 12, "Pollo fritto": 25,
"Patatine fritte": 25, "Bastoncini di pesce": 15, "Sofficini": 18, "Cordon Bleu": 20, "Polpette di carne": 30, "Cotolette di pollo": 20,
"Crocchette di patate": 20, "Calamari fritti": 15, "Verdure grigliate": 20, "Arancini di riso": 20, "Mozzarella in carrozza": 12,
"Mini pizze": 12, "Frittelle dolci": 12, "Focaccia": 20, "Frittata al forno": 20, "Lasagna vegetariana": 35, "Orata al forno": 25,
"Quiche lorraine": 35, "Salmone al forno": 20, "Salsiccia al forno": 35, "Torta margherita": 35, "Torta salata": 30, "Zucchine ripiene": 30 },
airfryer: { "Lasagne al ragù": 22, "Pizza margherita": 8, "Pane casereccio": 25, "Parmigiana di melanzane": 20, "Torta al cioccolato": 22,
"Arrosto di vitello": 45, "Arrosto di maiale": 45, "Pesce al forno con patate": 22, "Patate al forno": 25, "Cannelloni ricotta e spinaci": 22,
"Crostata di marmellata": 20, "Pizza surgelata": 10, "Pizza tonda": 8, "Pollo fritto": 18, "Patatine fritte": 15, "Bastoncini di pesce": 10,
"Sofficini": 11, "Cordon Bleu": 12, "Polpette di carne": 14, "Cotolette di pollo": 12, "Crocchette di patate": 12, "Calamari fritti": 8,
"Verdure grigliate": 12, "Arancini di riso": 12, "Mozzarella in carrozza": 7, "Mini pizze": 9, "Frittelle dolci": 8, "Focaccia": 15,
"Frittata al forno": 12, "Lasagna vegetariana": 22, "Orata al forno": 18, "Quiche lorraine": 22, "Salmone al forno": 12, "Salsiccia al forno": 20,
"Torta margherita": 22, "Torta salata": 20, "Zucchine ripiene": 18 } };

/* ====== Keys ====== */
const PREF_METHOD_KEY = 'tc-pref-method';
const AIR_MODE_KEY = 'tc-air-mode';
const AUDIO_OK_KEY = 'tc-audio-ok';
const THEME_KEY = 'tc-theme';

/* ====== Themes ====== */
const THEMES = {
  nero:   { bg:'#0b0b0c', card:'#151518', fg:'#f9fafb', muted:'#9ca3af', border:'#26262a', primary:'#22c55e', danger:'#ef4444', btnText:'#0b0b0c', icon:'#9ca3af', light:false },
  bianco: { bg:'#f8fafc', card:'#ffffff', fg:'#111827', muted:'#475569', border:'#e5e7eb', primary:'#16a34a', danger:'#dc2626', btnText:'#111827', icon:'#6b7280', light:true },
  celeste:{ bg:'#e0f2fe', card:'#ffffff', fg:'#0b0b0c', muted:'#334155', border:'#bae6fd', primary:'#0ea5e9', danger:'#dc2626', btnText:'#111827', icon:'#374151', light:true },
  rosa:   { bg:'#ffe4e6', card:'#ffffff', fg:'#0b0b0c', muted:'#334155', border:'#fecdd3', primary:'#f43f5e', danger:'#b91c1c', btnText:'#111827', icon:'#374151', light:true },
  giallo: { bg:'#fef9c3', card:'#ffffff', fg:'#0b0b0c', muted:'#334155', border:'#fef08a', primary:'#f59e0b', danger:'#b91c1c', btnText:'#111827', icon:'#374151', light:true },
  indaco: { bg:'#312e81', card:'#3730a3', fg:'#e0e7ff', muted:'#a5b4fc', border:'#4338ca', primary:'#22c55e', danger:'#ef4444', btnText:'#0b0b0c', icon:'#cbd5e1', light:false },
  grigio: { bg:'#111827', card:'#1f2937', fg:'#f9fafb', muted:'#9ca3af', border:'#374151', primary:'#22c55e', danger:'#ef4444', btnText:'#0b0b0c', icon:'#9ca3af', light:false }
};

function applyTheme(name){
  const t = THEMES[name] || THEMES.nero;
  const r = document.documentElement;
  r.style.setProperty('--bg', t.bg);
  r.style.setProperty('--card', t.card);
  r.style.setProperty('--fg', t.fg);
  r.style.setProperty('--muted', t.muted);
  r.style.setProperty('--border', t.border);
  r.style.setProperty('--primary', t.primary);
  r.style.setProperty('--danger', t.danger);
  r.style.setProperty('--btnText', t.btnText);
  r.style.setProperty('--icon', t.icon);
  document.body.classList.toggle('theme-light', !!t.light);
  localStorage.setItem(THEME_KEY, name);
}

/* ====== Refs ====== */
const dishSel = document.getElementById('dishSel');
const minutesInput = document.getElementById('minutes');
const minus1Btn = document.getElementById('minus1');
const plus1Btn = document.getElementById('plus1');
const display = document.getElementById('display');
const startBtn = document.getElementById('start');
const resetBtn = document.getElementById('reset');
const shareBtn = document.getElementById('share');
const airModeSel = document.getElementById('airModeSel');
const airRow = document.getElementById('airRow');
const cardForno = document.getElementById('cardForno');
const cardAir = document.getElementById('cardAir');
const favForno = document.getElementById('favForno');
const favAir = document.getElementById('favAir');
const btnSettings = document.getElementById('btnSettings');
const settingsPanel = document.getElementById('settingsPanel');
const closeSettings = document.getElementById('closeSettings');
const themeGrid = document.getElementById('themeGrid');

/* ====== State ====== */
let method = 'forno';
let secondsLeft = 0;
let timerId = null;
let endAt = null;
let running = false;
let prefMethod = localStorage.getItem(PREF_METHOD_KEY) || null;
let airMode = localStorage.getItem(AIR_MODE_KEY) || 'potente';

/* ====== Audio ====== */
let audioCtx;
async function initAudio(){
  if (!audioCtx) audioCtx = new (window.AudioContext||window.webkitAudioContext)();
  if (audioCtx.state === 'suspended') { try { await audioCtx.resume(); } catch(_) {} }
  try {
    const o = audioCtx.createOscillator(); const g=audioCtx.createGain();
    o.connect(g); g.connect(audioCtx.destination);
    g.gain.setValueAtTime(0.00001, audioCtx.currentTime);
    o.start(); o.stop(audioCtx.currentTime+0.02);
    localStorage.setItem(AUDIO_OK_KEY,'1');
  } catch(_) {}
}
function needsAudioUnlock(){
  const ok = localStorage.getItem(AUDIO_OK_KEY) === '1';
  return !ok && /iPhone|iPad|Android/i.test(navigator.userAgent);
}
function injectAudioPrompt(){
  if (document.getElementById('audioPrompt')) return;
  const box = document.createElement('div');
  box.id = 'audioPrompt';
  box.className = 'audio-prompt';
  box.innerHTML = `<span>🔔 Abilita suono allarme</span>
                   <button id="enableAudio" class="primary smallbtn">Consenti</button>`;
  document.body.appendChild(box);
  document.getElementById('enableAudio').addEventListener('click', async ()=>{
    try { await initAudio(); } catch(_) {}
    const el = document.getElementById('audioPrompt'); if (el) el.remove();
  });
}
function removeAudioPrompt(){ const el = document.getElementById('audioPrompt'); if (el) el.remove(); }

/* ====== Utils ====== */
function b64urlEncode(obj){
  const json = JSON.stringify(obj);
  const b64 = btoa(unescape(encodeURIComponent(json)));
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
function b64urlDecode(code){
  code = code.replace(/-/g,'+').replace(/_/g,'/');
  const pad = code.length % 4 ? 4 - (code.length % 4) : 0;
  code = code + '='.repeat(pad);
  const json = decodeURIComponent(escape(atob(code)));
  return JSON.parse(json);
}

/* ====== Populate dishes ====== */
DISHES.sort((a,b)=>a.localeCompare(b)).forEach(n => {
  const opt = document.createElement('option');
  opt.value = n; opt.textContent = n;
  dishSel.appendChild(opt);
});

function setSelected(selected, other){
  selected.classList.add('selected'); other.classList.remove('selected');
  airRow.style.display = (selected.id==='cardAir') ? 'flex' : 'none';
}
function applyPreferredMethod(){
  if (prefMethod === 'airfryer') {
    setSelected(cardAir, cardForno); favAir.classList.add('on'); favForno.classList.remove('on'); method = 'airfryer';
  } else {
    setSelected(cardForno, cardAir); favForno.classList.add('on'); favAir.classList.remove('on'); method = 'forno';
  }
  airModeSel.value = airMode; applyPreset();
}
applyPreferredMethod();

/* ====== Clicks ====== */
cardForno.addEventListener('click', ()=>{ method='forno'; setSelected(cardForno, cardAir); applyPreset(); });
cardAir.addEventListener('click', ()=>{ method='airfryer'; setSelected(cardAir, cardForno); applyPreset(); });
favForno.addEventListener('click', (e)=>{ e.stopPropagation(); prefMethod='forno'; localStorage.setItem('tc-pref-method', prefMethod); favForno.classList.add('on'); favAir.classList.remove('on'); });
favAir.addEventListener('click', (e)=>{ e.stopPropagation(); prefMethod='airfryer'; localStorage.setItem('tc-pref-method', prefMethod); favAir.classList.add('on'); favForno.classList.remove('on'); });
airModeSel.addEventListener('change', ()=>{ airMode = airModeSel.value; localStorage.setItem('tc-air-mode', airMode); if (method==='airfryer') applyPreset(); });
dishSel.addEventListener('change', applyPreset);

/* ====== Presets ====== */
function applyPreset(){
  const n = dishSel.value || DISHES[0];
  const map = method==='forno'? PRESETS.forno : PRESETS.airfryer;
  let mins = map[n];
  if (mins===undefined){ alert(`Tempo non definito per "${n}" (${method}).`); startBtn.disabled=true; return; }
  if (method==='airfryer' && airMode==='standard') mins += 2;
  minutesInput.value = mins; secondsLeft = mins*60; endAt = null; startBtn.disabled=false; renderDisplay();
}

/* ====== Alarm ====== */
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

/* ====== Timer ====== */
function renderDisplay(){ const mm = String(Math.floor(secondsLeft/60)).padStart(2,'0'); const ss = String(secondsLeft%60).padStart(2,'0'); display.textContent = `${mm}:${ss}`; }
minus1Btn.addEventListener('click', ()=>{ secondsLeft=Math.max(0,secondsLeft-60); if(endAt) endAt-=60000; renderDisplay(); });
plus1Btn.addEventListener('click', ()=>{ secondsLeft+=60; if(endAt) endAt+=60000; renderDisplay(); });
minutesInput.addEventListener('change', ()=>{ const v=Math.max(0, parseInt(minutesInput.value||'0')); minutesInput.value=v; secondsLeft=v*60; endAt=null; renderDisplay(); });

startBtn.addEventListener('click', async ()=>{
  removeAudioPrompt();
  if (!running) {
    try{ await initAudio(); }catch(_){}
    if(!secondsLeft) secondsLeft = Math.max(0, parseInt(minutesInput.value||'0')*60);
    endAt = Date.now()+secondsLeft*1000;
    timerId = setInterval(tick,250);
    running = true;
    startBtn.textContent = 'Pausa';
    startBtn.classList.remove('primary'); startBtn.classList.add('danger');
  } else {
    if(timerId) clearInterval(timerId); timerId=null;
    if(endAt){ secondsLeft=Math.max(0, Math.round((endAt-Date.now())/1000)); endAt=null; }
    running = false;
    startBtn.textContent = 'Start';
    startBtn.classList.remove('danger'); startBtn.classList.add('primary');
  }
});

resetBtn.addEventListener('click', ()=>{ if(timerId) clearInterval(timerId); timerId=null; running=false; startBtn.textContent='Start'; startBtn.className='primary start bigbtn'; applyPreset(); });

function tick(){
  if(!endAt) return;
  secondsLeft=Math.max(0, Math.round((endAt-Date.now())/1000));
  renderDisplay();
  if(secondsLeft<=0){
    if(timerId) clearInterval(timerId); timerId=null; running=false;
    startBtn.textContent='Start'; startBtn.classList.remove('danger'); startBtn.classList.add('primary');
    try{ alarm10s(); }catch(_){}
    if(navigator.vibrate) navigator.vibrate([300,150,300,150,300,150,300]);
  }
}

/* ====== Share (single-line message, space before URL) ====== */
shareBtn.addEventListener('click', async () => {
  const totalSeconds = parseInt(minutesInput.value || '0') * 60;
  let startedAt; let dur;
  if (endAt) { dur = totalSeconds; startedAt = endAt - dur * 1000; } else { dur = totalSeconds; startedAt = Date.now(); }
  const payload = { dish: dishSel.value, method, mode: (method==='airfryer'? airMode : ''), start: startedAt, dur };
  const code = b64urlEncode(payload);
  const url = `${location.origin}${location.pathname}#${code}`;
  const mins = Math.max(1, Math.round(totalSeconds/60));
  const text = `Ti è stato condiviso un Timer per ${mins} minuti relativo alla preparazione di ${dishSel.value}. Clicca per seguire il timer: ${url}`;

  const isSecure = (location.protocol === 'https:') || (location.hostname === 'localhost') || (location.hostname === '127.0.0.1');
  try {
    if (isSecure && navigator.share) {
      await navigator.share({ text });
      return;
    }
    throw new Error('Web Share non disponibile');
  } catch(_) {
    try {
      await navigator.clipboard.writeText(text);
      alert('Link copiato negli appunti.');
    } catch(__) {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position='fixed'; ta.style.opacity='0'; document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); alert('Copia eseguita.'); } catch(e){ prompt('Copia questo link:', ta.value); }
      document.body.removeChild(ta);
    }
  }
});

/* ====== Hash init (ensure audio banner on mobile when opening shared link) ====== */
function initFromHash() {
  const hash = location.hash?.replace(/^#/, '');
  if (!hash) return;
  let data; try { data = b64urlDecode(hash); } catch(_){ return; }
  const { dish: qDish, method: qMethod, mode: qMode, start: qStart, dur: qDur } = data || {};
  if (!qDish || !qMethod || !qStart || !qDur) return;

  const idx = [...dishSel.options].findIndex(o => o.value === qDish);
  if (idx >= 0) dishSel.selectedIndex = idx;

  if (qMethod === 'airfryer') {
    setSelected(cardAir, cardForno); method = 'airfryer';
    if (qMode === 'standard' || qMode === 'potente') {
      airMode = qMode; localStorage.setItem(AIR_MODE_KEY, airMode); airModeSel.value = airMode;
    }
  } else { setSelected(cardForno, cardAir); method = 'forno'; }

  applyPreset();

  const startMs = parseInt(qStart, 10); const durSec = parseInt(qDur, 10);
  const now = Date.now(); const end = startMs + durSec * 1000;
  const remain = Math.max(0, Math.round((end - now) / 1000));
  secondsLeft = remain; endAt = now + remain * 1000;

  if (timerId) clearInterval(timerId);
  timerId = setInterval(tick, 250);
  running = true;
  startBtn.textContent = 'Pausa';
  startBtn.classList.remove('primary'); startBtn.classList.add('danger');

  // Ensure banner appears on mobile if audio context not yet enabled in this session
  const onMobile = /iPhone|iPad|Android/i.test(navigator.userAgent);
  if (onMobile && (!audioCtx || needsAudioUnlock())) {
    injectAudioPrompt();
  }
}

/* ====== Settings ====== */
const THEMES_LIST = [
  ['nero','Nero'],['bianco','Bianco'],['celeste','Celeste'],['rosa','Rosa'],['giallo','Giallo'],['indaco','Indaco'],['grigio','Grigio']
];
function buildThemeGrid(){
  themeGrid.innerHTML = '';
  const current = localStorage.getItem(THEME_KEY) || 'nero';
  THEMES_LIST.forEach(([key,label])=>{
    const sw = document.createElement('button'); sw.className = 'theme-swatch'; sw.setAttribute('data-theme', key);
    const dot = document.createElement('span'); dot.className='theme-dot';
    const t = THEMES[key];
    dot.style.background = t.bg; dot.style.borderColor = t.light ? '#111827' : '#ffffff';
    const cap = document.createElement('span'); cap.className='theme-label'; cap.textContent = label;
    if (key===current) sw.style.outline = '2px solid var(--green)';
    sw.appendChild(dot); sw.appendChild(cap);
    sw.addEventListener('click', ()=>{ applyTheme(key); buildThemeGrid(); });
    themeGrid.appendChild(sw);
  });
}
btnSettings.addEventListener('click', ()=>{ buildThemeGrid(); settingsPanel.classList.remove('hidden'); });
closeSettings.addEventListener('click', ()=> settingsPanel.classList.add('hidden'));
window.addEventListener('keydown', (e)=>{ if(e.key==='Escape') settingsPanel.classList.add('hidden'); });

/* ====== Init ====== */
applyTheme(localStorage.getItem(THEME_KEY) || 'nero');
if (!location.hash) { dishSel.selectedIndex=0; applyPreset(); }
initFromHash();
