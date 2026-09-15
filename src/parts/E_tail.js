function figure(c,x,y,k,walk,dir,pose,rim){
  const s=Math.sin(walk)*7;
  c.save();
  c.fillStyle='rgba(0,0,0,0.42)';
  c.beginPath(); c.ellipse(x,y+2,18*k,5.4*k,0,0,6.3); c.fill();
  c.translate(x,y); c.scale(dir*k,k);
  const col='#0b0e1a';
  c.strokeStyle=col; c.fillStyle=col; c.lineCap='round';
  if(pose==='fight'){
    c.lineWidth=8; c.beginPath();
    c.moveTo(-2,-27); c.lineTo(-15,0); c.moveTo(2,-27); c.lineTo(14,0); c.stroke();
    c.lineWidth=17; c.beginPath(); c.moveTo(0,-28); c.lineTo(2,-50); c.stroke();
    c.lineWidth=7; c.beginPath();
    c.moveTo(0,-47); c.lineTo(-17,-38); c.moveTo(2,-47); c.lineTo(19,-52); c.stroke();
  } else if(pose==='run'){
    c.lineWidth=8; c.beginPath();
    c.moveTo(-2,-27); c.lineTo(-18,-6); c.moveTo(2,-27); c.lineTo(15,-2); c.stroke();
    c.lineWidth=17; c.beginPath(); c.moveTo(-1,-28); c.lineTo(3,-50); c.stroke();
    c.lineWidth=7; c.beginPath();
    c.moveTo(1,-47); c.lineTo(-14,-52); c.moveTo(3,-47); c.lineTo(18,-40); c.stroke();
  } else {
    c.lineWidth=8; c.beginPath();
    c.moveTo(-1.5,-27); c.lineTo(-2.5+s*0.55,0);
    c.moveTo(1.5,-27); c.lineTo(2.5-s*0.55,0); c.stroke();
    c.lineWidth=17; c.beginPath(); c.moveTo(0,-28); c.lineTo(0,-50); c.stroke();
    c.lineWidth=7; c.beginPath();
    c.moveTo(-1,-47); c.lineTo(-9-s*0.42,-30);
    c.moveTo(1,-47); c.lineTo(9+s*0.42,-30); c.stroke();
  }
  c.beginPath(); c.arc(pose==='run'?4:0,-60,11,0,6.3); c.fill();
  if(rim){ c.strokeStyle=rim; c.lineWidth=2; c.beginPath(); c.arc(0,-60,11,0,6.3); c.stroke(); }
  c.restore();
}
function hooded(c,x,y,k){
  c.save();
  c.fillStyle='rgba(0,0,0,0.4)'; c.beginPath(); c.ellipse(x,y+2,22*k,6*k,0,0,6.3); c.fill();
  c.translate(x,y); c.scale(k,k);
  c.fillStyle='#0e1120';
  c.beginPath(); c.moveTo(0,-86); c.quadraticCurveTo(30,-56,27,0); c.lineTo(-27,0);
  c.quadraticCurveTo(-30,-56,0,-86); c.fill();
  c.beginPath(); c.moveTo(0,-96); c.quadraticCurveTo(19,-80,17,-62);
  c.quadraticCurveTo(0,-54,-17,-62); c.quadraticCurveTo(-19,-80,0,-96); c.fill();
  c.fillStyle='#2a1c12'; c.fillRect(22,-96,5,96);
  c.restore();
}
const NPCS=[
  {px:180,y:700,dir:1,ph:0.2},{px:380,y:678,dir:-1,ph:1.1},{px:560,y:730,dir:1,ph:2.3,pose:'fight'},
  {px:720,y:726,dir:-1,ph:2.6,pose:'fight'},{px:1180,y:690,dir:1,ph:2.9},{px:1400,y:672,dir:-1,ph:0.6},
  {px:1640,y:790,dir:1,ph:0.4,jump:1},{px:1900,y:700,dir:-1,ph:3.1},{px:2100,y:684,dir:1,ph:1.7},
  {px:2340,y:800,dir:1,ph:1.9,pose:'run',run:1},{px:2600,y:702,dir:-1,ph:2.8},{px:2800,y:676,dir:1,ph:0.9},
  {px:3080,y:712,dir:-1,ph:2.1},{px:3300,y:812,dir:-1,ph:2.2},{px:3620,y:690,dir:1,ph:1.3},
  {px:3860,y:706,dir:-1,ph:0.8},{px:60,y:716,dir:1,ph:1.6},
];
const HOODED=[{px:3000,y:700},{px:1050,y:690}];

