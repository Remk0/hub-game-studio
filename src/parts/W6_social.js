
/* =====================================================================
   SOCIAAL — scorebord en chat
   Twee plekken in de zaal: het scorebord tegenover de poort (px 0) en
   het chatbord in de wand (px 2420). Beide ook als volledig paneel.
===================================================================== */
const HOF_PX=0, CHAT_PX=2420;
const BW=236, BH=188, BY=286;              // afmetingen van een wandbord

STATIONS.push({id:'hof', name:'Scorebord', kind:'board', px:HOF_PX,  y:702, rx:158, ry:48, status:'live'});
STATIONS.push({id:'chat',name:'Chatruimte',kind:'board', px:CHAT_PX, y:702, rx:158, ry:48, status:'live'});

/* ---------------- opslag op dit apparaat ---------------- */
const LS={
  get(k,d){ try{ const v=localStorage.getItem(k); return v==null?d:v; }catch(e){ return d; } },
  set(k,v){ try{ localStorage.setItem(k,v); }catch(e){} }
};
function uid(){ return 'p'+Math.random().toString(36).slice(2,10)+Date.now().toString(36).slice(-4); }
const ME={ id:LS.get('hub.id',''), name:LS.get('hub.name','') };
if(!ME.id){ ME.id=uid(); LS.set('hub.id',ME.id); }

/* ---------------- woordfilter (NL + EN) ---------------- */
const BADWORDS=[
  // Nederlands
  'kut','kanker','tering','tyfus','pleuris','klootzak','lul','lullo','eikel','sukkel',
  'hoer','slet','mongool','debiel','idioot','achterlijk','godverdomme','godver','verdomme',
  'kolere','flikker','homo','neuken','neuk','kutzooi','rotzak','stommerd','dombo','stomkop',
  'teringlijer','kankerlijer','oetlul','zakkenwasser','schijt','stront','poep',
  // Engels
  'fuck','fucking','fucker','shit','bullshit','bitch','cunt','asshole','arsehole','ass',
  'dick','cock','piss','bastard','damn','goddamn','wanker','twat','prick','slut','whore',
  'retard','retarded','moron','idiot','stupid','dumbass','crap','bollocks','bugger','douche',
  'nigga','nigger','fag','faggot'
];
const FUNWORDS=[
  'pannenkoek','stroopwafel','tuinkabouter','bloemkool','wasbeer','hagelslag','knakworst',
  'pindakaas','fietsbel','kaasschaaf','klomp','zeepbel','tosti','banaan','snoeppot',
  'waterpistool','drop','kabouterhoed','rolschaats','flipperkast','poffertje','zeeschildpad',
  'toeter','wiebelpudding','sokkenmand','kruimeldief','muizenval','regenlaars','fluitketel',
  'kwispelstaart','beschuitje','eendenbek','sneeuwbal','kroepoek','pluizenbol'
];
const LEET={'0':'o','1':'i','3':'e','4':'a','5':'s','7':'t','@':'a','$':'s','!':'i','+':'t'};
/* woorden die ook binnenín een woord tellen ('kankerhard', 'fucking') —
   alleen lange, ondubbelzinnige stammen, zodat 'klasse' en 'homogeen' heel blijven */
const STRONG=['kanker','tering','tyfus','pleuris','klootzak','godverdomme','verdomme',
  'kolere','flikker','neuken','teringlijer','kankerlijer','oetlul','zakkenwasser','kutzooi',
  'fuck','shit','bitch','cunt','asshole','arsehole','bastard','goddamn','wanker','bollocks',
  'motherfuck','nigger','nigga','faggot','retard','whore','douchebag'];
function stripLeet(s){
  return s.toLowerCase().replace(/[013457@$!+]/g,ch=>LEET[ch]||ch).replace(/[^a-z]/g,'');
}
function normWord(w){ return stripLeet(w); }
function squashed(s){ return s.replace(/(.)\1+/g,'$1'); }   // 'shiiiit' -> 'shit'
const BADSET=(function(){
  const m=Object.create(null);
  BADWORDS.forEach(w=>{ const n=stripLeet(w); m[n]=1; m[squashed(n)]=1; });
  return m;
})();
function funFor(seed){
  let h=0; for(let i=0;i<seed.length;i++) h=(h*31+seed.charCodeAt(i))>>>0;
  return FUNWORDS[h%FUNWORDS.length];
}
function isBad(tok){
  const n=stripLeet(tok);
  if(!n) return false;
  const q=squashed(n);
  if(BADSET[n]||BADSET[q]) return true;
  for(let i=0;i<STRONG.length;i++){
    if(n.indexOf(STRONG[i])>=0||q.indexOf(STRONG[i])>=0) return true;
  }
  return false;
}
function joinSpelled(s){          // 'b i t c h' en 'k-u-t' worden weer één woord
  return s.replace(/(^|[^A-Za-z])((?:[A-Za-z][\s._\-*]+){2,}[A-Za-z])(?![A-Za-z])/g,
    (m,pre,run)=>pre+run.replace(/[\s._\-*]+/g,''));
}
function censorTokens(s){
  return s.replace(/\S+/g,tok=>{
    if(!isBad(tok)) return tok;
    const f=funFor(stripLeet(tok));
    return /^[A-Z][^a-z]*$/.test(tok) ? f.toUpperCase() : f;
  });
}
function censor(text){
  if(!text) return '';
  const raw=String(text);
  const joined=joinSpelled(raw);
  const jc=censorTokens(joined);
  // alleen als iemand het woord uit elkaar trok plakken we het aan elkaar
  if(joined!==raw && jc!==joined) return jc;
  return censorTokens(raw);
}
function clean(text,max){
  let s=String(text||'').replace(/\s+/g,' ').trim().slice(0,max||160);
  return censor(s);
}

