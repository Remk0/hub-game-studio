#!/usr/bin/env python3
"""Bouwt de hub met vier werelden + alle zes spellen in één speelbaar bestand."""
import base64, os, sys
HERE = os.path.dirname(os.path.abspath(__file__))     # .../src
ROOT = os.path.dirname(HERE)                          # de repo zelf
sys.path.insert(0, HERE)
import score_bridge
D = os.path.join(HERE, 'parts') + os.sep
def rd(n): return open(D+n, encoding='utf-8').read()
def out(*p): return os.path.join(ROOT, *p)

A   = rd('A_const_utils.js')      # constanten + tekenhulp
CR  = rd('_castle_raw.js')        # kasteel-onderdelen (uit de vorige hub)
W0  = rd('W0_shared.js')
W1  = rd('W1_castle_glue.js')
W2  = rd('W2_volcano.js')
W3  = rd('W3_ocean.js')
W4  = rd('W4_space.js')
W5  = rd('W5_register.js')
B   = rd('B_screens.js')          # schermen + previews
C   = rd('C_propprims.js')        # rekwisiet-primitieven
Dg  = rd('D_glow.js')             # vlamsprite
W6  = rd('W6_social.js')          # scorebord + chat (data)
W7  = rd('W7_panels.js')          # scorebord + chat (schermen)
W8  = rd('W8_firebase.js')        # eigen server (alleen in de online-versie)
E   = rd('E_tail.js')             # figuren, speler, interactie, HUD, frame

def sub(txt,a,b,n=1,name=''):
    assert a in txt, 'MIS ('+name+'): '+a[:70]
    return txt.replace(a,b,n)

# ---------- A: geen dubbele vloer-/scherm-constanten ----------
A = sub(A,"const OCX=800, OCY=54, OCR=44;","const OCX=800, OCY=54, OCR=44;",name='ocx')

# ---------- C: FLOOR_CANDLES weg (heet nu FLOOR_LAMPS, in W0) ----------
C = C.replace("const FLOOR_CANDLES=[];\n","")

W0 = sub(W0,"  TH.wall(q);","  TH.wall(q);\n"
          "  boardPanel(q,HOF_PX,'HALL OF FAME'); boardPanel(q,PW,'HALL OF FAME');\n"
          "  boardPanel(q,CHAT_PX,'CHATBORD');",name='bake')

# ---------- B: het scherm neemt de kleuren van de wereld over ----------
B = sub(B,"  c.fillStyle='#121a33'; rr(c,px0,py,pw,38,7); c.fill();\n"
          "  c.strokeStyle='rgba(215,225,255,0.55)'; c.lineWidth=2.2; rr(c,px0,py,pw,38,7); c.stroke();\n"
          "  skull(c,px0+23,py+18,10,'#f2f6ff','#121a33',true);\n"
          "  c.textAlign='left'; c.fillStyle='#f4f7ff';",
          "  c.fillStyle=TH.plaque; rr(c,px0,py,pw,38,7); c.fill();\n"
          "  c.strokeStyle=TH.plaqueEdge; c.lineWidth=2.2; rr(c,px0,py,pw,38,7); c.stroke();\n"
          "  skull(c,px0+23,py+18,10,TH.accent,TH.plaque,true);\n"
          "  c.textAlign='left'; c.fillStyle=TH.plaqueInk;",name='plaque')
B = sub(B,"  bodyG.addColorStop(0,'#aab4c8'); bodyG.addColorStop(0.5,'#8d97ad'); bodyG.addColorStop(1,'#6b7490');",
          "  bodyG.addColorStop(0,TH.cab[0]); bodyG.addColorStop(0.5,TH.cab[1]); bodyG.addColorStop(1,TH.cab[2]);",name='cab')
B = sub(B,"  c.strokeStyle='#5b6480'; c.lineWidth=2.6; rr(c,x,y,SCR_W,SCR_H,18); c.stroke();",
          "  c.strokeStyle=TH.cabEdge; c.lineWidth=2.6; rr(c,x,y,SCR_W,SCR_H,18); c.stroke();",name='cabedge')
B = sub(B,"  c.fillStyle='#4c5470';\n"
          "  c.fillRect(cx-90,y+SCR_H,18,fy-(y+SCR_H)+8);\n"
          "  c.fillRect(cx+72,y+SCR_H,18,fy-(y+SCR_H)+8);\n"
          "  c.fillStyle='#3a4160'; c.fillRect(cx-SCR_W/2+28,fy-2,SCR_W-56,14);",
          "  c.fillStyle=TH.cabLeg;\n"
          "  c.fillRect(cx-90,y+SCR_H,18,fy-(y+SCR_H)+8);\n"
          "  c.fillRect(cx+72,y+SCR_H,18,fy-(y+SCR_H)+8);\n"
          "  c.fillStyle=TH.cabFoot; c.fillRect(cx-SCR_W/2+28,fy-2,SCR_W-56,14);",name='legs')
