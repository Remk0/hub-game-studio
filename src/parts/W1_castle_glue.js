
/* ---- KASTEEL: wand, plafond, vloer, rekwisieten ---- */
function c_wall(q){
  panoWall(q);
  panoGate(q,GATE_PX);
  panoCrest(q,0); panoCrest(q,PW);
  panoSideBanner(q,1560);
  panoMiniPanel(q,2380);
  BANNER.forEach(x=>bannerCloth(q,x,CORN_Y-8,56,128,'#c0293a','#71131f','#fff3e2'));
  panoHubSign(q,GATE_PX);
  CEIL.forEach(px=>hangLantern(q,px,196,1));
  SCONCE.forEach((x,i)=>wallTorch(q,x,430,1,(i%2)?-1:1));
  q.fillStyle='#39405e'; q.fillRect(0,FLOOR_Y-22,PW,22);
  q.fillStyle='#4e5888'; q.fillRect(0,FLOOR_Y-26,PW,6);
  q.fillStyle='rgba(0,0,0,0.35)'; q.fillRect(0,FLOOR_Y-3,PW,7);
  q.fillStyle='rgba(190,208,255,0.09)';
  for(let x=0;x<PW;x+=44) q.fillRect(x+3,FLOOR_Y-19,38,4);
}
function c_roof(c){
  c.save(); roofClip(c);
  if(!_rg) _rg=vgrad(c,-130,CORN_Y+20,[[0,'#0b0206'],[0.45,'#20060d'],[1,'#380a16']]);
  c.fillStyle=_rg; c.fillRect(0,-130,W,CORN_Y+150);
  HANG.forEach(px=>{
    const x=P(px); if(!vis(x,260)) return;
    pool(c,x,CORN_Y+bow(x)-86,230,'rgba(255,170,96,0.16)');
  });
  HANG.forEach(px=>{ const x=P(px); if(vis(x,120)) chandelier(c,x,CORN_Y+bow(x)-46); });
  c.restore();
  cornice(c,-30,8,'#98a6d9');
  cornice(c,-23,26,'#4e5888');
  cornice(c,3,8,'rgba(0,0,0,0.4)');
  c.fillStyle='#39426a';
  for(let i=0;i<60;i++){
    const x=P(i*(PW/60));
    if(vis(x,20)) c.fillRect(x-6,CORN_Y+bow(x)+11,12,8);
  }
}
function c_floor(c){
  c.save(); floorClip(c);
  if(!_fg) _fg=vgrad(c,FLOOR_Y,HH,[[0,'#15161b'],[0.28,'#0d0e12'],[1,'#030304']]);
  c.fillStyle=_fg; c.fillRect(0,FLOOR_Y-24,W,HH-FLOOR_Y+24);
  if(!_wg){ _wg=c.createRadialGradient(FCX,FLOOR_Y+120,40,FCX,FLOOR_Y+120,900);
    _wg.addColorStop(0,'rgba(255,196,130,0.06)'); _wg.addColorStop(1,'rgba(255,170,90,0)'); }
  c.fillStyle=_wg; c.fillRect(0,FLOOR_Y-24,W,HH-FLOOR_Y+24);
  const CARPET='#7d1622', CARPET2='#95202e', GOLD='rgba(206,166,86,0.75)';
  c.save(); runnersClip(c);
  wedge(c,GATE_PX,100,CARPET2,GOLD);
  SCREENS.forEach(S=>wedge(c,S.px,82,CARPET,GOLD));
  c.restore();
  ringBand(c,104,176,CARPET); ringLine(c,108,GOLD); ringLine(c,172,GOLD);
  floorSheen(c,'rgba(255,190,150,0.12)','rgba(0,0,0,0.4)');
  if(!_sg) _sg=vgrad(c,FLOOR_Y,FLOOR_Y+180,[[0,'rgba(255,224,178,0.17)'],[1,'rgba(255,200,150,0)']]);
  c.fillStyle=_sg; c.fillRect(0,FLOOR_Y-10,W,200);
  c.restore();
  floorEdge(c,'rgba(0,0,0,0.42)');
  const mx=P(GATE_PX);
  if(vis(mx,320)){
    const dy=bow(mx);
    c.save(); c.translate(mx,716+dy); c.scale(1,0.3);
    c.strokeStyle='rgba(206,166,86,0.6)'; c.lineWidth=9;
    [250,196].forEach(r=>{ c.beginPath(); c.arc(0,0,r,0,6.3); c.stroke(); });
    c.restore();
    c.save(); c.globalAlpha=0.72; c.translate(mx,718+dy); c.scale(1,0.3);
    skull(c,0,-16,80,'#d9b05e','#4a0d16',true);
    c.restore();
  }
}
function c_props(c){
  SCREENS.forEach(S=>{ const x=P(S.px); if(vis(x,240)){
    reflectStrip(c,x,SCR_W*0.85,'rgba(150,180,255,0.16)',170); benchLight(c,x,700+bow(x),150); } });
  const gx=P(GATE_PX); if(vis(gx,260)) reflectStrip(c,gx,200,'rgba(160,200,255,0.2)',210);
  SCONCE.forEach(px=>{ const x=P(px); if(vis(x,80)) reflectStrip(c,x,54,'rgba(255,178,90,0.26)',175); });
  FLOOR_LAMPS.forEach(([px,y])=>{ const x=P(px); if(vis(x,40)) candleAt(c,x,y+bow(x),1); });
  let x=P(640);
  if(vis(x,280)){
    c.save(); c.translate(0,bow(x));
    c.strokeStyle='rgba(180,205,255,0.2)'; c.lineWidth=7;
    c.beginPath(); c.ellipse(x,786,140,44,0,0,6.3); c.stroke();
    c.fillStyle='rgba(150,180,255,0.05)'; c.beginPath(); c.ellipse(x,786,140,44,0,0,6.3); c.fill();
    [-140,-72,0,74,142].forEach(d=>ropeStanchion(c,x+d,800,1));
    c.strokeStyle='#8a6636'; c.lineWidth=4; c.lineCap='round';
    c.beginPath(); c.moveTo(x-140,742);
    c.quadraticCurveTo(x-106,762,x-72,742); c.quadraticCurveTo(x-36,764,x,742);
    c.quadraticCurveTo(x+38,764,x+74,742); c.quadraticCurveTo(x+108,762,x+142,742); c.stroke();
    c.save(); c.translate(x,790); c.rotate(-0.42);
    c.shadowColor='rgba(150,205,255,0.9)'; c.shadowBlur=18;
    c.fillStyle='#dbe9ff';
    c.beginPath(); c.moveTo(-52,0); c.lineTo(34,-7); c.lineTo(52,0); c.lineTo(34,7); c.closePath(); c.fill();
    c.fillStyle='#8a6636'; c.fillRect(-64,-4,14,8);
    c.restore(); c.restore();
  }
  x=P(1660);
  if(vis(x,220)){
    c.save(); c.translate(0,bow(x));
    [[-60,828,74,26],[6,800,74,30],[74,830,74,24]].forEach(([d,y2,w,h])=>{
      c.fillStyle=vgrad(c,y2-h,y2,[[0,'#6a7292'],[1,'#3d4462']]);
      rr(c,x+d-w/2,y2-h,w,h,5); c.fill();
      c.strokeStyle='rgba(0,0,0,0.35)'; c.lineWidth=2; c.stroke();
    });
    c.fillStyle='#e8b93c';
    [[-36,774],[44,764]].forEach(([d,y2])=>{ c.beginPath(); c.ellipse(x+d,y2,10,12,0,0,6.3); c.fill(); });
    c.restore();
  }
  x=P(2380);
  if(vis(x,240)){
    c.save(); c.translate(0,bow(x));
    c.save(); c.translate(x-90,800); c.transform(1,0,-0.5,1,0,0);
    for(let r=0;r<2;r++) for(let col=0;col<8;col++){
      c.fillStyle=((r+col)%2)?'rgba(240,243,251,0.75)':'rgba(25,29,46,0.75)';
      c.fillRect(col*18,-r*16,18,16);
    }
    c.restore();
    checkerFlag(c,x+56,802,72,0.06); checkerFlag(c,x+112,806,68,-0.05);
    barrelProp(c,x-16,818,0.7);
    c.restore();
  }
  x=P(3320);
  if(vis(x,260)){
    c.save(); c.translate(0,bow(x));
    crateProp(c,x-80,826,1); crateProp(c,x-14,830,1.05); crateProp(c,x-46,780,0.85);
    crateProp(c,x+64,824,0.9); barrelProp(c,x+130,820,0.9);
    rock(c,x+206,760,1.2); pumpkinProp(c,x+210,742,1.05);
    c.restore();
  }
  [[120,812,'rock',1],[2140,860,'rock',0.8],[3000,872,'rock',0.9],
   [980,846,'pump',0.6],[2860,856,'pump',0.55]].forEach(([px,y,kind,s])=>{
    const xx=P(px); if(!vis(xx,90)) return;
    if(kind==='rock') rock(c,xx,y+bow(xx),s); else pumpkinProp(c,xx,y+bow(xx),s);
  });
}
function c_fire(c){
  SCONCE.forEach((px,i)=>{ const x=P(px); if(vis(x,90)) flame(c,x+((i%2)?-16:16),398+bow(x),1.1,i*1.7); });
  CEIL.forEach((px,i)=>{ const x=P(px); if(vis(x,70)) flame(c,x,193+bow(x),0.5,i*2.1,0.8); });
  FLOOR_LAMPS.forEach(([px,y],i)=>{ const x=P(px); if(vis(x,50)) flame(c,x,y-16+bow(x),0.34,i*0.9); });
  HANG.forEach((px,j)=>{
    const x=P(px); if(!vis(x,120)) return;
    const y=CORN_Y+bow(x)-46;
    for(let i=0;i<6;i++){ const a=i*1.047; flame(c,x+Math.cos(a)*44,y+Math.sin(a)*12-18,0.42,j*3+i,0.9); }
  });
  const cx0=P(0);
  if(vis(cx0,200)) pool(c,cx0,400,190,'rgba(255,190,110,'+(0.16*(0.72+0.28*Math.sin(T*7)))+')');
}
const BATS=[{px:2000,y:352,r:22,sp:0.7,ph:0},{px:2060,y:336,r:18,sp:-0.9,ph:2},
            {px:1950,y:326,r:28,sp:0.55,ph:4},{px:900,y:340,r:24,sp:-0.6,ph:1},
            {px:3300,y:330,r:20,sp:0.8,ph:5}];
function c_ambient(c){
  c.fillStyle='#090c18';
  BATS.forEach(bt=>{
    const bx=P(bt.px); if(!vis(bx,60)) return;
    const a=T*bt.sp+bt.ph;
    const x=bx+Math.cos(a)*bt.r, y=bt.y+Math.sin(a*1.4)*bt.r*0.4+bow(bx);
    const fl=4+Math.sin(T*13+bt.ph)*4, s=0.8;
    c.beginPath();
    c.moveTo(x-9*s,y-fl*s);
    c.quadraticCurveTo(x-4*s,y+3*s,x,y);
    c.quadraticCurveTo(x+4*s,y+3*s,x+9*s,y-fl*s);
    c.quadraticCurveTo(x+4*s,y+1*s,x,y+3*s);
    c.quadraticCurveTo(x-4*s,y+1*s,x-9*s,y-fl*s);
    c.fill();
  });
}
