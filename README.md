# Tempi cottura (Web MVP)

Timer "Pomodoro" per cucina con preset per piatto e metodo (forno / friggitrice ad aria), condivisione e suggerimento ricetta.

## Funzioni
- Preset per piatto e metodo
- Start / Pausa / Reset e ±1 min
- Beep a fine timer + notifica browser (se consentita)
- Condivisione con link all'app
- Ricetta suggerita in-app (primo risultato web via proxy pubblico)

## Sviluppo locale
```bash
python3 -m http.server 8000
# poi apri http://localhost:8000
```

## Deploy su GitHub Pages (consigliato)
1. Crea un repository **pubblico** su GitHub (es. `tempi-cottura`).
2. Esegui i comandi sotto dal terminale nella cartella del progetto.
3. Apri *Settings → Pages* e verifica che sia selezionato **GitHub Actions** come sorgente.

```bash
git init
git add .
git commit -m "chore: first commit (Tempi cottura web mvp)"
git branch -M main
git remote add origin https://github.com/<TUO_USERNAME>/tempi-cottura.git
git push -u origin main
```

La pipeline `Deploy Pages` pubblicherà automaticamente su GitHub Pages all'indirizzo:
`https://<TUO_USERNAME>.github.io/tempi-cottura/`

> Nota: la ricerca ricetta usa un proxy pubblico (AllOrigins) solo per l’MVP. In produzione valuta un endpoint tuo.

## Licenza
MIT
