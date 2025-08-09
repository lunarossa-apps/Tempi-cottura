// Tempi Cottura - v7.9.3
const LANG_KEY='tc-lang';
const flags={ it:'🇮🇹', en:'🇬🇧', es:'🇪🇸', pt:'🇵🇹', de:'🇩🇪' };
const messages={
  it:{ title:'Tempi Cottura', dish:'Piatto', selectHint:'Seleziona un piatto e poi scegli il metodo di cottura.', oven:'Forno', air:'Airfryer', mode:'Modalità', power:'Potente', standard:'Standard (+2 min)', minutes:'Minuti', start:'Start', pause:'Pausa', reset:'Reset', shareBtn:'Condividi timer', shareText:(m,d,u)=>`Ti è stato condiviso un Timer per ${m} minuti relativo alla preparazione di ${d}. Clicca per seguire il timer: ${u}`, settings:'Impostazioni', theme:'Tema colore', language:'Lingua', quickFlags:'Selettore rapido', auto:'Auto (device)', footer:'App developed by LunaRossa Ltd — Copyright LunaRossa Ltd London 2025', recipe:'Ricetta (apri ricerca)', shareHint:'Condividendo, chi riceve vedrà il timer già avviato con i minuti selezionati.', allow:'Consenti audio', audioBanner:'Per sentire l’allarme al termine, tocca “Consenti audio”.' },
  en:{ title:'Cook Times', dish:'Dish', selectHint:'Pick a dish, then choose the cooking method.', oven:'Oven', air:'Airfryer', mode:'Mode', power:'Powerful', standard:'Standard (+2 min)', minutes:'Minutes', start:'Start', pause:'Pause', reset:'Reset', shareBtn:'Share timer', shareText:(m,d,u)=>`A ${m}-minute timer was shared for ${d}. Tap to follow it: ${u}`, settings:'Settings', theme:'Theme color', language:'Language', quickFlags:'Quick selector', auto:'Auto (device)', footer:'App developed by LunaRossa Ltd — Copyright LunaRossa Ltd London 2025', recipe:'Recipe (open search)', shareHint:'When you share, the receiver sees the timer already running with the selected minutes.', allow:'Allow sound', audioBanner:'To hear the alarm, tap “Allow sound”.' },
  es:{ title:'Tiempos de Cocción', dish:'Plato', selectHint:'Elige un plato y después el método de cocción.', oven:'Horno', air:'Freidora de aire', mode:'Modo', power:'Potente', standard:'Estándar (+2 min)', minutes:'Minutos', start:'Inicio', pause:'Pausa', reset:'Reiniciar', shareBtn:'Compartir temporizador', shareText:(m,d,u)=>`Se compartió un temporizador de ${m} minutos para ${d}. Pulsa para seguirlo: ${u}`, settings:'Ajustes', theme:'Color del tema', language:'Idioma', quickFlags:'Selector rápido', auto:'Auto (dispositivo)', footer:'App developed by LunaRossa Ltd — Copyright LunaRossa Ltd London 2025', recipe:'Receta (abrir búsqueda)', shareHint:'Al compartir, el receptor ve el temporizador ya iniciado con los minutos seleccionados.', allow:'Permitir sonido', audioBanner:'Para oír la alarma, toca “Permitir sonido”.' },
  pt:{ title:'Tempos de Cozedura', dish:'Prato', selectHint:'Escolha um prato e depois o método de cozedura.', oven:'Forno', air:'Airfryer', mode:'Modo', power:'Potente', standard:'Normal (+2 min)', minutes:'Minutos', start:'Iniciar', pause:'Pausar', reset:'Repor', shareBtn:'Partilhar temporizador', shareText:(m,d,u)=>`Foi partilhado um temporizador de ${m} minutos para ${d}. Toque para seguir: ${u}`, settings:'Definições', theme:'Cor do tema', language:'Idioma', quickFlags:'Seletor rápido', auto:'Automático (dispositivo)', footer:'App developed by LunaRossa Ltd — Copyright LunaRossa Ltd London 2025', recipe:'Receita (abrir pesquisa)', shareHint:'Ao partilhar, o destinatário vê o temporizador já a contar com os minutos selecionados.', allow:'Permitir áudio', audioBanner:'Para ouvir o alarme, toque em “Permitir áudio”.' },
  de:{ title:'Garzeiten', dish:'Gericht', selectHint:'Wähle ein Gericht und dann die Garmethode.', oven:'Ofen', air:'Heißluftfritteuse', mode:'Modus', power:'Leistungsvoll', standard:'Standard (+2 Min)', minutes:'Minuten', start:'Start', pause:'Pause', reset:'Zurücksetzen', shareBtn:'Timer teilen', shareText:(m,d,u)=>`Ein ${m}-Minuten-Timer für ${d} wurde geteilt. Tippe zum Folgen: ${u}`, settings:'Einstellungen', theme:'Designfarbe', language:'Sprache', quickFlags:'Schnellauswahl', auto:'Auto (Gerät)', footer:'App developed by LunaRossa Ltd — Copyright LunaRossa Ltd London 2025', recipe:'Rezept (Suche öffnen)', shareHint:'Beim Teilen sieht der Empfänger den Timer bereits laufend mit den gewählten Minuten.', allow:'Ton erlauben', audioBanner:'Um den Alarm zu hören, tippe „Ton erlauben“.')
};

