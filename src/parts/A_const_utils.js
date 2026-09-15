/* =====================================================================
   HUB GAME STUDIO — ronde koepelzaal (360°, je ziet er ~40% van)
   Alles staat op een "panorama-x" (0..PW) rond de zaal.
===================================================================== */
const W=1600, HH=900;
const VIS=0.4, PW=W/VIS;          // 4000 = één hele ronde
const CORN_Y=158, FLOOR_Y=600, FLOOR_B=876;
const OCX=800, OCY=54, OCR=44;

const GAMES=[
  { id:'toren', px:300,  kind:'climb',   name:'Torenklim',   title:'RECORDS — TORENKLIM',
    url:'https://claude.ai/artifact/AFR2Njobhniz1agiEgJDSy' },
  { id:'nest',  px:800,  kind:'nest',    name:'Spinnennest', title:'RECORDS — SPINNENNEST',
    url:'https://claude.ai/artifact/B3Zpw1deNyBnShh2DyM2ei' },
  { id:'spook', px:1300, kind:'spook',   name:'Spookhuis',   title:'RECORDS — SPOOKHUIS',
    url:'https://claude.ai/artifact/2pmaTvEZqCKeAW5GQobC8k' },
  { id:'oche',  px:2700, kind:'dart',    name:'Oche Arena',  title:'RECORDS — OCHE ARENA',
    url:'https://claude.ai/artifact/FKv66e18xzXW5kPz2ksF7K' },
  { id:'reus',  px:3200, kind:'giant',   name:'De Reus',     title:'RECORDS — DE REUS',
    url:'https://claude.ai/artifact/R9mdScoDYy6nXoPh7Kw1TH' },
  { id:'hal',   px:3700, kind:'monster', name:'De Hal',      title:'RECORDS — DE HAL',
    url:'https://claude.ai/artifact/61eU3CHjjnGLRrccnshn2G' },
];
const SCREENS=GAMES.map(function(G){ return Object.assign({status:'live'},G); });
const SCR_W=276, SCR_H=244, SCR_Y=262;
const GATE_PX=2000;
const STATIONS=GAMES.map(function(G){
  return {id:G.id,name:G.name,px:G.px,y:690,rx:152,ry:46,status:'live',url:G.url};
});

const cv=document.getElementById('c'), g=cv.getContext('2d');
let sc=1, ox=0, oy=0, T=0, cam=GATE_PX/PW;
function resize(){
  const d=Math.min(devicePixelRatio||1,2);
  cv.width=innerWidth*d; cv.height=innerHeight*d;
  sc=Math.min(cv.width/W, cv.height/HH);
  ox=(cv.width-W*sc)/2; oy=(cv.height-HH*sc)/2;
}
addEventListener('resize',resize); resize();

/* ---------------- utils ---------------- */
let _s=1;
function srnd(v){ _s=v>>>0; }
function rnd(){ _s=(_s*1664525+1013904223)>>>0; return _s/4294967296; }
function rr(c,x,y,w,h,r){ c.beginPath(); if(c.roundRect) c.roundRect(x,y,w,h,r); else c.rect(x,y,w,h); }
function lerp(a,b,t){ return a+(b-a)*t; }
function wrapd(d){ return d-Math.round(d); }
function P(px){ return W/2 + wrapd(px/PW-cam)*PW; }       // panorama x -> screen x
function vis(x,m){ m=m||220; return x>-m && x<W+m; }
function angDist(a,b){ const d=Math.abs(a-b)%PW; return Math.min(d,PW-d); }
function depthK(y){ return 0.6+(y-FLOOR_Y)/(FLOOR_B-FLOOR_Y)*0.58; }
const BOW=34;
function bow(x){ const t=(x-W/2)/(W/2); return BOW*t*t; }
function bowSlope(x){ return 2*BOW*(x-W/2)/((W/2)*(W/2)); }