/* ---------------- gedeelde of lokale opslag ---------------- */
const MAXMSG=24, MAXRUN=120;
let DB=null, ROOM=null, ONLINE=false;
let PLAYERS=Object.create(null);            // id -> {name,msgs,runs,t}
let PEERS=[];                               // wie er nu rondloopt
let MINE={name:ME.name,t:Date.now(),msgs:[],runs:[]};
let chatDirty=true, boardDirty=true, netTimer=null;

try{ const raw=LS.get('hub.mine',''); if(raw){ const o=JSON.parse(raw);
  MINE.msgs=o.msgs||[]; MINE.runs=o.runs||[]; } }catch(e){}

function saveLocal(){
  MINE.name=ME.name; MINE.t=Date.now();
  LS.set('hub.mine',JSON.stringify({msgs:MINE.msgs.slice(-MAXMSG),runs:MINE.runs.slice(-MAXRUN)}));
  PLAYERS[ME.id]=MINE;
  chatDirty=boardDirty=true;
}
function pushNet(){                          // één schrijfactie per rustmoment
  if(!DB) return;
  clearTimeout(netTimer);
  netTimer=setTimeout(()=>{
    DB.doc('players/'+ME.id).set({
      name:ME.name||'Speler', t:Date.now(),
      msgs:MINE.msgs.slice(-MAXMSG), runs:MINE.runs.slice(-MAXRUN)
    }).catch(()=>{});
  },900);
}
function commit(){ saveLocal(); pushNet(); }

let NETLABEL='';
async function netInit(){
  try{                                        // eigen server (Firebase), als die er is
    if(typeof onlineDB==='function'){
      const r=await onlineDB();
      if(r&&r.db){ DB=r.db; ROOM=r.room||null; }
    }
  }catch(e){ DB=null; }
  try{                                        // anders de gedeelde opslag van Claude
    if(!DB&&window.claude&&typeof claude.use==='function'){
      DB=await claude.use('db');
      ROOM=await claude.use('room');
    }
  }catch(e){ DB=null; ROOM=null; }
  if(DB){
    ONLINE=true;
    try{
      DB.collection('players').orderBy('t','desc').limit(200).onSnapshot(snap=>{
        const next=Object.create(null);
        snap.docs.forEach(d=>{
          const v=d.data()||{};
          next[d.id]={ name:clean(v.name,22)||'Speler', t:+v.t||0,
                       msgs:Array.isArray(v.msgs)?v.msgs:[], runs:Array.isArray(v.runs)?v.runs:[] };
        });
        next[ME.id]=MINE;                    // eigen tekst meteen zichtbaar
        PLAYERS=next; chatDirty=boardDirty=true;
      },()=>{ ONLINE=false; });
    }catch(e){ ONLINE=false; }
  }
  if(ROOM){
    try{
      ROOM.presence({name:ME.name||'Speler',world:THEME_KEY});
      ROOM.onPeers(ev=>{ PEERS=(ev&&ev.peers)?ev.peers:[]; chatDirty=true; });
    }catch(e){}
  }
  if(!ONLINE) startBots();
  syncNetBadge();
}
function presenceUpdate(){
  if(typeof presenceUpdateOnline==='function') presenceUpdateOnline();
  if(!ROOM) return;
  try{ ROOM.presence({name:ME.name||'Speler',world:THEME_KEY}); }catch(e){}
}

/* ---------------- gezelschap als je alleen bent ---------------- */
const BOTNAMES=['Veld','Bram','Maas','Tuk','Nova','Pim'];
const BOTLINES=['Wie verslaat mijn score?','Goed gedaan!','Hoi, welkom!','Ik daag je uit!',
  'Bedankt!','Even pauze','Wie gaat er mee?','Dat was op het nippertje','Nog één potje',
  'Kijk op het scorebord','Ik pak de vulkaan','Zie je bij de darts'];