function detectLang(){
  const pref=localStorage.getItem(LANG_KEY);
  if(pref && pref!=='auto') return pref;
  const n=(navigator.language||'en').toLowerCase();
  if(n.startsWith('it')) return 'it';
  if(n.startsWith('es')) return 'es';
  if(n.startsWith('pt')) return 'pt';
  if(n.startsWith('de')) return 'de';
  return 'en';
}
let lang=detectLang();
function t(key,...args){ const pack=messages[lang]||messages.en; const val=pack[key]; return typeof val==='function'? val(...args):val; }

/* Dishes */
const DISH_IDS=['arancini_riso','arrosto_maiale','arrosto_vitello','bastoncini_pesce','calamari_fritti','cannelloni_ricotta_spinaci','cordon_bleu','cotolette_pollo','crostata_marmellata','crocchette_patate','focaccia','frittata_forno','frittelle_dolci','lasagna_vegetariana','lasagne','mini_pizze','mozzarella_carrozza','orata_forno','pane_casereccio','parmigiana_melanzane','patate_forno','patatine_fritte','pesce_patate','pizza_margherita','pizza_surgelata','pizza_tonda','pollo_fritto','polpette_carne','quiche_lorraine','salmone_forno','salsiccia_forno','sofficini','torta_cioccolato','torta_margherita','torta_salata','verdure_grigliate','zucchine_ripiene'];