/* ---------------- player + camera ---------------- */
const p={px:GATE_PX,y:770,dir:1,walk:0};
const keys={};
function effL(){ return keys.ArrowLeft||keys.a||keys.A||keys.tL; }
function effR(){ return keys.ArrowRight||keys.d||keys.D||keys.tR; }
function effU(){ return keys.ArrowUp||keys.w||keys.W||keys.tU; }
function effD(){ return keys.ArrowDown||keys.s||keys.S||keys.tD; }
function updatePlayer(){
  const depth=(p.y-FLOOR_Y)/(FLOOR_B-FLOOR_Y);
  let mx=0,my=0;
  if(effL())mx-=1; if(effR())mx+=1;
  if(effU())my-=1; if(effD())my+=1;
  if(mx||my){
    const n=Math.hypot(mx,my)||1;
    p.px=(p.px+mx/n*(4.2+5.4*depth)+PW)%PW;
    p.y+=my/n*2.6;
    if(mx) p.dir=mx>0?1:-1;
    p.walk+=0.2;
    p.y=Math.max(FLOOR_Y+22,Math.min(FLOOR_B,p.y));
  } else p.walk*=0.86;
  // the room turns once you reach the outer 10% of the view
  const sx=P(p.px), dead=W*0.10;
  if(sx<dead) cam-=(dead-sx)/PW;
  else if(sx>W-dead) cam+=(sx-(W-dead))/PW;
  cam=(cam%1+1)%1;
}
function nearStation(){
  for(const s of STATIONS){
    const dx=angDist(p.px,s.px)/s.rx, dy=(p.y-s.y)/s.ry;
    if(dx*dx+dy*dy<1.3) return s;
  }
  return null;
}

/* ---------------- speech bubbles ---------------- */
function bubbleIcon(c,kind,x,y,col){
  c.save(); c.translate(x,y); c.strokeStyle=col; c.fillStyle=col; c.lineWidth=2.2; c.lineCap='round';
  if(kind==='sword'){
    c.beginPath(); c.moveTo(-7,7); c.lineTo(7,-7); c.moveTo(-7,-7); c.lineTo(7,7); c.stroke();
    c.beginPath(); c.moveTo(-9,4); c.lineTo(-4,9); c.moveTo(9,4); c.lineTo(4,9); c.stroke();
  } else if(kind==='coin'){
    [3,-1,-5].forEach(dy=>{ c.beginPath(); c.ellipse(0,dy,8,4,0,0,6.3); c.stroke(); });
  } else if(kind==='flag'){
    c.beginPath(); c.moveTo(-7,9); c.lineTo(-7,-8); c.stroke();
    for(let r=0;r<2;r++) for(let cl=0;cl<2;cl++){
      c.fillStyle=((r+cl)%2)?col:'rgba(0,0,0,0)';
      c.fillRect(-5+cl*6,-8+r*6,6,6);
    }
    c.strokeStyle=col; c.strokeRect(-5,-8,12,12);
  } else if(kind==='dart'){
    dartGlyph(c,0,0,8,col);
  } else {
    c.beginPath();
    c.moveTo(-8,-7); c.lineTo(-2,-7); c.arc(1,-7,3,Math.PI,0,true);
    c.lineTo(8,-7); c.lineTo(8,0); c.arc(8,3,3,-Math.PI/2,Math.PI/2,false);
    c.lineTo(8,7); c.lineTo(-8,7); c.closePath(); c.stroke();
  }
  c.restore();
}
function bubble(c,cx,by,lines,icon,dark,bob){
  c.font='500 15px "Work Sans",system-ui,sans-serif';
  let wMax=0; lines.forEach(l=>{ wMax=Math.max(wMax,c.measureText(l).width); });
  const padX=14, iconW=icon?30:0;
  const w=wMax+padX*2+iconW, h=lines.length*20+18;
  const y=by-h+Math.sin(bob)*2.5, x=cx-w/2;
  const fill=dark?'rgba(22,30,52,0.94)':'rgba(233,239,247,0.96)';
  const text=dark?'#eaf0fb':'#18223c';
  c.fillStyle=fill; rr(c,x,y,w,h,10); c.fill();
  c.strokeStyle=dark?'rgba(150,175,230,0.35)':'rgba(255,255,255,0.7)'; c.lineWidth=1.6;
  rr(c,x,y,w,h,10); c.stroke();
  c.fillStyle=fill;
  c.beginPath(); c.moveTo(cx-8,y+h-1); c.lineTo(cx+8,y+h-1); c.lineTo(cx+1,y+h+13); c.closePath(); c.fill();
  if(icon){
    bubbleIcon(c,icon,x+padX+8,y+h/2,text);
    c.strokeStyle=dark?'rgba(200,215,245,0.25)':'rgba(24,34,60,0.25)'; c.lineWidth=1.2;
    c.beginPath(); c.moveTo(x+padX+22,y+8); c.lineTo(x+padX+22,y+h-8); c.stroke();
  }
  c.fillStyle=text; c.textAlign='left'; c.font='500 15px "Work Sans",system-ui,sans-serif';
  lines.forEach((l,i)=>c.fillText(l,x+padX+iconW,y+27+i*20));
}
const BUBBLES=[
  {px:330,y:634,lines:['Links of rechts? Kies snel,','anders haalt de lava je in!'],dark:false},
  {px:1010,y:628,lines:['Oef, die spin is snel!'],dark:false},
  {px:1510,y:624,lines:['Durf jij het donker in?'],dark:true},
  {px:1660,y:742,lines:['Springen!'],icon:'coin',dark:false},
  {px:2000,y:640,lines:['Wie gaat er mee naar','het andere spel?'],dark:true},
  {px:2380,y:748,lines:['Rennen!'],icon:'flag',dark:true},
  {px:2700,y:620,lines:['Wie durft er te gooien?'],icon:'dart',dark:true},
  {px:3000,y:626,lines:['Kijk uit — hij stapt!'],dark:false},
  {px:3900,y:634,lines:['Hoe lang hou jij het vol?'],dark:false},
];