function startBots(){
  BOTNAMES.forEach((n,i)=>{
    const id='bot'+i;
    PLAYERS[id]={name:n,t:Date.now()-i*1000,msgs:[],runs:[]};
    // een paar eerdere scores, zodat het bord niet leeg staat
    const now=Date.now();
    for(let k=0;k<7;k++){
      PLAYERS[id].runs.push({
        g:GAMES[(i+k)%GAMES.length].id,
        v:Math.round(40+((i*37+k*53)%160)),
        t:now-((k*k*7+i*3)*36e5)
      });
    }
  });
  const opener=[[0,'Hoi, welkom!'],[1,'Wie verslaat mijn score?'],[3,'Goed bezig!']];
  opener.forEach(([i,tx],k)=>{
    const pl=PLAYERS['bot'+i]; if(!pl) return;
    pl.msgs.push({i:uid(),x:tx,t:Date.now()-(3-k)*42e4,q:1});
  });
  chatDirty=true;
  setInterval(()=>{
    if(Math.random()<0.55) return;
    const id='bot'+((Math.random()*BOTNAMES.length)|0);
    const pl=PLAYERS[id]; if(!pl) return;
    pl.msgs.push({i:uid(),x:BOTLINES[(Math.random()*BOTLINES.length)|0],t:Date.now(),q:1});
    if(pl.msgs.length>MAXMSG) pl.msgs.shift();
    pl.t=Date.now(); chatDirty=true;
  },14000);
}

/* ---------------- berichten ---------------- */
let lastSay=0, sayCount=0, sayWindow=0;
function postMessage_(text,to,isQuick){
  const x=clean(text,160);
  if(!x) return;
  const now=Date.now();
  if(now-lastSay<1200){ showToast('Rustig aan — even wachten.'); return; }
  if(now-sayWindow>60000){ sayWindow=now; sayCount=0; }
  if(sayCount>=15){ showToast('Je hebt veel achter elkaar gezegd. Probeer het zo weer.'); return; }
  const prev=MINE.msgs[MINE.msgs.length-1];
  if(prev&&prev.x===x&&now-prev.t<15000){ showToast('Dat zei je net al.'); return; }
  lastSay=now; sayCount++;
  if(!ME.name){ ME.name=defaultName(); LS.set('hub.name',ME.name); }
  MINE.msgs.push({i:uid(),x:x,t:Date.now(),to:to||null,q:isQuick?1:0});
  if(MINE.msgs.length>MAXMSG) MINE.msgs.shift();
  commit();
}
function defaultName(){ return 'Speler'+(100+((Math.random()*899)|0)); }
function feed(limit){
  const out=[];
  for(const id in PLAYERS){
    const pl=PLAYERS[id];
    (pl.msgs||[]).forEach(m=>out.push({id:id,name:pl.name||'Speler',x:m.x,t:+m.t||0,to:m.to||null,q:m.q}));
  }
  out.sort((a,b)=>a.t-b.t);
  return limit?out.slice(-limit):out;
}

/* ---------------- scores ---------------- */
function addRun(gameId,v){
  if(!(v>0)) return;
  if(!ME.name){ ME.name=defaultName(); LS.set('hub.name',ME.name); }
  MINE.runs.push({g:gameId,v:Math.round(v),t:Date.now()});
  if(MINE.runs.length>MAXRUN) MINE.runs.shift();
  commit();
  const G=GAMES.find(g=>g.id===gameId);
  showToast('Score genoteerd: '+(G?G.name:gameId)+' — '+Math.round(v));
}
function periodStart(k){
  const d=new Date();
  if(k==='day'){ d.setHours(0,0,0,0); return +d; }
  if(k==='week'){ const wd=(d.getDay()+6)%7; d.setHours(0,0,0,0); return +d-wd*864e5; }
  if(k==='month'){ return +new Date(d.getFullYear(),d.getMonth(),1); }
  return 0;
}
function ranking(gameId,period){
  const from=periodStart(period), best=Object.create(null);
  for(const id in PLAYERS){
    const pl=PLAYERS[id];
    (pl.runs||[]).forEach(r=>{
      if(r.t<from) return;
      if(gameId!=='all' && r.g!==gameId) return;
      const key=gameId==='all'?(id+'|'+r.g):id;
      const cur=best[key];
      if(!cur||r.v>cur.v) best[key]={name:pl.name||'Speler',id:id,g:r.g,v:+r.v||0,t:r.t};
    });
  }
  return Object.keys(best).map(k=>best[k]).sort((a,b)=>b.v-a.v||a.t-b.t);
}
function unitFor(gid){
  return {toren:'pt',nest:'pt',spook:'schrik',oche:'pt',reus:'m',hal:'s'}[gid]||'pt';
}
function ago(t){
  const s=(Date.now()-t)/1000;
  if(s<90) return 'net';
  if(s<5400) return Math.round(s/60)+' min';
  if(s<172800) return Math.round(s/3600)+' uur';
  return Math.round(s/86400)+' dg';
}