const DISH_LABELS={
  it:{arancini_riso:'Arancini di riso', arrosto_maiale:'Arrosto di maiale', arrosto_vitello:'Arrosto di vitello', bastoncini_pesce:'Bastoncini di pesce', calamari_fritti:'Calamari fritti', cannelloni_ricotta_spinaci:'Cannelloni ricotta e spinaci', cordon_bleu:'Cordon Bleu', cotolette_pollo:'Cotolette di pollo', crostata_marmellata:'Crostata di marmellata', crocchette_patate:'Crocchette di patate', focaccia:'Focaccia', frittata_forno:'Frittata al forno', frittelle_dolci:'Frittelle dolci', lasagna_vegetariana:'Lasagna vegetariana', lasagne:'Lasagne', mini_pizze:'Mini pizze', mozzarella_carrozza:'Mozzarella in carrozza', orata_forno:'Orata al forno', pane_casereccio:'Pane casereccio', parmigiana_melanzane:'Parmigiana di melanzane', patate_forno:'Patate al forno', patatine_fritte:'Patatine fritte', pesce_patate:'Pesce e patate', pizza_margherita:'Pizza margherita', pizza_surgelata:'Pizza surgelata', pizza_tonda:'Pizza tonda', pollo_fritto:'Pollo fritto', polpette_carne:'Polpette di carne', quiche_lorraine:'Quiche Lorraine', salmone_forno:'Salmone al forno', salsiccia_forno:'Salsiccia al forno', sofficini:'Sofficini', torta_cioccolato:'Torta al cioccolato', torta_margherita:'Torta margherita', torta_salata:'Torta salata', verdure_grigliate:'Verdure grigliate', zucchine_ripiene:'Zucchine ripiene'},
  en:{arancini_riso:'Arancini (rice balls)', arrosto_maiale:'Roast pork', arrosto_vitello:'Roast veal', bastoncini_pesce:'Fish sticks', calamari_fritti:'Fried calamari', cannelloni_ricotta_spinaci:'Ricotta & spinach cannelloni', cordon_bleu:'Cordon Bleu', cotolette_pollo:'Chicken cutlets', crostata_marmellata:'Jam tart', crocchette_patate:'Potato croquettes', focaccia:'Focaccia', frittata_forno:'Baked frittata', frittelle_dolci:'Sweet fritters', lasagna_vegetariana:'Vegetarian lasagna', lasagne:'Lasagna', mini_pizze:'Mini pizzas', mozzarella_carrozza:'Mozzarella in carrozza', orata_forno:'Baked sea bream', pane_casereccio:'Country bread', parmigiana_melanzane:'Eggplant parmigiana', patate_forno:'Roasted potatoes', patatine_fritte:'French fries', pesce_patate:'Fish & potatoes', pizza_margherita:'Margherita pizza', pizza_surgelata:'Frozen pizza', pizza_tonda:'Round pizza', pollo_fritto:'Fried chicken', polpette_carne:'Meatballs', quiche_lorraine:'Quiche Lorraine', salmone_forno:'Baked salmon', salsiccia_forno:'Baked sausage', sofficini:'Sofficini', torta_cioccolato:'Chocolate cake', torta_margherita:'Sponge cake', torta_salata:'Savory tart', verdure_grigliate:'Grilled vegetables', zucchine_ripiene:'Stuffed zucchini'},
  es:{arancini_riso:'Arancini (bolas de arroz)', arrosto_maiale:'Asado de cerdo', arrosto_vitello:'Asado de ternera', bastoncini_pesce:'Palitos de pescado', calamari_fritti:'Calamares fritos', cannelloni_ricotta_spinaci:'Canelones de ricota y espinacas', cordon_bleu:'Cordon Bleu', cotolette_pollo:'Milanesas de pollo', crostata_marmellata:'Tarta de mermelada', crocchette_patate:'Croquetas de patata', focaccia:'Focaccia', frittata_forno:'Frittata al horno', frittelle_dolci:'Buñuelos dulces', lasagna_vegetariana:'Lasaña vegetariana', lasagne:'Lasaña', mini_pizze:'Mini pizzas', mozzarella_carrozza:'Mozzarella in carrozza', orata_forno:'Dorada al horno', pane_casereccio:'Pan casero', parmigiana_melanzane:'Parmesana de berenjena', patate_forno:'Patatas al horno', patatine_fritte:'Papas fritas', pesce_patate:'Pescado con patatas', pizza_margherita:'Pizza margarita', pizza_surgelata:'Pizza congelada', pizza_tonda:'Pizza redonda', pollo_fritto:'Pollo frito', polpette_carne:'Albóndigas', quiche_lorraine:'Quiche Lorraine', salmone_forno:'Salmón al horno', salsiccia_forno:'Salchicha al horno', sofficini:'Sofficini', torta_cioccolato:'Pastel de chocolate', torta_margherita:'Bizcocho', torta_salata:'Tarta salada', verdure_grigliate:'Verduras a la parrilla', zucchine_ripiene:'Calabacines rellenos'},
  pt:{arancini_riso:'Arancini (bolas de arroz)', arrosto_maiale:'Assado de porco', arrosto_vitello:'Assado de vitela', bastoncini_pesce:'Palitos de peixe', calamari_fritti:'Lulas fritas', cannelloni_ricotta_spinaci:'Canelones de ricota e espinafre', cordon_bleu:'Cordon Bleu', cotolette_pollo:'Panados de frango', crostata_marmellata:'Tarte de compota', crocchette_patate:'Croquetes de batata', focaccia:'Focaccia', frittata_forno:'Frittata no forno', frittelle_dolci:'Fritos doces', lasagna_vegetariana:'Lasanha vegetariana', lasagne:'Lasanha', mini_pizze:'Mini pizzas', mozzarella_carrozza:'Mozzarella in carrozza', orata_forno:'Dourada no forno', pane_casereccio:'Pão caseiro', parmigiana_melanzane:'Parmegiana de berinjela', patate_forno:'Batatas assadas', patatine_fritte:'Batatas fritas', pesce_patate:'Peixe com batatas', pizza_margherita:'Pizza margherita', pizza_surgelata:'Pizza congelada', pizza_tonda:'Pizza redonda', pollo_fritto:'Frango frito', polpette_carne:'Almôndegas', quiche_lorraine:'Quiche Lorraine', salmone_forno:'Salmão no forno', salsiccia_forno:'Linguiça no forno', sofficini:'Sofficini', torta_cioccolato:'Bolo de chocolate', torta_margherita:'Bolo simples', torta_salata:'Torta salgada', verdure_grigliate:'Legumes grelhados', zucchine_ripiene:'Abobrinhas recheadas'},
  de:{arancini_riso:'Arancini (Reisbällchen)', arrosto_maiale:'Schweinebraten', arrosto_vitello:'Kalbsbraten', bastoncini_pesce:'Fischstäbchen', calamari_fritti:'Frittierte Calamari', cannelloni_ricotta_spinaci:'Cannelloni mit Ricotta und Spinat', cordon_bleu:'Cordon Bleu', cotolette_pollo:'Hähnchenschnitzel', crostata_marmellata:'Marmeladentarte', crocchette_patate:'Kartoffelkroketten', focaccia:'Focaccia', frittata_forno:'Ofen-Frittata', frittelle_dolci:'Süße Krapfen', lasagna_vegetariana:'Vegetarische Lasagne', lasagne:'Lasagne', mini_pizze:'Mini-Pizzen', mozzarella_carrozza:'Mozzarella in Carrozza', orata_forno:'Goldbrasse aus dem Ofen', pane_casereccio:'Bauernbrot', parmigiana_melanzane:'Auberginen-Parmigiana', patate_forno:'Ofenkartoffeln', patatine_fritte:'Pommes frites', pesce_patate:'Fisch mit Kartoffeln', pizza_margherita:'Pizza Margherita', pizza_surgelata:'Tiefkühlpizza', pizza_tonda:'Runde Pizza', pollo_fritto:'Brathähnchen', polpette_carne:'Fleischbällchen', quiche_lorraine:'Quiche Lorraine', salmone_forno:'Lachs aus dem Ofen', salsiccia_forno:'Wurst aus dem Ofen', sofficini:'Sofficini', torta_cioccolato:'Schokoladenkuchen', torta_margherita:'Biskuitkuchen', torta_salata:'Herzhafte Torte', verdure_grigliate:'Gegrilltes Gemüse', zucchine_ripiene:'Gefüllte Zucchini'}
};

