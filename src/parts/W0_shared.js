/* =====================================================================
   WERELD-MOTOR — vier thema's delen dezelfde plattegrond
   De zaal is altijd hetzelfde rondeel: zes schermen, één poort, één
   nis tegenover de poort. Alleen het materiaal eromheen verandert.
===================================================================== */
const PANO_H=620;
const pano=document.createElement('canvas'); pano.width=PW; pano.height=PANO_H;
const q=pano.getContext('2d');

/* vaste ankerpunten, vrijgehouden van de schermen (300/800/1300/2700/3200/3700)
   en van de poort (2000) — zo blijft de indeling herkenbaar per thema */
const SCONCE=[120,520,1050,1520,1760,2250,2480,2950,3420,3880];
const HANG  =[400,1560,2400,3450];
const OPEN  =[560,1800,2200,3450];
const NICHE =[1000,3000];
const BANNER=[150,450,980,1150,1850,2150,2550,2950,3550,3850];
const CEIL=[];
for(let i=0;i<20;i++){ const px=i*200+100; if(angDist(px,GATE_PX)>190) CEIL.push(px); }
const FLOOR_LAMPS=[];
for(let i=0;i<24;i++) FLOOR_LAMPS.push([i*(PW/24)+70, 640+((i*37)%120)]);

let TH=null, THEME_KEY='castle';

/* ---- gedeelde tekenhulp ---- */
function vgrad(c,y0,y1,stops){
  const g2=c.createLinearGradient(0,y0,0,y1);
  stops.forEach(s=>g2.addColorStop(s[0],s[1]));
  return g2;
}
function pool(c,x,y,r,c0,c1){            // warme/koude lichtplek op de wand
  const gl=c.createRadialGradient(x,y,4,x,y,r);
  gl.addColorStop(0,c0); gl.addColorStop(1,c1||'rgba(0,0,0,0)');
  c.fillStyle=gl; c.fillRect(x-r,y-r,r*2,r*2);
}
function seam(c,y,col,w){                 // horizontale naad over de hele wand
  c.strokeStyle=col; c.lineWidth=w||2;
  c.beginPath(); c.moveTo(0,y); c.lineTo(PW,y); c.stroke();
}
function arcPath(c,x,hw,apex,spring,sill){
  c.beginPath();
  c.moveTo(x-hw,sill); c.lineTo(x-hw,spring);
  c.quadraticCurveTo(x-hw+5,apex+24,x,apex);
  c.quadraticCurveTo(x+hw-5,apex+24,x+hw,spring);
  c.lineTo(x+hw,sill); c.closePath();
}
function starField(c,x,y,w,h,n,seed,col,big){
  srnd(seed>>>0);
  for(let i=0;i<n;i++){
    const sx=x+rnd()*w, sy=y+rnd()*h, r=rnd();
    c.fillStyle=col;
    const s=r>0.94?(big||2.6):(r>0.7?1.7:1.1);
    c.fillRect(sx,sy,s,s);
  }
}

