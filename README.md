# Tempi Cottura — V7.7 (core, piatti multilingua + bandiere)

**Novità**
- Piatti localizzati in **5 lingue** (IT/EN/ES/PT/DE) con **ID canonici**.
- Il link condiviso invia l’**ID del piatto** (retrocompatibilità: se riceve il nome, viene mappato all’ID).
- Selettore rapido con bandiere in appbar + selezione in Impostazioni.
- Tutti i testi localizzati come in 7.6.

**Nota per i preset**
I tempi sono mappati per **ID** in `PRESETS` (forno/airfryer). Per aggiungere nuovi piatti:
1. Aggiungi l’ID in `DISH_IDS`
2. Aggiungi il label in ogni lingua in `DISH_LABELS`
3. Aggiungi i minuti nei due oggetti `PRESETS`

**Deploy**
- Pubblica su GitHub Pages e apri con `?v=7.7` per evitare cache vecchie (aggiorna anche `CACHE` in `sw.js` se fai un hotfix).