/* DuckDuckGo recipe */
const methodKeywords={ it:{forno:'forno', airfryer:'friggitrice ad aria'}, en:{forno:'oven', airfryer:'air fryer'}, es:{forno:'horno', airfryer:'freidora de aire'}, pt:{forno:'forno', airfryer:'airfryer'}, de:{forno:'Backofen', airfryer:'Heißluftfritteuse'} };
const recipeWord={ it:'ricetta', en:'recipe', es:'receta', pt:'receita', de:'rezept' };
const ddgKl={ it:'it-it', en:'us-en', es:'es-es', pt:'pt-pt', de:'de-de' };
function buildRecipeURL(dishId, method){
  const label=(DISH_LABELS[lang]||DISH_LABELS.en)[dishId]||dishId;
  const words=`${label} ${recipeWord[lang]||'recipe'} ${methodKeywords[lang]?.[method]||''}`.trim();
  const q=encodeURIComponent(words);
  const kl=ddgKl[lang]||'us-en';
  return `https://duckduckgo.com/?q=${q}&kl=${kl}`;
}

/* Theme */
const PREF_METHOD_KEY='tc-pref-method', AIR_MODE_KEY='tc-air-mode', THEME_KEY='tc-theme';
const THEMES={
  nero:{bg:'#0b0b0c',card:'#151518',fg:'#f9fafb',muted:'#9ca3af',border:'#26262a',primary:'#22c55e',danger:'#ef4444',btnText:'#0b0b0c',icon:'#9ca3af',light:false},
  bianco:{bg:'#f8fafc',card:'#ffffff',fg:'#111827',muted:'#475569',border:'#e5e7eb',primary:'#16a34a',danger:'#dc2626',btnText:'#111827',icon:'#6b7280',light:true},
  celeste:{bg:'#e0f2fe',card:'#ffffff',fg:'#0b0b0c',muted:'#334155',border:'#bae6fd',primary:'#0ea5e9',danger:'#dc2626',btnText:'#111827',icon:'#374151',light:true},
  rosa:{bg:'#ffe4e6',card:'#ffffff',fg:'#0b0b0c',muted:'#334155',border:'#fecdd3',primary:'#f43f5e',danger:'#b91c1c',btnText:'#111827',icon:'#374151',light:true},
  giallo:{bg:'#fef9c3',card:'#ffffff',fg:'#0b0b0c',muted:'#334155',border:'#fef08a',primary:'#f59e0b',danger:'#b91c1c',btnText:'#111827',icon:'#374151',light:true},
  indaco:{bg:'#312e81',card:'#3730a3',fg:'#e0e7ff',muted:'#a5b4fc',border:'#4338ca',primary:'#22c55e',danger:'#ef4444',btnText:'#0b0b0c',icon:'#cbd5e1',light:false},
  grigio:{bg:'#111827',card:'#1f2937',fg:'#f9fafb',muted:'#9ca3af',border:'#374151',primary:'#22c55e',danger:'#ef4444',btnText:'#0b0b0c',icon:'#9ca3af',light:false}
};
function applyTheme(name){
  const t=THEMES[name]||THEMES.nero; const r=document.documentElement;
  r.style.setProperty('--bg',t.bg); r.style.setProperty('--card',t.card); r.style.setProperty('--fg',t.fg);
  r.style.setProperty('--muted',t.muted); r.style.setProperty('--border',t.border); r.style.setProperty('--primary',t.primary);
  r.style.setProperty('--danger',t.danger); r.style.setProperty('--btnText',t.btnText); r.style.setProperty('--icon',t.icon);
  document.body.classList.toggle('theme-light', !!t.light); localStorage.setItem(THEME_KEY,name);
}

