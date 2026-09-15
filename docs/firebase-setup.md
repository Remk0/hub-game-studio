# HUB Game Studio online zetten

Je hebt drie dingen nodig: een Firebase-project (gratis), de config erin plakken, en het
bestand ergens neerzetten. Reken op een kwartier.

---

## 1. Firebase-project maken

1. Ga naar **console.firebase.google.com** en log in met een Google-account.
2. **Add project** → geef het een naam (bijvoorbeeld `hub-game-studio`).
3. Google Analytics mag je uitzetten — je hebt het niet nodig.

## 2. Anoniem inloggen aanzetten

Spelers hoeven geen account te maken, maar de server moet ze wel uit elkaar kunnen
houden. Daar is "anoniem inloggen" voor: elk apparaat krijgt stilletjes een eigen id.

1. Links in het menu: **Build → Authentication → Get started**.
2. Tabblad **Sign-in method** → **Anonymous** → aanzetten → **Save**.

Zet je dit niet aan, dan kan niemand iets opslaan en valt de hub terug op offline.

## 3. Database aanmaken

1. **Build → Firestore Database → Create database**.
2. Kies **Start in production mode** (de regels zetten we hierna goed).
3. Kies een regio dicht bij je spelers, bijvoorbeeld **europe-west** — dit kun je later
   niet meer veranderen.

## 4. De beveiligingsregels erin zetten

1. In Firestore: tabblad **Rules**.
2. Verwijder alles wat er staat en plak de volledige inhoud van **`firestore.rules`**
   (zit hiernaast) erin.
3. **Publish**.

Deze regels zorgen dat:

- iedereen het scorebord en de chat kan lezen;
- iemand alleen zijn **eigen** speler-document kan schrijven — niemand kan namens een
  ander praten of andermans score aanpassen;
- namen maximaal 22 tekens zijn, en er hoogstens 24 berichten en 120 scores per speler
  bewaard worden;
- er minstens een halve seconde tussen twee schrijfacties zit — een rem op spammen;
- verder niets in de database geschreven kan worden.

## 5. De sleutel in het bestand plakken

1. In Firebase: **tandwiel → Project settings**.
2. Onderaan bij **Your apps**: klik het **web-icoon `</>`** → geef een naam → **Register app**.
3. Je krijgt een blokje `firebaseConfig` te zien. Kopieer de waarden.
4. Open **`firebase-config.js`** in een teksteditor (Kladblok is genoeg) en vul de zes
   regels in:

```js
window.HUB_FIREBASE = {
  apiKey:            "AIza...",
  authDomain:        "jouwproject.firebaseapp.com",
  projectId:         "jouwproject",
  storageBucket:     "jouwproject.firebasestorage.app",
  messagingSenderId: "123456789012",
  appId:             "1:1234:web:abcd"
};
```

Dit bestand staat los van `index.html`, zodat een herbouw met `src/build.py` je sleutel
niet overschrijft.

**Deze sleutel hoort publiek te zijn.** Hij staat in elke Firebase-website en is geen
wachtwoord. Wat je data beschermt zijn de regels uit stap 4.

Laat je het leeg, dan werkt de hub gewoon offline verder — handig om te testen.

## 6. Online zetten

Kies er één:

**GitHub Pages** — als de code toch al in een repo staat.
Settings → Pages → Branch `main`, map `/ (root)`. Na een minuut staat de hub online.

**Netlify Drop** — zonder repo, geen installatie.
Ga naar `app.netlify.com/drop` en sleep `index.html` **en** `firebase-config.js` er samen
in. Beide bestanden zijn nodig, anders blijft de hub offline.

**Firebase Hosting** — alles op één plek.
```bash
npm install -g firebase-tools
firebase login
firebase init hosting      # public map: "public", geen single-page app
# kopieer index.html en firebase-config.js naar public/
firebase deploy
```

---

## Werkt het?

Open de link, loop naar het chatbord en zeg iets. Rechtsboven in de chatruimte moet
**"live — gedeeld met iedereen online"** staan.

Staat er iets anders, dan klopt er iets niet:

| Wat je ziet | Wat er aan de hand is |
|---|---|
| "geen verbinding met de server" | `firebase-config.js` niet meegekomen, of Firestore/anoniem inloggen nog niet aan |
| "offline — alleen op dit apparaat" | de config is leeg gebleven |
| berichten verschijnen niet bij de ander | de regels uit stap 4 staan nog niet in de console |

Zie je een foutmelding, open dan de ontwikkelaarsconsole (F12 → Console); Firebase zegt
er meestal bij wat er mist.

Open daarna dezelfde link op je telefoon: je ziet jezelf twee keer in de lijst rechts,
en wat je op het ene apparaat typt verschijnt op het andere.

## Wat het kost

Niets, bij normaal gebruik. De gratis laag van Firestore geeft 50.000 leesacties en
20.000 schrijfacties per dag. Eén speler die een uur speelt gebruikt er een paar honderd.
Wil je zeker weten dat het gratis blijft: laat het factuuraccount er gewoon af — dan stopt
het als de gratis laag op is in plaats van dat er kosten bijkomen.

## Waar je op moet letten

De chat is **openbaar en voor iedereen met de link**. Het woordfilter vangt scheldwoorden
in het Nederlands en Engels, maar het vangt geen mensen. Voor een groep die je kent is dat
prima; deel je de link breed, houd er dan een oogje op. In de Firestore-console kun je
onder **Data → players** elk document bekijken en verwijderen als iemand zich misdraagt.

Wil je later toch een toegangscode voor de chat, dan is dat een kleine aanpassing —
vraag het gerust.
