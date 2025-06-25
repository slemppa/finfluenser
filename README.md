# Finfluenser – AI-videoiden generointisovellus

Finfluenser on moderni React-sovellus, jonka avulla voit luoda vaikuttavia videoita tekoälyn avulla helposti ja nopeasti. Sovellus hyödyntää Viteä kehitysympäristönä ja tarjoaa selkeän käyttöliittymän videoiden generointiin sekä webhook-integraation ulkoisen datan näyttämiseen.

## Ominaisuudet

- **Moderni landing page**: Tyylikäs ylävalikko ja hero-osio, jossa brändi ja toimintakehote.
- **Generointi-sivu**: Vasemmalla kiinteä valikko (sidebar), jossa valitaan moodi (Puhe/Liike), ääni/tyyppi, kuvasuhde ja generointipainike.
- **Chat ja generoidut videot**: Keskialueella chat-ruutu ja ulkoisesta webhookista (Airtable/n8n) haetut videot kortteina (media + VoiceOver-teksti).
- **Responsiivinen ulkoasu**: Sovellus toimii hyvin eri kokoisilla näytöillä (sidebar ei piiloudu pienilläkään näytöillä).
- **Fontti**: Käytössä Montserrat-fontti.
- **Reititys**: React Router mahdollistaa siirtymisen etusivun ja generointi-sivun välillä.

## Teknologiat ja riippuvuudet

- [React](https://react.dev/) 19
- [Vite](https://vitejs.dev/) 7
- [React Router](https://reactrouter.com/) 7
- [ESLint](https://eslint.org/) (kehityksessä)

## Asennus ja käyttöönotto

1. **Kloonaa repositorio:**
   ```bash
   git clone https://github.com/slemppa/finfluenser.git
   cd ai-video-generator
   ```
2. **Asenna riippuvuudet:**
   ```bash
   npm install
   ```
3. **Käynnistä kehityspalvelin:**
   ```bash
   npm run dev
   ```
   Sovellus on nyt käytettävissä osoitteessa [http://localhost:5173](http://localhost:5173)

## Projektin rakenne

- `src/LandingPage.jsx` – Etusivu ja hero-osio
- `src/Generointi.jsx` – Generointi-sivu, sidebar ja kortit
- `src/App.jsx` – Reititys
- `src/App.css` & `src/index.css` – Tyylit ja fontit

## Webhook-integraatio

Generointi-sivu hakee videotiedot webhookista:
```
https://samikiias.app.n8n.cloud/webhook/finlf-get-posts
```
Vastaukset näytetään kortteina, joissa on video ja VoiceOver-teksti.

## Kehittäjille

- ESLint-konfiguraatio löytyy tiedostosta `eslint.config.js`.
- Fontti ladataan Google Fontsista (Montserrat).
- Favicon löytyy kansiosta `public/`.

## Lisenssi

Tämä projekti on tarkoitettu demokäyttöön eikä sisällä virallista lisenssiä.
