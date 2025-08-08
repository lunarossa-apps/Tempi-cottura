// Tempi cottura MVP (Web)
const DISH_PRESETS = {
  "Patate al forno": { forno: 45, airfryer: 25 },
  "Pollo a tocchetti": { forno: 30, airfryer: 18 },
  "Verdure grigliate": { forno: 20, airfryer: 12 },
  "Lasagne": { forno: 35, airfryer: 22 }
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

const recipeCard = document.getElementById('recipeCard');
const recipeLink = document.getElementById('recipeLink');
const recipeStatus = document.getElementById('recipeStatus');

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
  fetchRecipeLink().catch(()=>{});
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
  const text = `Timer cottura: ${dishSel.value} (${method}) impostato a ${mm}:${ss}.\nScarica l’app: ${APP_URL}`;
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

// Recipe suggestion using DuckDuckGo HTML via AllOrigins (public CORS proxy).
// Fallback: link di ricerca.
async function fetchRecipeLink() {
  recipeCard.classList.remove('hidden');
  recipeStatus.textContent = 'Cerco una ricetta...';
  recipeLink.textContent = '...';
  recipeLink.href = '#';

  const q = `ricetta ${dishSel.value} ${method === 'airfryer' ? 'friggitrice ad aria' : 'forno'}`;
  const ddg = `https://duckduckgo.com/html/?q=${encodeURIComponent(q)}`;
  const proxied = `https://api.allorigins.win/get?url=${encodeURIComponent(ddg)}`;

  try {
    const res = await fetch(proxied, { cache: 'no-store' });
    if (!res.ok) throw new Error('Fetch failed');
    const data = await res.json();
    const html = data.contents;
    const doc = new DOMParser().parseFromString(html, 'text/html');
    // First organic result
    const first = doc.querySelector('.result__a');
    if (first && first.getAttribute('href')) {
      const href = first.getAttribute('href');
      const title = first.textContent.trim();
      recipeLink.textContent = title || 'Apri ricetta';
      recipeLink.href = href;
      recipeStatus.textContent = '';
      return;
    }
    throw new Error('No result');
  } catch (e) {
    // Fallback: search link
    const searchLink = `https://duckduckgo.com/?q=${encodeURIComponent(q)}`;
    recipeLink.textContent = 'Vedi risultati di ricerca';
    recipeLink.href = searchLink;
    recipeStatus.textContent = 'Risultato diretto non disponibile. Ti porto alla ricerca.';
  }
}

// Initial
applyPreset();
