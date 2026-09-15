
/* =====================================================================
   PANELEN — scorebord en chatruimte als volledig scherm
===================================================================== */
const QUICKS=['Hoi, welkom!','Goed gedaan!','Wie verslaat mijn score?','Ik daag je uit!',
  'Bedankt!','Nog één potje?','Zullen we samen spelen?','Wat een score!',
  'Goed bezig!','Even pauze','Sorry!','Tot de volgende!'];

const hofEl=document.getElementById('hof'),   chatEl=document.getElementById('chat');
const hofBody=document.getElementById('hofBody'), hofTabs=document.getElementById('hofTabs');
const hofGames=document.getElementById('hofGames');
const chatLog=document.getElementById('chatLog'), chatQuick=document.getElementById('chatQuick');
const chatWho=document.getElementById('chatWho'), chatInput=document.getElementById('chatInput');
const chatSend=document.getElementById('chatSend'), chatTo=document.getElementById('chatTo');
const chatToName=document.getElementById('chatToName'), chatToClear=document.getElementById('chatToClear');
const netBadge=document.getElementById('netBadge');
const nameInput=document.getElementById('nameInput');

let panel=null, hofPeriod='day', hofGame='all', talkTo=null;

function syncNetBadge(){
  if(!netBadge) return;
  netBadge.textContent=NETLABEL||(ONLINE?'live — gedeeld met andere spelers':'offline — alleen op dit apparaat');
  netBadge.className=ONLINE?'on':'off';
}
function openPanel(which){
  panel=which;
  if(which==='hof'){ renderHof(); hofEl.hidden=false; }
  else { renderChat(); chatEl.hidden=false; setTimeout(()=>{try{chatInput.focus();}catch(e){}},60); }
  enterEl.hidden=true; barEl.hidden=true;
  for(const k in keys) keys[k]=false;
}
function closePanel(){
  panel=null; hofEl.hidden=true; chatEl.hidden=true; barEl.hidden=false;
  for(const k in keys) keys[k]=false;
  try{ window.focus(); }catch(e){}
}

/* ---------------- scorebord ---------------- */
function renderHof(){
  [].forEach.call(hofTabs.querySelectorAll('button'),b=>
    b.classList.toggle('on',b.dataset.p===hofPeriod));
  [].forEach.call(hofGames.querySelectorAll('button'),b=>
    b.classList.toggle('on',b.dataset.g===hofGame));
  const rows=ranking(hofGame,hofPeriod).slice(0,25);
  hofBody.textContent='';
  if(!rows.length){
    const d=document.createElement('p'); d.className='leeg';
    d.textContent=hofPeriod==='day'
      ? 'Vandaag nog niets gespeeld. Loop naar een scherm en zet de eerste score neer.'
      : 'Nog geen scores in dit tijdvak.';
    hofBody.appendChild(d); return;
  }
  rows.forEach((r,i)=>{
    const G=GAMES.find(g=>g.id===r.g);
    const row=document.createElement('div');
    row.className='rij'+(r.id===ME.id?' jij':'')+(i<3?' top':'');
    const rank=document.createElement('span'); rank.className='nr'; rank.textContent=(i+1);
    const nm=document.createElement('span');  nm.className='nm';
    nm.textContent=r.name+(r.id===ME.id?' (jij)':'');
    const gm=document.createElement('span');  gm.className='gm'; gm.textContent=G?G.name:'';
    const sc=document.createElement('span');  sc.className='sc';
    sc.textContent=r.v+' '+unitFor(r.g);
    const wh=document.createElement('span');  wh.className='wh'; wh.textContent=ago(r.t);
    row.appendChild(rank); row.appendChild(nm); row.appendChild(gm); row.appendChild(sc); row.appendChild(wh);
    hofBody.appendChild(row);
  });
}
[].forEach.call(hofTabs.querySelectorAll('button'),b=>
  b.addEventListener('click',()=>{ hofPeriod=b.dataset.p; renderHof(); }));