function skull(c,x,y,r,col,hole,ears){
  c.save(); c.fillStyle=col;
  c.beginPath(); c.arc(x,y,r,0,6.3); c.fill();
  if(ears){
    c.beginPath(); c.arc(x-r*0.74,y-r*0.66,r*0.27,0,6.3); c.fill();
    c.beginPath(); c.arc(x+r*0.74,y-r*0.66,r*0.27,0,6.3); c.fill();
  }
  c.fillRect(x-r*0.5,y+r*0.44,r*1.0,r*0.6);
  c.fillStyle=hole;
  c.beginPath(); c.ellipse(x-r*0.37,y-r*0.02,r*0.23,r*0.27,0,0,6.3); c.fill();
  c.beginPath(); c.ellipse(x+r*0.37,y-r*0.02,r*0.23,r*0.27,0,0,6.3); c.fill();
  c.beginPath(); c.moveTo(x,y+r*0.2); c.lineTo(x-r*0.13,y+r*0.44); c.lineTo(x+r*0.13,y+r*0.44); c.closePath(); c.fill();
  c.fillRect(x-r*0.19,y+r*0.46,r*0.1,r*0.56);
  c.fillRect(x+r*0.09,y+r*0.46,r*0.1,r*0.56);
  c.restore();
}
function crossbones(c,x,y,r,col){
  c.save(); c.strokeStyle=col; c.lineWidth=r*0.22; c.lineCap='round';
  [[-1,1],[1,1]].forEach(([dx,dy])=>{
    c.beginPath(); c.moveTo(x-r*1.25*dx,y+r*0.5*dy); c.lineTo(x+r*1.25*dx,y-r*0.5*dy); c.stroke();
  });
  c.fillStyle=col;
  [[-1.3,-0.5],[-1.3,0.5],[1.3,-0.5],[1.3,0.5]].forEach(([dx,dy])=>{
    c.beginPath(); c.arc(x+r*dx,y+r*dy,r*0.2,0,6.3); c.fill();
  });
  c.restore();
  skull(c,x,y,r*0.72,col,'#111528',false);
}
function cuteSpider(c,x,y,r,col){
  c.save(); c.strokeStyle=col; c.lineWidth=Math.max(1.4,r*0.16); c.lineCap='round';
  for(let i=0;i<4;i++){
    const oy=y-r*0.5+i*r*0.32;
    [-1,1].forEach(d=>{
      c.beginPath(); c.moveTo(x,y);
      c.quadraticCurveTo(x+d*r*1.05,oy-r*0.42,x+d*r*1.4,oy+r*0.55); c.stroke();
    });
  }
  c.fillStyle=col;
  c.beginPath(); c.ellipse(x,y+r*0.22,r*0.62,r*0.72,0,0,6.3); c.fill();
  c.beginPath(); c.arc(x,y-r*0.5,r*0.42,0,6.3); c.fill();
  c.fillStyle='#11162a';
  c.beginPath(); c.arc(x-r*0.17,y-r*0.55,r*0.12,0,6.3); c.fill();
  c.beginPath(); c.arc(x+r*0.17,y-r*0.55,r*0.12,0,6.3); c.fill();
  c.restore();
}
function climberGlyph(c,x,y,r,col){
  c.save(); c.strokeStyle=col; c.fillStyle=col; c.lineCap='round'; c.lineWidth=r*0.24;
  c.beginPath(); c.moveTo(x,y-r*0.1); c.lineTo(x-r*0.55,y+r*0.75);
  c.moveTo(x,y-r*0.1); c.lineTo(x+r*0.55,y+r*0.75); c.stroke();
  c.beginPath(); c.moveTo(x,y-r*0.1); c.lineTo(x-r*0.7,y-r*0.7);
  c.moveTo(x,y-r*0.1); c.lineTo(x+r*0.7,y-r*0.55); c.stroke();
  c.beginPath(); c.arc(x,y-r*0.72,r*0.32,0,6.3); c.fill();
  c.restore();
}
function dartGlyph(c,x,y,r,col){
  c.save(); c.strokeStyle=col; c.lineWidth=r*0.24; c.lineCap='round';
  c.beginPath(); c.moveTo(x-r,y+r); c.lineTo(x+r*0.35,y-r*0.35); c.stroke();
  c.fillStyle=col;
  c.beginPath(); c.moveTo(x+r*0.35,y-r*0.35); c.lineTo(x+r,y-r); c.lineTo(x+r*0.95,y-r*0.15);
  c.lineTo(x+r*0.15,y-r*0.95); c.closePath(); c.fill();
  c.restore();
}
function castle(c,bx,by,s,col,lights){
  c.fillStyle=col;
  const towers=[[0,150,40],[46,196,30],[-48,186,30],[100,128,34],[-104,136,32],
                [152,178,26],[-156,180,26],[200,116,22],[-204,120,22]];
  towers.forEach(([dx,ht,wd])=>{
    const x=bx+dx*s, w=wd*s, hgt=ht*s;
    c.fillRect(x-w/2,by-hgt,w,hgt);
    c.beginPath(); c.moveTo(x-w/2-4*s,by-hgt); c.lineTo(x,by-hgt-34*s); c.lineTo(x+w/2+4*s,by-hgt); c.closePath(); c.fill();
    c.fillRect(x-w/2-3*s,by-hgt-2*s,w+6*s,5*s);
  });
  c.fillRect(bx-200*s,by-78*s,400*s,78*s);
  for(let i=-9;i<=9;i++) c.fillRect(bx+i*22*s-7*s,by-92*s,14*s,16*s);
  if(lights){
    c.fillStyle='rgba(255,200,120,0.8)'; srnd(77);
    for(let i=0;i<26;i++) c.fillRect(bx+(rnd()-0.5)*380*s,by-(12+rnd()*170)*s,2.6*s,3.6*s);
  }
}

