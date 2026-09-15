
/* =====================================================================
   RUIMTE — een ringstation, de zaal draait om een glazen koepel
===================================================================== */
function s_panel(c,x,y,w,h,base,edge){
  c.fillStyle=base; c.fillRect(x,y,w,h);
  c.strokeStyle='rgba(0,0,0,0.5)'; c.lineWidth=2; c.strokeRect(x+1,y+1,w-2,h-2);
  c.strokeStyle=edge; c.lineWidth=1.4;
  c.beginPath(); c.moveTo(x+2,y+2.5); c.lineTo(x+w-2,y+2.5); c.stroke();
  c.fillStyle='rgba(255,255,255,0.05)'; c.fillRect(x+2,y+2,w-4,3);
}
function s_rivets(c,x,y,w,n,col){
  c.fillStyle=col;
  for(let i=0;i<n;i++){ c.beginPath(); c.arc(x+8+i*(w-16)/(n-1),y,2.2,0,6.3); c.fill(); }
}
function s_hazard(c,x,y,w,h){
  c.save(); c.beginPath(); c.rect(x,y,w,h); c.clip();
  c.fillStyle='#161a20'; c.fillRect(x,y,w,h);
  c.fillStyle='#c8a33a';
  for(let i=-1;i<w/16+1;i++){
    c.beginPath(); c.moveTo(x+i*16,y+h); c.lineTo(x+i*16+9,y+h);
    c.lineTo(x+i*16+9+h,y); c.lineTo(x+i*16+h,y); c.closePath(); c.fill();
  }
  c.restore();
  c.strokeStyle='rgba(0,0,0,0.55)'; c.lineWidth=2; c.strokeRect(x,y,w,h);
}
function s_conduit(c,y,col){
  c.strokeStyle='#141a22'; c.lineWidth=13; seam(c,y,'#141a22',13);
  c.strokeStyle='#1e2833'; c.lineWidth=8;  seam(c,y-1,'#1e2833',8);
  c.strokeStyle=col; c.lineWidth=2;        seam(c,y+3,col,2);
  c.fillStyle='#2a3644';
  for(let x=0;x<PW;x+=96) c.fillRect(x,y-9,10,18);
}
function s_viewport(c,x,variant){
  const hw=104, top=272, bot=520;
  c.save();
  rr(c,x-hw,top,hw*2,bot-top,22); c.clip();
  c.fillStyle='#01030a'; c.fillRect(x-hw,top,hw*2,bot-top);
  starFieldLocal(c,x-hw,top,hw*2,bot-top,110,(x*7)|0);
  if(variant===0){                            // gasreus met ringen
    const g2=c.createRadialGradient(x+30,392,10,x+30,392,120);
    g2.addColorStop(0,'#e8c184'); g2.addColorStop(0.5,'#b9813f'); g2.addColorStop(1,'#6d4622');
    c.fillStyle=g2; c.beginPath(); c.arc(x+30,392,96,0,6.3); c.fill();
    c.save(); c.beginPath(); c.arc(x+30,392,96,0,6.3); c.clip();
    ['rgba(240,214,170,0.5)','rgba(140,92,44,0.5)','rgba(226,190,140,0.4)','rgba(120,74,36,0.5)']
      .forEach((col,i)=>{ c.fillStyle=col; c.fillRect(x-70,340+i*26,200,13); });
    c.fillStyle='rgba(212,160,96,0.55)';
    c.beginPath(); c.ellipse(x-4,368,26,11,-0.3,0,6.3); c.fill();
    c.restore();
    c.fillStyle='rgba(6,8,16,0.55)';            // nachtzijde
    c.beginPath(); c.arc(x+30,392,96,-1.1,1.5); c.fill();
    c.save(); c.translate(x+30,392); c.rotate(-0.34); c.scale(1,0.18);
    ['rgba(228,204,166,0.55)','rgba(180,150,110,0.4)'].forEach((col,i)=>{
      c.strokeStyle=col; c.lineWidth=13-i*5;
      c.beginPath(); c.arc(0,0,132+i*22,0,6.3); c.stroke();
    });
    c.restore();
  } else if(variant===1){                     // nevel met een jonge sterrenhoop
    ['rgba(96,54,168,0.34)','rgba(196,58,128,0.26)','rgba(52,124,204,0.26)'].forEach((col,i)=>{
      const g3=c.createRadialGradient(x-30+i*44,360+i*34,8,x-30+i*44,360+i*34,120);
      g3.addColorStop(0,col); g3.addColorStop(1,'rgba(0,0,0,0)');
      c.fillStyle=g3; c.fillRect(x-hw,top,hw*2,bot-top);
    });
    starFieldLocal(c,x-hw,top,hw*2,bot-top,60,(x*11)|0,'rgba(226,236,255,0.95)');
    srnd(55);
    for(let i=0;i<9;i++){                      // heldere sterren met een kruisflare
      const sx=x-70+rnd()*140, sy=top+40+rnd()*170;
      c.fillStyle='rgba(236,244,255,0.95)';
      c.beginPath(); c.arc(sx,sy,2.4,0,6.3); c.fill();
      c.strokeStyle='rgba(200,222,255,0.45)'; c.lineWidth=1;
      c.beginPath(); c.moveTo(sx-9,sy); c.lineTo(sx+9,sy);
      c.moveTo(sx,sy-9); c.lineTo(sx,sy+9); c.stroke();
    }
  } else if(variant===2){                     // maan met een mijnbouwinstallatie
    const g2=c.createRadialGradient(x-14,400,8,x-14,400,110);
    g2.addColorStop(0,'#cfd6dd'); g2.addColorStop(0.6,'#8b949f'); g2.addColorStop(1,'#3e4650');
    c.fillStyle=g2; c.beginPath(); c.arc(x-14,400,92,0,6.3); c.fill();
    c.save(); c.beginPath(); c.arc(x-14,400,92,0,6.3); c.clip();
    c.fillStyle='rgba(60,68,78,0.6)'; srnd(23);
    for(let i=0;i<16;i++){
      const cx2=x-90+rnd()*160, cy2=330+rnd()*140, r=4+rnd()*15;
      c.beginPath(); c.arc(cx2,cy2,r,0,6.3); c.fill();
      c.strokeStyle='rgba(190,200,212,0.35)'; c.lineWidth=1.4;
      c.beginPath(); c.arc(cx2,cy2,r,0,6.3); c.stroke();
    }
    c.fillStyle='rgba(8,10,18,0.6)'; c.beginPath(); c.arc(x+16,400,96,-1.2,1.4); c.fill();
    c.restore();
    c.fillStyle='#2b3542';                     // installatie op de rand
    c.fillRect(x-42,318,7,26); c.fillRect(x-20,310,7,34); c.fillRect(x+2,322,7,22);
    c.fillRect(x-48,336,64,7);
    c.fillStyle='#ffb14a';
    [[-39,314],[-17,306],[5,318]].forEach(([dx,dy])=>{ c.beginPath(); c.arc(x+dx+3,dy,2.2,0,6.3); c.fill(); });
  } else {                                     // asteroïdenveld met een vrachtschip
    srnd(77);
    for(let i=0;i<16;i++){
      const ax=x-hw+10+rnd()*(hw*2-20), ay=top+16+rnd()*(bot-top-32), r=5+rnd()*22;
      c.fillStyle=vgrad(c,ay-r,ay+r,[[0,'#565f6b'],[1,'#20262e']]);
      c.beginPath();
      for(let k=0;k<8;k++){
        const a=k*0.785, rr2=r*(0.72+rnd()*0.5);
        k?c.lineTo(ax+Math.cos(a)*rr2,ay+Math.sin(a)*rr2):c.moveTo(ax+Math.cos(a)*rr2,ay+Math.sin(a)*rr2);
      }
      c.closePath(); c.fill();
      c.fillStyle='rgba(0,0,0,0.35)';
      c.beginPath(); c.arc(ax+r*0.3,ay+r*0.2,r*0.3,0,6.3); c.fill();
    }
    c.fillStyle='#39434f';                      // het schip
    c.fillRect(x-56,392,88,17);
    c.fillStyle='#4c5865'; c.fillRect(x+24,386,22,28);
    c.beginPath(); c.moveTo(x-56,392); c.lineTo(x-78,400); c.lineTo(x-56,409); c.closePath(); c.fill();
    c.fillStyle='#7fd8ff';
    c.fillRect(x+30,392,10,5);
    c.fillStyle='rgba(120,200,255,0.85)'; c.fillRect(x-84,398,10,4);
    c.fillStyle='rgba(120,200,255,0.3)'; c.fillRect(x-110,396,28,8);
    c.fillStyle='#ff5a4a'; c.beginPath(); c.arc(x-10,388,2,0,6.3); c.fill();
  }
  c.restore();
  // ruit, kozijn en kruisverstevigingen
  c.strokeStyle='rgba(150,220,255,0.12)'; c.lineWidth=2;
  c.beginPath(); c.moveTo(x-hw+16,top+16); c.lineTo(x+hw-40,bot-24); c.stroke();
  c.strokeStyle='#28323e'; c.lineWidth=26; rr(c,x-hw,top,hw*2,bot-top,22); c.stroke();
  c.strokeStyle='#495768'; c.lineWidth=14; rr(c,x-hw,top,hw*2,bot-top,22); c.stroke();
  c.strokeStyle='rgba(0,0,0,0.45)'; c.lineWidth=3; rr(c,x-hw-9,top-9,hw*2+18,bot-top+18,26); c.stroke();
  c.fillStyle='#2b3644';
  c.fillRect(x-7,top+6,14,bot-top-12);
  c.fillRect(x-hw+6,388,hw*2-12,12);
  c.fillStyle='#3d4b5c'; c.fillRect(x-7,top+6,14,3); c.fillRect(x-hw+6,388,hw*2-12,3);
  s_rivets(c,x-hw,top-16,hw*2,9,'#63748a');
  s_rivets(c,x-hw,bot+16,hw*2,9,'#63748a');
  c.fillStyle='#7fd8ff'; c.font='700 11px ui-monospace,Menlo,monospace'; c.textAlign='center';
  c.fillText(['SECTOR 04','SECTOR 09','SECTOR 12','SECTOR 17'][variant%4],x,bot+42);
  c.save(); c.globalCompositeOperation='lighter';
  pool(c,x,396,190,'rgba(90,170,230,0.14)');
  c.restore();
}
function starFieldLocal(c,x,y,w,h,n,seed,col){
  srnd(seed>>>0);
  for(let i=0;i<n;i++){
    const sx=x+rnd()*w, sy=y+rnd()*h, r=rnd();
    c.fillStyle=col||('rgba(200,218,246,'+(0.3+r*0.7).toFixed(2)+')');
    const s=r>0.95?2.4:(r>0.75?1.6:1);
    c.fillRect(sx,sy,s,s);
  }
}
function s_strip(c,x,y,w){                  // plasmalijst
  c.fillStyle='#161d26'; c.fillRect(x,y-7,w,16);
  c.fillStyle='#0c1219'; c.fillRect(x+3,y-4,w-6,10);
  const g2=c.createLinearGradient(x,y-4,x,y+6);
  g2.addColorStop(0,'rgba(140,224,255,0.95)'); g2.addColorStop(0.5,'rgba(70,170,230,0.8)');
  g2.addColorStop(1,'rgba(40,110,180,0.5)');
  c.fillStyle=g2; c.fillRect(x+5,y-3,w-10,8);
  c.fillStyle='#39485a'; c.fillRect(x,y-8,w,3);
}
function s_beacon(c,x,y){
  c.fillStyle='#232d3a';
  c.beginPath(); c.moveTo(x-3,y); c.lineTo(x+21,y-7); c.lineTo(x+21,y-2); c.lineTo(x-1,y+5); c.closePath(); c.fill();
  c.fillStyle='#2f3d4c'; c.fillRect(x+15,y-22,14,16);
  c.fillStyle='#ffae3a'; c.fillRect(x+17,y-20,10,12);
  c.fillStyle='rgba(255,180,70,0.4)';
  c.beginPath(); c.moveTo(x+22,y-14); c.lineTo(x+70,y-34); c.lineTo(x+70,y+6); c.closePath(); c.fill();
  c.fillStyle='#4b5c70'; c.fillRect(x+14,y-25,16,4);
}
function s_leds(c,x,y,n,seed){
  srnd(seed>>>0);
  for(let i=0;i<n;i++){
    const v=rnd();
    c.fillStyle=v<0.3?'#61e08a':(v<0.6?'#7fd8ff':(v<0.85?'#ffae3a':'#ff5a4a'));
    c.fillRect(x+i*9,y,4,4);
  }
}
function s_arch(c,gx){                      // rechthoekige sluisopening
  const hw=AR.half+4, top=AR.apex+2, bot=FLOOR_Y+4, r=28;
  c.beginPath();
  c.moveTo(gx-hw,bot); c.lineTo(gx-hw,top+r);
  c.quadraticCurveTo(gx-hw,top,gx-hw+r,top);
  c.lineTo(gx+hw-r,top); c.quadraticCurveTo(gx+hw,top,gx+hw,top+r);
  c.lineTo(gx+hw,bot); c.closePath();
}
function s_limb(c,gx){                      // uitzicht door de sluis
  c.save(); s_arch(c,gx); c.clip();
  c.fillStyle='#01030a'; c.fillRect(gx-AR.half,AR.apex-40,AR.half*2,FLOOR_Y-AR.apex+60);
  starFieldLocal(c,gx-AR.half,AR.apex-40,AR.half*2,FLOOR_Y-AR.apex+60,150,404);
  // nevelsluier
  const nb=c.createRadialGradient(gx-50,AR.apex+40,10,gx-50,AR.apex+40,170);
  nb.addColorStop(0,'rgba(88,58,160,0.3)'); nb.addColorStop(1,'rgba(40,20,90,0)');
  c.fillStyle=nb; c.fillRect(gx-AR.half,AR.apex-40,AR.half*2,320);
  // de planeet die onder je opkomt
  const pg=c.createRadialGradient(gx-30,640,40,gx,700,300);
  pg.addColorStop(0,'#7ec4e8'); pg.addColorStop(0.4,'#2f7fb4'); pg.addColorStop(0.75,'#154767'); pg.addColorStop(1,'#08202f');
  c.fillStyle=pg; c.beginPath(); c.arc(gx,720,268,0,6.3); c.fill();
  c.save(); c.beginPath(); c.arc(gx,720,268,0,6.3); c.clip();
  c.fillStyle='rgba(58,132,86,0.65)';         // continenten
  [[-86,498,54,26],[24,520,68,22],[-30,560,44,18],[92,556,38,16]].forEach(([dx,dy,rw,rh])=>{
    c.beginPath(); c.ellipse(gx+dx,dy,rw,rh,0.2,0,6.3); c.fill();
  });
  c.fillStyle='rgba(236,246,255,0.5)';        // wolkenbanden
  [[-60,478,96,12],[40,504,110,10],[-20,536,120,9]].forEach(([dx,dy,rw,rh])=>{
    c.beginPath(); c.ellipse(gx+dx,dy,rw,rh,0.05,0,6.3); c.fill();
  });
  c.fillStyle='rgba(2,6,16,0.6)';             // nachtzijde
  c.beginPath(); c.arc(gx+150,700,268,0,6.3); c.fill();
  c.restore();
  const atm=c.createRadialGradient(gx,720,258,gx,720,300);
  atm.addColorStop(0,'rgba(140,210,255,0.5)'); atm.addColorStop(1,'rgba(120,190,255,0)');
  c.fillStyle=atm; c.beginPath(); c.arc(gx,720,300,0,6.3); c.fill();
  // de ruggengraat van het station en een vertrekkende shuttle
  c.fillStyle='#39434f';
  c.fillRect(gx+46,AR.apex+30,13,200);
  c.fillRect(gx+30,AR.apex+70,46,11);
  c.fillRect(gx+30,AR.apex+150,46,11);
  c.fillStyle='#4e5c6c'; c.fillRect(gx+46,AR.apex+30,13,4);
  c.fillStyle='#ffae3a';
  for(let i=0;i<5;i++){ c.beginPath(); c.arc(gx+52,AR.apex+48+i*38,2,0,6.3); c.fill(); }
  const sx2=gx-72+Math.sin(T*0.25)*22, sy2=AR.apex+120+Math.cos(T*0.25)*10;
  c.fillStyle='#485768';
  c.fillRect(sx2-18,sy2-5,34,10);
  c.beginPath(); c.moveTo(sx2+16,sy2-5); c.lineTo(sx2+27,sy2); c.lineTo(sx2+16,sy2+5); c.closePath(); c.fill();
  c.fillStyle='#7fd8ff'; c.fillRect(sx2+8,sy2-3,6,3);
  const th=c.createLinearGradient(sx2-18,0,sx2-54,0);
  th.addColorStop(0,'rgba(130,200,255,0.8)'); th.addColorStop(1,'rgba(90,150,255,0)');
  c.fillStyle=th; c.fillRect(sx2-54,sy2-3.4,36,7);
  c.restore();
}
function s_sign(c,gx){
  const w=256,h=134,x=gx-w/2,y=84;
  c.fillStyle='#1b2430'; rr(c,x-8,y-6,w+16,h+12,10); c.fill();
  c.fillStyle='#2b3745'; rr(c,x-3,y-1,w+6,h+2,8); c.fill();
  c.fillStyle='#07101a'; rr(c,x+7,y+10,w-14,h-20,6); c.fill();
  c.save(); c.globalCompositeOperation='lighter';
  pool(c,gx,y+64,140,'rgba(90,200,255,0.28)');
  c.restore();
  c.strokeStyle='rgba(127,216,255,0.55)'; c.lineWidth=2; rr(c,x+7,y+10,w-14,h-20,6); c.stroke();
  s_rivets(c,x-8,y-2,w+16,10,'#5d6f85');
  s_rivets(c,x-8,y+h+6,w+16,10,'#5d6f85');
  skull(c,gx,y+40,20,'#7fd8ff','#07101a',true);
  c.fillStyle='#a8e6ff'; c.font='800 42px "Work Sans",system-ui,sans-serif'; c.letterSpacing='2px';
  c.fillText('HUB',gx,y+100); c.letterSpacing='0px';
  c.fillStyle='#cfe8f8'; c.font='600 22px "Work Sans",system-ui,sans-serif';
  c.fillText('game studio',gx,y+124);
  c.fillStyle='rgba(127,216,255,0.07)';        // scanlijnen
  for(let yy=y+12;yy<y+h-10;yy+=4) c.fillRect(x+8,yy,w-16,1.6);
  s_leds(c,gx-40,y+h-6,9,3);
}
function s_banner(c,cx){                     // holo-vaandel
  const top=CORN_Y-4,w=52,h=118;
  c.fillStyle='#2b3745'; c.fillRect(cx-w*0.6,top-9,w*1.2,8);
  c.fillStyle='#4e5c6c'; c.fillRect(cx-3,top-9,6,14);
  const g2=c.createLinearGradient(cx-w/2,0,cx+w/2,0);
  g2.addColorStop(0,'rgba(40,130,190,0.1)'); g2.addColorStop(0.4,'rgba(90,200,255,0.34)');
  g2.addColorStop(1,'rgba(40,130,190,0.1)');
  c.fillStyle=g2;
  c.beginPath(); c.moveTo(cx-w/2,top+6); c.lineTo(cx+w/2,top+6); c.lineTo(cx+w/2,top+h);
  c.lineTo(cx,top+h-18); c.lineTo(cx-w/2,top+h); c.closePath(); c.fill();
  c.strokeStyle='rgba(140,222,255,0.5)'; c.lineWidth=1.6; c.stroke();
  c.fillStyle='rgba(10,20,30,0.35)';
  for(let yy=top+8;yy<top+h-6;yy+=5) c.fillRect(cx-w/2,yy,w,2);
  skull(c,cx,top+40,12,'rgba(170,236,255,0.9)','rgba(10,26,40,0.8)',true);
}
function s_niche(c,nx){
  const top=300, bot=524, hw=52;
  c.fillStyle='#0b1118'; c.fillRect(nx-hw,top,hw*2,bot-top);
  c.strokeStyle='#38465a'; c.lineWidth=10; c.strokeRect(nx-hw,top,hw*2,bot-top);
  c.fillStyle='#161e29'; c.fillRect(nx-hw+10,top+10,hw*2-20,bot-top-20);
  s_hazard(c,nx-hw+10,bot-34,hw*2-20,14);
  // statuspaneel
  c.fillStyle='#05202c'; c.fillRect(nx-34,top+26,68,46);
  c.strokeStyle='#2f6a82'; c.lineWidth=2; c.strokeRect(nx-34,top+26,68,46);
  c.fillStyle='#4be0a0';
  for(let i=0;i<5;i++) c.fillRect(nx-28,top+34+i*8,12+((i*13)%40),4);
  c.fillStyle='#7fd8ff'; c.font='700 9px ui-monospace,Menlo,monospace'; c.textAlign='center';
  c.fillText('SYS OK',nx,top+90);
  // ruimtepak aan een rek
  c.fillStyle='#d8dde4';
  c.beginPath(); c.arc(nx,top+118,15,0,6.3); c.fill();
  c.fillRect(nx-18,top+130,36,50);
  c.fillRect(nx-28,top+134,10,38); c.fillRect(nx+18,top+134,10,38);
  c.fillRect(nx-15,top+180,12,34); c.fillRect(nx+3,top+180,12,34);
  c.fillStyle='#2f4356'; c.beginPath(); c.arc(nx,top+116,10,0,6.3); c.fill();
  c.fillStyle='rgba(127,216,255,0.45)'; c.beginPath(); c.arc(nx-3,top+113,4,0,6.3); c.fill();
  c.fillStyle='#ff8a3a'; c.fillRect(nx-18,top+140,36,5);
  c.save(); c.globalCompositeOperation='lighter';
  pool(c,nx,top+70,120,'rgba(80,200,255,0.2)');
  c.restore();
}
function s_wall(q){
  q.fillStyle=vgrad(q,CORN_Y,FLOOR_Y+8,[[0,'#131a24'],[0.4,'#1a232f'],[0.8,'#232e3c'],[1,'#151d27']]);
  q.fillRect(0,CORN_Y,PW,FLOOR_Y-CORN_Y+8);
  // hullplaten in rijen
  let row=0;
  for(let y=CORN_Y+8;y<FLOOR_Y-20;y+=68,row++){
    for(let x=(row%2)?-60:0;x<PW;x+=120){
      s_panel(q,x+3,y+3,114,62,(row%2)?'#1d2733':'#212c39','rgba(150,190,230,0.12)');
      if(((x/120+row)|0)%5===0) s_rivets(q,x+3,y+10,114,6,'rgba(150,180,210,0.3)');
    }
  }
  s_conduit(q,CORN_Y+44,'rgba(127,216,255,0.5)');
  s_conduit(q,FLOOR_Y-70,'rgba(255,174,58,0.45)');
  // waarschuwingsstroken en labels
  for(let x=0;x<PW;x+=400) s_hazard(q,x+150,FLOOR_Y-42,120,16);
  q.font='700 13px ui-monospace,Menlo,monospace'; q.textAlign='left';
  for(let x=0;x<PW;x+=260){
    q.fillStyle='rgba(150,190,220,0.35)';
    q.fillText('R-'+(100+(x/26|0)),x+16,CORN_Y+78);
    s_leds(q,x+16,CORN_Y+86,6,(x*3)|0);
  }
  q.textAlign='center';
  OPEN.forEach((nx,i)=>s_viewport(q,nx,i));
  NICHE.forEach(nx=>s_niche(q,nx));
  // sluisboog
  q.fillStyle=vgrad(q,CORN_Y,FLOOR_Y,[[0,'#26313f'],[0.45,'#1a222d'],[1,'#121922']]);
  q.fillRect(GATE_PX-150,CORN_Y,300,FLOOR_Y-CORN_Y+8);
  s_limb(q,GATE_PX);
  q.save(); s_arch(q,GATE_PX); q.lineWidth=20; q.strokeStyle='#38465a'; q.stroke();
  q.lineWidth=9; q.strokeStyle='#131a24'; q.stroke();
  q.lineWidth=3; q.strokeStyle='rgba(127,216,255,0.3)'; q.stroke(); q.restore();
  // sluisdeur-segmenten rond de boog
  q.strokeStyle='#4c5c70'; q.lineWidth=5;
  for(let i=0;i<9;i++){
    const a=Math.PI+i*(Math.PI/8);
    q.beginPath();
    q.moveTo(GATE_PX+Math.cos(a)*(AR.half+14),AR.spring+Math.sin(a)*74);
    q.lineTo(GATE_PX+Math.cos(a)*(AR.half+36),AR.spring+Math.sin(a)*96);
    q.stroke();
  }
  s_hazard(q,GATE_PX-AR.half-40,FLOOR_Y-36,40,16);
  s_hazard(q,GATE_PX+AR.half,FLOOR_Y-36,40,16);
  s_sign(q,GATE_PX);
  BANNER.forEach(bx=>s_banner(q,bx));
  SCONCE.forEach((sx,i)=>{ s_strip(q,sx-70,412,140); s_beacon(q,sx+78,404); });
  CEIL.forEach(lx=>s_strip(q,lx-58,196,116));
  q.save(); q.globalCompositeOperation='lighter';
  SCONCE.forEach(sx=>pool(q,sx,408,175,'rgba(90,190,255,0.3)'));
  CEIL.forEach(px=>pool(q,px,196,120,'rgba(110,205,255,0.22)'));
  q.restore();
  // dekrand
  q.fillStyle='#1a222d'; q.fillRect(0,FLOOR_Y-22,PW,22);
  q.fillStyle='#2c3949'; q.fillRect(0,FLOOR_Y-26,PW,6);
  q.save(); q.globalCompositeOperation='lighter';
  q.fillStyle='rgba(127,216,255,0.4)'; q.fillRect(0,FLOOR_Y-12,PW,3);
  q.restore();
  q.fillStyle='rgba(0,0,0,0.4)'; q.fillRect(0,FLOOR_Y-3,PW,7);
}
const S_STARS=[];
for(let i=0;i<165;i++) S_STARS.push([rnd()*PW, -120+rnd()*(CORN_Y+130), rnd()]);
function s_roof(c){
  c.save(); roofClip(c);
  if(!_rg) _rg=vgrad(c,-130,CORN_Y+20,[[0,'#01030a'],[0.6,'#040a14'],[1,'#08121e']]);
  c.fillStyle=_rg; c.fillRect(0,-130,W,CORN_Y+150);
  // nevelvlekken die met de zaal meedraaien
  [[600,'rgba(92,52,166,0.22)'],[1900,'rgba(188,54,124,0.16)'],[3100,'rgba(46,118,198,0.2)']]
    .forEach(([px,col])=>{
      const x=P(px); if(!vis(x,340)) return;
      pool(c,x,-30,300,col);
    });
  // sterren
  S_STARS.forEach(([px,y,r])=>{
    const x=P(px); if(!vis(x,20)) return;
    const tw=0.55+0.45*Math.sin(T*(1.2+r*2)+px);
    c.fillStyle='rgba(216,232,255,'+((0.25+r*0.7)*tw).toFixed(3)+')';
    const s2=r>0.95?2.4:(r>0.72?1.6:1);
    c.fillRect(x,y,s2,s2);
  });
  // een langstrekkend schip met navigatielichten
  const shipX=((T*30)%(W+700))-350;
  c.fillStyle='#2a3340';
  c.fillRect(shipX-70,-72,120,13);
  c.fillRect(shipX+40,-80,28,29);
  c.beginPath(); c.moveTo(shipX-70,-72); c.lineTo(shipX-96,-65); c.lineTo(shipX-70,-59); c.closePath(); c.fill();
  c.fillStyle='rgba(127,216,255,0.9)'; c.fillRect(shipX+48,-72,9,5);
  c.fillStyle=(Math.sin(T*6)>0)?'#ff5a4a':'rgba(120,40,40,0.6)';
  c.beginPath(); c.arc(shipX-20,-76,2.6,0,6.3); c.fill();
  c.fillStyle=(Math.sin(T*6+3)>0)?'#61e08a':'rgba(40,120,60,0.6)';
  c.beginPath(); c.arc(shipX+20,-76,2.6,0,6.3); c.fill();
  const thr=c.createLinearGradient(shipX-96,0,shipX-150,0);
  thr.addColorStop(0,'rgba(140,200,255,0.7)'); thr.addColorStop(1,'rgba(90,150,255,0)');
  c.fillStyle=thr; c.fillRect(shipX-150,-70,54,9);
  c.restore();
  // de glazen koepel: ribben die samenkomen boven je hoofd
  c.save(); roofClip(c);
  c.strokeStyle='rgba(120,168,210,0.4)'; c.lineWidth=4;
  for(let i=0;i<20;i++){
    const x=P(i*(PW/20));
    if(x<-200||x>W+200) continue;
    c.beginPath(); c.moveTo(x,CORN_Y+bow(x)+6); c.lineTo(OCX,OCY); c.stroke();
  }
  c.strokeStyle='rgba(120,168,210,0.3)'; c.lineWidth=3;
  [0.3,0.58,0.82].forEach(f=>{
    c.beginPath();
    for(let x=0;x<=W;x+=30){
      const y=OCY+(CORN_Y+bow(x)+6-OCY)*f;
      x?c.lineTo(x,y):c.moveTo(x,y);
    }
    c.stroke();
  });
  c.fillStyle='rgba(140,190,235,0.06)';
  c.fillRect(0,-130,W,CORN_Y+150);
  // de naaf van de koepel
  c.fillStyle='#1b2634'; c.beginPath(); c.arc(OCX,OCY,OCR,0,6.3); c.fill();
  c.strokeStyle='#3f5165'; c.lineWidth=7; c.beginPath(); c.arc(OCX,OCY,OCR,0,6.3); c.stroke();
  c.fillStyle='#0d1520'; c.beginPath(); c.arc(OCX,OCY,OCR-13,0,6.3); c.fill();
  c.fillStyle='rgba(127,216,255,0.6)';
  for(let i=0;i<8;i++){
    const a=i*0.785+T*0.4;
    c.beginPath(); c.arc(OCX+Math.cos(a)*(OCR-6),OCY+Math.sin(a)*(OCR-6),2.4,0,6.3); c.fill();
  }
  c.restore();
  cornice(c,-30,8,'#5a7089');
  cornice(c,-23,26,'#28323f');
  cornice(c,3,8,'rgba(0,0,0,0.45)');
  c.save(); c.globalCompositeOperation='lighter';
  cornice(c,-6,3,'rgba(127,216,255,0.28)');
  c.restore();
  c.fillStyle='#1f2836';
  for(let i=0;i<60;i++){
    const x=P(i*(PW/60));
    if(vis(x,20)) c.fillRect(x-6,CORN_Y+bow(x)+11,12,8);
  }
}
function s_floor(c){
  c.save(); floorClip(c);
  if(!_fg) _fg=vgrad(c,FLOOR_Y,HH,[[0,'#1b232e'],[0.3,'#121922'],[1,'#05080c']]);
  c.fillStyle=_fg; c.fillRect(0,FLOOR_Y-24,W,HH-FLOOR_Y+24);
  // dekplaten met ruitprofiel
  c.strokeStyle='rgba(0,0,0,0.55)'; c.lineWidth=2.4;
  for(let k=1;k<7;k++){
    const o=k*44;
    c.beginPath();
    for(let x=0;x<=W;x+=12){ const y=FLOOR_Y+bow(x)+o; x?c.lineTo(x,y):c.moveTo(x,y); }
    c.stroke();
  }
  for(let k=0;k<30;k++){
    const x=P(k*(PW/30));
    if(!vis(x,30)) continue;
    c.beginPath(); c.moveTo(x,FLOOR_Y+bow(x)); c.lineTo(FCX+(x-FCX)*0.18,HH); c.stroke();
  }
  c.strokeStyle='rgba(180,210,240,0.05)'; c.lineWidth=1.6;
  for(let k=1;k<7;k++){
    const o=k*44+3;
    c.beginPath();
    for(let x=0;x<=W;x+=12){ const y=FLOOR_Y+bow(x)+o; x?c.lineTo(x,y):c.moveTo(x,y); }
    c.stroke();
  }
  // lichtbanen naar elk scherm
  c.save(); runnersClip(c);
  wedge(c,GATE_PX,92,'rgba(18,58,84,0.7)','rgba(127,216,255,0.75)');
  SCREENS.forEach(S=>wedge(c,S.px,52,'rgba(16,50,74,0.6)','rgba(110,200,245,0.6)'));
  c.restore();
  // de ringbaan, verlicht in het dek
  ringBand(c,104,176,'rgba(12,26,38,0.75)');
  c.save(); c.globalCompositeOperation='lighter';
  ringLine(c,108,'rgba(127,216,255,0.7)',5);
  ringLine(c,172,'rgba(127,216,255,0.7)',5);
  ringLine(c,140,'rgba(90,180,240,0.06)',28);
  c.restore();
  // looprichting-pijlen die meelopen
  c.save(); c.globalCompositeOperation='lighter';
  for(let k=0;k<30;k++){
    const px=k*(PW/30)+((T*40)%(PW/30)), x=P(px);
    if(!vis(x,20)) continue;
    const y=FLOOR_Y+bow(x)+140;
    c.fillStyle='rgba(127,216,255,0.32)';
    c.beginPath(); c.moveTo(x-8,y-6); c.lineTo(x+6,y); c.lineTo(x-8,y+6); c.closePath(); c.fill();
  }
  c.restore();
  floorSheen(c,'rgba(160,215,255,0.1)','rgba(0,0,0,0.5)');
  if(!_sg) _sg=vgrad(c,FLOOR_Y,FLOOR_Y+180,[[0,'rgba(140,210,255,0.14)'],[1,'rgba(100,170,230,0)']]);
  c.fillStyle=_sg; c.fillRect(0,FLOOR_Y-10,W,200);
  c.restore();
  floorEdge(c,'rgba(0,0,0,0.45)');
  const mx=P(GATE_PX);
  if(vis(mx,320)){
    const dy=bow(mx);
    c.save(); c.translate(mx,716+dy); c.scale(1,0.3);
    c.strokeStyle='rgba(127,216,255,0.5)'; c.lineWidth=9;
    [250,196].forEach(r=>{ c.beginPath(); c.arc(0,0,r,0,6.3); c.stroke(); });
    c.setLineDash([26,18]); c.lineWidth=6; c.strokeStyle='rgba(127,216,255,0.3)';
    c.beginPath(); c.arc(0,0,224,0,6.3); c.stroke(); c.setLineDash([]);
    c.restore();
    c.save(); c.globalAlpha=0.75; c.translate(mx,718+dy); c.scale(1,0.3);
    skull(c,0,-16,80,'#7fd8ff','#071824',true);
    c.restore();
  }
}
function s_crate(c,x,y,s,label){
  const w=64*s,h=54*s;
  c.fillStyle=vgrad(c,y-h,y,[[0,'#39485a'],[1,'#1d2733']]);
  c.fillRect(x-w/2,y-h,w,h);
  c.strokeStyle='#141b24'; c.lineWidth=3*s; c.strokeRect(x-w/2,y-h,w,h);
  c.fillStyle='#4c5c70'; c.fillRect(x-w/2,y-h,w,5*s);
  c.fillStyle='#ffae3a'; c.fillRect(x-w/2+5*s,y-h*0.58,w-10*s,6*s);
  c.fillStyle='#0d1219'; c.font='700 '+(9*s)+'px ui-monospace,Menlo,monospace'; c.textAlign='center';
  c.fillText(label||'C-14',x,y-h*0.36);
  s_leds(c,x-14*s,y-12*s,3,(x|0));
}
function s_tank(c,x,y,s){
  const w=40*s,h=66*s;
  c.fillStyle=vgrad(c,y-h,y,[[0,'#46586c'],[0.4,'#5f748c'],[1,'#26313d']]);
  rr(c,x-w/2,y-h,w,h,12*s); c.fill();
  c.strokeStyle='#1a222c'; c.lineWidth=3*s; rr(c,x-w/2,y-h,w,h,12*s); c.stroke();
  c.fillStyle='#7fd8ff'; c.fillRect(x-w/2+6*s,y-h*0.7,w-12*s,4*s);
  c.fillStyle='#2b3644'; c.fillRect(x-7*s,y-h-8*s,14*s,10*s);
  c.fillStyle='#ffae3a'; c.fillRect(x-w/2+5*s,y-14*s,w-10*s,4*s);
}
function s_drone(c,x,y,s,t){
  const bob=Math.sin(t*2.4)*3;
  c.fillStyle='#39485a';
  rr(c,x-13*s,y-8*s+bob,26*s,15*s,5*s); c.fill();
  c.fillStyle='#7fd8ff';
  c.beginPath(); c.arc(x+7*s,y+bob,3.4*s,0,6.3); c.fill();
  c.strokeStyle='#2b3644'; c.lineWidth=2.6*s;
  c.beginPath(); c.moveTo(x-13*s,y-6*s+bob); c.lineTo(x-22*s,y-12*s+bob);
  c.moveTo(x+13*s,y-6*s+bob); c.lineTo(x+22*s,y-12*s+bob); c.stroke();
  c.fillStyle='rgba(170,220,255,0.35)';
  [-22,22].forEach(d=>{ c.beginPath(); c.ellipse(x+d*s,y-13*s+bob,9*s,2.6*s,0,0,6.3); c.fill(); });
  c.fillStyle='rgba(127,216,255,0.16)';
  c.beginPath(); c.moveTo(x-8*s,y+7*s+bob); c.lineTo(x+8*s,y+7*s+bob);
  c.lineTo(x+18*s,y+30*s); c.lineTo(x-18*s,y+30*s); c.closePath(); c.fill();
}
function s_props(c){
  SCREENS.forEach(S=>{ const x=P(S.px); if(vis(x,240)){
    reflectStrip(c,x,SCR_W*0.85,'rgba(127,216,255,0.2)',170); benchLight(c,x,700+bow(x),150); } });
  const gx=P(GATE_PX); if(vis(gx,260)) reflectStrip(c,gx,215,'rgba(127,216,255,0.26)',210);
  SCONCE.forEach(px=>{ const x=P(px); if(vis(x,80)) reflectStrip(c,x,150,'rgba(110,200,250,0.22)',175); });
  FLOOR_LAMPS.forEach(([px,y],i)=>{          // dekmarkeringen
    const x=P(px); if(!vis(x,40)) return;
    const a=0.4+0.3*Math.sin(T*2.2+i);
    c.fillStyle='rgba(127,216,255,'+a.toFixed(3)+')';
    c.fillRect(x-7,y+bow(x)-2,14,3);
  });
  let x=P(640);
  if(vis(x,280)){                             // laadplatform met drone
    c.save(); c.translate(0,bow(x));
    c.fillStyle='#1d2733'; rr(c,x-110,790,220,20,6); c.fill();
    c.fillStyle='#2f3d4c'; c.fillRect(x-110,790,220,4);
    c.save(); c.globalCompositeOperation='lighter';
    pool(c,x,796,120,'rgba(127,216,255,0.16)');
    c.restore();
    s_crate(c,x-58,790,1,'C-14'); s_crate(c,x+6,790,0.85,'A-02');
    s_drone(c,x+74,742,1.1,T);
    c.restore();
  }
  x=P(1660);
  if(vis(x,220)){                             // dekmodules om overheen te springen
    c.save(); c.translate(0,bow(x));
    [[-60,828,74,26],[6,800,74,30],[74,830,74,24]].forEach(([d,y2,w,h])=>{
      c.fillStyle=vgrad(c,y2-h,y2,[[0,'#46586c'],[1,'#1d2733']]);
      rr(c,x+d-w/2,y2-h,w,h,5); c.fill();
      c.strokeStyle='#131a24'; c.lineWidth=2.4; c.stroke();
      c.fillStyle='rgba(127,216,255,0.6)'; c.fillRect(x+d-w/2+6,y2-h+4,w-12,2.6);
    });
    c.fillStyle='#ffd45a';
    [[-36,774],[44,764]].forEach(([d,y2])=>{ c.beginPath(); c.ellipse(x+d,y2,10,12,0,0,6.3); c.fill(); });
    c.restore();
  }
  x=P(2380);
  if(vis(x,240)){                             // koelvaten en kabelhaspel
    c.save(); c.translate(0,bow(x));
    s_tank(c,x-70,826,1); s_tank(c,x-26,830,0.85);
    c.fillStyle='#2b3644'; c.beginPath(); c.ellipse(x+58,816,30,30,0,0,6.3); c.fill();
    c.fillStyle='#46586c'; c.beginPath(); c.ellipse(x+58,816,22,22,0,0,6.3); c.fill();
    c.strokeStyle='#161d26'; c.lineWidth=5;
    c.beginPath(); c.moveTo(x+78,830); c.quadraticCurveTo(x+120,850,x+150,828); c.stroke();
    c.restore();
  }
  x=P(3320);
  if(vis(x,260)){
    c.save(); c.translate(0,bow(x));
    s_crate(c,x-78,828,1,'D-07'); s_crate(c,x-12,832,1.05,'B-21'); s_crate(c,x-46,782,0.85,'F-03');
    s_tank(c,x+68,826,0.95);
    rock(c,x+206,760,1.2);
    c.restore();
  }
  [[120,812,1],[2140,860,0.8],[3000,872,0.9],[980,846,0.7],[2860,856,0.6]].forEach(([px,y,s])=>{
    const xx=P(px); if(!vis(xx,90)) return;
    c.fillStyle='#232e3c';
    rr(c,xx-26*s,y+bow(xx)-20*s,52*s,20*s,4); c.fill();
    c.fillStyle='rgba(127,216,255,0.4)'; c.fillRect(xx-20*s,y+bow(xx)-18*s,40*s,2.4);
  });
}
const MOTES=[];
for(let i=0;i<54;i++) MOTES.push({px:rnd()*PW, y:rnd()*860, sp:(rnd()-0.5)*7, ph:rnd()*6.3, s:1+rnd()*1.4});
function s_ambient(c){
  c.fillStyle='rgba(190,222,255,0.3)';
  MOTES.forEach(m=>{
    const x=P(m.px)+Math.sin(T*0.4+m.ph)*22;
    if(!vis(x,30)) return;
    const y=((m.y+T*m.sp)%900+900)%900-20;
    c.fillRect(x,y+bow(x),m.s,m.s);
  });
  // servicedrone die door de zaal vliegt
  const dx=((T*52)%(PW+900))-450, x=P(dx);
  if(vis(x,120)) s_drone(c,x,420+bow(x)+Math.sin(T*0.7)*26,1.5,T);
}
function s_fire(c){
  c.save(); c.globalCompositeOperation='lighter';
  SCONCE.forEach((px,i)=>{
    const x=P(px); if(!vis(x,160)) return;
    const y=412+bow(x);
    const g2=c.createLinearGradient(x-70,0,x+70,0);
    g2.addColorStop(0,'rgba(127,216,255,0)'); g2.addColorStop(0.5,'rgba(127,216,255,0.24)');
    g2.addColorStop(1,'rgba(127,216,255,0)');
    c.fillStyle=g2; c.fillRect(x-80,y-26,160,52);
    // zwaailicht dat ronddraait
    const sw=Math.sin(T*1.6+i*1.1);
    if(sw>0){
      c.fillStyle='rgba(255,180,70,'+(sw*0.3).toFixed(3)+')';
      c.beginPath(); c.moveTo(x+82,y-14); c.lineTo(x+82+120*sw,y-52); c.lineTo(x+82+120*sw,y+26); c.closePath(); c.fill();
    }
    pool(c,x+82,y-14,26,'rgba(255,180,70,'+(0.4+0.3*sw)+')');
  });
  CEIL.forEach(px=>{
    const x=P(px); if(!vis(x,90)) return;
    pool(c,x,196+bow(x),86,'rgba(127,216,255,0.16)');
  });
  OPEN.forEach(px=>{
    const x=P(px); if(!vis(x,180)) return;
    pool(c,x,396+bow(x),170,'rgba(96,180,240,0.09)');
  });
  const gx=P(GATE_PX);
  if(vis(gx,300)) pool(c,gx,FLOOR_Y+bow(gx)-30,250,'rgba(120,200,255,0.12)');
  c.restore();
}