/* ---------------- de twee borden in de zaal ---------------- */
function boardPanel(q,px,title){
  const x=px-BW/2, y=BY;
  q.save();
  // nis erachter
  q.fillStyle=TH.boardBack;
  q.beginPath();
  q.moveTo(x-26,FLOOR_Y-6); q.lineTo(x-26,y-44);
  q.quadraticCurveTo(x-26,y-78,px,y-78);
  q.quadraticCurveTo(x+BW+26,y-78,x+BW+26,y-44);
  q.lineTo(x+BW+26,FLOOR_Y-6); q.closePath(); q.fill();
  q.strokeStyle=TH.boardEdge; q.lineWidth=11; q.stroke();
  q.save(); q.globalCompositeOperation='lighter';
  pool(q,px,y+BH*0.4,200,TH.boardGlow);
  q.restore();
  // het bord zelf
  q.fillStyle=TH.boardFrame; rr(q,x-12,y-34,BW+24,BH+50,12); q.fill();
  q.strokeStyle=TH.boardEdge; q.lineWidth=4; rr(q,x-12,y-34,BW+24,BH+50,12); q.stroke();
  q.fillStyle=TH.boardInk2; rr(q,x,y,BW,BH,7); q.fill();
  q.strokeStyle=TH.boardEdge; q.lineWidth=2; rr(q,x,y,BW,BH,7); q.stroke();
  q.textAlign='center'; q.fillStyle=TH.accent;
  q.font='800 16px "Work Sans",system-ui,sans-serif'; q.letterSpacing='1.4px';
  q.fillText(title,px,y-12); q.letterSpacing='0px';
  // pootjes
  q.fillStyle=TH.boardEdge;
  q.fillRect(x+20,y+BH+16,14,FLOOR_Y-(y+BH+16)-4);
  q.fillRect(x+BW-34,y+BH+16,14,FLOOR_Y-(y+BH+16)-4);
  q.restore();
}
function boardText(c,px,rows,empty){
  const cx=P(px); if(!vis(cx,240)) return;
  const sh=bowSlope(cx), x=cx-BW/2, y=BY+bow(cx);
  c.save();
  c.translate(cx,y+BH/2); c.transform(1,sh,0,1,0,0); c.translate(-cx,-(y+BH/2));
  c.save(); c.beginPath(); c.rect(x+6,y+6,BW-12,BH-12); c.clip();
  if(!rows.length){
    c.textAlign='center'; c.fillStyle='rgba(210,220,245,0.4)';
    c.font='500 13px "Work Sans",system-ui,sans-serif';
    c.fillText(empty,cx,y+BH/2);
  } else {
    rows.forEach((r,i)=>{
      const ry=y+24+i*28;
      if(ry>y+BH-8) return;
      c.textAlign='left';
      c.fillStyle=r.hi?TH.accent:TH.boardInk;
      c.font=(r.hi?'700 ':'600 ')+'13px "Work Sans",system-ui,sans-serif';
      c.fillText(r.a,x+12,ry);
      if(r.b!=null){
        c.textAlign='right'; c.fillStyle=TH.accent;
        c.font='700 13px "Work Sans",system-ui,sans-serif';
        c.fillText(r.b,x+BW-12,ry);
      }
      if(r.c){
        c.textAlign='left'; c.fillStyle='rgba(200,212,240,0.55)';
        c.font='500 11.5px "Work Sans",system-ui,sans-serif';
        c.fillText(r.c,x+12,ry+14);
      }
    });
  }
  c.restore(); c.restore();
}
let _hofRows=[], _chatRows=[], _rowsAt=0;
function refreshBoardRows(){
  if(!boardDirty&&!chatDirty&&T*1000-_rowsAt<800) return;
  _rowsAt=T*1000;
  if(boardDirty){
    boardDirty=false;
    _hofRows=ranking('all','all').slice(0,5).map((r,i)=>{
      const G=GAMES.find(g=>g.id===r.g);
      return {a:(i+1)+'. '+r.name, b:r.v+' '+unitFor(r.g), c:G?G.name:'', hi:r.id===ME.id};
    });
  }
  if(chatDirty){
    chatDirty=false;
    _chatRows=feed(4).map(m=>({
      a:m.name+(m.to?' → '+m.to:''), b:null, c:m.x, hi:m.id===ME.id
    }));
  }
}
function drawSocialBoards(c){
  refreshBoardRows();
  boardText(c,HOF_PX,_hofRows,'nog geen scores');
  boardText(c,CHAT_PX,_chatRows,'nog geen berichten');
}
