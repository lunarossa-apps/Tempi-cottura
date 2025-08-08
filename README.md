# Tempi Cottura (v4 lite, senza assets)

Webapp PWA per timer di cottura (forno / friggitrice ad aria) con griglia piatti a 2 colonne.

## Contenuto
- `index.html`, `style.css`, `app.js`, `manifest.json`, `sw.js`
- cartella `assets/` (vuota): carica qui le immagini quando pronte

## Come pubblicare su GitHub Pages
1. Crea un repository pubblico e carica tutti i file di questo pacchetto.
2. Vai su **Settings → Pages** → `Source: Branch main / root` (o GitHub Actions).
3. Attendi 1–2 minuti: l’URL sarà `https://<user>.github.io/<repo>/`.

## Come aggiungere le immagini (assets)
Carica nella cartella `assets/` i file con questi nomi (case-sensitive):

- `lasagne.jpg`
- `pizza_margherita.jpg`
- `pane_casereccio.jpg`
- `parmigiana_melanzane.jpg`
- `torta_cioccolato.jpg`
- `arrosto_vitello.jpg`
- `arrosto_maiale.jpg`
- `pesce_patate.jpg`
- `patate_al_forno.jpg`
- `cannelloni_ricotta_spinaci.jpg`
- `crostata_marmellata.jpg`
- `pollo_fritto.jpg`
- `patatine_fritte.jpg`
- `bastoncini_pesce.jpg`
- `sofficini.jpg`
- `cordon_bleu.jpg`
- `polpette_di_carne.jpg`
- `cotolette_pollo.jpg`
- `crocchette_patate.jpg`
- `calamari_fritti.jpg`
- `verdure_grigliate.jpg`
- `arancini_riso.jpg`
- `mozzarella_in_carrozza.jpg`
- `mini_pizze.jpg`
- `frittelle_dolci.jpg`
- `pizza_surgelata.jpg`
- `pizza_tonda.jpg`
- **Icona PWA:** `pwa_icon.png` (192×192 e 512×512 con lo stesso nome)

> Tip: se la pagina non aggiorna subito, aggiungi `?v=4-lite` all’URL o svuota la cache del browser.
