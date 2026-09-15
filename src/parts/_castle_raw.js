function stonePilaster(c,x,w){
  const top=CORN_Y+4, bot=FLOOR_Y+6;
  const cg=c.createLinearGradient(x-w/2,0,x+w/2,0);
  cg.addColorStop(0,'#232a44'); cg.addColorStop(0.4,'#414a6b'); cg.addColorStop(0.75,'#2e3550'); cg.addColorStop(1,'#1d2338');
  c.fillStyle=cg; c.fillRect(x-w/2,top,w,bot-top);
  c.strokeStyle='rgba(0,0,0,0.28)'; c.lineWidth=1.8;
  for(let y=top+34;y<bot;y+=34){ c.beginPath(); c.moveTo(x-w/2,y); c.lineTo(x+w/2,y); c.stroke(); }
  c.fillStyle='#4b5476'; c.fillRect(x-w/2-11,top,w+22,15);
  c.fillStyle='#39405e'; c.fillRect(x-w/2-7,top+15,w+14,8);
  c.fillStyle='#39405e'; c.fillRect(x-w/2-9,bot-16,w+18,16);
}
function winPath(c,x,hw,apex,spring,sill){
  c.beginPath();
  c.moveTo(x-hw,sill); c.lineTo(x-hw,spring);
  c.quadraticCurveTo(x-hw+5,apex+24,x,apex);
  c.quadraticCurveTo(x+hw-5,apex+24,x+hw,spring);
  c.lineTo(x+hw,sill); c.closePath();
}
function panoWindow(c,x,variant){
  const hw=80, apex=246, spring=332, sill=552;
  c.save(); winPath(c,x,hw,apex,spring,sill); c.clip();
  const sk=c.createLinearGradient(0,apex,0,sill);
  sk.addColorStop(0,'#16244c'); sk.addColorStop(0.45,'#294a7e'); sk.addColorStop(1,'#31507f');
  c.fillStyle=sk; c.fillRect(x-hw,apex-10,hw*2,sill-apex+20);
  srnd((x*7)|0);
  c.fillStyle='rgba(226,236,255,0.85)';
  for(let i=0;i<34;i++) c.fillRect(x-hw+rnd()*hw*2,apex+rnd()*150,1.9,1.9);
  // moonlight spilling in from off to the side — the moon itself is round by the gate
  const dir=(variant%2)?1:-1;
  const gl=c.createRadialGradient(x+dir*104,300,10,x+dir*104,300,210);
  gl.addColorStop(0,'rgba(196,222,255,0.34)'); gl.addColorStop(1,'rgba(150,190,255,0)');
  c.fillStyle=gl; c.fillRect(x-hw,apex-10,hw*2,sill-apex+20);
  if(variant===0){
    // wooded ridges rolling away
    c.fillStyle='#16233d';
    c.beginPath(); c.moveTo(x-hw,452); c.quadraticCurveTo(x-20,412,x+26,440);
    c.quadraticCurveTo(x+54,456,x+hw,436); c.lineTo(x+hw,sill); c.lineTo(x-hw,sill); c.closePath(); c.fill();
    c.fillStyle='#1b3a2a';
    c.beginPath(); c.moveTo(x-hw,488); c.quadraticCurveTo(x-16,458,x+30,486);
    c.quadraticCurveTo(x+58,500,x+hw,482); c.lineTo(x+hw,sill); c.lineTo(x-hw,sill); c.closePath(); c.fill();
    c.fillStyle='#10281c';
    for(let i=0;i<9;i++){
      const tx=x-hw+14+i*18, ty=506+((i*37)%18), ts=13+((i*23)%9);
      c.beginPath(); c.moveTo(tx,ty-ts*2.3); c.lineTo(tx-ts*0.8,ty); c.lineTo(tx+ts*0.8,ty); c.closePath(); c.fill();
    }
  } else if(variant===1){
    // the castle, small and far off across the valley
    castle(c,x+44,462,0.17,'#101a38',true);
    c.fillStyle='#1c3350';
    c.beginPath(); c.moveTo(x-hw,476); c.quadraticCurveTo(x-10,450,x+30,470);
    c.quadraticCurveTo(x+56,482,x+hw,468); c.lineTo(x+hw,sill); c.lineTo(x-hw,sill); c.closePath(); c.fill();
    c.fillStyle='#22402a';
    c.beginPath(); c.moveTo(x-hw,510); c.quadraticCurveTo(x+2,486,x+44,510);
    c.lineTo(x+hw,506); c.lineTo(x+hw,sill); c.lineTo(x-hw,sill); c.closePath(); c.fill();
    c.fillStyle='#132a1c';
    [[x-48,530,13],[x+50,536,11],[x-8,542,12]].forEach(([tx,ty,ts])=>{
      c.beginPath(); c.moveTo(tx,ty-ts*2.2); c.lineTo(tx-ts*0.8,ty); c.lineTo(tx+ts*0.8,ty); c.closePath(); c.fill();
    });
  } else if(variant===2){
    // a river valley catching the light
    c.fillStyle='#1c2f4e';
    c.beginPath(); c.moveTo(x-hw,458); c.quadraticCurveTo(x,430,x+hw,452);
    c.lineTo(x+hw,sill); c.lineTo(x-hw,sill); c.closePath(); c.fill();
    c.fillStyle='#284a34';
    c.beginPath(); c.moveTo(x-hw,486); c.quadraticCurveTo(x-6,462,x+46,488);
    c.lineTo(x+hw,482); c.lineTo(x+hw,sill); c.lineTo(x-hw,sill); c.closePath(); c.fill();
    c.fillStyle='#4d739e';
    c.beginPath();
    c.moveTo(x-30,sill); c.bezierCurveTo(x-18,522,x-44,506,x-22,492);
    c.bezierCurveTo(x-4,480,x+18,482,x+22,470);
    c.lineTo(x+42,474);
    c.bezierCurveTo(x+34,498,x+4,498,x-8,508);
    c.bezierCurveTo(x-22,518,x+2,532,x+10,sill);
    c.closePath(); c.fill();
    c.fillStyle='rgba(216,234,255,0.4)';
    [[x-24,516,9],[x-6,498,7],[x+22,482,6]].forEach(([rx2,ry2,rw])=>{
      c.beginPath(); c.ellipse(rx2,ry2,rw,2,0,0,6.3); c.fill();
    });
    c.fillStyle='#16331f';
    [[x-58,528,12],[x+58,524,11]].forEach(([tx,ty,ts])=>{
      c.beginPath(); c.moveTo(tx,ty-ts*2.2); c.lineTo(tx-ts*0.8,ty); c.lineTo(tx+ts*0.8,ty); c.closePath(); c.fill();
    });
  } else {
    // the village below, windows still lit
    c.fillStyle='#16233d';
    c.beginPath(); c.moveTo(x-hw,458); c.quadraticCurveTo(x+6,432,x+hw,454);
    c.lineTo(x+hw,sill); c.lineTo(x-hw,sill); c.closePath(); c.fill();
    srnd(31);
    for(let i=0;i<7;i++){
      const bx=x-hw+12+i*22, bw2=16+((i*19)%8), bh=22+((i*29)%16), by=498+((i*13)%14);
      c.fillStyle='#101a33'; c.fillRect(bx,by-bh,bw2,bh);
      c.beginPath(); c.moveTo(bx-3,by-bh); c.lineTo(bx+bw2/2,by-bh-12); c.lineTo(bx+bw2+3,by-bh); c.closePath(); c.fill();
      c.fillStyle='rgba(255,196,110,0.85)';
      c.fillRect(bx+bw2*0.3,by-bh*0.6,4,5);
    }
    c.fillStyle='#22402a';
    c.beginPath(); c.moveTo(x-hw,524); c.quadraticCurveTo(x,510,x+hw,522);
    c.lineTo(x+hw,sill); c.lineTo(x-hw,sill); c.closePath(); c.fill();
  }
  c.fillStyle='rgba(190,215,255,0.12)';
  c.beginPath(); c.ellipse(x,494,92,9,0,0,6.3); c.fill();
  c.beginPath(); c.ellipse(x,470,78,7,0,0,6.3); c.fill();
  c.restore();
  // tracery
  c.strokeStyle='#3b4468'; c.lineWidth=8; c.lineCap='butt';
  c.beginPath(); c.moveTo(x,apex+30); c.lineTo(x,sill); c.stroke();
  c.beginPath(); c.moveTo(x-hw,424); c.lineTo(x+hw,424); c.stroke();
  c.lineWidth=6;
  c.beginPath(); c.arc(x,apex+46,22,0,6.3); c.stroke();
  c.strokeStyle='rgba(180,200,255,0.18)'; c.lineWidth=1.8;
  c.beginPath(); c.moveTo(x-2.5,apex+30); c.lineTo(x-2.5,sill); c.stroke();
  // stone surround
  c.save(); winPath(c,x,hw,apex,spring,sill);
  c.lineWidth=22; c.strokeStyle='#3a4269'; c.stroke();
  c.lineWidth=10; c.strokeStyle='#59628d'; c.stroke();
  c.lineWidth=3; c.strokeStyle='rgba(0,0,0,0.4)'; c.stroke();
  c.restore();
  c.fillStyle='#4e5888'; c.fillRect(x-hw-18,sill-4,hw*2+36,16);
  c.fillStyle='#39405e'; c.fillRect(x-hw-18,sill+12,hw*2+36,8);
  c.save(); c.globalCompositeOperation='lighter';
  const sp=c.createRadialGradient(x,sill,4,x,sill,150);
  sp.addColorStop(0,'rgba(150,190,255,0.2)'); sp.addColorStop(1,'rgba(150,190,255,0)');
  c.fillStyle=sp; c.fillRect(x-150,sill-90,300,160);
  c.restore();
}
function panoWall(c){
  const wg=c.createLinearGradient(0,CORN_Y,0,FLOOR_Y);
  wg.addColorStop(0,'#1d2549'); wg.addColorStop(0.5,'#28325e'); wg.addColorStop(1,'#374473');
  c.fillStyle=wg; c.fillRect(0,CORN_Y,PW,FLOOR_Y-CORN_Y+8);
  c.strokeStyle='rgba(0,0,0,0.34)'; c.lineWidth=2.4;
  for(let y=CORN_Y+30;y<FLOOR_Y;y+=34){ c.beginPath(); c.moveTo(0,y); c.lineTo(PW,y); c.stroke(); }
  c.strokeStyle='rgba(150,175,255,0.05)'; c.lineWidth=1.6;
  for(let y=CORN_Y+32;y<FLOOR_Y;y+=34){ c.beginPath(); c.moveTo(0,y); c.lineTo(PW,y); c.stroke(); }
  c.strokeStyle='rgba(0,0,0,0.26)'; c.lineWidth=2;
  for(let x=44;x<PW;x+=88){ c.beginPath(); c.moveTo(x,CORN_Y); c.lineTo(x,FLOOR_Y); c.stroke(); }
  // per-block tone variation so the stone reads as masonry
  srnd(4711);
  let row=0;
  for(let y=CORN_Y+30;y<FLOOR_Y-4;y+=34,row++){
    const off=(row%2)?44:0;
    for(let x=off;x<PW;x+=88){
      const v=rnd();
      c.fillStyle=v<0.34?'rgba(255,255,255,0.035)':(v>0.72?'rgba(0,0,0,0.12)':'rgba(255,255,255,0)');
      c.fillRect(x+2,y+2,84,30);
    }
  }
  [560,1800,2200,3450].forEach((nx,i)=>panoWindow(c,nx,i));
  // blind niches break up the long stretches of wall
  [1000,3000].forEach(nx=>{
    const top=312, bot=520, hw=46;
    c.fillStyle='#161c33';
    c.beginPath();
    c.moveTo(nx-hw,bot); c.lineTo(nx-hw,top+34);
    c.quadraticCurveTo(nx-hw,top,nx,top); c.quadraticCurveTo(nx+hw,top,nx+hw,top+34);
    c.lineTo(nx+hw,bot); c.closePath(); c.fill();
    c.strokeStyle='#4b5476'; c.lineWidth=9; c.stroke();
    const gl=c.createRadialGradient(nx,bot-40,4,nx,bot-40,90);
    gl.addColorStop(0,'rgba(255,190,110,0.18)'); gl.addColorStop(1,'rgba(255,170,60,0)');
    c.fillStyle=gl; c.fillRect(nx-hw,top,hw*2,bot-top);
    c.fillStyle='#39405e'; c.fillRect(nx-30,bot-30,60,12);
    skull(c,nx,bot-50,17,'#cdbf9f','#161c33',true);
  });
  for(let x=0;x<PW;x+=200) if(x%400===0) stonePilaster(c,x,56);
  // warm light spilling onto the stone
  c.save(); c.globalCompositeOperation='lighter';
  [120,520,1050,1520,1760,2250,2480,2950,3420,3880].forEach(tx=>{
    const gl=c.createRadialGradient(tx+14,404,6,tx+14,404,190);
    gl.addColorStop(0,'rgba(255,164,72,0.5)'); gl.addColorStop(0.45,'rgba(255,130,44,0.13)');
    gl.addColorStop(1,'rgba(255,120,40,0)');
    c.fillStyle=gl; c.fillRect(tx-180,CORN_Y,372,FLOOR_Y-CORN_Y+8);
  });
  for(let i=0;i<20;i++){
    const lx=i*200+100;
    const gl=c.createRadialGradient(lx,208,4,lx,208,120);
    gl.addColorStop(0,'rgba(255,176,88,0.34)'); gl.addColorStop(1,'rgba(255,140,50,0)');
    c.fillStyle=gl; c.fillRect(lx-120,CORN_Y,240,220);
  }
  // candle glow washing up the foot of the wall
  const foot=c.createLinearGradient(0,FLOOR_Y-90,0,FLOOR_Y+8);
  foot.addColorStop(0,'rgba(255,150,60,0)'); foot.addColorStop(1,'rgba(255,150,60,0.16)');
  c.fillStyle=foot; c.fillRect(0,FLOOR_Y-90,PW,98);
  c.restore();
}
const AR={half:96, apex:288, spring:424};
function archPath(c,gx){
  c.beginPath();
  c.moveTo(gx-AR.half,FLOOR_Y+4);
  c.lineTo(gx-AR.half,AR.spring);
  c.quadraticCurveTo(gx-AR.half+9,AR.apex+34,gx,AR.apex);
  c.quadraticCurveTo(gx+AR.half-9,AR.apex+34,gx+AR.half,AR.spring);
  c.lineTo(gx+AR.half,FLOOR_Y+4);
  c.closePath();
}
function panoVista(c,gx){
  c.save(); archPath(c,gx); c.clip();
  c.translate(gx-AR.half,AR.apex);
  c.scale((AR.half*2)/215,(FLOOR_Y-AR.apex)/344);
  c.translate(-700,-232);
  const s=c.createLinearGradient(0,232,0,576);
  s.addColorStop(0,'#1d3468'); s.addColorStop(0.42,'#37578f'); s.addColorStop(1,'#2b4470');
  c.fillStyle=s; c.fillRect(686,220,248,372);
  const mg=c.createRadialGradient(806,350,6,806,350,135);
  mg.addColorStop(0,'rgba(238,246,255,0.95)'); mg.addColorStop(0.32,'rgba(205,228,255,0.5)');
  mg.addColorStop(1,'rgba(170,210,255,0)');
  c.fillStyle=mg; c.beginPath(); c.arc(806,350,135,0,6.3); c.fill();
  c.fillStyle='#eef5ff'; c.beginPath(); c.arc(806,346,62,0,6.3); c.fill();
  c.fillStyle='#1b2c4e';
  c.beginPath(); c.moveTo(690,300); c.lineTo(736,344); c.lineTo(716,420); c.lineTo(690,470); c.closePath(); c.fill();
  c.beginPath(); c.moveTo(930,290); c.lineTo(884,340); c.lineTo(906,430); c.lineTo(930,480); c.closePath(); c.fill();
  c.fillStyle='#16233d';
  c.beginPath(); c.moveTo(716,452); c.lineTo(762,412); c.lineTo(806,398);
  c.lineTo(854,412); c.lineTo(898,452); c.closePath(); c.fill();
  c.save(); c.translate(806,0); c.scale(0.56,1); c.translate(-806,0);
  castle(c,806,416,0.66,'#111a36',true);
  c.restore();
  c.fillStyle='#2b4a33';
  c.beginPath(); c.moveTo(690,458); c.quadraticCurveTo(752,436,806,452);
  c.quadraticCurveTo(870,472,930,448); c.lineTo(930,580); c.lineTo(690,580); c.closePath(); c.fill();
  c.fillStyle='#22402a';
  c.beginPath(); c.moveTo(690,502); c.quadraticCurveTo(770,478,842,508);
  c.quadraticCurveTo(892,524,930,512); c.lineTo(930,580); c.lineTo(690,580); c.closePath(); c.fill();
  c.fillStyle='#8d9670';
  c.beginPath();
  c.moveTo(770,580);
  c.bezierCurveTo(778,528,724,506,750,474);
  c.bezierCurveTo(772,448,820,442,812,414);
  c.lineTo(832,412);
  c.bezierCurveTo(842,448,792,462,764,484);
  c.bezierCurveTo(736,506,796,530,822,580);
  c.closePath(); c.fill();
  c.fillStyle='#ffc46a';
  [[760,528],[742,486],[792,452],[822,430]].forEach(([lx,ly])=>{
    c.beginPath(); c.arc(lx,ly,2.6,0,6.3); c.fill();
  });
  c.fillStyle='#132a1c';
  [[712,524,17],[904,532,15],[700,558,20],[920,562,18],[744,474,10],[872,476,9]].forEach(([tx,ty,ts])=>{
    c.fillRect(tx-2,ty-ts*0.4,4,ts*0.5);
    c.beginPath(); c.moveTo(tx,ty-ts*2.2); c.lineTo(tx-ts*0.78,ty-ts*0.2); c.lineTo(tx+ts*0.78,ty-ts*0.2); c.closePath(); c.fill();
  });
  c.fillStyle='rgba(190,215,255,0.11)';
  [[806,470,140,10],[806,512,150,12]].forEach(([x,y,rx,ry])=>{
    c.beginPath(); c.ellipse(x,y,rx,ry,0,0,6.3); c.fill();
  });
  c.restore();
}
function panoGate(c,gx){
  const gg=c.createLinearGradient(0,CORN_Y,0,FLOOR_Y);
  gg.addColorStop(0,'#4a5479'); gg.addColorStop(0.45,'#353d60'); gg.addColorStop(1,'#262c49');
  c.fillStyle=gg; c.fillRect(gx-150,CORN_Y,300,FLOOR_Y-CORN_Y+8);
  c.strokeStyle='rgba(0,0,0,0.24)'; c.lineWidth=2;
  for(let y=CORN_Y+34;y<FLOOR_Y;y+=34){ c.beginPath(); c.moveTo(gx-150,y); c.lineTo(gx+150,y); c.stroke(); }
  panoVista(c,gx);
  c.save(); archPath(c,gx); c.lineWidth=15; c.strokeStyle='#525c82'; c.stroke();
  c.lineWidth=6; c.strokeStyle='#2c3350'; c.stroke(); c.restore();
  c.beginPath();
  c.moveTo(gx-AR.half-18,FLOOR_Y+4); c.lineTo(gx-AR.half-18,AR.spring-6);
  c.quadraticCurveTo(gx-AR.half-7,AR.apex+18,gx,AR.apex-18);
  c.quadraticCurveTo(gx+AR.half+7,AR.apex+18,gx+AR.half+18,AR.spring-6);
  c.lineTo(gx+AR.half+18,FLOOR_Y+4);
  c.lineWidth=12; c.strokeStyle='#3c456a'; c.stroke();
  stonePilaster(c,gx-122,60); stonePilaster(c,gx+122,60);
  c.fillStyle='#59628a';
  c.beginPath(); c.moveTo(gx-19,AR.apex-26); c.lineTo(gx+19,AR.apex-26);
  c.lineTo(gx+12,AR.apex+20); c.lineTo(gx-12,AR.apex+20); c.closePath(); c.fill();
  c.strokeStyle='rgba(0,0,0,0.35)'; c.lineWidth=1.8; c.stroke();
  c.fillStyle='#1d3a24';
  [[gx-136,342],[gx-104,334],[gx+104,336],[gx+136,328]].forEach(([vx,vy])=>{
    for(let i=0;i<7;i++) { c.beginPath(); c.ellipse(vx+Math.sin(i*1.4)*5,vy+i*13,7,5,0.4,0,6.3); c.fill(); }
  });
}
function panoHubSign(c,gx){
  const w=252,h=136,x=gx-w/2,y=84;
  c.strokeStyle='#6e7490'; c.lineWidth=3;
  [x+36,x+w-36].forEach(cx0=>{ c.beginPath(); c.moveTo(cx0,y); c.lineTo(cx0,y-46); c.stroke(); });
  c.fillStyle='#2a3150';
  for(let sx=x+18;sx<x+w-10;sx+=32){
    c.beginPath(); c.moveTo(sx-6,y+5); c.lineTo(sx,y-11); c.lineTo(sx+6,y+5); c.closePath(); c.fill();
  }
  c.fillStyle='#8a7038'; rr(c,x-7,y,w+14,h,12); c.fill();
  c.fillStyle='#caa257'; rr(c,x-3,y+4,w+6,h-8,10); c.fill();
  c.fillStyle='#17110f'; rr(c,x+6,y+13,w-12,h-26,8); c.fill();
  const bgl=c.createLinearGradient(0,y+13,0,y+h-13);
  bgl.addColorStop(0,'rgba(255,190,110,0.09)'); bgl.addColorStop(1,'rgba(0,0,0,0.2)');
  c.fillStyle=bgl; rr(c,x+6,y+13,w-12,h-26,8); c.fill();
  c.fillStyle='#caa257';
  [[x-5,y+h*0.5],[x+w+5,y+h*0.5]].forEach(([sx,sy])=>{ c.beginPath(); c.arc(sx,sy,10,0,6.3); c.fill(); });
  skull(c,gx,y+42,21,'#f5a83c','#17110f',true);
  c.textAlign='center';
  c.fillStyle='#f6ad45'; c.font='800 42px "Work Sans",system-ui,sans-serif'; c.letterSpacing='2px';
  c.fillText('HUB',gx,y+102); c.letterSpacing='0px';
  c.fillStyle='#f0e6d6'; c.font='600 22px "Work Sans",system-ui,sans-serif';
  c.fillText('game studio',gx,y+126);
}
function bannerCloth(c,cx,top,w,h,c1,c2,skullCol){
  c.fillStyle='#3a2a18'; c.fillRect(cx-w*0.6,top-9,w*1.2,9);
  c.strokeStyle='#8a8fa8'; c.lineWidth=2.2;
  [-0.32,0.32].forEach(o=>{ c.beginPath(); c.arc(cx+w*o,top-4,4.6,0,6.3); c.stroke(); });
  const bgd=c.createLinearGradient(cx-w/2,0,cx+w/2,0);
  bgd.addColorStop(0,c2); bgd.addColorStop(0.4,c1); bgd.addColorStop(1,c2);
  c.fillStyle=bgd;
  c.beginPath();
  c.moveTo(cx-w/2,top); c.lineTo(cx+w/2,top); c.lineTo(cx+w/2,top+h);
  c.lineTo(cx,top+h-22); c.lineTo(cx-w/2,top+h); c.closePath(); c.fill();
  c.strokeStyle='rgba(255,230,190,0.2)'; c.lineWidth=2; c.stroke();
  c.fillStyle='rgba(0,0,0,0.2)'; c.fillRect(cx+w/2-9,top,9,h-13);
  skull(c,cx,top+42,14,skullCol,c1,true);
}
function panoSideBanner(c,cx){
  const top=214,w=76,h=214;
  c.fillStyle='#3a2a18'; c.fillRect(cx-w*0.6,top-9,w*1.2,9);
  const bgd=c.createLinearGradient(cx-w/2,0,cx+w/2,0);
  bgd.addColorStop(0,'#1d1839'); bgd.addColorStop(0.42,'#372b60'); bgd.addColorStop(1,'#1b1634');
  c.fillStyle=bgd;
  c.beginPath(); c.moveTo(cx-w/2,top); c.lineTo(cx+w/2,top); c.lineTo(cx+w/2,top+h);
  c.lineTo(cx,top+h-22); c.lineTo(cx-w/2,top+h); c.closePath(); c.fill();
  c.strokeStyle='rgba(196,176,255,0.3)'; c.lineWidth=2; c.stroke();
  skull(c,cx,top+46,19,'#c9b6f5','#231a42',true);
  c.textAlign='center'; c.fillStyle='#ece7fb';
  c.font='700 15px "Work Sans",system-ui,sans-serif';
  ['SPEEL','ONTDEK','WIN'].forEach((t,i)=>c.fillText(t,cx,top+112+i*28));
}
function panoMiniPanel(c,cx){
  const top=212,w=96,h=232;
  c.fillStyle='#3a2a18'; c.fillRect(cx-w*0.6,top-9,w*1.2,9);
  const bgd=c.createLinearGradient(cx-w/2,0,cx+w/2,0);
  bgd.addColorStop(0,'#141a38'); bgd.addColorStop(0.42,'#222c55'); bgd.addColorStop(1,'#131936');
  c.fillStyle=bgd;
  c.beginPath(); c.moveTo(cx-w/2,top); c.lineTo(cx+w/2,top); c.lineTo(cx+w/2,top+h);
  c.lineTo(cx,top+h-20); c.lineTo(cx-w/2,top+h); c.closePath(); c.fill();
  c.strokeStyle='rgba(180,200,255,0.26)'; c.lineWidth=2; c.stroke();
  c.textAlign='center'; c.fillStyle='#f0f4ff';
  c.font='700 13px "Work Sans",system-ui,sans-serif';
  c.fillText('ZES SPELLEN',cx,top+26); c.fillText('ALLEMAAL GRATIS',cx,top+43);
  [[top+56,'climb','Torenklim'],[top+130,'nest','Spinnennest']].forEach(([ty,kind,label])=>{
    c.fillStyle='#0e1430'; rr(c,cx-24,ty,48,48,8); c.fill();
    c.strokeStyle='rgba(180,200,255,0.2)'; c.lineWidth=1.4; rr(c,cx-24,ty,48,48,8); c.stroke();
    if(kind==='climb') climberGlyph(c,cx,ty+24,12,'#f2f6ff');
    else cuteSpider(c,cx,ty+24,11,'#f2f6ff');
    c.fillStyle='#dde4fa'; c.font='600 12px "Work Sans",system-ui,sans-serif';
    c.fillText(label,cx,ty+64);
  });
}
function panoCrest(c,cx){
  // trophy niche opposite the gate
  c.fillStyle='#1b2039';
  c.beginPath();
  c.moveTo(cx-110,FLOOR_Y); c.lineTo(cx-110,330);
  c.quadraticCurveTo(cx-110,238,cx,238);
  c.quadraticCurveTo(cx+110,238,cx+110,330);
  c.lineTo(cx+110,FLOOR_Y); c.closePath(); c.fill();
  c.strokeStyle='#4b5476'; c.lineWidth=13; c.stroke();
  const gl=c.createRadialGradient(cx,360,10,cx,360,150);
  gl.addColorStop(0,'rgba(255,190,110,0.2)'); gl.addColorStop(1,'rgba(255,190,110,0)');
  c.fillStyle=gl; c.fillRect(cx-110,250,220,FLOOR_Y-250);
  skull(c,cx,352,52,'#e8d9b4','#1b2039',true);
  c.textAlign='center'; c.fillStyle='#f0e6d6';
  c.font='700 17px "Work Sans",system-ui,sans-serif'; c.letterSpacing='2px';
  c.fillText('HALL OF FAME',cx,470); c.letterSpacing='0px';
  c.font='600 13px "Work Sans",system-ui,sans-serif'; c.fillStyle='rgba(220,228,250,0.6)';
  c.fillText('Veld · 1450',cx,500);
  c.fillStyle='#3a2a18'; c.fillRect(cx-124,318,18,FLOOR_Y-318);
  c.fillRect(cx+106,318,18,FLOOR_Y-318);
}
function hangLantern(c,x,y,s){
  c.strokeStyle='#6e7490'; c.lineWidth=2.4*s;
  c.beginPath(); c.moveTo(x,y-40*s); c.lineTo(x,y-24*s); c.stroke();
  c.fillStyle='#2b3148';
  c.beginPath(); c.moveTo(x-11*s,y-18*s); c.lineTo(x+11*s,y-18*s); c.lineTo(x+7*s,y-26*s); c.lineTo(x-7*s,y-26*s); c.closePath(); c.fill();
  c.fillStyle='#39405c'; c.fillRect(x-10*s,y-18*s,20*s,30*s);
  c.fillStyle='#120e08'; c.fillRect(x-7*s,y-15*s,14*s,24*s);
  c.fillStyle='#2b3148'; c.fillRect(x-12*s,y+11*s,24*s,6*s);
  c.fillStyle='#6e7490';
  c.fillRect(x-10*s,y-16*s,2*s,28*s); c.fillRect(x+8*s,y-16*s,2*s,28*s);
}
function wallTorch(c,x,y,s,dir){
  c.save(); c.translate(x,y); c.scale(dir||1,1);
  c.fillStyle='#39405c';
  c.beginPath(); c.moveTo(0,0); c.lineTo(16*s,-6*s); c.lineTo(16*s,-2*s); c.lineTo(2*s,6*s); c.closePath(); c.fill();
  c.fillStyle='#2a1b10'; c.fillRect(12*s,-22*s,7*s,20*s);
  c.fillStyle='#4a5375';
  c.beginPath(); c.moveTo(9*s,-22*s); c.lineTo(23*s,-22*s); c.lineTo(20*s,-30*s); c.lineTo(12*s,-30*s); c.closePath(); c.fill();
  c.restore();
}

function chandelier(c,x,y){
  c.strokeStyle='#22283f'; c.lineWidth=3;
  c.beginPath(); c.moveTo(x,-40); c.lineTo(x,y-26); c.stroke();
  c.fillStyle='#1b2136';
  c.beginPath(); c.ellipse(x,y,46,13,0,0,6.3); c.fill();
  c.strokeStyle='#39405e'; c.lineWidth=5;
  c.beginPath(); c.ellipse(x,y,46,13,0,0,6.3); c.stroke();
  c.strokeStyle='#22283f'; c.lineWidth=2.4;
  [-30,0,30].forEach(d=>{ c.beginPath(); c.moveTo(x+d,y-24); c.lineTo(x+d*0.4,y-2); c.stroke(); });
  c.fillStyle='#e8e2d0';
  for(let i=0;i<6;i++){
    const a=i*1.047, cx2=x+Math.cos(a)*44, cy2=y+Math.sin(a)*12;
    c.fillRect(cx2-3,cy2-16,6,16);
  }
}
