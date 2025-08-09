// Tempi Cottura v7.7.1 — Minimal stable + Share hint + DuckDuckGo recipe link
// --- Language helpers ---
const currentLang = (navigator.language||'en').toLowerCase().slice(0,2);
const ddgKl = { it:'it-it', en:'us-en', es:'es-es', pt:'pt-pt', de:'de-de' };
const methodKeywords = {
  it:{ forno:'forno', airfryer:'friggitrice ad aria' },
  en:{ forno:'oven', airfryer:'air fryer' },
  es:{ forno:'horno', airfryer:'freidora de aire' },
  pt:{ forno:'forno', airfryer:'airfryer' },
  de:{ forno:'Backofen', airfryer:'Heißluftfritteuse' }
};
const recipeWord = { it:'ricetta', en:'recipe', es:'receta', pt:'receita', de:'rezept' };
function buildRecipeURL(dishLabel, method) {
  const lang = ['it','en','es','pt','de'].includes(currentLang) ? currentLang : 'en';
  const words = `${dishLabel} ${recipeWord[lang]||'recipe'} ${methodKeywords[lang]?.[method]||''}`.trim();
  const q = encodeURIComponent(words);
  const kl = ddgKl[lang] || 'us-en';
  return `https://duckduckgo.com/?q=${q}&kl=${kl}`;
}

// --- Dishes (basic) ---
const DISH_IDS=['arancini_riso','lasagne','pizza_margherita','patate_forno','parmigiana_melanzane','pollo_fritto','patatine_fritte','bastoncini_pesce','sofficini','cordon_bleu','polpette_carne','cotolette_pollo','crocchette_patate','calamari_fritti','verdure_grigliate','pane_casereccio','crostata_marmellata','cannelloni_ricotta_spinaci','pizza_surgelata','pizza_tonda'];
const DISH_LABELS={
  arancini_riso:'Arancini di riso', lasagne:'Lasagne', pizza_margherita:'Pizza margherita', patate_forno:'Patate al forno',
  parmigiana_melanzane:'Parmigiana di melanzane', pollo_fritto:'Pollo fritto', patatine_fritte:'Patatine fritte',
  bastoncini_pesce:'Bastoncini di pesce', sofficini:'Sofficini', cordon_bleu:'Cordon Bleu', polpette_carne:'Polpette di carne',
  cotolette_pollo:'Cotolette di pollo', crocchette_patate:'Crocchette di patate', calamari_fritti:'Calamari fritti',
  verdure_grigliate:'Verdure grigliate', pane_casereccio:'Pane casereccio', crostata_marmellata:'Crostata di marmellata',
  cannelloni_ricotta_spinaci:'Cannelloni ricotta e spinaci', pizza_surgelata:'Pizza surgelata', pizza_tonda:'Pizza tonda'
};

// Preset minutes
const PRESETS={
  forno:{ lasagne:35, pizza_margherita:12, pane_casereccio:40, parmigiana_melanzane:35, patate_forno:45, cannelloni_ricotta_spinaci:35, crostata_marmellata:30, pizza_surgelata:14, pizza_tonda:12, pollo_fritto:25, patatine_fritte:25, bastoncini_pesce:15, sofficini:18, cordon_bleu:20, polpette_carne:30, cotolette_pollo:20, crocchette_patate:20, calamari_fritti:15, verdure_grigliate:20, arancini_riso:20 },
  airfryer:{ lasagne:22, pizza_margherita:8, pane_casereccio:25, parmigiana_melanzane:20, patate_forno:25, cannelloni_ricotta_spinaci:22, crostata_marmellata:20, pizza_surgelata:10, pizza_tonda:8, pollo_fritto:18, patatine_fritte:15, bastoncini_pesce:10, sofficini:11, cordon_bleu:12, polpette_carne:14, cotolette_pollo:12, crocchette_patate:12, calamari_fritti:8, verdure_grigliate:12, arancini_riso:12 }
};

// --- DOM refs ---
const dishSel=document.getElementById('dishSel');
const minutesInput=document.getElementById('minutes');
const minus1Btn=document.getElementById('minus1');
const plus1Btn=document.getElementById('plus1');
const display=document.getElementById('display');
const startBtn=document.getElementById('start');
const resetBtn=document.getElementById('reset');
const shareBtn=document.getElementById('share');
const airModeSel=document.getElementById('airModeSel');
const airRow=document.getElementById('airRow');
const cardForno=document.getElementById('cardForno');
const cardAir=document.getElementById('cardAir');
const recipeLink=document.getElementById('recipeLink');