B = sub(B,"  c.textAlign='center'; pixText(c,mid,gx+gw*0.56,gy+18,'#f5a83c',9);",
          "  c.textAlign='center'; pixText(c,mid,gx+gw*0.56,gy+18,TH.accent,9);",name='mid')


B = sub(B,"  c.fillStyle='#161c2e'; rr(c,gx-7,gy-7,gw+14,gh+14,8); c.fill();",
          "  c.fillStyle=TH.cabBezel; rr(c,gx-7,gy-7,gw+14,gh+14,8); c.fill();",name='bezel')
B = sub(B,"  c.strokeStyle='rgba(130,220,255,0.45)'; c.lineWidth=1.4; rr(c,gx,gy,gw,gh,5); c.stroke();",
          "  c.strokeStyle=TH.cabGlass; c.lineWidth=1.4; rr(c,gx,gy,gw,gh,5); c.stroke();",name='glass')
B = sub(B,"  c.fillStyle='#7b8399'; c.fillRect(x+17,cyy,SCR_W-34,24);\n"
          "  c.fillStyle='#5f6884'; c.fillRect(x+17,cyy,SCR_W-34,3);\n"
          "  c.fillStyle='#2b3245'; rr(c,x+30,cyy+5,44,14,3); c.fill();",
          "  c.fillStyle=TH.cabStrip; c.fillRect(x+17,cyy,SCR_W-34,24);\n"
          "  c.fillStyle=TH.cabStrip2; c.fillRect(x+17,cyy,SCR_W-34,3);\n"
          "  c.fillStyle=TH.cabBtn; rr(c,x+30,cyy+5,44,14,3); c.fill();",name='strip')
B = sub(B,"    c.fillStyle='#39405c'; rr(c,lx-9,cyy+4,18,16,3); c.fill();",
          "    c.fillStyle=TH.cabBtn; rr(c,lx-9,cyy+4,18,16,3); c.fill();",name='btn')
B = sub(B,"  c.fillStyle='rgba(60,68,90,0.8)';","  c.fillStyle=TH.cabScrew;",name='screw')

W1 = sub(W1,"  panoCrest(q,0); panoCrest(q,PW);\n","",name='crest')

# ---------- E: HUD, vignet en frame volgen de wereld ----------
E = sub(E,"""    c.strokeStyle=s.status==='live'
      ? 'rgba(120,235,160,'+(on?0.5+0.3*pulse:0.1)+')'
      : 'rgba(185,200,255,'+(on?0.34+0.24*pulse:0.05)+')';""",
          """    c.strokeStyle=s.status==='live'
      ? 'rgba('+TH.ringLive+','+(on?0.5+0.3*pulse:0.1)+')'
      : 'rgba(185,200,255,'+(on?0.34+0.24*pulse:0.05)+')';""",name='ring')
E = sub(E,"      gl.addColorStop(0,s.status==='live'?'rgba(110,230,150,0.18)':'rgba(170,185,255,0.15)');",
          "      gl.addColorStop(0,s.status==='live'?'rgba('+TH.ringLive+',0.18)':'rgba(170,185,255,0.15)');",name='ringgl')
E = sub(E,"    c.fillStyle=s.status==='live'?'#5fd98c':'rgba(185,195,235,0.55)';",
          "    c.fillStyle=s.status==='live'?TH.accent:'rgba(185,195,235,0.55)';",name='comp')
E = sub(E,"    c.strokeStyle=s.status==='live'?'rgba(120,235,160,0.6)':'rgba(190,190,240,0.3)';",
          "    c.strokeStyle=s.status==='live'?'rgba('+TH.ringLive+',0.6)':'rgba(190,190,240,0.3)';",name='prompt1')
E = sub(E,"    c.fillStyle=s.status==='live'?'#8ff0b4':'#d6d9f2';",
          "    c.fillStyle=s.status==='live'?TH.accent:'#d6d9f2';",name='prompt2')
E = sub(E,"  c.fillText('← → rondlopen · ↑ ↓ naar voren · ENTER of de groene knop: spelen',800,HH-12);",
          "  c.fillText(TH.hint,800,HH-12);",name='hint')