/* Refs */
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
const favForno=document.getElementById('favForno');
const favAir=document.getElementById('favAir');
const btnSettings=document.getElementById('btnSettings');
const settingsPanel=document.getElementById('settingsPanel');
const closeSettings=document.getElementById('closeSettings');
const themeGrid=document.getElementById('themeGrid');
const flagBar=document.getElementById('flagBar');
const flagsGrid=document.getElementById('flagsGrid');
const recipeLink=document.getElementById('recipeLink');

/* State */
let method='forno', secondsLeft=0, timerId=null, endAt=null, running=false;
let prefMethod=localStorage.getItem(PREF_METHOD_KEY)||'forno';
let airMode=localStorage.getItem(AIR_MODE_KEY)||'potente';
let currentDishId=DISH_IDS[0];

/* Audio */
let audioCtx;
async function initAudio(){ if(!audioCtx) audioCtx=new (window.AudioContext||window.webkitAudioContext)(); if(audioCtx.state==='suspended'){ try{ await audioCtx.resume(); }catch(_){} } }
function alarm10s(){ if(!audioCtx) return; const o=audioCtx.createOscillator(); const g=audioCtx.createGain(); o.type='sine'; o.connect(g); g.connect(audioCtx.destination); const now=audioCtx.currentTime; g.gain.setValueAtTime(0.0001,now); g.gain.linearRampToValueAtTime(0.7,now+0.1); o.frequency.setValueAtTime(700,now); for(let i=0;i<10;i++){ o.frequency.linearRampToValueAtTime(1200,now+i+0.5); o.frequency.linearRampToValueAtTime(700,now+i+1.0); } o.start(now); o.stop(now+10.0); }

