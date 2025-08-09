// Tempi Cottura v7.7.4 — stable core + Settings + DDG recipe + share sync (refactored)
(() => {
  /* ---------- Utilities ---------- */
  const qs = (sel, p=document) => p.querySelector(sel);
  const on = (el, ev, fn) => el.addEventListener(ev, fn);

  /* ---------- Language / i18n ---------- */
  const LANG_KEY='tc-lang';
  const flags={ it:'🇮🇹', en:'🇬🇧', es:'🇪🇸', pt:'🇵🇹', de:'🇩🇪' };
  const ddgKl = { it:'it-it', en:'us-en', es:'es-es', pt:'pt-pt', de:'de-de' };
  const methodWords = {
    it:{ forno:'forno', airfryer:'friggitrice ad aria' },
    en:{ forno:'oven', airfryer:'air fryer' },
    es:{ forno:'horno', airfryer:'freidora de aire' },
    pt:{ forno:'forno', airfryer:'airfryer' },
    de:{ forno:'Backofen', airfryer:'Heißluftfritteuse' }
  };
  const recipeWord = { it:'ricetta', en:'recipe', es:'receta', pt:'receita', de:'rezept' };

  const detectLang = () => {
    const pref = localStorage.getItem(LANG_KEY);
    if (pref) return pref;
    return (navigator.language||'en').toLowerCase().slice(0,2);
  };
  let lang = ['it','en','es','pt','de'].includes(detectLang()) ? detectLang() : 'en';

  /* ---------- Theme ---------- */
  const THEME_KEY='tc-theme';
  const THEMES={
    nero:{bg:'#0b0b0c',card:'#151518',fg:'#f9fafb',muted:'#9ca3af',border:'#26262a',primary:'#22c55e',danger:'#ef4444',btnText:'#0b0b0c',icon:'#9ca3af'},
    bianco:{bg:'#f8fafc',card:'#ffffff',fg:'#111827',muted:'#475569',border:'#e5e7eb',primary:'#16a34a',danger:'#dc2626',btnText:'#111827',icon:'#6b7280'},
    celeste:{bg:'#e0f2fe',card:'#ffffff',fg:'#0b0b0c',muted:'#334155',border:'#bae6fd',primary:'#0ea5e9',danger:'#dc2626',btnText:'#111827',icon:'#374151'},
    rosa:{bg:'#ffe4e6',card:'#ffffff',fg:'#0b0b0c',muted:'#334155',border:'#fecdd3',primary:'#f43f5e',danger:'#b91c1c',btnText:'#111827',icon:'#374151'},
    giallo:{bg:'#fef9c3',card:'#ffffff',fg:'#0b0b0c',muted:'#334155',border:'#fef08a',primary:'#f59e0b',danger:'#b91c1c',btnText:'#111827',icon:'#374151'},
    indaco:{bg:'#312e81',card:'#3730a3',fg:'#e0e7ff',muted:'#a5b4fc',border:'#4338ca',primary:'#22c55e',danger:'#ef4444',btnText:'#0b0b0c',icon:'#cbd5e1'},
    grigio:{bg:'#111827',card:'#1f2937',fg:'#f9fafb',muted:'#9ca3af',border:'#374151',primary:'#22c55e',danger:'#ef4444',btnText:'#0b0b0c',icon:'#9ca3af'}
  };
  const applyTheme = (name) => {
    const t = THEMES[name] || THEMES.nero;
    const r = document.documentElement;
    r.style.setProperty('--bg',t.bg); r.style.setProperty('--card',t.card); r.style.setProperty('--fg',t.fg);
    r.style.setProperty('--muted',t.muted); r.style.setProperty('--border',t.border);
    r.style.setProperty('--primary',t.primary); r.style.setProperty('--danger',t.danger);
    r.style.setProperty('--btnText',t.btnText); r.style.setProperty('--icon',t.icon);
    localStorage.setItem(THEME_KEY, name);
  };
  applyTheme(localStorage.getItem(THEME_KEY)||'nero');

  /* ---------- Data ---------- */
  const DISHES = [
    'arancini_riso','lasagne','pizza_margherita','patate_forno','parmigiana_melanzane','pollo_fritto','patatine_fritte',
    'bastoncini_pesce','sofficini','cordon_bleu','polpette_carne','cotolette_pollo','crocchette_patate','calamari_fritti',
    'verdure_grigliate','pane_casereccio','crostata_marmellata','cannelloni_ricotta_spinaci','pizza_surgelata','pizza_tonda'
  ];
  const LABELS = {
    arancini_riso:'Arancini di riso', lasagne:'Lasagne', pizza_margherita:'Pizza margherita', patate_forno:'Patate al forno',
    parmigiana_melanzane:'Parmigiana di melanzane', pollo_fritto:'Pollo fritto', patatine_fritte:'Patatine fritte',
    bastoncini_pesce:'Bastoncini di pesce', sofficini:'Sofficini', cordon_bleu:'Cordon Bleu', polpette_carne:'Polpette di carne',
    cotolette_pollo:'Cotolette di pollo', crocchette_patate:'Crocchette di patate', calamari_fritti:'Calamari fritti',
    verdure_grigliate:'Verdure grigliate', pane_casereccio:'Pane casereccio', crostata_marmellata:'Crostata di marmellata',
    cannelloni_ricotta_spinaci:'Cannelloni ricotta e spinaci', pizza_surgelata:'Pizza surgelata', pizza_tonda:'Pizza tonda'
  };
  const PRESETS = {
    forno:{ lasagne:35, pizza_margherita:12, pane_casereccio:40, parmigiana_melanzane:35, patate_forno:45, cannelloni_ricotta_spinaci:35,
      crostata_marmellata:30, pizza_surgelata:14, pizza_tonda:12, pollo_fritto:25, patatine_fritte:25, bastoncini_pesce:15, sofficini:18,
      cordon_bleu:20, polpette_carne:30, cotolette_pollo:20, crocchette_patate:20, calamari_fritti:15, verdure_grigliate:20, arancini_riso:20 },
    airfryer:{ lasagne:22, pizza_margherita:8, pane_casereccio:25, parmigiana_melanzane:20, patate_forno:25, cannelloni_ricotta_spinaci:22,
      crostata_marmellata:20, pizza_surgelata:10, pizza_tonda:8, pollo_fritto:18, patatine_fritte:15, bastoncini_pesce:10, sofficini:11,
      cordon_bleu:12, polpette_carne:14, cotolette_pollo:12, crocchette_patate:12, calamari_fritti:8, verdure_grigliate:12, arancini_riso:12 }
  };

  /* ---------- State ---------- */
  const S = {
    method:'forno',
    airMode: localStorage.getItem('tc-air-mode') || 'potente',
    dish: DISHES[0],
    running:false, timer:null, endAt:null, seconds:0
  };

  /* ---------- DOM ---------- */
  const dishSel = qs('#dishSel');
  const airRow = qs('#airRow');
  const airModeSel = qs('#airModeSel');
  const cardForno = qs('#cardForno');
  const cardAir = qs('#cardAir');
  const minutesInput = qs('#minutes');
  const display = qs('#display');
  const startBtn = qs('#start');
  const resetBtn = qs('#reset');
  const minus1Btn = qs('#minus1');
  const plus1Btn = qs('#plus1');
  const shareBtn = qs('#share');
  const recipeLink = qs('#recipeLink');
  const btnSettings = qs('#btnSettings');
  const settingsPanel = qs('#settingsPanel');
  const closeSettings = qs('#closeSettings');
  const themeGrid = qs('#themeGrid');
  const flagsGrid = qs('#flagsGrid');

  /* ---------- Audio ---------- */
  let audioCtx;
  const initAudio = async () => {
    if (!audioCtx) audioCtx = new (window.AudioContext||window.webkitAudioContext)();
    if (audioCtx.state==='suspended'){ try{ await audioCtx.resume(); }catch{} }
  };
  const alarm10s = () => {
    if(!audioCtx) return;
    const o=audioCtx.createOscillator(), g=audioCtx.createGain();
    o.type='sine'; o.connect(g); g.connect(audioCtx.destination);
    const now=audioCtx.currentTime;
    g.gain.setValueAtTime(0.0001,now); g.gain.linearRampToValueAtTime(0.7,now+0.1);
    o.frequency.setValueAtTime(700,now);
    for(let i=0;i<10;i++){ o.frequency.linearRampToValueAtTime(1200,now+i+0.5); o.frequency.linearRampToValueAtTime(700,now+i+1.0); }
    o.start(now); o.stop(now+10);
  };

  /* ---------- Helpers ---------- */
  const render = () => {
    const mm = String(Math.floor(S.seconds/60)).padStart(2,'0');
    const ss = String(S.seconds%60).padStart(2,'0');
    display.textContent = `${mm}:${ss}`;
  };
  const applyPreset = () => {
    const map = S.method==='forno' ? PRESETS.forno : PRESETS.airfryer;
    let mins = map[S.dish];
    if (S.method==='airfryer' && S.airMode==='standard') mins += 2;
    minutesInput.value = mins;
    S.seconds = mins*60;
    S.endAt = null;
    render();
  };
  const updateRecipeLink = () => {
    const label = LABELS[S.dish] || S.dish;
    const words = `${label} ${recipeWord[lang]||'recipe'} ${methodWords[lang]?.[S.method]||''}`.trim();
    const q = encodeURIComponent(words);
    const kl = ddgKl[lang] || 'us-en';
    recipeLink.href = `https://duckduckgo.com/?q=${q}&kl=${kl}`;
  };
  const setSelected = (air) => {
    if (air){
      cardAir.classList.add('selected'); cardForno.classList.remove('selected');
      airRow.hidden = false; S.method='airfryer';
    } else {
      cardForno.classList.add('selected'); cardAir.classList.remove('selected');
      airRow.hidden = true; S.method='forno';
    }
    applyPreset(); updateRecipeLink();
  };

  /* ---------- Populate dishes ---------- */
  const list = DISHES.map(id => ({id, label: LABELS[id]})).sort((a,b)=>a.label.localeCompare(b.label));
  dishSel.innerHTML = list.map(d=>`<option value="${d.id}">${d.label}</option>`).join('');
  S.dish = list[0].id;
  dishSel.value = S.dish;

  /* ---------- Events ---------- */
  on(cardForno,'click', ()=> setSelected(false));
  on(cardAir,'click',  ()=> setSelected(true));
  airModeSel.value = S.airMode;
  on(airModeSel,'change', ()=>{ S.airMode=airModeSel.value; localStorage.setItem('tc-air-mode',S.airMode); if(S.method==='airfryer') applyPreset(); });

  on(dishSel,'change', ()=>{ S.dish=dishSel.value; applyPreset(); updateRecipeLink(); });

  on(minus1Btn,'click',()=>{ S.seconds=Math.max(0,S.seconds-60); if(S.endAt) S.endAt-=60000; render(); });
  on(plus1Btn,'click', ()=>{ S.seconds+=60; if(S.endAt) S.endAt+=60000; render(); });
  on(minutesInput,'change', ()=>{ const v=Math.max(0,parseInt(minutesInput.value||'0',10)); minutesInput.value=v; S.seconds=v*60; S.endAt=null; render(); });

  on(startBtn,'click', async()=>{
    if(!S.running){
      try{ await initAudio(); }catch{}
      if(!S.seconds) S.seconds = Math.max(0, parseInt(minutesInput.value||'0',10)*60);
      S.endAt = Date.now() + S.seconds*1000;
      S.timer = setInterval(()=>{
        S.seconds = Math.max(0, Math.round((S.endAt-Date.now())/1000));
        render();
        if(S.seconds<=0){ clearInterval(S.timer); S.timer=null; S.running=false; startBtn.textContent='Start'; startBtn.classList.remove('danger'); startBtn.classList.add('primary'); try{ alarm10s(); }catch{} if(navigator.vibrate) navigator.vibrate([300,150,300,150,300]); }
      }, 250);
      S.running=true; startBtn.textContent='Pausa'; startBtn.classList.remove('primary'); startBtn.classList.add('danger');
    }else{
      clearInterval(S.timer); S.timer=null;
      if(S.endAt){ S.seconds = Math.max(0, Math.round((S.endAt-Date.now())/1000)); S.endAt=null; }
      S.running=false; startBtn.textContent='Start'; startBtn.classList.remove('danger'); startBtn.classList.add('primary');
    }
  });

  on(resetBtn,'click', ()=>{ if(S.timer) clearInterval(S.timer); S.timer=null; S.running=false; startBtn.textContent='Start'; startBtn.className='primary start bigbtn'; applyPreset(); });

  /* ---------- Share (sync) ---------- */
  const b64enc = obj => {
    const json = JSON.stringify(obj);
    const b64  = btoa(unescape(encodeURIComponent(json)));
    return b64.replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
  };
  on(shareBtn,'click', async()=>{
    const totalSeconds = Math.max(0, parseInt(minutesInput.value||'0',10)*60);
    const startedAt = S.endAt ? (S.endAt - totalSeconds*1000) : Date.now();
    const payload = { dishId:S.dish, dish:LABELS[S.dish], method:S.method, mode:(S.method==='airfryer'? S.airMode:''), start:startedAt, dur: totalSeconds };
    const url = `${location.origin}${location.pathname}#${b64enc(payload)}`;
    const mins = Math.max(1, Math.round(totalSeconds/60));
    const text = `Ti è stato condiviso un Timer per ${mins} minuti relativo alla preparazione di ${LABELS[S.dish]}. Clicca per seguire il timer: ${url}`;
    const isSecure = (location.protocol==='https:')||(location.hostname==='localhost')||(location.hostname==='127.0.0.1');
    try{ if(isSecure && navigator.share){ await navigator.share({text}); return; } throw 0; }
    catch{ try{ await navigator.clipboard.writeText(text); alert('Link copiato negli appunti'); }
           catch{ const ta=document.createElement('textarea'); ta.value=text; ta.style.position='fixed'; ta.style.opacity='0'; document.body.appendChild(ta); ta.select(); try{ document.execCommand('copy'); alert('Copia effettuata'); } catch{ prompt('Copia link:', ta.value); } document.body.removeChild(ta); } }
  });

  /* ---------- Open from shared link ---------- */
  const b64dec = code => {
    code = code.replace(/-/g,'+').replace(/_/g,'/');
    const pad = code.length%4 ? 4-(code.length%4) : 0;
    code = code + '='.repeat(pad);
    const json = decodeURIComponent(escape(atob(code)));
    return JSON.parse(json);
  };
  const initFromHash = () => {
    const hash = location.hash?.slice(1); if(!hash) return;
    let data; try{ data=b64dec(hash); }catch{ return; }
    const { dishId, method, mode, start, dur } = data||{};
    if(!dishId || !method || !start || !dur) return;
    S.dish = dishId; dishSel.value = S.dish;
    setSelected(method==='airfryer');
    if(method==='airfryer' && mode){ S.airMode = mode; airModeSel.value = mode; }
    applyPreset(); updateRecipeLink();
    const end = parseInt(start,10) + parseInt(dur,10)*1000;
    const remain = Math.max(0, Math.round((end-Date.now())/1000));
    S.seconds = remain; S.endAt = Date.now()+remain*1000;
    if(S.timer) clearInterval(S.timer);
    S.timer = setInterval(()=>{
      S.seconds = Math.max(0, Math.round((S.endAt-Date.now())/1000));
      render();
      if(S.seconds<=0){ clearInterval(S.timer); S.timer=null; S.running=false; startBtn.textContent='Start'; startBtn.classList.remove('danger'); startBtn.classList.add('primary'); try{ alarm10s(); }catch{} if(navigator.vibrate) navigator.vibrate([300,150,300,150,300]); }
    }, 250);
    S.running=true; startBtn.textContent='Pausa'; startBtn.classList.remove('primary'); startBtn.classList.add('danger');
  };

  /* ---------- Settings ---------- */
  on(btnSettings,'click', ()=> settingsPanel.classList.remove('hidden'));
  on(closeSettings,'click', ()=> settingsPanel.classList.add('hidden'));
  on(settingsPanel,'click', e=>{ if(e.target===settingsPanel) settingsPanel.classList.add('hidden'); });
  on(themeGrid,'click', e=>{ const b=e.target.closest('button[data-theme]'); if(!b) return; applyTheme(b.dataset.theme); });

  const rebuildFlags = () => {
    flagsGrid.innerHTML='';
    ['it','en','es','pt','de'].forEach(code=>{
      const b=document.createElement('button');
      b.className = 'flagchip' + (code===lang?' active':'');
      b.innerHTML = `<span>${flags[code]}</span><span>${code.toUpperCase()}</span>`;
      b.addEventListener('click', ()=>{ lang=code; localStorage.setItem(LANG_KEY,code); rebuildFlags(); updateRecipeLink(); });
      flagsGrid.appendChild(b);
    });
  };

  /* ---------- Bootstrap ---------- */
  setSelected(false);         // default forno
  updateRecipeLink();
  rebuildFlags();
  initFromHash();
  render();
})();