E = sub(E,"""const vignetteSprite=(function(){
  const cv2=document.createElement('canvas'); cv2.width=W; cv2.height=8;
  const k=cv2.getContext('2d');
  const vg=k.createLinearGradient(0,0,W,0);
  vg.addColorStop(0,'rgba(4,6,16,0.62)'); vg.addColorStop(0.11,'rgba(4,6,16,0)');
  vg.addColorStop(0.89,'rgba(4,6,16,0)'); vg.addColorStop(1,'rgba(4,6,16,0.62)');
  k.fillStyle=vg; k.fillRect(0,0,W,8);
  return cv2;
})();
function drawVignette(c){ c.drawImage(vignetteSprite,0,0,W,8,0,0,W,HH); }""",
"""let _vign=null;
function makeVignette(){                 // één keer per wereld, daarna uitrekken
  const cv2=document.createElement('canvas'); cv2.width=W; cv2.height=8;
  const k=cv2.getContext('2d');
  const vg=k.createLinearGradient(0,0,W,0);
  vg.addColorStop(0,TH.vign); vg.addColorStop(0.11,'rgba(0,0,0,0)');
  vg.addColorStop(0.89,'rgba(0,0,0,0)'); vg.addColorStop(1,TH.vign);
  k.fillStyle=vg; k.fillRect(0,0,W,8);
  _vign=cv2;
}
function drawVignette(c){ if(_vign) c.drawImage(_vign,0,0,W,8,0,0,W,HH); }""",name='vign')
E = sub(E,"""function frame(){
  T+=1/60;
  updatePlayer();
  g.setTransform(1,0,0,1,0,0);
  g.fillStyle='#05060f'; g.fillRect(0,0,cv.width,cv.height);
  g.setTransform(sc,0,0,sc,ox,oy);
  g.save(); g.beginPath(); g.rect(0,0,W,HH); g.clip();
  drawRoof(g);
  drawPano(g);
  drawBats(g);
  drawFloor(g);
  syncEnter();
  SCREENS.forEach(S=>drawScreen(g,S,T));
  drawProps(g);
  drawFire(g);""",
"""function frame(){
  if(playing||panel){ requestAnimationFrame(frame); return; }
  T+=1/60;
  updatePlayer();
  g.setTransform(1,0,0,1,0,0);
  g.fillStyle=TH.sky; g.fillRect(0,0,cv.width,cv.height);
  g.setTransform(sc,0,0,sc,ox,oy);
  g.save(); g.beginPath(); g.rect(0,0,W,HH); g.clip();
  TH.roof(g);
  drawPano(g);
  drawSocialBoards(g);
  TH.ambient(g);
  TH.floor(g);
  syncEnter();
  SCREENS.forEach(S=>drawScreen(g,S,T));
  TH.props(g);
  TH.fire(g);""",name='frame')
E = sub(E,"""bakePano();
if(document.fonts&&document.fonts.ready) document.fonts.ready.then(bakePano);
requestAnimationFrame(frame);""",
"""setTheme('castle',true);
if(document.fonts&&document.fonts.ready) document.fonts.ready.then(bakePano);
requestAnimationFrame(frame);""",name='boot')

# ---- toegang tot de spellen: alles in deze pagina, geen nieuw tabblad ----
E = sub(E,"""const enterEl=document.getElementById('enter'), enterNameEl=document.getElementById('enterName');
let enterFor=null;
function syncEnter(){
  const s=introGone?nearStation():null;
  if(s&&s.status==='live'){
    if(enterFor!==s.id){ enterFor=s.id; enterNameEl.textContent=s.name; enterEl.href=s.url; }
    enterEl.hidden=false;
  }else{ enterFor=null; enterEl.hidden=true; }
}
enterEl.addEventListener('click',dismissIntro);
function pressAction(){
  const s=nearStation();
  if(!s){ showToast('Loop naar een scherm om te spelen.'); return; }
  if(s.status==='live'){
    syncEnter();
    enterEl.click();   // een echte link-klik: window.open wordt geblokkeerd in de sandbox
  } else showToast('“'+s.name+'” is er nog niet — binnenkort!');
}""",
"""const enterEl=document.getElementById('enter'), enterNameEl=document.getElementById('enterName');
const enterActEl=document.getElementById('enterAct');
const playEl=document.getElementById('play'), frameEl=document.getElementById('frame');
const playNameEl=document.getElementById('playName'), backEl=document.getElementById('back');
const barEl=document.getElementById('themes');
let enterFor=null, playing=null;
function syncEnter(){
  const s=(introGone&&!playing&&!panel)?nearStation():null;
  if(s&&s.status==='live'){
    if(enterFor!==s.id){
      enterFor=s.id; enterNameEl.textContent=s.name;
      enterEl.dataset.kind=s.kind==='board'?s.id:'game';
      enterActEl.textContent=s.kind==='board'
        ? (s.id==='hof'?'bekijken \u2192':'openen \u2192') : 'spelen \u2192';
    }
    enterEl.hidden=false;
  }else{ enterFor=null; enterEl.hidden=true; }
}
function gameHTML(id){
  const el=document.getElementById('G-'+id); if(!el) return null;
  const bin=atob(el.textContent.replace(/\\s+/g,''));
  const buf=new Uint8Array(bin.length);
  for(let i=0;i<bin.length;i++) buf[i]=bin.charCodeAt(i);
  return new TextDecoder('utf-8').decode(buf);
}
function openGame(s){
  const html=gameHTML(s.id);
  if(!html){ showToast('“'+s.name+'” kon niet geladen worden.'); return; }
  for(const k in keys) keys[k]=false;
  playing=s.id;
  playNameEl.textContent=s.name;
  enterEl.hidden=true; barEl.hidden=true;
  frameEl.srcdoc=html;
  playEl.hidden=false;
  setTimeout(()=>{ try{ frameEl.contentWindow.focus(); }catch(e){} },80);
}
function closeGame(){
  playing=null;
  playEl.hidden=true; barEl.hidden=false;
  frameEl.srcdoc='';
  for(const k in keys) keys[k]=false;
  window.focus();
}
backEl.addEventListener('click',closeGame);
enterEl.addEventListener('click',()=>{
  dismissIntro();
  const s=nearStation();
  if(!s) return;
  if(s.kind==='board') openPanel(s.id);
  else if(s.status==='live') openGame(s);
});
/* wereldkiezer */
function syncThemeBar(){
  [].forEach.call(barEl.querySelectorAll('button'),b=>{
    b.classList.toggle('on', b.dataset.k===THEME_KEY);
  });
  barEl.style.setProperty('--acc',TH.accent);
}
THEME_ORDER.forEach((k,i)=>{
  const b=document.createElement('button');
  b.type='button'; b.dataset.k=k;
  b.innerHTML='<span class="g">'+THEMES[k].glyph+'</span><span class="n">'+THEMES[k].name+'</span>'
             +'<span class="k">'+(i+1)+'</span>';
  b.addEventListener('click',()=>{ dismissIntro(); if(!playing&&!panel){ setTheme(k); presenceUpdate(); } });
  barEl.appendChild(b);
});
function pressAction(){
  if(playing) return;
  const s=nearStation();
  if(!s){ showToast('Loop naar een scherm om te spelen.'); return; }
  if(s.status==='live') openGame(s);
  else showToast('“'+s.name+'” is er nog niet — binnenkort!');
}""",name='entry')
E = sub(E,"""addEventListener('keydown',e=>{
  keys[e.key]=true; dismissIntro();
  if(e.key==='Enter'||e.key===' '){ pressAction(); e.preventDefault(); }
  else if(e.key.indexOf('Arrow')===0) e.preventDefault();
});""",
"""addEventListener('keydown',e=>{
  if(playing){ if(e.key==='Escape'){ closeGame(); e.preventDefault(); } return; }
  if(panel){ if(e.key==='Escape'){ closePanel(); e.preventDefault(); } return; }
  keys[e.key]=true; dismissIntro();
  if(e.key>='1'&&e.key<='4'){ setTheme(THEME_ORDER[+e.key-1]); presenceUpdate(); e.preventDefault(); return; }
  if(e.key==='Enter'||e.key===' '){ pressAction(); e.preventDefault(); }
  else if(e.key.indexOf('Arrow')===0) e.preventDefault();
});""",name='keys')
E = sub(E,"""cv.addEventListener('pointerdown',e=>{
  dismissIntro();
  if(e.target!==cv) return;""",
"""cv.addEventListener('pointerdown',e=>{
  if(playing||panel) return;
  dismissIntro();
  if(e.target!==cv) return;""",name='ptr')

