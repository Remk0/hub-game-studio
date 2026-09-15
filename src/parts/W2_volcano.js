
/* =====================================================================
   VULKAAN — een zaal uitgehakt in gestolde lava, onder de krater
===================================================================== */
function v_column(c,x,w,seed){          // zuilvormig basalt, zoals op een basaltplateau
  const top=CORN_Y+2, bot=FLOOR_Y+6;
  srnd(seed>>>0);
  const g2=c.createLinearGradient(x-w/2,0,x+w/2,0);
  const t=rnd();
  g2.addColorStop(0,'#0e0908');
  g2.addColorStop(0.34,t>0.5?'#2d2220':'#262019');
  g2.addColorStop(0.7,'#1a1312');
  g2.addColorStop(1,'#070505');
  c.fillStyle=g2; c.fillRect(x-w/2,top,w,bot-top);
  // horizontale breukvlakken
  c.strokeStyle='rgba(0,0,0,0.55)'; c.lineWidth=2;
  let y=top+26+rnd()*30;
  while(y<bot){ c.beginPath(); c.moveTo(x-w/2,y); c.lineTo(x+w/2,y+ (rnd()-0.5)*4); c.stroke();
    c.strokeStyle='rgba(255,138,60,0.07)'; c.lineWidth=1.2;
    c.beginPath(); c.moveTo(x-w/2,y+2); c.lineTo(x+w/2,y+2); c.stroke();
    c.strokeStyle='rgba(0,0,0,0.55)'; c.lineWidth=2;
    y+=34+rnd()*26; }
  // randlicht aan één kant, alsof er ergens lava brandt
  c.fillStyle='rgba(255,142,58,0.10)'; c.fillRect(x+w/2-3,top,3,bot-top);
  c.fillStyle='rgba(0,0,0,0.4)'; c.fillRect(x-w/2,top,3,bot-top);
}
function v_crack(c,x0,y0,len,ang,wide,depth,glow){
  if(depth<=0||len<6) return;
  const x1=x0+Math.cos(ang)*len, y1=y0+Math.sin(ang)*len;
  c.strokeStyle=glow; c.lineWidth=wide; c.lineCap='round';
  c.beginPath(); c.moveTo(x0,y0); c.lineTo(x1,y1); c.stroke();
  v_crack(c,x1,y1,len*(0.64+rnd()*0.2),ang+(rnd()-0.5)*1.1,wide*0.66,depth-1,glow);
  if(rnd()<0.55) v_crack(c,x1,y1,len*0.5,ang+(rnd()-0.5)*1.6,wide*0.55,depth-1,glow);
}
function v_lavafall(c,x){               // opening met een gordijn van gloeiend gesteente
  const hw=84, apex=238, spring=330, sill=556;
  c.save(); arcPath(c,x,hw,apex,spring,sill); c.clip();
  c.fillStyle=vgrad(c,apex,sill,[[0,'#140503'],[0.4,'#2a0a04'],[1,'#120402']]);
  c.fillRect(x-hw,apex-10,hw*2,sill-apex+20);
  // de val zelf: verticale stromen in verschillende tinten
  srnd((x*11)|0);
  for(let i=0;i<13;i++){
    const sx=x-hw+6+i*13+rnd()*5, w2=6+rnd()*8;
    const g2=c.createLinearGradient(0,apex,0,sill);
    g2.addColorStop(0,'rgba(255,214,110,0.95)');
    g2.addColorStop(0.35,'rgba(255,128,32,0.9)');
    g2.addColorStop(0.8,'rgba(186,44,12,0.85)');
    g2.addColorStop(1,'rgba(90,16,8,0.8)');
    c.fillStyle=g2; c.fillRect(sx,apex-10,w2,sill-apex+20);
  }
  // spetters en korsten die eroverheen liggen
  c.fillStyle='rgba(22,10,8,0.85)';
  for(let i=0;i<34;i++){
    const sx=x-hw+rnd()*hw*2, sy=apex+rnd()*(sill-apex);
    c.beginPath(); c.ellipse(sx,sy,3+rnd()*9,2+rnd()*4,rnd(),0,6.3); c.fill();
  }
  // gloed onderaan waar het in het bassin slaat
  const bs=c.createRadialGradient(x,sill,6,x,sill,120);
  bs.addColorStop(0,'rgba(255,196,96,0.85)'); bs.addColorStop(1,'rgba(255,110,30,0)');
  c.fillStyle=bs; c.fillRect(x-hw,sill-120,hw*2,140);
  c.restore();
  // zwaar ijzeren traliewerk ervoor
  c.strokeStyle='#100c0b'; c.lineWidth=9;
  for(let i=-2;i<=2;i++){ c.beginPath(); c.moveTo(x+i*30,apex+12); c.lineTo(x+i*30,sill); c.stroke(); }
  c.lineWidth=5; c.strokeStyle='#2b201c';
  for(let i=-2;i<=2;i++){ c.beginPath(); c.moveTo(x+i*30-1.5,apex+12); c.lineTo(x+i*30-1.5,sill); c.stroke(); }
  [300,400,500].forEach(yy=>{ c.strokeStyle='#100c0b'; c.lineWidth=8;
    c.beginPath(); c.moveTo(x-hw+6,yy); c.lineTo(x+hw-6,yy); c.stroke(); });
  // stenen omlijsting
  c.save(); arcPath(c,x,hw,apex,spring,sill);
  c.lineWidth=24; c.strokeStyle='#241a16'; c.stroke();
  c.lineWidth=11; c.strokeStyle='#3b2b23'; c.stroke();
  c.lineWidth=3; c.strokeStyle='rgba(255,130,50,0.25)'; c.stroke();
  c.restore();
  c.fillStyle='#2b201c'; c.fillRect(x-hw-20,sill-4,hw*2+40,18);
  c.fillStyle='#4a362c'; c.fillRect(x-hw-20,sill-8,hw*2+40,5);
  c.save(); c.globalCompositeOperation='lighter';
  pool(c,x,sill-40,180,'rgba(255,140,48,0.3)');
  c.restore();
}
function v_brazier(c,x,y){              // ijzeren vuurkorf aan een beugel
  c.fillStyle='#1a1311';
  c.beginPath(); c.moveTo(x-6,y); c.lineTo(x+26,y-10); c.lineTo(x+26,y-4); c.lineTo(x-2,y+8); c.closePath(); c.fill();
  c.fillStyle='#241a16';
  c.beginPath(); c.moveTo(x+8,y-12); c.lineTo(x+40,y-12); c.lineTo(x+34,y+12); c.lineTo(x+14,y+12); c.closePath(); c.fill();
  c.strokeStyle='#463229'; c.lineWidth=3;
  c.beginPath(); c.moveTo(x+8,y-12); c.lineTo(x+40,y-12); c.stroke();
  c.fillStyle='rgba(255,150,54,0.5)';
  c.beginPath(); c.ellipse(x+24,y-11,15,4,0,0,6.3); c.fill();
  // gloeiende kolen
  srnd((x*7)|0);
  for(let i=0;i<7;i++){ c.fillStyle='rgba(255,'+(120+rnd()*110|0)+',40,0.9)';
    c.beginPath(); c.arc(x+12+rnd()*24,y-11+rnd()*4,2+rnd()*2.4,0,6.3); c.fill(); }
}
function v_chain(c,x,y0,y1){
  c.strokeStyle='#2a1f1a'; c.lineWidth=3;
  for(let y=y0;y<y1;y+=9){
    c.beginPath(); c.ellipse(x,y,3.4,5,0,0,6.3); c.stroke();
  }
}
function v_caldera(c,gx){               // het uitzicht door de poort
  c.save(); archPath(c,gx); c.clip();
  const s=c.createLinearGradient(0,AR.apex-40,0,FLOOR_Y);
  s.addColorStop(0,'#1a0c10'); s.addColorStop(0.35,'#3a1410'); s.addColorStop(0.75,'#6b2208'); s.addColorStop(1,'#a3390c');
  c.fillStyle=s; c.fillRect(gx-AR.half,AR.apex-40,AR.half*2,FLOOR_Y-AR.apex+60);
  // aspluim met bliksem
  c.fillStyle='rgba(30,18,20,0.75)';
  srnd(91);
  for(let i=0;i<16;i++){
    const px=gx-70+rnd()*140, py=AR.apex+10+rnd()*120, r=24+rnd()*40;
    c.beginPath(); c.arc(px,py,r,0,6.3); c.fill();
  }
  c.strokeStyle='rgba(255,226,180,0.55)'; c.lineWidth=2;
  c.beginPath(); c.moveTo(gx-22,AR.apex+30); c.lineTo(gx-8,AR.apex+66);
  c.lineTo(gx-20,AR.apex+70); c.lineTo(gx-2,AR.apex+112); c.stroke();
  // verre kegels
  c.fillStyle='#1d0f0e';
  c.beginPath(); c.moveTo(gx-AR.half,470); c.lineTo(gx-52,360); c.lineTo(gx-16,470); c.closePath(); c.fill();
  c.fillStyle='#160b0b';
  c.beginPath(); c.moveTo(gx+6,470); c.lineTo(gx+62,326); c.lineTo(gx+AR.half,470); c.closePath(); c.fill();
  // lava die langs de flank loopt
  c.strokeStyle='rgba(255,150,50,0.95)'; c.lineWidth=3; c.lineCap='round';
  c.beginPath(); c.moveTo(gx+62,330); c.lineTo(gx+52,376); c.lineTo(gx+62,404); c.lineTo(gx+50,452); c.stroke();
  c.lineWidth=1.6; c.strokeStyle='rgba(255,222,150,0.9)';
  c.beginPath(); c.moveTo(gx+62,332); c.lineTo(gx+53,376); c.lineTo(gx+62,402); c.stroke();
  c.fillStyle='rgba(255,200,120,0.7)';
  c.beginPath(); c.ellipse(gx+62,322,9,5,0,0,6.3); c.fill();
  // het lavameer op de bodem
  const lk=c.createLinearGradient(0,468,0,FLOOR_Y+6);
  lk.addColorStop(0,'#ff9c30'); lk.addColorStop(0.45,'#e2550f'); lk.addColorStop(1,'#7e1f06');
  c.fillStyle=lk; c.fillRect(gx-AR.half,468,AR.half*2,FLOOR_Y-468+8);
  c.fillStyle='rgba(24,12,10,0.9)';                 // korstplaten op het meer
  srnd(17);
  for(let i=0;i<22;i++){
    const px=gx-AR.half+rnd()*AR.half*2, py=474+rnd()*110, w2=18+rnd()*46, h2=6+rnd()*12;
    c.beginPath(); c.ellipse(px,py,w2,h2,(rnd()-0.5)*0.4,0,6.3); c.fill();
  }
  c.save(); c.globalCompositeOperation='lighter';
  pool(c,gx,500,200,'rgba(255,150,50,0.45)');
  c.restore();
  c.restore();
}
function v_sign(c,gx){
  const w=256,h=138,x=gx-w/2,y=82;
  v_chain(c,x+36,y-52,y); v_chain(c,x+w-36,y-52,y);
  c.fillStyle='#1d1513'; rr(c,x-8,y,w+16,h,10); c.fill();
  c.fillStyle='#2f221d'; rr(c,x-3,y+5,w+6,h-10,8); c.fill();
  c.fillStyle='#0d0807'; rr(c,x+7,y+14,w-14,h-28,6); c.fill();
  c.strokeStyle='rgba(255,140,50,0.35)'; c.lineWidth=2; rr(c,x+7,y+14,w-14,h-28,6); c.stroke();
  // klinknagels
  c.fillStyle='#5a4136';
  for(let i=0;i<9;i++){ c.beginPath(); c.arc(x+14+i*(w-28)/8,y+8,3.2,0,6.3); c.fill();
    c.beginPath(); c.arc(x+14+i*(w-28)/8,y+h-8,3.2,0,6.3); c.fill(); }
  c.save(); c.globalCompositeOperation='lighter';
  pool(c,gx,y+68,120,'rgba(255,140,50,0.3)');
  c.restore();
  skull(c,gx,y+42,21,'#ff9c3a','#0d0807',true);
  c.fillStyle='#ffb457'; c.font='800 42px "Work Sans",system-ui,sans-serif'; c.letterSpacing='2px';
  c.fillText('HUB',gx,y+104); c.letterSpacing='0px';
  c.fillStyle='#e8c9a0'; c.font='600 22px "Work Sans",system-ui,sans-serif';
  c.fillText('game studio',gx,y+128);
}
function v_banner(c,cx){
  const top=CORN_Y-8,w=54,h=126;
  c.fillStyle='#2a1f1a'; c.fillRect(cx-w*0.6,top-9,w*1.2,9);
  const g2=c.createLinearGradient(cx-w/2,0,cx+w/2,0);
  g2.addColorStop(0,'#2b100c'); g2.addColorStop(0.4,'#54190f'); g2.addColorStop(1,'#280f0b');
  c.fillStyle=g2;
  c.beginPath(); c.moveTo(cx-w/2,top); c.lineTo(cx+w/2,top); c.lineTo(cx+w/2,top+h);
  c.lineTo(cx,top+h-20); c.lineTo(cx-w/2,top+h); c.closePath(); c.fill();
  c.strokeStyle='rgba(255,150,60,0.22)'; c.lineWidth=2; c.stroke();
  c.fillStyle='#6b4a3a';
  [-0.3,0.3].forEach(o=>{ c.beginPath(); c.arc(cx+w*o,top+6,3,0,6.3); c.fill(); });
  skull(c,cx,top+42,13,'#ff9c3a','#2b100c',true);
}
function v_niche(c,nx){
  const top=310, bot=524, hw=48;
  c.fillStyle='#0b0706';
  c.beginPath();
  c.moveTo(nx-hw,bot); c.lineTo(nx-hw,top+34);
  c.quadraticCurveTo(nx-hw,top,nx,top); c.quadraticCurveTo(nx+hw,top,nx+hw,top+34);
  c.lineTo(nx+hw,bot); c.closePath(); c.fill();
  c.strokeStyle='#332520'; c.lineWidth=10; c.stroke();
  c.save(); c.globalCompositeOperation='lighter';
  pool(c,nx,bot-46,110,'rgba(255,130,40,0.4)');
  c.restore();
  // ijzeren ketel met gloeiend gesteente
  c.fillStyle='#1b1411';
  c.beginPath(); c.ellipse(nx,bot-30,34,22,0,Math.PI,0,true); c.fill();
  c.fillRect(nx-34,bot-30,68,20);
  c.fillStyle='#3a2a22'; c.fillRect(nx-36,bot-34,72,6);
  const lg=c.createRadialGradient(nx,bot-34,3,nx,bot-34,34);
  lg.addColorStop(0,'#ffd478'); lg.addColorStop(0.5,'#ff8a20'); lg.addColorStop(1,'rgba(200,50,10,0)');
  c.fillStyle=lg; c.beginPath(); c.ellipse(nx,bot-34,32,9,0,0,6.3); c.fill();
  skull(c,nx,bot-96,17,'#c9a882','#0b0706',true);
}
function v_wall(q){
  // grondtoon: donker gesteente met warme gloed van onder
  q.fillStyle=vgrad(q,CORN_Y,FLOOR_Y+8,[[0,'#120a09'],[0.45,'#1d100d'],[0.82,'#2a1510'],[1,'#3a1a10']]);
  q.fillRect(0,CORN_Y,PW,FLOOR_Y-CORN_Y+8);
  // basaltzuilen over de hele ronde
  let x=0, i=0;
  while(x<PW){ const w=38+((i*37)%26); v_column(q,x+w/2,w,i*911+5); x+=w+2; i++; }
  // gloeiende scheuren, gebakken in de wand
  q.save(); q.globalCompositeOperation='lighter';
  srnd(1234);
  for(let k=0;k<26;k++){
    const cx=rnd()*PW, cy=CORN_Y+40+rnd()*(FLOOR_Y-CORN_Y-90);
    v_crack(q,cx,cy,30+rnd()*36,rnd()*6.3,3.4,4,'rgba(255,112,26,0.55)');
    v_crack(q,cx,cy,26+rnd()*30,rnd()*6.3,1.5,4,'rgba(255,216,140,0.75)');
    pool(q,cx,cy,86,'rgba(255,110,30,0.16)');
  }
  q.restore();
  // ashaagje langs de bovenrand
  q.fillStyle='rgba(60,48,46,0.5)'; q.fillRect(0,CORN_Y,PW,16);
  q.fillStyle='rgba(120,104,98,0.22)'; q.fillRect(0,CORN_Y+14,PW,4);

  OPEN.forEach(nx=>v_lavafall(q,nx));
  NICHE.forEach(nx=>v_niche(q,nx));
  // poort
  q.fillStyle=vgrad(q,CORN_Y,FLOOR_Y,[[0,'#2c1d18'],[0.45,'#1e1310'],[1,'#150d0b']]);
  q.fillRect(GATE_PX-150,CORN_Y,300,FLOOR_Y-CORN_Y+8);
  v_caldera(q,GATE_PX);
  q.save(); archPath(q,GATE_PX); q.lineWidth=17; q.strokeStyle='#2f211b'; q.stroke();
  q.lineWidth=7; q.strokeStyle='#120b09'; q.stroke(); q.restore();
  q.beginPath();
  q.moveTo(GATE_PX-AR.half-18,FLOOR_Y+4); q.lineTo(GATE_PX-AR.half-18,AR.spring-6);
  q.quadraticCurveTo(GATE_PX-AR.half-7,AR.apex+18,GATE_PX,AR.apex-18);
  q.quadraticCurveTo(GATE_PX+AR.half+7,AR.apex+18,GATE_PX+AR.half+18,AR.spring-6);
  q.lineTo(GATE_PX+AR.half+18,FLOOR_Y+4);
  q.lineWidth=13; q.strokeStyle='#3c2a22'; q.stroke();
  // gesmolten kanaal dat onder de poort door de zaal in loopt
  q.save(); q.globalCompositeOperation='lighter';
  pool(q,GATE_PX,FLOOR_Y-10,150,'rgba(255,140,50,0.4)');
  q.restore();
  v_sign(q,GATE_PX);
  BANNER.forEach(bx=>v_banner(q,bx));
  SCONCE.forEach((sx,k)=>v_brazier(q,sx-14,418));
  CEIL.forEach(lx=>{                     // hangende kolenkorven
    q.save(); q.globalCompositeOperation='lighter';
    pool(q,lx,200,110,'rgba(255,140,48,0.26)');
    q.restore();
    v_chain(q,lx,150,186);
    q.fillStyle='#1b1411';
    q.beginPath(); q.moveTo(lx-13,186); q.lineTo(lx+13,186); q.lineTo(lx+9,206); q.lineTo(lx-9,206); q.closePath(); q.fill();
    q.fillStyle='rgba(255,168,70,0.85)';
    q.beginPath(); q.ellipse(lx,187,11,3.4,0,0,6.3); q.fill();
  });
  // lichtplekken van de korven
  q.save(); q.globalCompositeOperation='lighter';
  SCONCE.forEach(sx=>pool(q,sx,404,180,'rgba(255,128,36,0.42)'));
  q.restore();
  // voet van de wand: gestolde stroom met gloeiende naad
  q.fillStyle='#1a100d'; q.fillRect(0,FLOOR_Y-24,PW,24);
  q.fillStyle='#2b1a14'; q.fillRect(0,FLOOR_Y-28,PW,6);
  q.save(); q.globalCompositeOperation='lighter';
  q.fillStyle='rgba(255,120,34,0.5)'; q.fillRect(0,FLOOR_Y-9,PW,4);
  q.fillStyle='rgba(255,208,140,0.5)'; q.fillRect(0,FLOOR_Y-8,PW,1.6);
  q.restore();
  q.fillStyle='rgba(0,0,0,0.45)'; q.fillRect(0,FLOOR_Y-3,PW,8);
}
const V_CRACKS=(function(){        // vooraf berekend: scheelt werk per beeld
  const out=[];
  function seg(list,x0,y0,len,ang,wide,depth){
    if(depth<=0||len<7) return;
    const x1=x0+Math.cos(ang)*len, y1=y0+Math.sin(ang)*len;
    list.push([x0,y0,x1,y1,wide]);
    seg(list,x1,y1,len*(0.64+rnd()*0.2),ang+(rnd()-0.5)*1.1,wide*0.66,depth-1);
    if(rnd()<0.55) seg(list,x1,y1,len*0.5,ang+(rnd()-0.5)*1.6,wide*0.55,depth-1);
  }
  for(let i=0;i<6;i++){
    srnd(i*577+3);
    const list=[]; seg(list,0,0,44,0.4+i,2.6,4);
    const list2=[]; srnd(i*331+9); seg(list2,0,0,36,2.1+i,1.2,4);
    out.push({px:i*(PW/6)+240, dy:-70-((i*23)%50), a:list, b:list2});
  }
  return out;
})();
function v_roof(c){
  c.save(); roofClip(c);
  if(!_rg) _rg=vgrad(c,-130,CORN_Y+20,[[0,'#080504'],[0.5,'#140907'],[1,'#26100b']]);
  c.fillStyle=_rg; c.fillRect(0,-130,W,CORN_Y+150);
  // gloeiende breuken in het obsidiaan, ademend
  const puls=0.55+0.45*Math.sin(T*0.9);
  c.save(); c.globalCompositeOperation='lighter'; c.lineCap='round';
  V_CRACKS.forEach(cr=>{
    const x=P(cr.px); if(!vis(x,300)) return;
    const y=CORN_Y+bow(x)+cr.dy;
    c.strokeStyle='rgba(255,96,24,'+(0.34+0.2*puls)+')';
    cr.a.forEach(s2=>{ c.lineWidth=s2[4]; c.beginPath();
      c.moveTo(x+s2[0],y+s2[1]); c.lineTo(x+s2[2],y+s2[3]); c.stroke(); });
    c.strokeStyle='rgba(255,206,130,'+(0.4+0.25*puls)+')';
    cr.b.forEach(s2=>{ c.lineWidth=s2[4]; c.beginPath();
      c.moveTo(x+s2[0],y+s2[1]); c.lineTo(x+s2[2],y+s2[3]); c.stroke(); });
    pool(c,x,y,150,'rgba(255,100,28,'+(0.10+0.06*puls)+')');
  });
  c.restore();
  // hangende vuurkorven aan kettingen
  HANG.forEach(px=>{
    const x=P(px); if(!vis(x,140)) return;
    const y=CORN_Y+bow(x)-52;
    c.strokeStyle='#221814'; c.lineWidth=3;
    c.beginPath(); c.moveTo(x,-40); c.lineTo(x,y-28); c.stroke();
    c.fillStyle='#181210';
    c.beginPath(); c.ellipse(x,y,44,13,0,0,6.3); c.fill();
    c.strokeStyle='#3a2a22'; c.lineWidth=6;
    c.beginPath(); c.ellipse(x,y,44,13,0,0,6.3); c.stroke();
    c.strokeStyle='#221814'; c.lineWidth=2.4;
    [-28,0,28].forEach(d=>{ c.beginPath(); c.moveTo(x+d,y-26); c.lineTo(x+d*0.4,y-2); c.stroke(); });
    const gl=c.createRadialGradient(x,y-4,3,x,y-4,46);
    gl.addColorStop(0,'rgba(255,214,130,0.9)'); gl.addColorStop(0.5,'rgba(255,120,36,0.5)');
    gl.addColorStop(1,'rgba(255,90,20,0)');
    c.fillStyle=gl; c.beginPath(); c.ellipse(x,y-4,42,12,0,0,6.3); c.fill();
  });
  c.restore();
  cornice(c,-30,8,'#5a4034');
  cornice(c,-23,26,'#2c1e18');
  cornice(c,3,8,'rgba(0,0,0,0.5)');
  c.save(); c.globalCompositeOperation='lighter';
  cornice(c,-6,3,'rgba(255,120,36,0.3)');
  c.restore();
  c.fillStyle='#241813';
  for(let i=0;i<60;i++){
    const x=P(i*(PW/60));
    if(vis(x,20)) c.fillRect(x-6,CORN_Y+bow(x)+11,12,8);
  }
}
function v_floor(c){
  c.save(); floorClip(c);
  if(!_fg) _fg=vgrad(c,FLOOR_Y,HH,[[0,'#241611'],[0.3,'#150d0a'],[1,'#060403']]);
  c.fillStyle=_fg; c.fillRect(0,FLOOR_Y-24,W,HH-FLOOR_Y+24);
  // basaltplaten
  c.strokeStyle='rgba(0,0,0,0.5)'; c.lineWidth=2;
  for(let k=1;k<7;k++){
    const o=k*46;
    c.beginPath();
    for(let x=0;x<=W;x+=12){ const y=FLOOR_Y+bow(x)+o; x?c.lineTo(x,y):c.moveTo(x,y); }
    c.stroke();
  }
  for(let k=0;k<26;k++){
    const x=P(k*(PW/26)+30);
    if(!vis(x,30)) continue;
    c.beginPath(); c.moveTo(x,FLOOR_Y+bow(x)); c.lineTo(FCX+(x-FCX)*0.2,HH); c.stroke();
  }
  // gloeiende naden naar elk scherm
  c.save(); runnersClip(c);
  wedge(c,GATE_PX,86,'rgba(120,32,10,0.85)','rgba(255,140,50,0.8)');
  SCREENS.forEach(S=>wedge(c,S.px,42,'rgba(96,26,8,0.8)','rgba(255,132,40,0.7)'));
  c.restore();
  // de ring is een gesmolten kanaal met ijzeren roosters erover
  ringBand(c,104,176,'#0a0605');
  c.save();
  c.beginPath();
  for(let x=0;x<=W;x+=12){ const y=FLOOR_Y+bow(x)+108; x?c.lineTo(x,y):c.moveTo(x,y); }
  for(let x=W;x>=0;x-=12) c.lineTo(x,FLOOR_Y+bow(x)+172);
  c.closePath(); c.clip();
  const flow=(T*26)%160;
  const lg=c.createLinearGradient(0,FLOOR_Y+100,0,FLOOR_Y+180);
  lg.addColorStop(0,'#ff8c24'); lg.addColorStop(0.45,'#e0490c'); lg.addColorStop(1,'#6d1a05');
  c.fillStyle=lg; c.fillRect(0,FLOOR_Y+100,W,90);
  c.fillStyle='rgba(16,8,6,0.88)';                 // drijvende korstplaten
  for(let k=0;k<14;k++){
    const bx=((k*187+flow)%(W+240))-120, by=FLOOR_Y+bow(bx)+118+((k*53)%44);
    c.beginPath(); c.ellipse(bx,by,26+((k*17)%30),7+((k*11)%7),0,0,6.3); c.fill();
  }
  c.fillStyle='rgba(255,226,160,0.5)';
  for(let k=0;k<10;k++){
    const bx=((k*401-flow*1.6)%(W+240))-120, by=FLOOR_Y+bow(bx)+126+((k*37)%36);
    c.beginPath(); c.ellipse(bx,by,10,2.6,0,0,6.3); c.fill();
  }
  c.restore();
  c.strokeStyle='#150d0b'; c.lineWidth=6;          // roosterspijlen over het kanaal
  for(let k=0;k<30;k++){
    const x=P(k*(PW/30)+18); if(!vis(x,40)) continue;
    c.beginPath(); c.moveTo(x,FLOOR_Y+bow(x)+104); c.lineTo(FCX+(x-FCX)*0.72,FLOOR_Y+bow(x)+178); c.stroke();
  }
  ringLine(c,104,'#2e1f19',5); ringLine(c,176,'#2e1f19',5);
  c.save(); c.globalCompositeOperation='lighter';
  ringLine(c,102,'rgba(255,150,60,0.4)',3); ringLine(c,178,'rgba(255,150,60,0.4)',3);
  c.restore();
  floorSheen(c,'rgba(255,150,80,0.16)','rgba(0,0,0,0.5)');
  if(!_sg) _sg=vgrad(c,FLOOR_Y,FLOOR_Y+180,[[0,'rgba(255,150,60,0.18)'],[1,'rgba(255,110,30,0)']]);
  c.fillStyle=_sg; c.fillRect(0,FLOOR_Y-10,W,200);
  c.restore();
  floorEdge(c,'rgba(0,0,0,0.5)');
  const mx=P(GATE_PX);
  if(vis(mx,320)){
    const dy=bow(mx);
    c.save(); c.translate(mx,716+dy); c.scale(1,0.3);
    c.strokeStyle='rgba(255,140,50,0.45)'; c.lineWidth=9;
    [250,196].forEach(r=>{ c.beginPath(); c.arc(0,0,r,0,6.3); c.stroke(); });
    c.restore();
    c.save(); c.globalAlpha=0.75; c.translate(mx,718+dy); c.scale(1,0.3);
    skull(c,0,-16,80,'#ff9c3a','#2a0f08',true);
    c.restore();
  }
}
function v_anvil(c,x,y,s){
  c.fillStyle='#17110f';
  c.fillRect(x-20*s,y-12*s,40*s,12*s);
  c.fillRect(x-9*s,y-30*s,18*s,20*s);
  c.beginPath(); c.moveTo(x-26*s,y-42*s); c.lineTo(x+18*s,y-42*s);
  c.lineTo(x+34*s,y-36*s); c.lineTo(x+18*s,y-32*s); c.lineTo(x-26*s,y-32*s); c.closePath(); c.fill();
  c.fillStyle='#352721'; c.fillRect(x-26*s,y-42*s,52*s,3*s);
  c.fillStyle='rgba(255,150,60,0.5)'; c.fillRect(x-12*s,y-40*s,20*s,2*s);
}
function v_ingots(c,x,y,s){
  for(let r=0;r<3;r++) for(let k=0;k<3-r;k++){
    const bx=x+k*22*s+r*11*s, by=y-r*11*s;
    c.fillStyle=r===2&&k===0?'#c9521a':'#2a1c16';
    c.beginPath(); c.moveTo(bx,by); c.lineTo(bx+20*s,by); c.lineTo(bx+17*s,by-10*s); c.lineTo(bx+3*s,by-10*s); c.closePath(); c.fill();
    c.fillStyle='rgba(255,150,60,0.28)'; c.fillRect(bx+3*s,by-10*s,14*s,2*s);
  }
}
function v_shard(c,x,y,s){
  c.fillStyle='#0d0a0c';
  c.beginPath(); c.moveTo(x,y); c.lineTo(x-13*s,y-8*s); c.lineTo(x-5*s,y-44*s);
  c.lineTo(x+7*s,y-30*s); c.lineTo(x+15*s,y-6*s); c.closePath(); c.fill();
  c.fillStyle='rgba(180,140,255,0.16)';
  c.beginPath(); c.moveTo(x-5*s,y-44*s); c.lineTo(x+7*s,y-30*s); c.lineTo(x+2*s,y-6*s); c.closePath(); c.fill();
  c.fillStyle='rgba(255,140,60,0.25)'; c.fillRect(x-11*s,y-8*s,24*s,3*s);
}
function v_props(c){
  SCREENS.forEach(S=>{ const x=P(S.px); if(vis(x,240)){
    reflectStrip(c,x,SCR_W*0.85,'rgba(255,150,70,0.2)',170); benchLight(c,x,700+bow(x),150); } });
  const gx=P(GATE_PX); if(vis(gx,260)) reflectStrip(c,gx,210,'rgba(255,150,60,0.3)',210);
  SCONCE.forEach(px=>{ const x=P(px); if(vis(x,80)) reflectStrip(c,x,56,'rgba(255,140,50,0.3)',175); });
  FLOOR_LAMPS.forEach(([px,y])=>{           // kleine kolenpotjes langs de rand
    const x=P(px); if(!vis(x,40)) return;
    const yy=y+bow(x);
    c.fillStyle='#1a1210';
    c.beginPath(); c.moveTo(x-7,yy); c.lineTo(x+7,yy); c.lineTo(x+5,yy-11); c.lineTo(x-5,yy-11); c.closePath(); c.fill();
    c.fillStyle='rgba(255,150,50,0.8)';
    c.beginPath(); c.ellipse(x,yy-11,5,1.8,0,0,6.3); c.fill();
  });
  let x=P(640);
  if(vis(x,280)){                            // de smidse
    c.save(); c.translate(0,bow(x));
    v_anvil(c,x-40,806,1.15);
    v_ingots(c,x+34,818,1);
    c.strokeStyle='#241a16'; c.lineWidth=5; c.lineCap='round';
    c.beginPath(); c.moveTo(x-96,812); c.quadraticCurveTo(x-72,834,x-48,816); c.stroke();
    v_shard(c,x+140,820,1);
    c.restore();
  }
  x=P(1660);
  if(vis(x,220)){                            // gestolde bobbels waar je overheen springt
    c.save(); c.translate(0,bow(x));
    [[-60,828,74,26],[6,800,74,30],[74,830,74,24]].forEach(([d,y2,w,h])=>{
      c.fillStyle=vgrad(c,y2-h,y2,[[0,'#3a2a22'],[1,'#150d0b']]);
      rr(c,x+d-w/2,y2-h,w,h,7); c.fill();
      c.strokeStyle='rgba(255,130,44,0.3)'; c.lineWidth=2; c.stroke();
    });
    c.fillStyle='rgba(255,180,80,0.85)';
    [[-36,774],[44,764]].forEach(([d,y2])=>{ c.beginPath(); c.ellipse(x+d,y2,10,12,0,0,6.3); c.fill(); });
    c.restore();
  }
  x=P(2380);
  if(vis(x,240)){                            // een stollende stroom dwars over de vloer
    c.save(); c.translate(0,bow(x));
    const st=c.createLinearGradient(x-120,0,x+140,0);
    st.addColorStop(0,'rgba(20,11,9,0.9)'); st.addColorStop(0.5,'rgba(226,80,16,0.85)');
    st.addColorStop(1,'rgba(20,11,9,0.9)');
    c.fillStyle=st;
    c.beginPath(); c.moveTo(x-130,830); c.quadraticCurveTo(x-20,798,x+130,826);
    c.lineTo(x+126,846); c.quadraticCurveTo(x-20,818,x-134,850); c.closePath(); c.fill();
    c.fillStyle='rgba(255,220,150,0.5)';
    c.beginPath(); c.ellipse(x+10,822,40,3.4,-0.06,0,6.3); c.fill();
    v_shard(c,x-150,836,0.8); v_shard(c,x+156,832,0.9);
    c.restore();
  }
  x=P(3320);
  if(vis(x,260)){
    c.save(); c.translate(0,bow(x));
    crateProp(c,x-80,826,1); crateProp(c,x-14,830,1.05);
    v_ingots(c,x-54,786,0.8);
    barrelProp(c,x+130,820,0.9);
    rock(c,x+206,760,1.2); v_shard(c,x+216,790,1.1);
    c.restore();
  }
  [[120,812,1],[2140,860,0.8],[3000,872,0.9],[980,846,0.7],[2860,856,0.6]].forEach(([px,y,s])=>{
    const xx=P(px); if(!vis(xx,90)) return;
    rock(c,xx,y+bow(xx),s);
    c.fillStyle='rgba(255,130,44,0.22)'; c.fillRect(xx-30*s,y+bow(xx)-3,60*s,3);
  });
}
const EMBERS=[];
for(let i=0;i<70;i++) EMBERS.push({px:rnd()*PW, y:600+rnd()*300, sp:12+rnd()*30, ph:rnd()*6.3, s:1+rnd()*1.8});
const ASH=[];
for(let i=0;i<60;i++) ASH.push({px:rnd()*PW, y:rnd()*760, sp:9+rnd()*16, ph:rnd()*6.3, s:1+rnd()*1.6});
function v_ambient(c){
  // opstijgende vonken
  EMBERS.forEach((e,i)=>{
    const x=P(e.px)+Math.sin(T*1.3+e.ph)*9;
    if(!vis(x,40)) return;
    const y=e.y-((T*e.sp)%420);
    const a=Math.max(0,1-((e.y-y)/420))*0.9;
    c.fillStyle='rgba(255,'+(140+((i*37)%90))+',50,'+a.toFixed(3)+')';
    c.fillRect(x,y+bow(x),e.s,e.s*1.6);
  });
  // dwarrelende as
  c.fillStyle='rgba(150,138,132,0.35)';
  ASH.forEach(e=>{
    const x=P(e.px)+Math.sin(T*0.7+e.ph)*20;
    if(!vis(x,30)) return;
    const y=((e.y+T*e.sp)%860)-40;
    c.fillRect(x,y+bow(x),e.s,e.s);
  });
  // druppel die van het plafond valt
  const dt=(T*0.4)%1, dx=P(1560);
  if(vis(dx,60)&&dt<0.55){
    const y=CORN_Y+bow(dx)-20+dt*760;
    c.fillStyle='rgba(255,170,70,0.9)';
    c.beginPath(); c.ellipse(dx,y,3,7,0,0,6.3); c.fill();
    c.fillStyle='rgba(255,230,170,0.8)';
    c.beginPath(); c.ellipse(dx,y-2,1.6,3.4,0,0,6.3); c.fill();
  }
}
function v_fire(c){
  SCONCE.forEach((px,i)=>{ const x=P(px); if(vis(x,90)) flame(c,x+10,404+bow(x),1.25,i*1.7); });
  CEIL.forEach((px,k)=>{ const x=P(px); if(vis(x,70)) flame(c,x,184+bow(x),0.55,k*2.1,0.9); });
  FLOOR_LAMPS.forEach(([px,y],i)=>{ const x=P(px); if(vis(x,50)) flame(c,x,y-14+bow(x),0.4,i*0.9); });
  HANG.forEach((px,j)=>{
    const x=P(px); if(!vis(x,120)) return;
    const y=CORN_Y+bow(x)-52;
    for(let i=0;i<5;i++){ const a=i*1.257; flame(c,x+Math.cos(a)*34,y+Math.sin(a)*10-12,0.5,j*3+i,1); }
  });
  OPEN.forEach((px,i)=>{ const x=P(px); if(vis(x,140)) flame(c,x,520+bow(x),0.9,i*2.3,0.9); });
  const gx=P(GATE_PX);
  if(vis(gx,280)){
    c.save(); c.globalCompositeOperation='lighter';
    pool(c,gx,FLOOR_Y+bow(gx)-4,220,'rgba(255,130,40,'+(0.16+0.06*Math.sin(T*2.1))+')');
    c.restore();
  }
}