/* Populate dishes */
function populateDishes(){
  const labels=DISH_LABELS[lang]||DISH_LABELS.en;
  dishSel.innerHTML='';
  const list = DISH_IDS.map(id=>({id,label:labels[id]||id})).sort((a,b)=>a.label.localeCompare(b.label));
  for(const it of list){ const o=document.createElement('option'); o.value=it.id; o.textContent=it.label; dishSel.appendChild(o); }
  if(!DISH_IDS.includes(currentDishId)) currentDishId=list[0].id;
  dishSel.value=currentDishId;
}
dishSel.addEventListener('change', ()=>{ currentDishId=dishSel.value; applyPreset(); updateRecipeLink(); });

/* Methods & preferences */
function setSelected(selected, other){ selected.classList.add('selected'); other.classList.remove('selected'); airRow.style.display=(selected.id==='cardAir')?'flex':'none'; updateRecipeLink(); }
function applyPreferredMethod(){
  if(prefMethod==='airfryer'){ setSelected(cardAir,cardForno); favAir.classList.add('on'); favForno.classList.remove('on'); method='airfryer'; }
  else{ setSelected(cardForno,cardAir); favForno.classList.add('on'); favAir.classList.remove('on'); method='forno'; }
  airModeSel.value=airMode; applyPreset(); updateRecipeLink();
}
cardForno.addEventListener('click', ()=>{ method='forno'; setSelected(cardForno,cardAir); applyPreset(); });
cardAir.addEventListener('click', ()=>{ method='airfryer'; setSelected(cardAir,cardForno); applyPreset(); });
favForno.addEventListener('click', (e)=>{ e.stopPropagation(); prefMethod='forno'; localStorage.setItem(PREF_METHOD_KEY,'forno'); favForno.classList.add('on'); favAir.classList.remove('on'); });
favAir.addEventListener('click', (e)=>{ e.stopPropagation(); prefMethod='airfryer'; localStorage.setItem(PREF_METHOD_KEY,'airfryer'); favAir.classList.add('on'); favForno.classList.remove('on'); });
airModeSel.addEventListener('change', ()=>{ airMode=airModeSel.value; localStorage.setItem(AIR_MODE_KEY,airMode); if(method==='airfryer') applyPreset(); });

/* Presets */
const PRESETS={
  forno:{ lasagne:35, pizza_margherita:12, pane_casereccio:40, parmigiana_melanzane:35, torta_cioccolato:35, arrosto_vitello:60, arrosto_maiale:55, pesce_patate:30, patate_forno:45, cannelloni_ricotta_spinaci:35, crostata_marmellata:30, pizza_surgelata:14, pizza_tonda:12, pollo_fritto:25, patatine_fritte:25, bastoncini_pesce:15, sofficini:18, cordon_bleu:20, polpette_carne:30, cotolette_pollo:20, crocchette_patate:20, calamari_fritti:15, verdure_grigliate:20, arancini_riso:20, mozzarella_carrozza:12, mini_pizze:15, focaccia:20, quiche_lorraine:30, torta_margherita:30, torta_salata:35, pane_casereccio:40, salmone_forno:18, salsiccia_forno:25, orata_forno:25, zucchine_ripiene:30 },
  airfryer:{ lasagne:22, pizza_margherita:8, pane_casereccio:25, parmigiana_melanzane:20, torta_cioccolato:22, arrosto_vitello:45, arrosto_maiale:45, pesce_patate:22, patate_forno:25, cannelloni_ricotta_spinaci:22, crostata_marmellata:20, pizza_surgelata:10, pizza_tonda:8, pollo_fritto:18, patatine_fritte:15, bastoncini_pesce:10, sofficini:11, cordon_bleu:12, polpette_carne:14, cotolette_pollo:12, crocchette_patate:12, calamari_fritti:8, verdure_grigliate:12, arancini_riso:12, mozzarella_carrozza:7, mini_pizze:9, focaccia:12, quiche_lorraine:18, torta_margherita:18, torta_salata:20, pane_casereccio:25, salmone_forno:12, salsiccia_forno:14, orata_forno:14, zucchine_ripiene:16 }
};
function applyPreset(){
  const map = method==='forno' ? PRESETS.forno : PRESETS.airfryer;
  let mins = map[currentDishId];
  if (mins===undefined){ startBtn.disabled=true; return; }
  if (method==='airfryer' && airMode==='standard') mins+=2;
  minutesInput.value=mins; secondsLeft=mins*60; endAt=null; startBtn.disabled=false; renderDisplay();
}