MARKUP = """<title>HUB Game Studio</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Work+Sans:wght@400;500;600;700;800&display=swap');
  *{box-sizing:border-box;}
  html,body{margin:0;padding:0;height:100%;background:#05060f;overflow:hidden;}
  body{font-family:'Work Sans',system-ui,sans-serif;position:fixed;inset:0;
    transition:background .5s ease;}
  #c{display:block;width:100%;height:100%;touch-action:none;}

  #themes{position:fixed;top:calc(10px + env(safe-area-inset-top,0px));right:12px;z-index:8;
    display:flex;gap:6px;padding:6px;border-radius:14px;
    background:rgba(8,10,20,0.62);backdrop-filter:blur(6px);
    border:1px solid rgba(190,205,255,0.16);box-shadow:0 10px 30px rgba(0,0,0,0.45);}
  #themes[hidden]{display:none !important;}
  #themes button{font-family:inherit;cursor:pointer;-webkit-appearance:none;appearance:none;
    display:flex;flex-direction:column;align-items:center;gap:1px;position:relative;
    background:transparent;border:1px solid transparent;border-radius:10px;
    padding:7px 11px 6px;color:#aeb6d4;transition:.18s;}
  #themes button .g{font-size:1.05rem;line-height:1.05;filter:saturate(.5) brightness(.85);transition:.18s;}
  #themes button .n{font-size:0.64rem;font-weight:700;letter-spacing:.06em;text-transform:uppercase;}
  #themes button .k{position:absolute;top:2px;right:4px;font-size:0.52rem;font-weight:700;opacity:.4;}
  #themes button:hover{color:#e6ebff;background:rgba(255,255,255,0.06);}
  #themes button:hover .g{filter:none;}
  #themes button.on{color:var(--acc,#f5a83c);border-color:var(--acc,#f5a83c);
    background:rgba(255,255,255,0.08);}
  #themes button.on .g{filter:none;}

  #toast{position:fixed;left:50%;bottom:5%;transform:translate(-50%,14px);
    background:#141a30;border:1px solid rgba(200,190,255,0.2);color:#dfe4f5;
    padding:11px 22px;border-radius:10px;font-size:0.9rem;font-weight:500;
    box-shadow:0 14px 34px rgba(0,0,0,0.6);opacity:0;pointer-events:none;
    transition:opacity .25s,transform .25s;z-index:9;max-width:86vw;text-align:center;}
  #toast.show{opacity:1;transform:translate(-50%,0);}

  #enter{position:fixed;left:50%;bottom:8.5%;transform:translate(-50%,0);z-index:7;
    display:flex;flex-direction:column;align-items:center;gap:1px;text-decoration:none;
    background:linear-gradient(180deg,#2f8a55,#186039);border:2px solid #7ff0ab;
    border-radius:14px;padding:9px 26px;font-family:inherit;
    -webkit-appearance:none;appearance:none;cursor:pointer;
    box-shadow:0 0 0 4px rgba(20,40,30,0.55),0 16px 36px rgba(0,0,0,0.6);
    animation:enterPulse 1.9s ease-in-out infinite;}
  #enter[hidden]{display:none !important;}
  #enter b{font-size:1.02rem;font-weight:800;color:#f3fff7;}
  #enter i{font-style:normal;font-size:0.68rem;font-weight:700;letter-spacing:.14em;
    text-transform:uppercase;color:#a8f5c6;}
  #enter[data-kind="hof"]{background:linear-gradient(180deg,#a3701f,#6b4510);border-color:#ffd37a;}
  #enter[data-kind="hof"] i{color:#ffe0a8;}
  #enter[data-kind="chat"]{background:linear-gradient(180deg,#2a6f9c,#16456a);border-color:#8fdcff;}
  #enter[data-kind="chat"] i{color:#b6e8ff;}
  #enter:hover{filter:brightness(1.12);}
  #enter:active{transform:translate(-50%,2px);}
  @keyframes enterPulse{
    0%,100%{box-shadow:0 0 0 4px rgba(20,40,30,0.55),0 16px 36px rgba(0,0,0,0.6);}
    50%{box-shadow:0 0 0 4px rgba(30,80,50,0.7),0 0 26px rgba(110,240,160,0.45),0 16px 36px rgba(0,0,0,0.6);}}
  @media (prefers-reduced-motion:reduce){#enter{animation:none;}}

  #play{position:fixed;inset:0;z-index:20;background:#05060f;display:flex;flex-direction:column;}
  #play[hidden]{display:none !important;}
  #play .bar{flex:0 0 auto;display:flex;align-items:center;gap:14px;padding:8px 14px;
    padding-top:calc(8px + env(safe-area-inset-top,0px));
    background:#0d1122;border-bottom:1px solid rgba(180,200,255,0.16);}
  #play .bar #playName{font-weight:800;color:#f5a83c;font-size:0.98rem;}
  #play .bar .tip{margin-left:auto;font-size:0.74rem;color:#7d85ab;}
  #back{font-family:inherit;font-size:0.86rem;font-weight:700;cursor:pointer;
    background:#1d2540;color:#dfe6fb;border:1px solid rgba(180,200,255,0.3);
    border-radius:9px;padding:8px 15px;-webkit-appearance:none;appearance:none;}
  #back:hover{background:#27314f;}
  #frame{flex:1 1 auto;width:100%;border:0;display:block;background:#04050a;}

  #intro{position:fixed;inset:0;z-index:30;display:flex;align-items:center;justify-content:center;
    background:rgba(4,5,14,0.74);backdrop-filter:blur(3px);transition:opacity .35s;padding:20px;}
  #intro.hide{opacity:0;pointer-events:none;}
  #intro .card{background:#11152b;border:1px solid rgba(210,200,255,0.16);border-radius:16px;
    padding:30px 28px;max-width:470px;text-align:center;box-shadow:0 24px 60px rgba(0,0,0,0.6);}
  #intro h2{margin:0 0 10px;font-size:1.5rem;font-weight:800;color:#f5a83c;}
  #intro p{margin:0;color:#d6d9f2;opacity:0.85;font-size:0.94rem;line-height:1.6;}
  #intro .worlds{display:flex;gap:8px;justify-content:center;margin-top:16px;flex-wrap:wrap;}
  #intro .worlds span{font-size:0.76rem;font-weight:700;letter-spacing:.05em;text-transform:uppercase;
    border:1px solid rgba(210,200,255,0.2);border-radius:8px;padding:6px 10px;color:#c3c9e8;}
  #intro .keys{margin-top:16px;font-size:0.82rem;color:#8b92bb;}
  #intro .keys b{color:#ffcf7a;background:rgba(255,154,68,0.1);border:1px solid rgba(255,154,68,0.3);
    border-radius:6px;padding:2px 7px;font-weight:600;}
  #intro .mee{margin-top:14px;font-size:0.8rem;color:#9aa2c8;}
  #intro .mee b{color:#d6dcf6;}

  #hof,#chat{position:fixed;inset:0;z-index:22;background:#080b16;display:flex;flex-direction:column;
    padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px);}
  #hof[hidden],#chat[hidden]{display:none !important;}
  #hof .kop,#chat .kop{flex:0 0 auto;display:flex;align-items:center;gap:14px;padding:10px 16px;
    background:#0d1122;border-bottom:1px solid rgba(180,200,255,0.16);flex-wrap:wrap;}
  #hof h3,#chat h3{margin:0;font-size:1.02rem;font-weight:800;color:#f5a83c;}
  #hofClose,#chatClose{font-family:inherit;font-size:0.86rem;font-weight:700;cursor:pointer;
    background:#1d2540;color:#dfe6fb;border:1px solid rgba(180,200,255,0.3);
    border-radius:9px;padding:8px 15px;-webkit-appearance:none;appearance:none;}
  #hofClose:hover,#chatClose:hover{background:#27314f;}
  #netBadge{margin-left:auto;font-size:0.72rem;font-weight:700;letter-spacing:.04em;
    border-radius:20px;padding:5px 12px;}
  #netBadge.on{color:#8ff0b4;background:rgba(60,190,120,0.12);border:1px solid rgba(110,240,160,0.4);}
  #netBadge.off{color:#9aa2c8;background:rgba(160,175,225,0.08);border:1px solid rgba(160,175,225,0.22);}

  .tabs,.chips{flex:0 0 auto;display:flex;gap:7px;padding:12px 16px 0;flex-wrap:wrap;}
  .chips{padding-top:9px;padding-bottom:4px;}
  .tabs button,.chips button{font-family:inherit;cursor:pointer;-webkit-appearance:none;appearance:none;
    border-radius:10px;border:1px solid rgba(180,200,255,0.2);background:rgba(255,255,255,0.04);
    color:#aeb6d4;padding:9px 15px;font-weight:700;font-size:0.84rem;transition:.15s;}
  .chips button{font-size:0.76rem;padding:7px 12px;border-radius:20px;}
  .tabs button:hover,.chips button:hover{color:#e6ebff;background:rgba(255,255,255,0.08);}
  .tabs button.on,.chips button.on{color:#0c1020;background:#f5a83c;border-color:#f5a83c;}

  .lijst{flex:1 1 auto;overflow-y:auto;padding:12px 16px 20px;}
  .lijst .leeg,.log .leeg{color:#8b92bb;font-size:0.9rem;line-height:1.6;max-width:44ch;}
  .lijst .rij{display:grid;grid-template-columns:34px 1fr auto auto 58px;gap:10px;align-items:center;
    padding:11px 12px;border-radius:10px;font-size:0.9rem;color:#dfe4f5;}
  .lijst .rij:nth-child(odd){background:rgba(255,255,255,0.03);}
  .lijst .rij.top .nr{color:#f5a83c;}
  .lijst .rij.jij{background:rgba(245,168,60,0.12);box-shadow:inset 0 0 0 1px rgba(245,168,60,0.35);}
  .lijst .nr{font-weight:800;color:#8b92bb;text-align:right;font-variant-numeric:tabular-nums;}
  .lijst .nm{font-weight:700;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
  .lijst .gm{font-size:0.78rem;color:#9aa2c8;}
  .lijst .sc{font-weight:800;color:#8ff0b4;font-variant-numeric:tabular-nums;}
  .lijst .wh{font-size:0.74rem;color:#7d85ab;text-align:right;}

  .chatwrap{flex:1 1 auto;display:flex;min-height:0;gap:0;}
  .log{flex:1 1 auto;overflow-y:auto;padding:14px 16px;display:flex;flex-direction:column;gap:9px;}
  .msg{display:flex;align-items:baseline;gap:8px;flex-wrap:wrap;font-size:0.92rem;line-height:1.45;}
  .msg .wie{font-family:inherit;font-weight:800;font-size:0.92rem;background:none;border:0;padding:0;
    cursor:pointer;text-decoration:none;}
  .msg .wie:hover{text-decoration:underline;}
  .msg .aan{font-size:0.78rem;font-weight:700;color:#7fd8ff;}
  .msg .tx{color:#dfe4f5;flex:1 1 200px;min-width:0;overflow-wrap:anywhere;}
  .msg .ti{font-size:0.7rem;color:#6d7499;}
  .msg.snel .tx{color:#bfe6cd;font-style:italic;}
  .msg.mij .tx{color:#ffe2b4;}
  .who{flex:0 0 172px;overflow-y:auto;border-left:1px solid rgba(180,200,255,0.14);
    padding:14px 10px;display:flex;flex-direction:column;gap:5px;}
  .who button{font-family:inherit;display:flex;align-items:center;gap:8px;cursor:pointer;
    background:none;border:1px solid transparent;border-radius:8px;padding:7px 9px;
    color:#aeb6d4;font-size:0.82rem;font-weight:600;text-align:left;}
  .who button:hover{background:rgba(255,255,255,0.06);color:#e6ebff;}
  .who button i{width:7px;height:7px;border-radius:50%;background:#4a5274;flex:0 0 auto;}
  .who button.live i{background:#6ee89a;box-shadow:0 0 8px rgba(110,232,154,0.8);}
  .who button.zelf{color:#ffcf7a;cursor:default;}

  .quick{flex:0 0 auto;display:flex;gap:6px;overflow-x:auto;padding:10px 16px;
    border-top:1px solid rgba(180,200,255,0.14);}
  .quick button{font-family:inherit;white-space:nowrap;cursor:pointer;-webkit-appearance:none;appearance:none;
    border:1px solid rgba(140,230,180,0.3);background:rgba(90,200,140,0.1);color:#bfe6cd;
    border-radius:20px;padding:8px 14px;font-size:0.8rem;font-weight:600;}
  .quick button:hover{background:rgba(90,200,140,0.2);color:#e8fff1;}

  .invoer{flex:0 0 auto;display:flex;align-items:center;gap:8px;padding:10px 16px;
    border-top:1px solid rgba(180,200,255,0.14);background:#0b0f1e;}
  #chatTo{font-size:0.76rem;color:#9aa2c8;background:rgba(127,216,255,0.1);
    border:1px solid rgba(127,216,255,0.3);border-radius:8px;padding:6px 8px;white-space:nowrap;}
  #chatTo b{color:#7fd8ff;}
  #chatToClear{font-family:inherit;background:none;border:0;color:#9aa2c8;cursor:pointer;
    font-size:0.95rem;padding:0 2px;margin-left:4px;}
  #chatInput,#nameInput{font-family:inherit;font-size:0.92rem;color:#eef2ff;
    background:#151b2f;border:1px solid rgba(180,200,255,0.24);border-radius:10px;padding:11px 13px;}
  #chatInput{flex:1 1 auto;min-width:0;}
  #chatInput:focus,#nameInput:focus{outline:2px solid rgba(245,168,60,0.6);outline-offset:1px;}
  #chatSend{font-family:inherit;font-weight:800;font-size:0.88rem;cursor:pointer;
    -webkit-appearance:none;appearance:none;border:2px solid #7ff0ab;border-radius:10px;
    background:linear-gradient(180deg,#2f8a55,#186039);color:#f3fff7;padding:10px 20px;}
  #chatSend:hover{filter:brightness(1.12);}
  .naam{margin-left:auto;font-size:0.76rem;color:#9aa2c8;display:flex;align-items:center;gap:8px;}
  #nameInput{padding:7px 10px;font-size:0.84rem;width:150px;}
  .note{flex:0 0 auto;margin:0;padding:8px 16px 12px;font-size:0.72rem;color:#6d7499;}
  @media (max-width:640px){
    .who{flex-basis:118px;}
    .lijst .rij{grid-template-columns:28px 1fr auto;row-gap:2px;}
    .lijst .gm,.lijst .wh{display:none;}
    .naam{width:100%;margin-left:0;}
  }
  @media (max-width:640px){
    #play .bar .tip{display:none;}
    #themes button .n{display:none;}
    #themes button{padding:9px 10px;}
  }
</style>

<canvas id="c"></canvas>
<div id="themes"></div>
<div id="toast"></div>
<button id="enter" type="button" hidden><b id="enterName"></b><i id="enterAct">spelen &rarr;</i></button>
<div id="play" hidden>
  <div class="bar">
    <button id="back" type="button">&larr; Terug naar de HUB</button>
    <span id="playName"></span>
    <span class="tip">Esc in het spel werkt niet altijd &mdash; gebruik deze knop</span>
  </div>
  <iframe id="frame" title="spel" allow="autoplay"></iframe>
</div>
<div id="hof" hidden>
  <div class="kop">
    <button id="hofClose" type="button">&larr; Terug naar de HUB</button>
    <h3>Scorebord</h3>
    <span id="netBadge" class="off"></span>
  </div>
  <div id="hofTabs" class="tabs">
    <button type="button" data-p="day" class="on">Vandaag</button>
    <button type="button" data-p="week">Deze week</button>
    <button type="button" data-p="month">Deze maand</button>
    <button type="button" data-p="all">Aller tijden</button>
  </div>
  <div id="hofGames" class="chips"><button type="button" data-g="all" class="on">Alle spellen</button></div>
  <div id="hofBody" class="lijst"></div>
</div>

<div id="chat" hidden>
  <div class="kop">
    <button id="chatClose" type="button">&larr; Terug naar de HUB</button>
    <h3>Chatruimte</h3>
    <label class="naam">Jouw naam <input id="nameInput" type="text" maxlength="22" autocomplete="off"></label>
  </div>
  <div class="chatwrap">
    <div id="chatLog" class="log"></div>
    <div id="chatWho" class="who"></div>
  </div>
  <div id="chatQuick" class="quick"></div>
  <div class="invoer">
    <span id="chatTo" hidden>aan <b id="chatToName"></b><button id="chatToClear" type="button">&times;</button></span>
    <input id="chatInput" type="text" maxlength="160" placeholder="Typ een bericht\u2026" autocomplete="off">
    <button id="chatSend" type="button">Stuur</button>
  </div>
  <p class="note">Alle gesprekken zijn openbaar \u2014 iedereen in de hub leest mee op het chatbord.</p>
</div>

<div id="intro">
  <div class="card">
    <h2>Welkom in de HUB</h2>
    <p>Een rondeel met zes speelbare schermen. Loop naar de rand van het beeld en de zaal
       draait met je mee. Dezelfde zaal bestaat in vier werelden &mdash; wissel rechtsboven
       of met de cijfertoetsen.</p>
    <div class="worlds"><span>&#127984; Kasteel</span><span>&#127755; Vulkaan</span><span>&#127754; Diepzee</span><span>&#128640; Ruimte</span></div>
    <div class="keys"><b>&larr; &rarr;</b> rondlopen &nbsp;&middot;&nbsp; <b>&uarr; &darr;</b> naar voren / achter
      &nbsp;&middot;&nbsp; <b>Enter</b> spelen &nbsp;&middot;&nbsp; <b>1-4</b> wereld</div>
    <p class="mee">Tegenover de poort hangt het <b>scorebord</b>, in de wand het <b>chatbord</b>.</p>
  </div>
</div>
"""

