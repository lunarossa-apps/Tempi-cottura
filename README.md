# Tempi Cottura — V7.4.1 (core)

- Condivisione robusta (Web Share su HTTPS/localhost, altrimenti copia link + fallback manuale) con messaggio:
  `Ti è stato condiviso un Timer per X minuti relativo alla preparazione di [Piatto]. Clicca per seguire il timer: [link]`.
- URL corto con **hash** Base64URL (contiene dish/method/mode/start/dur).
- Banner **Abilita suono** iniettato **solo** quando si apre da link condiviso.
- Temi con contrasto automatico; icona impostazioni grigia; pulsanti e testi sempre leggibili.
- Airfryer **Standard/Potente** (memorizzato); stellina preferiti.

## Deploy
Carica i file nel branch Pages. Forza refresh con `?v=7.4.1` se vedi cache vecchia.
