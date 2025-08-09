// Tempi Cottura v7.7.1L (languages + share sync)
(() => {
  const qs = (s,p=document)=>p.querySelector(s); const on=(e,t,f)=>e.addEventListener(t,f);

  /* i18n */
  const LANG_KEY='tc-lang'; const LANGS=['it','en','es','pt','de'];
  const flags={it:'🇮🇹',en:'🇬🇧',es:'🇪🇸',pt:'🇵🇹',de:'🇩🇪'};
  const detect=()=>{const s=localStorage.getItem(LANG_KEY); if(s&&LANGS.includes(s)) return s;
    const n=(navigator.language||'en').toLowerCase(); if(n.startsWith('it'))return'it'; if(n.startsWith('es'))return'es'; if(n.startsWith('pt'))return'pt'; if(n.startsWith('de'))return'de'; return'en';};
  let lang=detect();
  const UI={
    it:{title:'Tempi Cottura',dish:'Piatto',oven:'Forno',air:'Airfryer',mode:'Modalità',power:'Potente',standard:'Standard (+2 min)',minutes:'Minuti',start:'Start',pause:'Pausa',reset:'Reset',shareBtn:'Condividi timer',shareHint:'Condividendo, chi riceve vedrà il timer partire dal momento dell’invio con i minuti selezionati.',recipe:'🔎 Ricetta (apri ricerca)',settings:'Impostazioni',lang:'Lingua',theme:'Tema colore',
      share:(m,d,u)=>`Ti è stato condiviso un Timer per ${m} minuti relativo alla preparazione di ${d}. Clicca per seguire il timer: ${u}`},
    en:{title:'Cook Times',dish:'Dish',oven:'Oven',air:'Airfryer',mode:'Mode',power:'Powerful',standard:'Standard (+2 min)',minutes:'Minutes',start:'Start',pause:'Pause',reset:'Reset',shareBtn:'Share timer',shareHint:'When you share, the recipient sees the timer already running with your selected minutes.',recipe:'🔎 Recipe (open search)',settings:'Settings',lang:'Language',theme:'Color theme',
      share:(m,d,u)=>`A ${m}-minute timer was shared for ${d}. Tap to follow it: ${u}`},
    es:{title:'Tiempos de Cocción',dish:'Plato',oven:'Horno',air:'Freidora de aire',mode:'Modo',power:'Potente',standard:'Estándar (+2 min)',minutes:'Minutos',start:'Inicio',pause:'Pausa',reset:'Reiniciar',shareBtn:'Compartir temporizador',shareHint:'Al compartir, el destinatario verá el temporizador en marcha con los minutos seleccionados.',recipe:'🔎 Receta (abrir búsqueda)',settings:'Ajustes',lang:'Idioma',theme:'Tema de color',
      share:(m,d,u)=>`Se compartió un temporizador de ${m} minutos para ${d}. Pulsa para seguirlo: ${u}`},
    pt:{title:'Tempos de Cozedura',dish:'Prato',oven:'Forno',air:'Airfryer',mode:'Modo',power:'Potente',standard:'Normal (+2 min)',minutes:'Minutos',start:'Iniciar',pause:'Pausar',reset:'Repor',shareBtn:'Partilhar temporizador',shareHint:'Ao partilhar, o destinatário verá o temporizador a correr com os minutos selecionados.',recipe:'🔎 Receita (abrir pesquisa)',settings:'Definições',lang:'Idioma',theme:'Tema de cor',
      share:(m,d,u)=>`Foi partilhado um temporizador de ${m} minutos para ${d}. Toque para seguir: ${u}`},
    de:{title:'Garzeiten',dish:'Gericht',oven:'Ofen',air:'Heißluftfritteuse',mode:'Modus',power:'Leistungsstark',standard:'Standard (+2 Min)',minutes:'Minuten',start:'Start',pause:'Pause',reset:'Zurücksetzen',shareBtn:'Timer teilen',shareHint:'Beim Teilen sieht der Empfänger den Timer bereits mit deinen Minuten laufen.',recipe:'🔎 Rezept (Suche öffnen)',settings:'Einstellungen',lang:'Sprache',theme:'Farbschema',
      share:(m,d,u)=>`Ein ${m}-Minuten-Timer für ${d} wurde geteilt. Tippe zum Folgen: ${u}`}
  };

  const DISH_IDS=['arancini_riso','lasagne','pizza_margherita','patate_forno','parmigiana_melanzane','pollo_fritto','patatine_fritte','bastoncini_pesce','sofficini','cordon_bleu','polpette_carne','cotolette_pollo','crocchette_patate','calamari_fritti','verdure_grigliate','pane_casereccio','crostata_marmellata','cannelloni_ricotta_spinaci','pizza_surgelata','pizza_tonda'];
  const DISH_LABELS={
    it:{arancini_riso:'Arancini di riso',lasagne:'Lasagne',pizza_margherita:'Pizza margherita',patate_forno:'Patate al forno',parmigiana_melanzane:'Parmigiana di melanzane',pollo_fritto:'Pollo fritto',patatine_fritte:'Patatine fritte',bastoncini_pesce:'Bastoncini di pesce',sofficini:'Sofficini',cordon_bleu:'Cordon Bleu',polpette_carne:'Polpette di carne',cotolette_pollo:'Cotolette di pollo',crocchette_patate:'Crocchette di patate',calamari_fritti:'Calamari fritti',verdure_grigliate:'Verdure grigliate',pane_casereccio:'Pane casereccio',crostata_marmellata:'Crostata di marmellata',cannelloni_ricotta_spinaci:'Cannelloni ricotta e spinaci',pizza_surgelata:'Pizza surgelata',pizza_tonda:'Pizza tonda'},
    en:{arancini_riso:'Arancini (rice balls)',lasagne:'Lasagna',pizza_margherita:'Margherita pizza',patate_forno:'Baked potatoes',parmigiana_melanzane:'Eggplant Parmigiana',pollo_fritto:'Fried chicken',patatine_fritte:'French fries',bastoncini_pesce:'Fish sticks',sofficini:'Sofficini',cordon_bleu:'Cordon Bleu',polpette_carne:'Meatballs',cotolette_pollo:'Chicken cutlets',crocchette_patate:'Potato croquettes',calamari_fritti:'Fried calamari',verdure_grigliate:'Grilled vegetables',pane_casereccio:'Homemade bread',crostata_marmellata:'Jam tart',cannelloni_ricotta_spinaci:'Ricotta & spinach cannelloni',pizza_surgelata:'Frozen pizza',pizza_tonda:'Round pizza'},
    es:{arancini_riso:'Arancini (bolas de arroz)',lasagne:'Lasaña',pizza_margherita:'Pizza margarita',patate_forno:'Patatas al horno',parmigiana_melanzane:'Parmigiana de berenjena',pollo_fritto:'Pollo frito',patatine_fritte:'Papas fritas',bastoncini_pesce:'Palitos de pescado',sofficini:'Sofficini',cordon_bleu:'Cordon Bleu',polpette_carne:'Albóndigas de carne',cotolette_pollo:'Milanesas de pollo',crocchette_patate:'Croquetas de patata',calamari_fritti:'Calamares fritos',verdure_grigliate:'Verduras a la parrilla',pane_casereccio:'Pan casero',crostata_marmellata:'Tarta de mermelada',cannelloni_ricotta_spinaci:'Canelones de ricota y espinaca',pizza_surgelata:'Pizza congelada',pizza_tonda:'Pizza redonda'},
    pt:{arancini_riso:'Arancini (bolas de arroz)',lasagne:'Lasanha',pizza_margherita:'Pizza margherita',patate_forno:'Batatas no forno',parmigiana_melanzane:'Parmigiana de beringela',pollo_fritto:'Frango frito',patatine_fritte:'Batatas fritas',bastoncini_pesce:'Palitos de peixe',sofficini:'Sofficini',cordon_bleu:'Cordon Bleu',polpette_carne:'Almôndegas',cotolette_pollo:'Panados de frango',crocchette_patate:'Croquetes de batata',calamari_fritti:'Lulas fritas',verdure_grigliate:'Legumes grelhados',pane_casereccio:'Pão caseiro',crostata_marmellata:'Tarte de compota',cannelloni_ricotta_spinaci:'Canelones de ricota e espinafres',pizza_surgelata:'Pizza congelada',pizza_tonda:'Pizza redonda'},
    de:{arancini_riso:'Arancini (Reisbällchen)',lasagne:'Lasagne',pizza_margherita:'Margherita-Pizza',patate_forno:'Ofenkartoffeln',parmigiana_melanzane:'Auberginen-Parmigiana',pollo_fritto:'Frittiertes Hähnchen',patatine_fritte:'Pommes frites',bastoncini_pesce:'Fischstäbchen',sofficini:'Sofficini',cordon_bleu:'Cordon Bleu',polpette_carne:'Fleischbällchen',cotolette_pollo:'Hähnchenschnitzel',crocchette_patate:'Kartoffelkroketten',calamari_fritti:'Frittierte Calamari',verdure_grigliate:'Gegrilltes Gemüse',pane_casereccio:'Hausgemachtes Brot',crostata_marmellata:'Marmeladentarte',cannelloni_ricotta_spinaci:'Cannelloni mit Ricotta und Spinat',pizza_surgelata:'Tiefkühlpizza',pizza_tonda:'Runde Pizza'}
  };

  const ddgKl={it:'it-it',en:'us-en',es:'es-es',pt:'pt-pt',de:'de-de'};
  const methodWord={it:{forno:'forno',airfryer:'friggitrice ad aria'},en:{forno:'oven',airfryer:'air fryer'},es:{forno:'horno',airfryer:'freidora de aire'},pt:{forno:'forno',airfryer:'airfryer'},de:{forno:'Backofen',airfryer:'Heißluftfritteuse'}};
  const recipeWord={it:'ricetta',en:'recipe',es:'receta',pt:'receita',de:'rezept'};

  /* Theme (persisted) */
  const THEME_KEY='tc-theme'; const THEMES={nero:{bg:'#0b0b0c',card:'#151518',fg:'#f9fafb',muted:'#9ca3af',border:'#26262a',primary:'#22c55e',danger:'#ef4444',btnText:'#0b0b0c',icon:'#9ca3af'},bianco:{bg:'#f8fafc',card:'#ffffff',fg:'#111827',muted:'#475569',border:'#e5e7eb',primary:'#16a34a',danger:'#dc2626',btnText:'#111827',icon:'#6b7280'},celeste:{bg:'#e0f2fe',card:'#ffffff',fg:'#0b0b0c',muted:'#334155',border:'#bae6fd',primary:'#0ea5e9',danger:'#dc2626',btnText:'#111827',icon:'#374151'},rosa:{bg:'#ffe4e6',card:'#ffffff',fg:'#0b0b0c',muted:'#334155',border:'#fecdd3',primary:'#f43f5e',danger:'#b91c1c',btnText:'#111827',icon:'#374151'},giallo:{bg:'#fef9c3',card:'#ffffff',fg:'#0b0b0c',muted:'#334155',border:'#fef08a',primary:'#f59e0b',danger:'#b91c1c',btnText:'#111827',icon:'#374151'},indaco:{bg:'#312e81',card:'#3730a3',fg:'#e0e7ff',muted:'#a5b4fc',border:'#4338ca',primary:'#22c55e',danger:'#ef4444',btnText:'#0b0b0c',icon:'#cbd5e1'},grigio:{bg:'#111827',card:'#1f2937',fg:'#f9fafb',muted:'#9ca3af',border:'#374151',primary:'#22c55e',danger:'#ef4444',btnText:'#0b0b0c',icon:'#9ca3af'}};
  const applyTheme=(name)=>{const t=THEMES[name]||THEMES.nero,r=document.documentElement; r.style.setProperty('--bg',t.bg); r.style.setProperty('--card',t.card); r.style.setProperty('--fg',t.fg); r.style.setProperty('--muted',t.muted); r.style.setProperty('--border',t.border); r.style.setProperty('--primary',t.primary); r.style.setProperty('--danger',t.danger); r.style.setProperty('--btnText',t.btnText); r.style.setProperty('--icon',t.icon); localStorage.setItem(THEME_KEY,name);};
  applyTheme(localStorage.getItem(THEME_KEY)||'nero');
  /* Theme names localized */
  const THEME_NAMES = {
    it:{nero:'Nero', bianco:'Bianco', celeste:'Celeste', rosa:'Rosa', giallo:'Giallo', indaco:'Indaco', grigio:'Grigio'},
    en:{nero:'Black', bianco:'White', celeste:'Light Blue', rosa:'Pink', giallo:'Yellow', indaco:'Indigo', grigio:'Grey'},
    es:{nero:'Negro', bianco:'Blanco', celeste:'Celeste', rosa:'Rosa', giallo:'Amarillo', indaco:'Índigo', grigio:'Gris'},
    pt:{nero:'Preto', bianco:'Branco', celeste:'Azul claro', rosa:'Rosa', giallo:'Amarelo', indaco:'Índigo', grigio:'Cinzento'},
    de:{nero:'Schwarz', bianco:'Weiß', celeste:'Hellblau', rosa:'Rosa', giallo:'Gelb', indaco:'Indigo', grigio:'Grau'}
  };

  const rebuildThemeChips = () => {
    const names = THEME_NAMES[lang] || THEME_NAMES.en;
    const order = ['nero','bianco','celeste','rosa','giallo','indaco','grigio'];
    themeGrid.innerHTML = '';
    order.forEach(key => {
      const t = THEMES[key];
      const b = document.createElement('button');
      b.className = 'themechip';
      b.dataset.theme = key;
      // Visualize theme colors on the chip
      b.style.background = t.card;
      b.style.color = t.fg;
      b.style.borderColor = t.border;
      b.innerHTML = `<span class="swatch" style="background:${t.primary}; border-color:${t.border}"></span><span class="theme-label">${names[key]||key}</span>`;
      b.addEventListener('click', () => applyTheme(key));
      themeGrid.appendChild(b);
    });
  };


  /* State */
  const S={method:'forno', airMode:localStorage.getItem('tc-air-mode')||'potente', dish:DISH_IDS[0], running:false, timer:null, endAt:null, seconds:0};

  /* DOM */
  const dishSel=qs('#dishSel'), airRow=qs('#airRow'), airModeSel=qs('#airModeSel'), cardForno=qs('#cardForno'), cardAir=qs('#cardAir');
  const minutesInput=qs('#minutes'), display=qs('#display'), startBtn=qs('#start'), resetBtn=qs('#reset');
  const minus1Btn=qs('#minus1'), plus1Btn=qs('#plus1'), shareBtn=qs('#share'), recipeLink=qs('#recipeLink');
  const btnSettings=qs('#btnSettings'), settingsPanel=qs('#settingsPanel'), closeSettings=qs('#closeSettings'), themeGrid=qs('#themeGrid'), flagsGrid=qs('#flagsGrid');
  const appTitle=qs('[data-i18n="title"]'); const lblDish=qs('label[for="dishSel"]'); const ovenTitle=qs('#cardForno .method-title'); const airTitle=qs('#cardAir .method-title'); const lblMode=qs('label[for="airModeSel"]'); const lblMinutes=qs('label[for="minutes"]'); const btnShareText=qs('#btnShareText'); const shareHint=qs('#shareHint'); const settingsTitle=qs('#settingsTitle');

  const applyTexts=()=>{const U=UI[lang]||UI.en; document.documentElement.lang=lang; document.title=U.title; appTitle.textContent=U.title; lblDish.textContent=U.dish; ovenTitle.textContent=U.oven; airTitle.textContent=U.air; lblMode.textContent=U.mode; airModeSel.options[0].text=U.power; airModeSel.options[1].text=U.standard; lblMinutes.textContent=U.minutes; startBtn.textContent=S.running?U.pause:U.start; resetBtn.textContent=U.reset; btnShareText.textContent=U.shareBtn; shareHint.textContent=U.shareHint; qs('#flagsGrid').previousElementSibling.textContent=U.lang; qs('#themeGrid').previousElementSibling.textContent=U.theme; };

  const populateDishes=()=>{const labels=DISH_LABELS[lang]||DISH_LABELS.en; const prev=S.dish;
    const list=DISH_IDS.map(id=>({id,label:labels[id]||id})).sort((a,b)=>a.label.localeCompare(b.label));
    dishSel.innerHTML=list.map(d=>`<option value="${d.id}">${d.label}</option>`).join('');
    S.dish=list.find(x=>x.id===prev)?.id || list[0].id; dishSel.value=S.dish;
  };

  const render=()=>{const mm=String(Math.floor(S.seconds/60)).padStart(2,'0'); const ss=String(S.seconds%60).padStart(2,'0'); display.textContent=`${mm}:${ss}`;};
  const applyPreset=()=>{const map=S.method==='forno'?{lasagne:35,pizza_margherita:12,pane_casereccio:40,parmigiana_melanzane:35,patate_forno:45,cannelloni_ricotta_spinaci:35,crostata_marmellata:30,pizza_surgelata:14,pizza_tonda:12,pollo_fritto:25,patatine_fritte:25,bastoncini_pesce:15,sofficini:18,cordon_bleu:20,polpette_carne:30,cotolette_pollo:20,crocchette_patate:20,calamari_fritti:15,verdure_grigliate:20,arancini_riso:20}:{lasagne:22,pizza_margherita:8,pane_casereccio:25,parmigiana_melanzane:20,patate_forno:25,cannelloni_ricotta_spinaci:22,crostata_marmellata:20,pizza_surgelata:10,pizza_tonda:8,pollo_fritto:18,patatine_fritte:15,bastoncini_pesce:10,sofficini:11,cordon_bleu:12,polpette_carne:14,cotolette_pollo:12,crocchette_patate:12,calamari_fritti:8,verdure_grigliate:12,arancini_riso:12}; let mins=map[S.dish]; if(S.method==='airfryer'&&S.airMode==='standard') mins+=2; minutesInput.value=mins; S.seconds=mins*60; S.endAt=null; render();};
  const updateRecipeLink=()=>{const labels=DISH_LABELS[lang]||DISH_LABELS.en; const label=labels[S.dish]||S.dish; const q=encodeURIComponent(`${label} ${recipeWord[lang]||'recipe'} ${methodWord[lang]?.[S.method]||''}`.trim()); const kl=ddgKl[lang]||'us-en'; recipeLink.href=`https://duckduckgo.com/?q=${q}&kl=${kl}`;};
  const setSelected=(air)=>{ if(air){cardAir.classList.add('selected');cardForno.classList.remove('selected');airRow.hidden=false;S.method='airfryer';} else {cardForno.classList.add('selected');cardAir.classList.remove('selected');airRow.hidden=true;S.method='forno';} applyPreset(); updateRecipeLink(); applyTexts(); };

  // Audio
  let audioCtx; const initAudio=async()=>{ if(!audioCtx) audioCtx=new (window.AudioContext||window.webkitAudioContext)(); if(audioCtx.state==='suspended'){try{await audioCtx.resume();}catch{}} };
  const alarm10s=()=>{ if(!audioCtx) return; const o=audioCtx.createOscillator(),g=audioCtx.createGain(); o.type='sine'; o.connect(g); g.connect(audioCtx.destination); const now=audioCtx.currentTime; g.gain.setValueAtTime(0.0001,now); g.gain.linearRampToValueAtTime(0.7,now+0.1); o.frequency.setValueAtTime(700,now); for(let i=0;i<10;i++){ o.frequency.linearRampToValueAtTime(1200,now+i+0.5); o.frequency.linearRampToValueAtTime(700,now+i+1.0);} o.start(now); o.stop(now+10); };

  // Events
  on(cardForno,'click',()=>setSelected(false));
  on(cardAir,'click',()=>setSelected(true));
  airModeSel.value=S.airMode;
  on(airModeSel,'change',()=>{S.airMode=airModeSel.value; localStorage.setItem('tc-air-mode',S.airMode); if(S.method==='airfryer') applyPreset();});
  on(dishSel,'change',()=>{S.dish=dishSel.value; applyPreset(); updateRecipeLink();});
  on(minus1Btn,'click',()=>{ S.seconds=Math.max(0,S.seconds-60); if(S.endAt) S.endAt-=60000; render(); });
  on(plus1Btn,'click',()=>{ S.seconds+=60; if(S.endAt) S.endAt+=60000; render(); });
  on(minutesInput,'change',()=>{ const v=Math.max(0,parseInt(minutesInput.value||'0',10)); minutesInput.value=v; S.seconds=v*60; S.endAt=null; render(); });

  on(startBtn,'click',async()=>{ const U=UI[lang]||UI.en;
    if(!S.running){ try{await initAudio();}catch{} if(!S.seconds) S.seconds=Math.max(0,parseInt(minutesInput.value||'0',10)*60);
      S.endAt=Date.now()+S.seconds*1000; S.timer=setInterval(()=>{ S.seconds=Math.max(0,Math.round((S.endAt-Date.now())/1000)); render(); if(S.seconds<=0){ clearInterval(S.timer); S.timer=null; S.running=false; startBtn.textContent=U.start; startBtn.classList.remove('danger'); startBtn.classList.add('primary'); try{alarm10s();}catch{} if(navigator.vibrate) navigator.vibrate([300,150,300,150,300]); } },250);
      S.running=true; startBtn.textContent=U.pause; startBtn.classList.remove('primary'); startBtn.classList.add('danger');
    } else { clearInterval(S.timer); S.timer=null; if(S.endAt){ S.seconds=Math.max(0,Math.round((S.endAt-Date.now())/1000)); S.endAt=null; } S.running=false; startBtn.textContent=U.start; startBtn.classList.remove('danger'); startBtn.classList.add('primary'); }
  });
  on(resetBtn,'click',()=>{ if(S.timer) clearInterval(S.timer); S.timer=null; S.running=false; startBtn.className='primary start bigbtn'; applyPreset(); applyTexts(); });

  // Share
  const b64enc=o=>{const j=JSON.stringify(o); const b=btoa(unescape(encodeURIComponent(j))); return b.replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');};
  on(shareBtn,'click',async()=>{ const totalSeconds=Math.max(0,parseInt(minutesInput.value||'0',10)*60); const startedAt=S.endAt ? (S.endAt-totalSeconds*1000) : Date.now();
    const labels=DISH_LABELS[lang]||DISH_LABELS.en; const payload={dishId:S.dish,dish:labels[S.dish]||S.dish,method:S.method,mode:(S.method==='airfryer'?S.airMode:''),start:startedAt,dur:totalSeconds}; const url=`${location.origin}${location.pathname}#${b64enc(payload)}`;
    const mins=Math.max(1,Math.round(totalSeconds/60)); const text=(UI[lang]||UI.en).share(mins,labels[S.dish]||S.dish,url);
    const isSecure=(location.protocol==='https:')||(location.hostname==='localhost')||(location.hostname==='127.0.0.1');
    try{ if(isSecure && navigator.share){ await navigator.share({text}); return; } throw 0; }
    catch{ try{ await navigator.clipboard.writeText(text); alert('Link copiato negli appunti'); } catch{ const ta=document.createElement('textarea'); ta.value=text; ta.style.position='fixed'; ta.style.opacity='0'; document.body.appendChild(ta); ta.select(); try{ document.execCommand('copy'); alert('Copia effettuata'); } catch{ prompt('Copia link:', ta.value); } document.body.removeChild(ta); } }
  });

  // Open from shared link
  const b64dec=c=>{c=c.replace(/-/g,'+').replace(/_/g,'/'); const pad=c.length%4?4-(c.length%4):0; c=c+'='.repeat(pad); const j=decodeURIComponent(escape(atob(c))); return JSON.parse(j);};
  const initFromHash=()=>{ const h=location.hash?.slice(1); if(!h) return; let d; try{ d=b64dec(h); }catch{return;} const {dishId,method,mode,start,dur}=d||{}; if(!dishId||!method||!start||!dur) return;
    S.dish=dishId; populateDishes(); dishSel.value=S.dish; setSelected(method==='airfryer'); if(method==='airfryer'&&mode){ S.airMode=mode; airModeSel.value=mode; } applyPreset(); updateRecipeLink();
    const end=parseInt(start,10)+parseInt(dur,10)*1000; const remain=Math.max(0,Math.round((end-Date.now())/1000)); S.seconds=remain; S.endAt=Date.now()+remain*1000;
    if(S.timer) clearInterval(S.timer); S.timer=setInterval(()=>{ S.seconds=Math.max(0,Math.round((S.endAt-Date.now())/1000)); render(); if(S.seconds<=0){ clearInterval(S.timer); S.timer=null; S.running=false; startBtn.textContent=(UI[lang]||UI.en).start; startBtn.classList.remove('danger'); startBtn.classList.add('primary'); try{alarm10s();}catch{} if(navigator.vibrate) navigator.vibrate([300,150,300,150,300]); } },250);
    S.running=true; startBtn.textContent=(UI[lang]||UI.en).pause; startBtn.classList.remove('primary'); startBtn.classList.add('danger');
  };

  // Settings
  const rebuildFlags=()=>{ flagsGrid.innerHTML=''; LANGS.forEach(code=>{ const b=document.createElement('button'); b.className='flagchip'+(code===lang?' active':''); b.innerHTML=`<span>${flags[code]}</span><span>${code.toUpperCase()}</span>`; b.addEventListener('click',()=>{ lang=code; localStorage.setItem(LANG_KEY,code); applyTexts(); populateDishes(); updateRecipeLink(); rebuildFlags(); rebuildThemeChips(); }); flagsGrid.appendChild(b); }); };
  on(btnSettings,'click',()=>settingsPanel.classList.remove('hidden'));
  on(closeSettings,'click',()=>settingsPanel.classList.add('hidden'));
  on(settingsPanel,'click',e=>{ if(e.target===settingsPanel) settingsPanel.classList.add('hidden'); });
  on(themeGrid,'click',e=>{ const b=e.target.closest('button[data-theme]'); if(!b) return; applyTheme(b.dataset.theme); });

  // Boot
  settingsPanel.classList.add('hidden'); populateDishes(); applyTexts(); setSelected(false); updateRecipeLink(); rebuildFlags(); rebuildThemeChips(); initFromHash();
})();