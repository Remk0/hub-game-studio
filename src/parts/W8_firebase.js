
/* =====================================================================
   ONLINE — gedeelde chat en scores via Firebase Firestore
   Vul de gegevens in firebase-config.js in (of hieronder, als je één los
   bestand gebruikt).
   Deze gegevens horen publiek te zijn: ze staan in elke Firebase-website.
   Wat je data beschermt zijn de regels in firestore.rules, niet deze sleutel.
   Laat je het leeg, dan draait de hub gewoon offline verder.
===================================================================== */
const FIREBASE_CONFIG=(typeof window!=='undefined' && window.HUB_FIREBASE) || {
  apiKey:            "",
  authDomain:        "",
  projectId:         "",
  storageBucket:     "",
  messagingSenderId: "",
  appId:             ""
};

const SDK='https://www.gstatic.com/firebasejs/10.12.2/';
function loadScript(src){
  return new Promise((ok,fail)=>{
    const s=document.createElement('script');
    s.src=src; s.async=false;
    s.onload=ok; s.onerror=()=>fail(new Error('laden mislukt: '+src));
    document.head.appendChild(s);
  });
}
let FS=null, MYUID=null, presTimer=null;

async function onlineDB(){
  if(!FIREBASE_CONFIG.projectId) return null;           // niet ingevuld: offline
  try{
    await loadScript(SDK+'firebase-app-compat.js');
    await loadScript(SDK+'firebase-auth-compat.js');
    await loadScript(SDK+'firebase-firestore-compat.js');
    firebase.initializeApp(FIREBASE_CONFIG);
    const cred=await firebase.auth().signInAnonymously();
    MYUID=(cred&&cred.user&&cred.user.uid)||firebase.auth().currentUser.uid;
    FS=firebase.firestore();
    // het eigen document heet voortaan zoals de inlog, anders weigeren de regels het
    ME.id=MYUID; LS.set('hub.id',MYUID);
    PLAYERS[ME.id]=MINE;
    startPresence();
    NETLABEL='live — gedeeld met iedereen online';
    return { db:{ collection:p=>FS.collection(p), doc:p=>FS.doc(p) }, room:null };
  }catch(e){
    NETLABEL='geen verbinding met de server — alleen op dit apparaat';
    return null;
  }
}

/* ---- wie is er nu: een hartslag van 20 s, niemand hoeft af te melden ---- */
function startPresence(){
  const beat=()=>{
    if(!FS||!MYUID) return;
    FS.collection('presence').doc(MYUID).set({
      name:(ME.name||'Speler').slice(0,22), world:THEME_KEY, t:Date.now()
    }).catch(()=>{});
  };
  beat();
  clearInterval(presTimer);
  presTimer=setInterval(beat,20000);
  addEventListener('beforeunload',()=>{
    try{ FS.collection('presence').doc(MYUID).delete(); }catch(e){}
  });
  FS.collection('presence').orderBy('t','desc').limit(60).onSnapshot(snap=>{
    const cut=Date.now()-50000, out=[];
    snap.docs.forEach(d=>{
      const v=d.data()||{};
      if(!(+v.t>cut)) return;
      out.push({ self:d.id===MYUID, presence:{name:v.name||'Speler',world:v.world} });
    });
    PEERS=out; chatDirty=true;
  },()=>{});
}
function presenceUpdateOnline(){
  if(!FS||!MYUID) return;
  FS.collection('presence').doc(MYUID).set({
    name:(ME.name||'Speler').slice(0,22), world:THEME_KEY, t:Date.now()
  }).catch(()=>{});
}