/* Recipe link */
function updateRecipeLink(){
  const url=buildRecipeURL(currentDishId, method);
  recipeLink.href=url;
  recipeLink.textContent = '🔎 ' + t('recipe');
}

/* Timer */
function renderDisplay(){ const mm=String(Math.floor(secondsLeft/60)).padStart(2,'0'); const ss=String(secondsLeft%60).padStart(2,'0'); display.textContent=`${mm}:${ss}`; }
minus1Btn.addEventListener('click', ()=>{ secondsLeft=Math.max(0,secondsLeft-60); if(endAt) endAt-=60000; renderDisplay(); });
plus1Btn.addEventListener('click', ()=>{ secondsLeft+=60; if(endAt) endAt+=60000; renderDisplay(); });
minutesInput.addEventListener('change', ()=>{ const v=Math.max(0,parseInt(minutesInput.value||'0')); minutesInput.value=v; secondsLeft=v*60; endAt=null; renderDisplay(); });
startBtn.addEventListener('click', async()=>{
  if(!running){
    try{ await initAudio(); }catch(_){}
    if(!secondsLeft) secondsLeft=Math.max(0,parseInt(minutesInput.value||'0')*60);
    endAt=Date.now()+secondsLeft*1000; timerId=setInterval(tick,250); running=true; startBtn.textContent=t('pause'); startBtn.classList.remove('primary'); startBtn.classList.add('danger');
  }else{
    if(timerId) clearInterval(timerId); timerId=null;
    if(endAt){ secondsLeft=Math.max(0,Math.round((endAt-Date.now())/1000)); endAt=null; }
    running=false; startBtn.textContent=t('start'); startBtn.classList.remove('danger'); startBtn.classList.add('primary');
  }
});
resetBtn.addEventListener('click', ()=>{ if(timerId) clearInterval(timerId); timerId=null; running=false; startBtn.textContent=t('start'); startBtn.className='primary start bigbtn'; applyPreset(); });
function tick(){ if(!endAt) return; secondsLeft=Math.max(0,Math.round((endAt-Date.now())/1000)); renderDisplay(); if(secondsLeft<=0){ if(timerId) clearInterval(timerId); timerId=null; running=false; startBtn.textContent=t('start'); startBtn.classList.remove('danger'); startBtn.classList.add('primary'); try{ alarm10s(); }catch(_){ } if(navigator.vibrate) navigator.vibrate([300,150,300,150,300]); } }

/* Share */
function b64urlEncode(obj){ const json=JSON.stringify(obj); const b64=btoa(unescape(encodeURIComponent(json))); return b64.replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,''); }
function b64urlDecode(code){ code=code.replace(/-/g,'+').replace(/_/g,'/'); const pad=code.length%4?4-(code.length%4):0; code=code+'='.repeat(pad); const json=decodeURIComponent(escape(atob(code))); return JSON.parse(json); }
shareBtn.addEventListener('click', async()=>{
  const totalSeconds=parseInt(minutesInput.value||'0')*60;
  let startedAt, dur; if(endAt){ dur=totalSeconds; startedAt=endAt-dur*1000; } else { dur=totalSeconds; startedAt=Date.now(); }
  const payload={ dishId: currentDishId, method, mode:(method==='airfryer'? airMode:''), start: startedAt, dur };
  const code=b64urlEncode(payload); const url=`${location.origin}${location.pathname}#${code}`;
  const mins=Math.max(1,Math.round(totalSeconds/60));
  const dishLabel=(DISH_LABELS[lang]||DISH_LABELS.en)[currentDishId]||currentDishId;
  const text=messages[lang].shareText(mins, dishLabel, url);
  const isSecure=(location.protocol==='https:')||(location.hostname==='localhost')||(location.hostname==='127.0.0.1');
  try{ if(isSecure && navigator.share){ await navigator.share({text}); return; } throw new Error('no share'); }
  catch(_){ try{ await navigator.clipboard.writeText(text); alert('Link copiato negli appunti'); } catch(__){ const ta=document.createElement('textarea'); ta.value=text; ta.style.position='fixed'; ta.style.opacity='0'; document.body.appendChild(ta); ta.select(); try{ document.execCommand('copy'); alert('Copia effettuata'); } catch(e){ prompt('Copia link:', ta.value); } document.body.removeChild(ta); } }
});

