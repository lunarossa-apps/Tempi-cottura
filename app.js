// Tempi cottura (Web) v4 regen
const DISH_PRESETS = {
  "Biscotti": { forno: 12, airfryer: 8 },
  "Branzino al forno": { forno: 25, airfryer: 15 },
  "Broccoli gratinati": { forno: 20, airfryer: 12 },
  "Brownies": { forno: 25, airfryer: 15 },
  "Cannelloni": { forno: 35, airfryer: 22 },
  "Cavolfiore gratinato": { forno: 25, airfryer: 15 },
  "Cosce di pollo": { forno: 45, airfryer: 30 },
  "Crostata di marmellata": { forno: 30, airfryer: 20 },
  "Focaccia": { forno: 20, airfryer: 15 },
  "Frittata al forno": { forno: 20, airfryer: 12 },
  "Lasagna vegetariana": { forno: 35, airfryer: 22 },
  "Lasagne": { forno: 35, airfryer: 22 },
  "Melanzane alla parmigiana": { forno: 35, airfryer: 20 },
  "Muffin dolci": { forno: 20, airfryer: 12 },
  "Orata al forno": { forno: 25, airfryer: 18 },
  "Pane casereccio": { forno: 40, airfryer: 25 },
  "Patatine fritte": { forno: 25, airfryer: 15 },
  "Patate al forno": { forno: 45, airfryer: 25 },
  "Peperoni ripieni": { forno: 35, airfryer: 20 },
  "Petto di pollo impanato": { forno: 25, airfryer: 15 },
  "Pizza margherita": { forno: 12, airfryer: 8 },
  "Pollo intero": { forno: 60, airfryer: 45 },
  "Polpette di carne": { forno: 30, airfryer: 18 },
  "Quiche lorraine": { forno: 35, airfryer: 22 },
  "Salmone al forno": { forno: 20, airfryer: 12 },
  "Salsiccia al forno": { forno: 35, airfryer: 20 },
  "Torta margherita": { forno: 35, airfryer: 22 },
  "Torta salata": { forno: 30, airfryer: 20 },
  "Verdure grigliate": { forno: 20, airfryer: 12 },
  "Zucchine ripiene": { forno: 30, airfryer: 18 }
};

const APP_URL = location.origin + location.pathname;
const dishFilter = document.getElementById('dishFilter');
const dishSel = document.getElementById('dish');
const minutesInput = document.getElementById('minutes');
const display = document.getElementById('display');
const startBtn = document.getElementById('start');
const pauseBtn = document.getElementById('pause');
const resetBtn = document.getElementById('reset');
const minus1Btn = document.getElementById('minus1');
const plus1Btn = document.getElementById('plus1');
const shareBtn = document.getElementById('share');
const recipeBtn = document.getElementById('openRecipe');
const heroImg = document.getElementById('heroImg');
const heroTitle = document.getElementById('heroTitle');
const heroSub = document.getElementById('heroSub');

let method = 'forno';
let secondsLeft = 0;
let timerId = null;
let endAt = null;

// Audio unlock & 10s siren
let audioCtx;
function initAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const o = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    o.connect(g); g.connect(audioCtx.destination);
    g.gain.setValueAtTime(0.00001, audioCtx.currentTime);
    o.start(); o.stop(audioCtx.currentTime + 0.02);
  }
}
function alarm10s() {
  if (!audioCtx) return;
  const o = audioCtx.createOscillator();
  const g = audioCtx.createGain();
  o.type = 'sine';
  o.connect(g); g.connect(audioCtx.destination);
  const now = audioCtx.currentTime;
  g.gain.setValueAtTime(0.0001, now);
  g.gain.linearRampToValueAtTime(0.7, now + 0.1);
  o.frequency.setValueAtTime(700, now);
  for (let i = 0; i < 10; i++) {
    const t1 = now + i;
    const t2 = now + i + 0.5;
    const t3 = now + i + 1.0;
    o.frequency.linearRampToValueAtTime(1200, t2);
    o.frequency.linearRampToValueAtTime(700, t3);
  }
  o.start(now);
  o.stop(now + 10.0);
  g.gain.setValueAtTime(0.7, now + 9.5);
  g.gain.linearRampToValueAtTime(0.0001, now + 10.0);
}