SCRIPT = ("<script>\n" + A + "\n" + W0 + "\n" + CR + "\n" + W1 + "\n"
          + W2 + "\n" + W3 + "\n" + W4 + "\n"
          + C + "\n" + Dg + "\n" + W5 + "\n" + B + "\n" + W6 + "\n"
          + E + "\n" + W7 + "\n</script>\n")

page = MARKUP + "\n" + SCRIPT
open(out('dist','hub_worlds.html'),'w',encoding='utf-8').write(page)
print('dist/hub_worlds.html            %.0f KB' % (len(page.encode('utf-8'))/1024))

# ---------- en dan de zes spellen erin bakken ----------
GAMES=[('toren','Torenklim',   os.path.join(HERE,'games','torenklim.html')),
       ('nest', 'Spinnennest', os.path.join(HERE,'games','spidernest.html')),
       ('spook','Spookhuis',   os.path.join(HERE,'games','spook.html')),
       ('oche', 'Oche Arena',  os.path.join(HERE,'games','oche.html')),
       ('reus', 'De Reus',     os.path.join(HERE,'games','giant.html')),
       ('hal',  'De Hal',      os.path.join(HERE,'games','monster.html'))]
blobs=[]
for gid,name,path in GAMES:
    content=open(path,encoding='utf-8').read()
    content,hooks=score_bridge.wire(gid,content)
    print('   score-hook %-12s %d' % (name,hooks))
    doc=('<!doctype html><html lang="nl"><head><meta charset="utf-8">'
         '<meta name="viewport" content="width=device-width,initial-scale=1,user-scalable=no">'
         '</head><body style="margin:0">\n'+content.strip()+'\n</body></html>')
    b64=base64.b64encode(doc.encode('utf-8')).decode('ascii')
    blobs.append('<script type="text/plain" id="G-%s" data-name="%s">\n%s\n</script>'
                 % (gid,name,'\n'.join(b64[i:i+120] for i in range(0,len(b64),120))))
