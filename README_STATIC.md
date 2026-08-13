# 📱 Catalogo MW - Versione HTML Statico

Versione HTML statico dell'app catalogo prodotti Mediaworld con generazione codici a barre. Non richiede Streamlit e può essere hostata su qualsiasi servizio di hosting statico gratuito.

## ✨ Vantaggi rispetto alla versione Streamlit

- **Nessun standby**: L'app non va mai in sleep
- **Icona personalizzata**: PWA con icona custom quando aggiunta alla home
- **Più veloce**: Caricamento istantaneo, nessun server Python
- **Hosting gratuito**: GitHub Pages, Netlify, Vercel, ecc.
- **Codice privato**: Non richiede repository pubblico
- **Offline**: Funziona anche senza connessione (grazie al service worker)

## 📋 Requisiti

- Nessun requisito di backend
- Browser moderno con supporto JavaScript
- Per hosting: qualsiasi servizio di hosting statico

## 🚀 Deployment

### Opzione 1: GitHub Pages (Gratuito)

1. Crea un repository privato su GitHub
2. Carica tutti i file del progetto
3. Vai in Settings → Pages
4. Seleziona la branch main e la cartella root
5. L'app sarà disponibile all'URL: `https://tuo-username.github.io/nome-repo/`

### Opzione 2: Netlify (Gratuito)

1. Vai su [netlify.com](https://netlify.com)
2. Trascina la cartella del progetto nell'area di upload
3. L'app sarà online in pochi secondi

### Opzione 3: Vercel (Gratuito)

1. Installa Vercel CLI: `npm i -g vercel`
2. Nella cartella del progetto: `vercel`
3. Segui le istruzioni

### Opzione 4: Hosting locale

Per testare localmente:

```bash
# Python 3
python3 -m http.server 8000

# Node.js (se hai http-server installato)
npx http-server
```

Poi apri `http://localhost:8000` nel browser.

## 🎨 Icone Personalizzate

Per avere un'icona personalizzata quando aggiungi l'app alla home dello smartphone:

1. Crea un'icona quadrata di 192x192 pixel (PNG)
2. Crea un'icona quadrata di 512x512 pixel (PNG)
3. Salvala come `icon-192.png` e `icon-512.png` nella root del progetto
4. Puoi usare strumenti online come:
   - [Canva](https://www.canva.com)
   - [Favicon.io](https://favicon.io)
   - [RealFaviconGenerator](https://realfavicongenerator.net)

Suggerimento: Usa il logo Mediaworld o un'icona di un smartphone/codice a barre.

## 📁 Struttura del Progetto

```
smartphone-barcode-app/
├── index.html              # Pagina principale
├── styles.css              # Foglio di stile
├── app.js                  # Logica JavaScript
├── manifest.json           # Manifest PWA
├── sw.js                   # Service Worker per offline
├── icon-192.png            # Icona 192x192 (da creare)
├── icon-512.png            # Icona 512x512 (da creare)
├── data/                   # Database JSON
│   ├── smartphone.json
│   ├── smartwatch.json
│   ├── tablet.json
│   ├── notebook.json
│   └── services.json
├── convert_csv_to_json.py  # Script per convertire CSV in JSON
└── databases/              # File CSV originali (non necessari per deployment)
```

## 🔄 Aggiornare i Dati

Quando aggiorni i file CSV nella cartella `databases/`:

1. Esegui lo script di conversione:
   ```bash
   python3 convert_csv_to_json.py
   ```
2. Carica i nuovi file JSON nella cartella `data/`
3. Deploya nuovamente

## 🔒 Sicurezza

- La password admin è configurata nel file `app.js` (stessa della versione Streamlit)
- Per cambiare la password, modifica le costanti `SALT` e `PASSWORD_HASH` in `app.js`
- Genera nuovi hash con lo script `generate_password_hash.py`

## 📱 Come Aggiungere alla Home (PWA)

1. Apri l'app nel browser dello smartphone
2. Tocca il menu "Condividi" del browser
3. Seleziona "Aggiungi a Home"
4. L'app apparirà con la tua icona personalizzata

## 🐛 Risoluzione Problemi

### L'app non carica i dati
- Verifica che i file JSON siano nella cartella `data/`
- Controlla la console del browser per errori (F12)

### Il codice a barre non viene generato
- Verifica che JsBarcode sia caricato (controlla la connessione internet)
- Controlla che il codice PIM sia valido

### L'icona non appare quando aggiungo alla home
- Verifica che i file `icon-192.png` e `icon-512.png` esistano
- Assicurati che siano immagini PNG valide
- Cancella la cache del browser

### Service Worker non funziona
- Il service worker richiede HTTPS (tranne su localhost)
- Su GitHub Pages è automaticamente HTTPS

## 📄 Licenza

Questo progetto è fornito così com'è per uso interno aziendale.