/* ---------------- interaction ---------------- */
const introEl=document.getElementById('intro'), toastEl=document.getElementById('toast');
let introGone=false, toastTimer=null;
function dismissIntro(){ if(introGone)return; introGone=true; introEl.classList.add('hide'); }
introEl.addEventListener('pointerdown',dismissIntro);
function showToast(m){
  toastEl.textContent=m; toastEl.classList.add('show');
  clearTimeout(toastTimer); toastTimer=setTimeout(()=>toastEl.classList.remove('show'),2500);
}
const enterEl=document.getElementById('enter'), enterNameEl=document.getElementById('enterName');
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
}
addEventListener('keydown',e=>{
  keys[e.key]=true; dismissIntro();
  if(e.key==='Enter'||e.key===' '){ pressAction(); e.preventDefault(); }
  else if(e.key.indexOf('Arrow')===0) e.preventDefault();
});
addEventListener('keyup',e=>{ keys[e.key]=false; });
cv.addEventListener('pointerdown',e=>{
  dismissIntro();
  if(e.target!==cv) return;
  const fx=e.clientX/innerWidth, fy=e.clientY/innerHeight;
  if(fx<0.3) keys.tL=true; else if(fx>0.7) keys.tR=true;
  else if(fy<0.45) keys.tU=true; else if(fy>0.78) keys.tD=true;
  else pressAction();
});
addEventListener('pointerup',()=>{ keys.tL=keys.tR=keys.tU=keys.tD=false; });
addEventListener('pointercancel',()=>{ keys.tL=keys.tR=keys.tU=keys.tD=false; });