/* ---------------- chat ---------------- */
function nameColour(s){
  let h=0; for(let i=0;i<s.length;i++) h=(h*31+s.charCodeAt(i))>>>0;
  return 'hsl('+(h%360)+',62%,72%)';
}
function renderChat(){
  // berichten
  const atBottom=chatLog.scrollTop+chatLog.clientHeight>=chatLog.scrollHeight-40;
  chatLog.textContent='';
  const msgs=feed(80);
  if(!msgs.length){
    const d=document.createElement('p'); d.className='leeg';
    d.textContent='Nog stil hier. Zeg iets met een snelle zin of typ zelf.';
    chatLog.appendChild(d);
  }
  msgs.forEach(m=>{
    const row=document.createElement('div');
    row.className='msg'+(m.id===ME.id?' mij':'')+(m.q?' snel':'');
    const nm=document.createElement('button');
    nm.className='wie'; nm.type='button';
    nm.textContent=m.name; nm.style.color=nameColour(m.name);
    nm.title='Praat met '+m.name;
    nm.addEventListener('click',()=>setTalkTo(m.name));
    row.appendChild(nm);
    if(m.to){
      const to=document.createElement('span'); to.className='aan';
      to.textContent='→ '+m.to; row.appendChild(to);
    }
    const tx=document.createElement('span'); tx.className='tx';
    tx.textContent=censor(m.x);            // ook bij tonen, voor de zekerheid
    row.appendChild(tx);
    const ti=document.createElement('span'); ti.className='ti'; ti.textContent=ago(m.t);
    row.appendChild(ti);
    chatLog.appendChild(row);
  });
  if(atBottom) chatLog.scrollTop=chatLog.scrollHeight;
  // wie is er
  chatWho.textContent='';
  const seen=Object.create(null), list=[];
  PEERS.forEach(pe=>{
    const n=clean((pe.presence&&pe.presence.name)||'Speler',22);
    if(seen[n]) return; seen[n]=1;
    list.push({n:n,live:true,me:!!pe.self});
  });
  Object.keys(PLAYERS).forEach(id=>{
    const n=PLAYERS[id].name||'Speler';
    if(seen[n]) return; seen[n]=1;
    list.push({n:n,live:false,me:id===ME.id});
  });
  list.slice(0,24).forEach(o=>{
    const b=document.createElement('button');
    b.type='button'; b.className='speler'+(o.live?' live':'')+(o.me?' zelf':'');
    const dot=document.createElement('i'); b.appendChild(dot);
    const s=document.createElement('span'); s.textContent=o.n+(o.me?' (jij)':''); b.appendChild(s);
    if(!o.me) b.addEventListener('click',()=>setTalkTo(o.n));
    chatWho.appendChild(b);
  });
}
function setTalkTo(n){
  if(!n||n===ME.name) return;
  talkTo=n; chatTo.hidden=false; chatToName.textContent=n;
  try{ chatInput.focus(); }catch(e){}
}
function clearTalkTo(){ talkTo=null; chatTo.hidden=true; }
function say(text,quick){
  postMessage_(text,talkTo,quick);
  chatInput.value='';
  renderChat();
  chatLog.scrollTop=chatLog.scrollHeight;
}
QUICKS.forEach(qq=>{
  const b=document.createElement('button'); b.type='button'; b.textContent=qq;
  b.addEventListener('click',()=>say(qq,true));
  chatQuick.appendChild(b);
});
chatSend.addEventListener('click',()=>{ if(chatInput.value.trim()) say(chatInput.value,false); });
chatInput.addEventListener('keydown',e=>{
  e.stopPropagation();
  if(e.key==='Enter'&&chatInput.value.trim()){ say(chatInput.value,false); e.preventDefault(); }
});
chatToClear.addEventListener('click',clearTalkTo);

/* ---------------- naam ---------------- */
function applyName(){
  const n=clean(nameInput.value,22);
  if(n&&n!==ME.name){ ME.name=n; LS.set('hub.name',n); commit(); presenceUpdate(); }
  else if(!ME.name){ ME.name=defaultName(); LS.set('hub.name',ME.name); }
  nameInput.value=ME.name;
}
if(nameInput){
  nameInput.value=ME.name||'';
  nameInput.placeholder=defaultName();
  nameInput.addEventListener('change',applyName);
  nameInput.addEventListener('keydown',e=>{ e.stopPropagation(); if(e.key==='Enter') nameInput.blur(); });
}

/* ---------------- scores uit de spellen ---------------- */
addEventListener('message',ev=>{
  const d=ev&&ev.data;
  if(!d||d.hub!=='score') return;
  if(!GAMES.some(g=>g.id===d.game)) return;
  addRun(d.game,d.v);
});

/* ---------------- knoppen ---------------- */
document.getElementById('hofClose').addEventListener('click',closePanel);
document.getElementById('chatClose').addEventListener('click',closePanel);
GAMES.forEach(G=>{
  const b=document.createElement('button'); b.type='button'; b.dataset.g=G.id; b.textContent=G.name;
  b.addEventListener('click',()=>{ hofGame=G.id; renderHof(); });
  hofGames.appendChild(b);
});
hofGames.querySelector('button[data-g="all"]').addEventListener('click',()=>{ hofGame='all'; renderHof(); });

/* elke paar seconden bijwerken zolang een paneel openstaat */
setInterval(()=>{
  if(panel==='chat') renderChat();
  else if(panel==='hof') renderHof();
},4000);

// pas starten als het hele script is ingelezen (W8 staat erachter)
setTimeout(netInit,0);
