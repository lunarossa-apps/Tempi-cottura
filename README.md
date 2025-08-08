# Tempi Cottura (v5, code only)

Webapp PWA per timer di cottura (forno / friggitrice ad aria) con griglia piatti a 2 colonne, preferiti con stellina e selettore modalità Airfryer (Potente/Standard).

## Novità
- Tempi completi per **Forno** e **Airfryer**
- **Airfryer Standard/Potente** (Standard = Potente +2 min), con memoria in localStorage
- **Preferiti** per piatto (stellina in griglia), persistenti in localStorage
- Allarme 10s, vibrazione su mobile, condivisione e ricerca ricetta

## Pubblicazione su GitHub Pages
1. Carica tutti i file del pacchetto nel branch (es: `main`).
2. Vai su **Settings → Pages** → `Source: Branch main / root`.
3. Attendi 1–2 minuti: l’URL sarà `https://<user>.github.io/<repo>/`.

## Aggiungere le immagini (assets)
Carica nella cartella `assets/` i file con i **nomi esatti** elencati in `app.js` (proprietà `file` in `DISHES`) e l’icona PWA `pwa_icon.png`.

> Tip: se la pagina non aggiorna subito, aggiungi `?v=5` all’URL o svuota la cache del browser.