outf=('<!doctype html>\n<html lang="nl">\n<head>\n<meta charset="utf-8">\n'
     '<meta name="viewport" content="width=device-width,initial-scale=1,user-scalable=no">\n'
     '</head>\n<body>\n'+page.strip()+'\n\n'
     '<!-- de zes spellen, elk als losse pagina in deze ene file -->\n'
     +'\n'.join(blobs)+'\n</body>\n</html>\n')
open(out('dist','HUB_Vier_Werelden.html'),'w',encoding='utf-8').write(outf)
print('dist/HUB_Vier_Werelden.html   %.0f KB' % (len(outf.encode('utf-8'))/1024))

# ---------- versie voor publicatie: zonder buitenste documenttags ----------
art = ('<title>HUB Game Studio</title>\n'
       '<style>:root{padding:0 !important;color-scheme:dark}\n'
       'html,body{margin:0;padding:0;height:100%;max-height:100%;overflow:hidden}</style>\n'
       + page.strip().split('<title>HUB Game Studio</title>',1)[1].strip() + '\n\n'
       + '\n'.join(blobs) + '\n')
open(out('dist','hub_artifact.html'),'w',encoding='utf-8').write(art)
print('dist/hub_artifact.html          %.0f KB' % (len(art.encode('utf-8'))/1024))

# ---------- versie voor een eigen openbare server ----------
online = page.replace("\n</script>\n", "\n" + W8 + "\n</script>\n", 1)
assert W8[:40] in online, 'firebase-deel niet ingevoegd'
out_on = ('<!doctype html>\n<html lang="nl">\n<head>\n<meta charset="utf-8">\n'
          '<meta name="viewport" content="width=device-width,initial-scale=1,user-scalable=no">\n'
          '<title>HUB Game Studio</title>\n'
          '<script src="firebase-config.js"></script>\n</head>\n<body>\n'
          + online.strip() + '\n\n'
          + '\n'.join(blobs) + '\n</body>\n</html>\n')
open(out('index.html'),'w',encoding='utf-8').write(out_on)
print('index.html (online)           %.0f KB' % (len(out_on.encode('utf-8'))/1024))