// --- State ---
let method='forno', secondsLeft=0, timerId=null, endAt=null, running=false;
let airMode=localStorage.getItem('tc-air-mode')||'potente';
let currentDishId=DISH_IDS[0];

// --- Audio ---
let audioCtx;
async function initAudio(){ if(!audioCtx) audioCtx=new (window.AudioContext||window.webkitAudioContext)(); if(audioCtx.state==='suspended'){ try{ await audioCtx.resume(); }catch(_){} } }
function alarm10s(){ if(!audioCtx) return; const o=audioCtx.createOscillator(); const g=audioCtx.createGain(); o.type='sine'; o.connect(g); g.connect(audioCtx.destination); const now=audioCtx.currentTime; g.gain.setValueAtTime(0.0001,now); g.gain.linearRampToValueAtTime(0.7,now+0.1); o.frequency.setValueAtTime(700,now); for(let i=0;i<10;i++){ o.frequency.linearRampToValueAtTime(1200,now+i+0.5); o.frequency.linearRampToValueAtTime(700,now+i+1.0); } o.start(now); o.stop(now+10.0); }

// --- Populate dishes ---
function populateDishes(){
  dishSel.innerHTML='';
  const list = DISH_IDS.map(id=>({id,label:DISH_LABELS[id]})).sort((a,b)=>a.label.localeCompare(b.label));
  for(const it of list){ const o=document.createElement('option'); o.value=it.id; o.textContent=it.label; dishSel.appendChild(o); }
  currentDishId=list[0].id; dishSel.value=currentDishId;
}
populateDishes();

// --- Methods & modes ---
function setSelected(selected, other){ selected.classList.add('selected'); other.classList.remove('selected'); airRow.style.display=(selected.id==='cardAir')?'flex':'none'; updateRecipeLink(); }
cardForno.addEventListener('click', ()=>{ method='forno'; setSelected(cardForno,cardAir); applyPreset(); });
cardAir.addEventListener('click', ()=>{ method='airfryer'; setSelected(cardAir,cardForno); applyPreset(); });
airModeSel.value=airMode;
airModeSel.addEventListener('change', ()=>{ airMode=airModeSel.value; localStorage.setItem('tc-air-mode',airMode); if(method==='airfryer') applyPreset(); });

// --- Preset minutes ---
function applyPreset(){
  const map = method==='forno' ? PRESETS.forno : PRESETS.airfryer;
  let mins = map[currentDishId];
  if (mins===undefined){ startBtn.disabled=true; return; }
  if (method==='airfryer' && airMode==='standard') mins+=2;
  minutesInput.value=mins; secondsLeft=mins*60; endAt=null; startBtn.disabled=false; renderDisplay();
}
applyPreset();

// --- Recipe link ---
function updateRecipeLink(){
  const label = (dishSel.selectedOptions[0]?.text || '').trim();
  const url = buildRecipeURL(label, method);
  recipeLink.href = url;
}
updateRecipeLink();
dishSel.addEventListener('change', ()=>{ currentDishId=dishSel.value; applyPreset(); updateRecipeLink(); });

