/* Gegevens van je eigen Firebase-project (rrhub-6952b).
   Zie docs/firebase-setup.md voor waar ze vandaan komen.

   Deze sleutel HOORT publiek te zijn — hij staat in elke Firebase-website en is
   geen wachtwoord. Wat je data beschermt zijn de regels in firestore.rules.

   Dit bestand wordt NIET overschreven als je opnieuw bouwt met src/build.py. */
window.HUB_FIREBASE = {
  apiKey:            "AIzaSyC4LsnxMaY7ahi_VFTcpwTuJykhzyJ7wJM",
  authDomain:        "rrhub-6952b.firebaseapp.com",

  /* Voor het live zien van andere spelers in de zaal (en elkaar oppakken).
     Zet hier de URL van je Realtime Database — die staat in de Firebase-console
     onder Build > Realtime Database, bovenaan, en ziet er zo uit:
       https://rrhub-6952b-default-rtdb.europe-west1.firebasedatabase.app
     Laat je hem leeg, dan werkt alles behalve het live rondlopen.
     Stap voor stap: docs/firebase-setup.md */
  databaseURL:       "https://rrhub-6952b-default-rtdb.europe-west1.firebasedatabase.app/",

  projectId:         "rrhub-6952b",
  storageBucket:     "rrhub-6952b.firebasestorage.app",
  messagingSenderId: "151801875514",
  appId:             "1:151801875514:web:991cf0ffbb48c1dd52b903"
};