/* ---- vloer: de ring en de lopers naar de schermen ---- */
const FCX=800;
let _fg=null,_sg=null,_rg=null,_wg=null;
function floorClip(c){
  c.beginPath();
  for(let x=0;x<=W;x+=12){ const y=FLOOR_Y+bow(x); x?c.lineTo(x,y):c.moveTo(x,y); }
  c.lineTo(W,HH); c.lineTo(0,HH); c.closePath(); c.clip();
}
function ringBand(c,o1,o2,fill){
  c.beginPath();
  for(let x=0;x<=W;x+=12){ const y=FLOOR_Y+bow(x)+o1; x?c.lineTo(x,y):c.moveTo(x,y); }
  for(let x=W;x>=0;x-=12) c.lineTo(x,FLOOR_Y+bow(x)+o2);
  c.closePath(); c.fillStyle=fill; c.fill();
}
function ringLine(c,off,col,w){
  c.strokeStyle=col; c.lineWidth=w||4; c.beginPath();
  for(let x=0;x<=W;x+=12){ const y=FLOOR_Y+bow(x)+off; x?c.lineTo(x,y):c.moveTo(x,y); }
  c.stroke();
}
function wedge(c,px,halfPx,fill,trim){
  const x0=P(px-halfPx), x1=x0+halfPx*2;
  if(x1<-300||x0>W+300) return;
  const y0=FLOOR_Y+bow(x0), y1=FLOOR_Y+bow(x1);
  const bx0=FCX+(x0-FCX)*0.10, bx1=FCX+(x1-FCX)*0.10;
  c.beginPath();
  c.moveTo(x0,y0); c.lineTo(x1,y1); c.lineTo(bx1,892); c.lineTo(bx0,892); c.closePath();
  c.fillStyle=fill; c.fill();
  if(trim){
    c.strokeStyle=trim; c.lineWidth=4;
    c.beginPath(); c.moveTo(x0,y0); c.lineTo(bx0,892); c.moveTo(x1,y1); c.lineTo(bx1,892); c.stroke();
  }
}
function runnersClip(c){                  // lopers reiken van de wand tot de ring
  c.beginPath();
  c.moveTo(0,FLOOR_Y-60); c.lineTo(W,FLOOR_Y-60);
  for(let x=W;x>=0;x-=12) c.lineTo(x,FLOOR_Y+bow(x)+176);
  c.closePath(); c.clip();
}
function reflectStrip(c,x,w,col,len){
  const y0=FLOOR_Y+bow(x);
  const r=c.createLinearGradient(0,y0,0,y0+len);
  r.addColorStop(0,col); r.addColorStop(1,'rgba(0,0,0,0)');
  c.fillStyle=r; c.fillRect(x-w/2,y0,w,len);
}
function floorSheen(c,col0,col1){
  const pile=c.createLinearGradient(0,FLOOR_Y,0,HH);
  pile.addColorStop(0,col0); pile.addColorStop(0.45,'rgba(0,0,0,0)');
  pile.addColorStop(1,col1);
  c.fillStyle=pile; c.fillRect(0,FLOOR_Y-10,W,HH-FLOOR_Y+10);
}
function floorEdge(c,col){
  c.fillStyle=col; c.beginPath();
  for(let x=0;x<=W;x+=12){ const y=FLOOR_Y+bow(x)-3; x?c.lineTo(x,y):c.moveTo(x,y); }
  for(let x=W;x>=0;x-=12) c.lineTo(x,FLOOR_Y+bow(x)+3);
  c.closePath(); c.fill();
}

/* ---- plafond ---- */
function roofClip(c){
  c.beginPath(); c.moveTo(0,-120); c.lineTo(W,-120);
  for(let x=W;x>=0;x-=20) c.lineTo(x,CORN_Y+bow(x)+16);
  c.closePath(); c.clip();
}
function cornice(c,off,h,col){
  c.fillStyle=col; c.beginPath();
  for(let x=0;x<=W;x+=12){ const y=CORN_Y+bow(x)+off; x?c.lineTo(x,y):c.moveTo(x,y); }
  for(let x=W;x>=0;x-=12) c.lineTo(x,CORN_Y+bow(x)+off+h);
  c.closePath(); c.fill();
}

/* ---- panorama tekenen (in banden, zodat de wand bolt) ---- */
function drawPano(c){
  const sx0=((cam*PW-W/2)%PW+PW)%PW, BANDS=44, bw=W/BANDS;
  for(let i=0;i<BANDS;i++){
    const x=i*bw, sx=(sx0+x)%PW, dy=bow(x+bw/2);
    const w1=Math.min(bw,PW-sx);
    c.drawImage(pano, sx,0,w1,PANO_H, x,dy,w1+1,PANO_H);
    if(w1<bw) c.drawImage(pano, 0,0,bw-w1,PANO_H, x+w1,dy,bw-w1+1,PANO_H);
  }
}
function bakePano(){
  q.setTransform(1,0,0,1,0,0);
  q.clearRect(0,0,PW,PANO_H);
  q.textBaseline='alphabetic'; q.textAlign='center';
  TH.wall(q);
  q.globalCompositeOperation='source-over';
  q.globalAlpha=1;
}