// --- Timer ---
function renderDisplay(){ const mm=String(Math.floor(secondsLeft/60)).padStart(2,'0'); const ss=String(secondsLeft%60).padStart(2,'0'); display.textContent=`${mm}:${ss}`; }
minus1Btn.addEventListener('click', ()=>{ secondsLeft=Math.max(0,secondsLeft-60); if(endAt) endAt-=60000; renderDisplay(); });
plus1Btn.addEventListener('click', ()=>{ secondsLeft+=60; if(endAt) endAt+=60000; renderDisplay(); });
minutesInput.addEventListener('change', ()=>{ const v=Math.max(0,parseInt(minutesInput.value||'0')); minutesInput.value=v; secondsLeft=v*60; endAt=null; renderDisplay(); });
startBtn.addEventListener('click', async()=>{
  if(!running){
    try{ await initAudio(); }catch(_){}
    if(!secondsLeft) secondsLeft=Math.max(0,parseInt(minutesInput.value||'0')*60);
    endAt=Date.now()+secondsLeft*1000; timerId=setInterval(tick,250); running=true; startBtn.textContent='Pausa'; startBtn.classList.remove('primary'); startBtn.classList.add('danger');
  }else{
    if(timerId) clearInterval(timerId); timerId=null;
    if(endAt){ secondsLeft=Math.max(0,Math.round((endAt-Date.now())/1000)); endAt=null; }
    running=false; startBtn.textContent='Start'; startBtn.classList.remove('danger'); startBtn.classList.add('primary');
  }
});
resetBtn.addEventListener('click', ()=>{ if(timerId) clearInterval(timerId); timerId=null; running=false; startBtn.textContent='Start'; startBtn.className='primary start bigbtn'; applyPreset(); });
function tick(){ if(!endAt) return; secondsLeft=Math.max(0,Math.round((endAt-Date.now())/1000)); renderDisplay(); if(secondsLeft<=0){ if(timerId) clearInterval(timerId); timerId=null; running=false; startBtn.textContent='Start'; startBtn.classList.remove('danger'); startBtn.classList.add('primary'); try{ alarm10s(); }catch(_){ } if(navigator.vibrate) navigator.vibrate([300,150,300,150,300]); } }

// --- Share (sync timer) ---
function b64urlEncode(obj){ const json=JSON.stringify(obj); const b64=btoa(unescape(encodeURIComponent(json))); return b64.replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,''); }
function b64urlDecode(code){ code=code.replace(/-/g,'+').replace(/_/g,'/'); const pad=code.length%4?4-(code.length%4):0; code=code+'='.repeat(pad); const json=decodeURIComponent(escape(atob(code))); return JSON.parse(json); }

shareBtn.addEventListener('click', async()=>{
  const totalSeconds=parseInt(minutesInput.value||'0')*60;
  let startedAt, dur; if(endAt){ dur=totalSeconds; startedAt=endAt-dur*1000; } else { dur=totalSeconds; startedAt=Date.now(); }
  const payload={ dishId: currentDishId, dish: DISH_LABELS[currentDishId], method, mode:(method==='airfryer'? airMode:''), start: startedAt, dur: totalSeconds };
  const code=b64urlEncode(payload);
  const url=`${location.origin}${location.pathname}#${code}`;
  const mins=Math.max(1,Math.round(totalSeconds/60));
  const text=`Ti è stato condiviso un Timer per ${mins} minuti relativo alla preparazione di ${DISH_LABELS[currentDishId]}. Clicca per seguire il timer: ${url}`;
  const isSecure=(location.protocol==='https:')||(location.hostname==='localhost')||(location.hostname==='127.0.0.1');
  try{ if(isSecure && navigator.share){ await navigator.share({text}); return; } throw new Error('no share'); }
  catch(_){ try{ await navigator.clipboard.writeText(text); alert('Link copiato negli appunti'); } catch(__){ const ta=document.createElement('textarea'); ta.value=text; ta.style.position='fixed'; ta.style.opacity='0'; document.body.appendChild(ta); ta.select(); try{ document.execCommand('copy'); alert('Copia effettuata'); } catch(e){ prompt('Copia link:', ta.value); } document.body.removeChild(ta); } }
});

// --- Open from shared link ---
function initFromHash(){
  const hash=location.hash?.replace(/^#/,''); if(!hash) return; let data; try{ data=b64urlDecode(hash); }catch(_){ return; }
  let { dishId, method: qMethod, mode: qMode, start: qStart, dur: qDur } = data||{};
  if(!dishId || !qMethod || !qStart || !qDur) return;
  currentDishId=dishId; dishSel.value=currentDishId;
  if(qMethod==='airfryer'){ method='airfryer'; setSelected(cardAir,cardForno); if(qMode){ airMode=qMode; airModeSel.value=airMode; } }
  else { method='forno'; setSelected(cardForno,cardAir); }
  applyPreset(); updateRecipeLink();
  const startMs=parseInt(qStart,10); const durSec=parseInt(qDur,10); const now=Date.now(); const end=startMs+durSec*1000; const remain=Math.max(0,Math.round((end-now)/1000));
  secondsLeft=remain; endAt=now+remain*1000; if(timerId) clearInterval(timerId); timerId=setInterval(tick,250); running=true; startBtn.textContent='Pausa'; startBtn.classList.remove('primary'); startBtn.classList.add('danger');
}
initFromHash();
