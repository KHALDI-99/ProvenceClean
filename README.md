# Clean Provence — Site vitrine

Site vitrine React + Vite prêt à être envoyé sur GitHub.

## Installation

```bash
npm install
npm run dev
```

## Build production

```bash
npm run build
```

## Logo

Le logo est déjà inclus dans :

- `public/logo-clean-provence.jpg`

## Formulaire de devis

Le formulaire fonctionne en local avec `localStorage`.

Cela signifie que :

- les demandes restent enregistrées dans le navigateur
- elles peuvent être exportées en CSV
- elles ne sont pas centralisées sur plusieurs appareils

Pour une vraie version en ligne, il faudra ensuite connecter le formulaire à :

- Google Sheets
- Airtable
- Firebase
- Supabase
- ou un backend PHP / Node.js