// Populate dishes
function renderDishOptions(filterText="") {
  const entries = Object.keys(DISH_PRESETS).sort((a,b)=>a.localeCompare(b));
  dishSel.innerHTML = "";
  for (const k of entries) {
    if (filterText && !k.toLowerCase().includes(filterText.toLowerCase())) continue;
    const opt = document.createElement('option');
    opt.value = k; opt.textContent = k;
    dishSel.appendChild(opt);
  }
  if (!dishSel.value && dishSel.options.length) dishSel.value = dishSel.options[0].value;
}
renderDishOptions();

function updateHero() {
  heroImg.src = method === 'airfryer' ? 'assets/banner-airfryer.png' : 'assets/banner-oven.png';
  heroTitle.textContent = dishSel.value || 'Tempi cottura';
  heroSub.textContent = method === 'airfryer' ? 'Friggitrice ad aria' : 'Forno classico';
}

function applyPreset() {
  const dish = dishSel.value;
  const mins = DISH_PRESETS[dish][method];
  minutesInput.value = mins;
  secondsLeft = mins * 60;
  endAt = null;
  updateHero();
  renderDisplay();
}

function renderDisplay() {
  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
  const ss = String(secondsLeft % 60).padStart(2, '0');
  display.textContent = `${mm}:${ss}`;
}

function tick() {
  if (!endAt) return;
  const now = Date.now();
  secondsLeft = Math.max(0, Math.round((endAt - now) / 1000));
  renderDisplay();
  if (secondsLeft <= 0) {
    stopTimer();
    alarm10s();
    if (navigator.vibrate) navigator.vibrate([300,150,300,150,300,150,300]);
    maybeNotify();
  }
}

function startTimer() {
  initAudio();
  if (timerId) clearInterval(timerId);
  if (!secondsLeft) secondsLeft = Math.max(0, parseInt(minutesInput.value || '0') * 60);
  endAt = Date.now() + secondsLeft * 1000;
  timerId = setInterval(tick, 250);
  tick();
}

function pauseTimer() {
  if (!timerId) return;
  clearInterval(timerId);
  timerId = null;
  if (endAt) {
    secondsLeft = Math.max(0, Math.round((endAt - Date.now()) / 1000));
    endAt = null;
  }
  renderDisplay();
}

function stopTimer() {
  if (timerId) clearInterval(timerId);
  timerId = null;
  endAt = null;
  renderDisplay();
}

function resetTimer() {
  stopTimer();
  applyPreset();
}

minus1Btn.addEventListener('click', () => {
  secondsLeft = Math.max(0, secondsLeft - 60);
  if (endAt) endAt -= 60 * 1000;
  renderDisplay();
});
plus1Btn.addEventListener('click', () => {
  secondsLeft += 60;
  if (endAt) endAt += 60 * 1000;
  renderDisplay();
});

startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', resetTimer);

document.querySelectorAll('input[name="method"]').forEach(r => {
  r.addEventListener('change', e => {
    method = e.target.value;
    applyPreset();
  });
});
dishSel.addEventListener('change', applyPreset);
minutesInput.addEventListener('change', () => {
  const v = Math.max(0, parseInt(minutesInput.value || '0'));
  minutesInput.value = v;
  secondsLeft = v * 60;
  endAt = null;
  renderDisplay();
});

dishFilter.addEventListener('input', () => {
  const prev = dishSel.value;
  renderDishOptions(dishFilter.value.trim());
  for (const opt of dishSel.options) {
    if (opt.value === prev) { dishSel.value = prev; break; }
  }
  applyPreset();
});

if ('Notification' in window && Notification.permission === 'default') {
  Notification.requestPermission().catch(()=>{});
}
function maybeNotify() {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification('Tempi cottura', { body: `Pronto: ${dishSel.value}` });
  }
}

shareBtn.addEventListener('click', async () => {
  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
  const ss = String(secondsLeft % 60).padStart(2, '0');
  const text = `Timer cottura: ${dishSel.value} (${method}) impostato a ${mm}:${ss}.\nApri l’app: ${APP_URL}`;
  try {
    if (navigator.share) {
      await navigator.share({ title: 'Tempi cottura', text });
    } else {
      await navigator.clipboard.writeText(text);
      alert('Testo copiato negli appunti. Incollalo dove vuoi.');
    }
  } catch (e) {}
});

if (recipeBtn) {
  recipeBtn.addEventListener('click', () => {
    const q = `ricetta ${dishSel.value} ${method === 'airfryer' ? 'friggitrice ad aria' : 'forno'}`;
    const url = `https://duckduckgo.com/?q=${encodeURIComponent(q)}`;
    window.open(url, '_blank', 'noopener');
  });
}

applyPreset();