/* Hash init */
function initFromHash(){
  const hash=location.hash?.replace(/^#/,''); if(!hash) return; let data; try{ data=b64urlDecode(hash); }catch(_){ return; }
  let { dishId, method: qMethod, mode: qMode, start: qStart, dur: qDur } = data||{};
  if(!dishId || !qMethod || !qStart || !qDur) return;
  currentDishId=dishId; populateDishes(); dishSel.value=currentDishId;
  if(qMethod==='airfryer'){ method='airfryer'; setSelected(cardAir,cardForno); if(qMode) { airMode=qMode; localStorage.setItem(AIR_MODE_KEY,airMode); airModeSel.value=airMode; } }
  else { method='forno'; setSelected(cardForno,cardAir); }
  applyPreset(); updateRecipeLink();
  const startMs=parseInt(qStart,10); const durSec=parseInt(qDur,10); const now=Date.now(); const end=startMs+durSec*1000; const remain=Math.max(0,Math.round((end-now)/1000));
  secondsLeft=remain; endAt=now+remain*1000; if(timerId) clearInterval(timerId); timerId=setInterval(tick,250); running=true; startBtn.textContent=t('pause'); startBtn.classList.remove('primary'); startBtn.classList.add('danger');
}

/* Language/flags/settings */
function applyTexts(){
  document.documentElement.lang=lang;
  document.getElementById('appTitle').textContent=t('title');
  document.getElementById('lblDish').textContent=t('dish');
  document.getElementById('hintSelect').textContent=t('selectHint');
  document.getElementById('lblOven').textContent=t('oven');
  document.getElementById('lblAir').textContent=t('air');
  document.getElementById('lblMode').textContent=t('mode');
  document.getElementById('optPower').textContent=t('power');
  document.getElementById('optStandard').textContent=t('standard');
  document.getElementById('lblMinutes').textContent=t('minutes');
  document.getElementById('start').textContent=t('start');
  document.getElementById('reset').textContent=t('reset');
  document.getElementById('btnShareText').textContent=t('shareBtn');
  document.getElementById('footerText').textContent=t('footer');
  document.getElementById('recipeLink').textContent='🔎 '+t('recipe');
  document.getElementById('shareHint').textContent=t('shareHint');

  // Flagbar
  flagBar.innerHTML='';
  ['it','en','es','pt','de'].forEach(code=>{
    const b=document.createElement('button'); b.className='flagbtn'; b.textContent=flags[code]; b.title=code.toUpperCase();
    b.addEventListener('click',()=>{ localStorage.setItem(LANG_KEY,code); lang=code; applyTexts(); populateDishes(); updateRecipeLink(); });
    flagBar.appendChild(b);
  });

  // Settings flags grid
  buildFlagsGrid();
}
function buildFlagsGrid(){
  flagsGrid.innerHTML='';
  ['it','en','es','pt','de'].forEach(code=>{
    const chip=document.createElement('button'); chip.className='flagchip'; if(lang===code) chip.classList.add('active');
    chip.innerHTML=`<span>${flags[code]}</span><span>${code.toUpperCase()}</span>`;
    chip.addEventListener('click',()=>{ localStorage.setItem(LANG_KEY,code); lang=code; applyTexts(); populateDishes(); updateRecipeLink(); });
    flagsGrid.appendChild(chip);
  });
}

// Settings open/close & theme
btnSettings.addEventListener('click', ()=> settingsPanel.classList.remove('hidden'));
closeSettings.addEventListener('click', ()=> settingsPanel.classList.add('hidden'));
settingsPanel.addEventListener('click', (e)=>{ if(e.target===settingsPanel) settingsPanel.classList.add('hidden'); });
themeGrid.addEventListener('click', (e)=>{ const b=e.target.closest('button[data-theme]'); if(!b) return; applyTheme(b.dataset.theme); });

/* Init */
applyTheme(localStorage.getItem(THEME_KEY)||'nero');
applyTexts();
populateDishes();
applyPreferredMethod();
updateRecipeLink();
initFromHash();
