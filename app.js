// Tempi cottura MVP (Web) v2
const DISH_PRESETS = {
  "Lasagne": { forno: 35, airfryer: 22 },
  "Pizza margherita": { forno: 12, airfryer: 8 },
  "Pane casereccio": { forno: 40, airfryer: 25 },
  "Focaccia": { forno: 20, airfryer: 15 },
  "Patate al forno": { forno: 45, airfryer: 25 },
  "Patatine fritte": { forno: 25, airfryer: 15 },
  "Pollo intero": { forno: 60, airfryer: 45 },
  "Cosce di pollo": { forno: 45, airfryer: 30 },
  "Petto di pollo impanato": { forno: 25, airfryer: 15 },
  "Polpette di carne": { forno: 30, airfryer: 18 },
  "Salsiccia al forno": { forno: 35, airfryer: 20 },
  "Orata al forno": { forno: 25, airfryer: 18 },
  "Salmone al forno": { forno: 20, airfryer: 12 },
  "Branzino al forno": { forno: 25, airfryer: 15 },
  "Verdure grigliate": { forno: 20, airfryer: 12 },
  "Melanzane alla parmigiana": { forno: 35, airfryer: 20 },
  "Zucchine ripiene": { forno: 30, airfryer: 18 },
  "Peperoni ripieni": { forno: 35, airfryer: 20 },
  "Cavolfiore gratinato": { forno: 25, airfryer: 15 },
  "Broccoli gratinati": { forno: 20, airfryer: 12 },
  "Torta salata": { forno: 30, airfryer: 20 },
  "Quiche lorraine": { forno: 35, airfryer: 22 },
  "Frittata al forno": { forno: 20, airfryer: 12 },
  "Muffin dolci": { forno: 20, airfryer: 12 },
  "Torta margherita": { forno: 35, airfryer: 22 },
  "Crostata di marmellata": { forno: 30, airfryer: 20 },
  "Biscotti": { forno: 12, airfryer: 8 },
  "Brownies": { forno: 25, airfryer: 15 },
  "Cannelloni": { forno: 35, airfryer: 22 },
  "Lasagna vegetariana": { forno: 35, airfryer: 22 }
};

const APP_URL = location.origin + location.pathname; // link per la condivisione

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

let method = 'forno';
let secondsLeft = 0;
let timerId = null;
let endAt = null;

// Populate dishes
for (const k of Object.keys(DISH_PRESETS)) {
  const opt = document.createElement('option');
  opt.value = k;
  opt.textContent = k;
  dishSel.appendChild(opt);
}
dishSel.value = Object.keys(DISH_PRESETS)[0];

function applyPreset() {
  const dish = dishSel.value;
  const mins = DISH_PRESETS[dish][method];
  minutesInput.value = mins;
  secondsLeft = mins * 60;
  endAt = null;
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
    beep();
    maybeNotify();
  }
}

function startTimer() {
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

// Basic beep via WebAudio
function beep() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = 'sine';
    o.frequency.value = 880;
    o.connect(g);
    g.connect(ctx.destination);
    const now = ctx.currentTime;
    g.gain.setValueAtTime(0.0001, now);
    g.gain.exponentialRampToValueAtTime(0.5, now + 0.01);
    o.start(now);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);
    o.stop(now + 1.25);
  } catch (e) { console.log('Audio error', e); }
}

// Notifications (optional)
if ('Notification' in window && Notification.permission === 'default') {
  Notification.requestPermission().catch(()=>{});
}
function maybeNotify() {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification('Tempi cottura', { body: `Pronto: ${dishSel.value}` });
  }
}

// Share button with link
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
  } catch (e) {
    console.log('Share canceled/failed', e);
  }
});

// Recipe search button: opens a web search for the selected dish/method
if (recipeBtn) {
  recipeBtn.addEventListener('click', () => {
    const q = `ricetta ${dishSel.value} ${method === 'airfryer' ? 'friggitrice ad aria' : 'forno'}`;
    const url = `https://duckduckgo.com/?q=${encodeURIComponent(q)}`;
    window.open(url, '_blank', 'noopener');
  });
}

// Initial
applyPreset();