/* ---------------- HUD ---------------- */
function drawRings(c){
  const near=nearStation();
  STATIONS.forEach(s=>{
    const x=P(s.px); if(!vis(x,200)) return;
    const on=near&&near.id===s.id;
    const pulse=0.5+0.5*Math.sin(T*2.6);
    c.save();
    c.strokeStyle=s.status==='live'
      ? 'rgba(120,235,160,'+(on?0.5+0.3*pulse:0.1)+')'
      : 'rgba(185,200,255,'+(on?0.34+0.24*pulse:0.05)+')';
    c.lineWidth=on?3.2:1.5;
    const ry0=s.y+24+bow(x);
    c.beginPath(); c.ellipse(x,ry0,s.rx*0.7,s.ry*0.66,0,0,6.3); c.stroke();
    if(on){
      const gl=c.createRadialGradient(x,ry0,4,x,ry0,s.rx*0.9);
      gl.addColorStop(0,s.status==='live'?'rgba(110,230,150,0.18)':'rgba(170,185,255,0.15)');
      gl.addColorStop(1,'rgba(0,0,0,0)');
      c.fillStyle=gl; c.beginPath(); c.ellipse(x,ry0,s.rx*0.9,s.ry*0.9,0,0,6.3); c.fill();
    }
    c.restore();
  });
}
function drawActors(c){
  const list=[];
  NPCS.forEach(n=>{ const x=P(n.px); if(vis(x,80)) list.push({x,n,y:n.y}); });
  HOODED.forEach(hd=>{ const x=P(hd.px); if(vis(x,80)) list.push({x,hood:true,y:hd.y}); });
  list.push({x:P(p.px),player:true,y:p.y});
  list.sort((a,b)=>a.y-b.y);
  list.forEach(it=>{
    const dy=bow(it.x);
    if(it.player){
      const k=depthK(p.y);
      figure(c,it.x,p.y+dy,k,p.walk,p.dir,'idle','rgba(255,200,115,0.9)');
      c.textAlign='center'; c.fillStyle='rgba(255,214,140,0.95)';
      c.font='700 '+(12*k).toFixed(1)+'px "Work Sans",system-ui,sans-serif';
      c.fillText('JIJ',it.x,p.y+dy-80*k);
      return;
    }
    if(it.hood){ hooded(c,it.x,it.y+dy,depthK(it.y)); return; }
    const n=it.n, k=depthK(n.y), idle=Math.sin(T*1.6+n.ph)*0.9;
    if(n.jump) figure(c,it.x,n.y+dy-Math.abs(Math.sin(T*2.3+n.ph))*30,k,T*6,n.dir,'idle');
    else if(n.run) figure(c,it.x+Math.sin(T*1.0+n.ph)*34,n.y+dy,k,T*9,n.dir,'run');
    else figure(c,it.x,n.y+dy,k,idle,n.dir,n.pose||'idle');
  });
}
function drawCompass(c){
  // a thin ring showing where you are in the rotunda
  const cx=W/2, y=HH-40, w=300;
  c.fillStyle='rgba(12,16,32,0.6)'; rr(c,cx-w/2,y,w,7,4); c.fill();
  STATIONS.forEach(s=>{
    const f=((s.px/PW)-cam+1.5)%1;
    const dx=(f-0.5)*w;
    c.fillStyle=s.status==='live'?'#5fd98c':'rgba(185,195,235,0.55)';
    c.beginPath(); c.arc(cx+dx,y+3.5,3.4,0,6.3); c.fill();
  });
  const pf=((p.px/PW)-cam+1.5)%1;
  c.fillStyle='#ffcf7a';
  c.beginPath(); c.arc(cx+(pf-0.5)*w,y+3.5,5,0,6.3); c.fill();
  c.strokeStyle='rgba(255,255,255,0.18)'; c.lineWidth=1.4;
  c.beginPath(); c.moveTo(cx,y-4); c.lineTo(cx,y+11); c.stroke();
}
function drawPrompt(c){
  const s=nearStation();
  c.textAlign='center';
  if(s){
    const x=P(s.px);
    const label=s.status==='live'?s.name+' — ENTER of klik de knop':s.name+' — binnenkort';
    c.font='700 16px "Work Sans",system-ui,sans-serif';
    const w=c.measureText(label).width+34, bx=x-w/2, by=s.y-116+bow(x);
    c.fillStyle='rgba(10,12,26,0.88)'; rr(c,bx,by,w,34,8); c.fill();
    c.strokeStyle=s.status==='live'?'rgba(120,235,160,0.6)':'rgba(190,190,240,0.3)';
    c.lineWidth=1.8; rr(c,bx,by,w,34,8); c.stroke();
    c.fillStyle=s.status==='live'?'#8ff0b4':'#d6d9f2';
    c.fillText(label,x,by+23);
  }
  c.font='500 13px "Work Sans",system-ui,sans-serif';
  c.fillStyle='rgba(214,217,242,0.45)';
  c.fillText('← → rondlopen · ↑ ↓ naar voren · ENTER of de groene knop: spelen',800,HH-12);
}
const vignetteSprite=(function(){
  const cv2=document.createElement('canvas'); cv2.width=W; cv2.height=8;
  const k=cv2.getContext('2d');
  const vg=k.createLinearGradient(0,0,W,0);
  vg.addColorStop(0,'rgba(4,6,16,0.62)'); vg.addColorStop(0.11,'rgba(4,6,16,0)');
  vg.addColorStop(0.89,'rgba(4,6,16,0)'); vg.addColorStop(1,'rgba(4,6,16,0.62)');
  k.fillStyle=vg; k.fillRect(0,0,W,8);
  return cv2;
})();
function drawVignette(c){ c.drawImage(vignetteSprite,0,0,W,8,0,0,W,HH); }

/* ---------------- frame ---------------- */
function frame(){
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
  drawFire(g);
  drawRings(g);
  drawActors(g);
  BUBBLES.forEach((bu,i)=>{
    const x=P(bu.px);
    if(vis(x,200)) bubble(g,x,bu.y+bow(x),bu.lines,bu.icon,bu.dark,T*1.3+i);
  });
  drawVignette(g);
  drawPrompt(g);
  drawCompass(g);
  g.restore();
  requestAnimationFrame(frame);
}
bakePano();
if(document.fonts&&document.fonts.ready) document.fonts.ready.then(bakePano);
requestAnimationFrame(frame);
