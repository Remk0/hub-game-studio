
/* =====================================================================
   DIEPZEE — een gezonken zaal op de bodem, ver onder het licht
===================================================================== */
function o_coral(c,x,y,s,col,col2){
  srnd((x*31+y)|0);
  for(let i=0;i<7;i++){
    const bx=x+(rnd()-0.5)*26*s, by=y-rnd()*16*s, r=(4+rnd()*8)*s;
    c.fillStyle=rnd()<0.42?col2:col;
    c.beginPath(); c.arc(bx,by,r,0,6.3); c.fill();
  }
  c.strokeStyle=col; c.lineWidth=2.4*s; c.lineCap='round';
  for(let i=0;i<4;i++){
    const bx=x+(rnd()-0.5)*20*s;
    c.beginPath(); c.moveTo(bx,y);
    c.quadraticCurveTo(bx+(rnd()-0.5)*16*s,y-16*s,bx+(rnd()-0.5)*22*s,y-30*s); c.stroke();
  }
}
function o_fan(c,x,y,s,col){              // zeewaaier
  c.save(); c.translate(x,y); c.scale(s,s);
  c.strokeStyle=col; c.lineCap='round';
  for(let i=-3;i<=3;i++){
    c.lineWidth=3.2-Math.abs(i)*0.3;
    c.beginPath(); c.moveTo(0,0);
    c.quadraticCurveTo(i*9,-26,i*17,-52); c.stroke();
    for(let k=1;k<=3;k++){
      c.lineWidth=1.3;
      c.beginPath(); c.moveTo(i*5*k/3,-16*k/1.4);
      c.lineTo(i*5*k/3+(i>0?9:-9),-16*k/1.4-7); c.stroke();
    }
  }
  c.restore();
}
function o_barnacles(c,x,y,w,n,seed){
  srnd(seed>>>0);
  for(let i=0;i<n;i++){
    const bx=x+rnd()*w, by=y+rnd()*26, r=2+rnd()*4;
    c.fillStyle='rgba(208,214,206,0.5)';
    c.beginPath(); c.ellipse(bx,by,r,r*0.72,0,0,6.3); c.fill();
    c.fillStyle='rgba(20,34,44,0.7)';
    c.beginPath(); c.ellipse(bx,by,r*0.4,r*0.3,0,0,6.3); c.fill();
  }
}
function o_porthole(c,x,variant){
  const R=92, cy=396;
  c.save();
  c.beginPath(); c.arc(x,cy,R,0,6.3); c.clip();
  // het water erbuiten: donkerder naar beneden
  c.fillStyle=vgrad(c,cy-R,cy+R,[[0,'#0b3550'],[0.45,'#072538'],[1,'#03131f']]);
  c.fillRect(x-R,cy-R,R*2,R*2);
  if(variant===0){                       // kelpwoud met lichtval
    c.fillStyle='rgba(120,190,220,0.12)';
    for(let i=0;i<4;i++){ c.beginPath();
      c.moveTo(x-R+i*46,cy-R); c.lineTo(x-R+i*46+18,cy-R);
      c.lineTo(x-R+i*46+44,cy+R); c.lineTo(x-R+i*46-8,cy+R); c.closePath(); c.fill(); }
    for(let i=0;i<7;i++){
      const kx=x-R+10+i*26;
      c.strokeStyle='#1d5136'; c.lineWidth=5; c.lineCap='round';
      c.beginPath(); c.moveTo(kx,cy+R);
      c.quadraticCurveTo(kx+((i%2)?16:-16),cy,kx+((i%2)?-10:10),cy-R); c.stroke();
      c.fillStyle='#276b45';
      for(let k=0;k<6;k++){
        const ky=cy+R-k*32, kxx=kx+((i%2)?16:-16)*(1-k/6);
        c.beginPath(); c.ellipse(kxx+9,ky,11,4,0.5,0,6.3); c.fill();
        c.beginPath(); c.ellipse(kxx-9,ky-12,11,4,-0.5,0,6.3); c.fill();
      }
    }
  } else if(variant===1){                // een walvis die voorbijtrekt
    c.fillStyle='rgba(150,205,235,0.1)'; c.fillRect(x-R,cy-R,R*2,60);
    c.fillStyle='#10293c';
    c.beginPath();
    c.moveTo(x-96,cy-6); c.quadraticCurveTo(x-20,cy-46,x+52,cy-12);
    c.quadraticCurveTo(x+74,cy-6,x+92,cy-30);
    c.lineTo(x+96,cy+6);
    c.quadraticCurveTo(x+70,cy+4,x+50,cy+14);
    c.quadraticCurveTo(x-18,cy+40,x-96,cy+10);
    c.closePath(); c.fill();
    c.strokeStyle='rgba(180,214,236,0.22)'; c.lineWidth=2;
    for(let i=0;i<5;i++){ c.beginPath(); c.moveTo(x-80+i*8,cy+8); c.lineTo(x-76+i*8,cy+26); c.stroke(); }
    c.fillStyle='rgba(230,244,255,0.85)';
    c.beginPath(); c.arc(x-78,cy-8,3,0,6.3); c.fill();
    c.fillStyle='rgba(190,224,246,0.35)';                // kleine vissen eromheen
    for(let i=0;i<9;i++){ c.beginPath(); c.ellipse(x-40+i*14,cy-54+((i*13)%16),5,2.4,0.2,0,6.3); c.fill(); }
  } else if(variant===2){                // hydrothermale schoorstenen
    c.fillStyle='#0a1a24';
    c.beginPath(); c.moveTo(x-R,cy+R); c.lineTo(x-R,cy+40);
    c.quadraticCurveTo(x-30,cy+18,x+18,cy+44); c.lineTo(x+R,cy+30); c.lineTo(x+R,cy+R); c.closePath(); c.fill();
    [[-42,44],[6,58],[48,38]].forEach(([dx,h],i)=>{
      c.fillStyle='#132b34';
      c.beginPath(); c.moveTo(x+dx-13,cy+46); c.lineTo(x+dx-6,cy+46-h);
      c.lineTo(x+dx+6,cy+46-h); c.lineTo(x+dx+13,cy+46); c.closePath(); c.fill();
      c.fillStyle='rgba(40,30,30,0.6)';                  // zwarte rookpluim
      for(let k=0;k<7;k++){
        c.beginPath(); c.arc(x+dx+((k%2)?5:-5),cy+30-h-k*13,6+k*2.4,0,6.3); c.fill();
      }
      c.fillStyle='rgba(255,140,70,0.5)';
      c.beginPath(); c.ellipse(x+dx,cy+46-h,6,2.4,0,0,6.3); c.fill();
    });
    c.fillStyle='rgba(230,240,232,0.5)';                 // buisworm-bosjes
    for(let i=0;i<12;i++){
      const wx=x-60+i*11, wy=cy+48+((i*17)%10);
      c.fillRect(wx,wy-14,2.4,14);
      c.fillStyle='rgba(224,70,70,0.7)'; c.fillRect(wx-0.6,wy-17,3.6,4);
      c.fillStyle='rgba(230,240,232,0.5)';
    }
  } else {                                // hengelaarsvis in het donker
    c.fillStyle='rgba(2,10,16,0.9)'; c.fillRect(x-R,cy-R,R*2,R*2);
    const lx=x+16, ly=cy-16;
    const lg=c.createRadialGradient(lx,ly,2,lx,ly,64);
    lg.addColorStop(0,'rgba(180,255,226,0.95)'); lg.addColorStop(0.3,'rgba(90,220,190,0.35)');
    lg.addColorStop(1,'rgba(40,180,160,0)');
    c.fillStyle=lg; c.fillRect(x-R,cy-R,R*2,R*2);
    c.fillStyle='#071b20';
    c.beginPath(); c.ellipse(x-16,cy+8,50,34,0.1,0,6.3); c.fill();
    c.beginPath(); c.moveTo(x-62,cy+6); c.lineTo(x-92,cy-12); c.lineTo(x-88,cy+30); c.closePath(); c.fill();
    c.strokeStyle='#071b20'; c.lineWidth=3;
    c.beginPath(); c.moveTo(x-14,cy-22); c.quadraticCurveTo(x+16,cy-52,lx,ly+4); c.stroke();
    c.fillStyle='rgba(180,255,226,0.95)';
    c.beginPath(); c.arc(lx,ly,5,0,6.3); c.fill();
    c.fillStyle='#e8f6f2';                               // tanden
    for(let i=0;i<7;i++){
      c.beginPath(); c.moveTo(x-52+i*9,cy+16); c.lineTo(x-49+i*9,cy+26); c.lineTo(x-46+i*9,cy+16); c.closePath(); c.fill();
    }
    c.fillStyle='rgba(240,250,246,0.9)';
    c.beginPath(); c.arc(x-34,cy-2,4,0,6.3); c.fill();
    c.fillStyle='#04141a'; c.beginPath(); c.arc(x-33,cy-2,2,0,6.3); c.fill();
  }
  // deeltjes in het water vlak achter het glas
  c.fillStyle='rgba(206,232,240,0.3)';
  srnd((x*13)|0);
  for(let i=0;i<26;i++) c.fillRect(x-R+rnd()*R*2,cy-R+rnd()*R*2,1.6,1.6);
  c.restore();
  // dikke messing rand met bouten
  c.strokeStyle='#2b3c42'; c.lineWidth=26; c.beginPath(); c.arc(x,cy,R,0,6.3); c.stroke();
  c.strokeStyle='#6d6a4a'; c.lineWidth=16; c.beginPath(); c.arc(x,cy,R,0,6.3); c.stroke();
  c.strokeStyle='#8d8759'; c.lineWidth=6; c.beginPath(); c.arc(x,cy-1,R-4,0,6.3); c.stroke();
  c.strokeStyle='rgba(0,0,0,0.4)'; c.lineWidth=3; c.beginPath(); c.arc(x,cy,R+11,0,6.3); c.stroke();
  c.fillStyle='#b9b07a';
  for(let i=0;i<14;i++){
    const a=i*0.4488;
    c.beginPath(); c.arc(x+Math.cos(a)*(R+2),cy+Math.sin(a)*(R+2),4.2,0,6.3); c.fill();
  }
  c.strokeStyle='rgba(255,255,255,0.14)'; c.lineWidth=7;
  c.beginPath(); c.arc(x,cy,R-14,3.5,4.6); c.stroke();
  o_barnacles(c,x-R,cy+R-24,R*2,18,(x*3)|0);
  o_coral(c,x-R-6,cy+R-6,0.8,'#2e6b6a','#b8556b');
  o_coral(c,x+R+6,cy+R-2,0.7,'#2a5f74','#c96a52');
  c.save(); c.globalCompositeOperation='lighter';
  pool(c,x,cy,150,'rgba(96,190,214,0.14)');
  c.restore();
}
function o_globe(c,x,y){                  // kwallenlamp aan een touw
  c.strokeStyle='#4a5a54'; c.lineWidth=2.4;
  c.beginPath(); c.moveTo(x,y-42); c.lineTo(x,y-22); c.stroke();
  c.fillStyle='#3d5257';
  c.beginPath(); c.moveTo(x-9,y-22); c.lineTo(x+9,y-22); c.lineTo(x+6,y-30); c.lineTo(x-6,y-30); c.closePath(); c.fill();
  const gl=c.createRadialGradient(x,y-2,2,x,y-2,30);
  gl.addColorStop(0,'rgba(180,255,236,0.9)'); gl.addColorStop(0.45,'rgba(80,205,200,0.4)');
  gl.addColorStop(1,'rgba(40,150,170,0)');
  c.fillStyle=gl; c.beginPath(); c.arc(x,y-2,30,0,6.3); c.fill();
  c.fillStyle='rgba(150,240,225,0.65)';
  c.beginPath(); c.arc(x,y-6,11,Math.PI,0); c.fill();
  c.strokeStyle='rgba(180,250,236,0.6)'; c.lineWidth=1.6; c.lineCap='round';
  for(let i=-2;i<=2;i++){
    c.beginPath(); c.moveTo(x+i*4,y-6);
    c.quadraticCurveTo(x+i*6,y+4,x+i*3,y+13); c.stroke();
  }
  c.strokeStyle='rgba(200,222,216,0.35)'; c.lineWidth=2;
  c.beginPath(); c.arc(x,y-4,17,0,6.3); c.stroke();
}
function o_anemoneSconce(c,x,y){
  c.fillStyle='#2b4148';
  c.beginPath(); c.moveTo(x-4,y); c.lineTo(x+22,y-8); c.lineTo(x+22,y-3); c.lineTo(x-1,y+6); c.closePath(); c.fill();
  c.fillStyle='#37535a';
  c.beginPath(); c.ellipse(x+22,y-8,13,7,0,0,6.3); c.fill();
  const gl=c.createRadialGradient(x+22,y-12,2,x+22,y-12,30);
  gl.addColorStop(0,'rgba(190,255,214,0.8)'); gl.addColorStop(1,'rgba(60,210,180,0)');
  c.fillStyle=gl; c.beginPath(); c.arc(x+22,y-12,30,0,6.3); c.fill();
  c.strokeStyle='rgba(170,250,206,0.8)'; c.lineWidth=2.2; c.lineCap='round';
  for(let i=-4;i<=4;i++){
    c.beginPath(); c.moveTo(x+22,y-10);
    c.quadraticCurveTo(x+22+i*4,y-22,x+22+i*6.5,y-26); c.stroke();
  }
  c.fillStyle='rgba(224,120,140,0.7)';
  c.beginPath(); c.ellipse(x+22,y-11,7,4,0,0,6.3); c.fill();
}
function o_abyss(c,gx){                   // uitzicht door de poort: vlakte met een wrak
  c.save(); archPath(c,gx); c.clip();
  c.fillStyle=vgrad(c,AR.apex-40,FLOOR_Y+8,[[0,'#072030'],[0.4,'#0b3a48'],[0.78,'#10475d'],[1,'#1a5a6b']]);
  c.fillRect(gx-AR.half,AR.apex-40,AR.half*2,FLOOR_Y-AR.apex+60);
  // lichtschacht van heel ver boven
  const sh=c.createLinearGradient(0,AR.apex-40,0,FLOOR_Y);
  sh.addColorStop(0,'rgba(180,235,248,0.4)'); sh.addColorStop(1,'rgba(130,210,230,0.04)');
  c.fillStyle=sh;
  c.beginPath(); c.moveTo(gx-26,AR.apex-40); c.lineTo(gx+14,AR.apex-40);
  c.lineTo(gx+70,FLOOR_Y); c.lineTo(gx-72,FLOOR_Y); c.closePath(); c.fill();
  // het wrak
  c.fillStyle='#0d3343';
  c.save(); c.translate(gx+8,452); c.rotate(-0.12);
  c.beginPath();
  c.moveTo(-96,0); c.quadraticCurveTo(-70,26,10,28); c.quadraticCurveTo(76,26,96,-6);
  c.lineTo(84,-16); c.quadraticCurveTo(30,4,-22,0); c.quadraticCurveTo(-64,-4,-84,-18);
  c.closePath(); c.fill();
  c.fillRect(-52,-44,10,44); c.fillRect(6,-58,10,58);      // masten
  c.strokeStyle='rgba(120,180,190,0.3)'; c.lineWidth=1.4;
  c.beginPath(); c.moveTo(-47,-44); c.lineTo(11,-58); c.stroke();
  c.beginPath(); c.moveTo(-47,-40); c.lineTo(-84,-16); c.stroke();
  c.fillStyle='rgba(150,240,214,0.85)';                     // lichtjes in de patrijspoorten
  for(let i=0;i<6;i++){ c.beginPath(); c.arc(-56+i*22,-8,2.6,0,6.3); c.fill(); }
  c.restore();
  // zeebodem met ribbels
  c.fillStyle='#153d46';
  c.beginPath(); c.moveTo(gx-AR.half,494); c.quadraticCurveTo(gx-20,470,gx+AR.half,486);
  c.lineTo(gx+AR.half,FLOOR_Y+8); c.lineTo(gx-AR.half,FLOOR_Y+8); c.closePath(); c.fill();
  c.fillStyle='#1d5560';
  c.beginPath(); c.moveTo(gx-AR.half,528); c.quadraticCurveTo(gx+10,506,gx+AR.half,524);
  c.lineTo(gx+AR.half,FLOOR_Y+8); c.lineTo(gx-AR.half,FLOOR_Y+8); c.closePath(); c.fill();
  c.strokeStyle='rgba(190,224,226,0.14)'; c.lineWidth=2;
  for(let i=0;i<5;i++){
    c.beginPath(); c.moveTo(gx-AR.half,540+i*12);
    c.quadraticCurveTo(gx,530+i*12,gx+AR.half,542+i*12); c.stroke();
  }
  // verre rotspunten
  c.fillStyle='#0a2934';
  [[-70,430],[62,418],[-20,444]].forEach(([dx,ty])=>{
    c.beginPath(); c.moveTo(gx+dx-28,494); c.lineTo(gx+dx,ty); c.lineTo(gx+dx+26,494); c.closePath(); c.fill();
  });
  o_coral(c,gx-64,500,1.1,'#2a6b6c','#b8556b');
  o_coral(c,gx+70,506,1,'#2b5f76','#c96a52');
  o_fan(c,gx-30,512,0.8,'rgba(198,110,126,0.75)');
  c.fillStyle='rgba(160,220,232,0.5)';                      // school visjes in de verte
  for(let i=0;i<16;i++){
    c.beginPath(); c.ellipse(gx-70+((i*19)%150),400+((i*27)%50),4,1.8,0.15,0,6.3); c.fill();
  }
  c.restore();
}
function o_sign(c,gx){
  const w=254,h=136,x=gx-w/2,y=84;
  c.strokeStyle='#40554f'; c.lineWidth=3;
  [x+36,x+w-36].forEach(cx0=>{ c.beginPath(); c.moveTo(cx0,y); c.lineTo(cx0,y-48); c.stroke(); });
  c.fillStyle='#4a4a33'; rr(c,x-8,y,w+16,h,12); c.fill();
  c.fillStyle='#7d7550'; rr(c,x-3,y+5,w+6,h-10,10); c.fill();
  c.fillStyle='#08222c'; rr(c,x+7,y+14,w-14,h-28,8); c.fill();
  c.save(); c.globalCompositeOperation='lighter';
  pool(c,gx,y+68,130,'rgba(80,220,200,0.24)');
  c.restore();
  c.fillStyle='#9a9164';
  [[x-5,y+h*0.5],[x+w+5,y+h*0.5]].forEach(([sx,sy])=>{ c.beginPath(); c.arc(sx,sy,10,0,6.3); c.fill(); });
  skull(c,gx,y+42,21,'#6fe3c8','#08222c',true);
  c.fillStyle='#8df0d6'; c.font='800 42px "Work Sans",system-ui,sans-serif'; c.letterSpacing='2px';
  c.fillText('HUB',gx,y+104); c.letterSpacing='0px';
  c.fillStyle='#d6efe8'; c.font='600 22px "Work Sans",system-ui,sans-serif';
  c.fillText('game studio',gx,y+128);
  o_barnacles(c,x-4,y+h-16,w+8,22,7);
}
function o_banner(c,cx){                  // gerafeld zeildoek
  const top=CORN_Y-8,w=56,h=124;
  c.fillStyle='#3b4a44'; c.fillRect(cx-w*0.6,top-9,w*1.2,9);
  const g2=c.createLinearGradient(cx-w/2,0,cx+w/2,0);
  g2.addColorStop(0,'#1a4b52'); g2.addColorStop(0.4,'#2e7d7a'); g2.addColorStop(1,'#184a51');
  c.fillStyle=g2;
  c.beginPath();
  c.moveTo(cx-w/2,top); c.lineTo(cx+w/2,top); c.lineTo(cx+w/2,top+h-16);
  c.lineTo(cx+w*0.22,top+h); c.lineTo(cx,top+h-14); c.lineTo(cx-w*0.24,top+h-2);
  c.lineTo(cx-w/2,top+h-20); c.closePath(); c.fill();
  c.strokeStyle='rgba(190,240,232,0.2)'; c.lineWidth=2; c.stroke();
  skull(c,cx,top+40,13,'#9ae8d6','#184a51',true);
  o_barnacles(c,cx-w/2,top+h-34,w,7,(cx|0));
}
function o_niche(c,nx){
  const top=308, bot=524, hw=48;
  c.fillStyle='#061a24';
  c.beginPath();
  c.moveTo(nx-hw,bot); c.lineTo(nx-hw,top+34);
  c.quadraticCurveTo(nx-hw,top,nx,top); c.quadraticCurveTo(nx+hw,top,nx+hw,top+34);
  c.lineTo(nx+hw,bot); c.closePath(); c.fill();
  c.strokeStyle='#2e4a4e'; c.lineWidth=10; c.stroke();
  c.save(); c.globalCompositeOperation='lighter';
  pool(c,nx,bot-56,110,'rgba(70,210,190,0.3)');
  c.restore();
  // amfora met gloeiende inhoud
  c.fillStyle='#5c4a34';
  c.beginPath(); c.ellipse(nx,bot-42,24,32,0,0,6.3); c.fill();
  c.fillRect(nx-8,bot-84,16,22);
  c.fillStyle='#6d5a41'; c.beginPath(); c.ellipse(nx,bot-84,13,5,0,0,6.3); c.fill();
  c.strokeStyle='#4a3c2a'; c.lineWidth=3;
  c.beginPath(); c.moveTo(nx-8,bot-78); c.quadraticCurveTo(nx-22,bot-70,nx-16,bot-58); c.stroke();
  c.beginPath(); c.moveTo(nx+8,bot-78); c.quadraticCurveTo(nx+22,bot-70,nx+16,bot-58); c.stroke();
  c.fillStyle='rgba(140,245,214,0.8)';
  c.beginPath(); c.ellipse(nx,bot-86,10,3.4,0,0,6.3); c.fill();
  o_coral(c,nx-30,bot-6,0.8,'#2e6b6a','#b8556b');
  o_coral(c,nx+30,bot-4,0.7,'#2a5f74','#c96a52');
}
function o_wall(q){
  q.fillStyle=vgrad(q,CORN_Y,FLOOR_Y+8,[[0,'#04151f'],[0.42,'#08293a'],[0.82,'#0c3a4c'],[1,'#12475a']]);
  q.fillRect(0,CORN_Y,PW,FLOOR_Y-CORN_Y+8);
  // blokken van de gezonken muur
  q.strokeStyle='rgba(0,0,0,0.34)'; q.lineWidth=2.4;
  for(let y=CORN_Y+30;y<FLOOR_Y;y+=36) seam(q,y,'rgba(0,0,0,0.34)',2.4);
  q.strokeStyle='rgba(150,220,230,0.06)';
  for(let y=CORN_Y+32;y<FLOOR_Y;y+=36) seam(q,y,'rgba(150,220,230,0.07)',1.6);
  q.strokeStyle='rgba(0,0,0,0.26)'; q.lineWidth=2;
  for(let x=46;x<PW;x+=92){ q.beginPath(); q.moveTo(x,CORN_Y); q.lineTo(x,FLOOR_Y); q.stroke(); }
  srnd(8123);
  let row=0;
  for(let y=CORN_Y+30;y<FLOOR_Y-4;y+=36,row++){
    const off=(row%2)?46:0;
    for(let x=off;x<PW;x+=92){
      const v=rnd();
      q.fillStyle=v<0.3?'rgba(160,230,220,0.05)':(v>0.7?'rgba(0,0,0,0.16)':'rgba(0,0,0,0)');
      q.fillRect(x+2,y+2,88,32);
      if(v>0.86){ q.fillStyle='rgba(46,107,106,0.5)'; q.fillRect(x+2,y+2,88,6); }
    }
  }
  // begroeiing over de hele wand
  srnd(4242);
  for(let i=0;i<90;i++){
    const cx=rnd()*PW, cy=CORN_Y+30+rnd()*(FLOOR_Y-CORN_Y-60);
    const r=rnd();
    if(r<0.4) o_coral(q,cx,cy,0.55+rnd()*0.5,'#245c5e','#a34a60');
    else if(r<0.7) o_fan(q,cx,cy,0.5+rnd()*0.5,'rgba(176,96,112,0.55)');
    else o_barnacles(q,cx-20,cy,40,8,(cx*5)|0);
  }
  // wier dat langs de wand omhoog groeit
  q.strokeStyle='rgba(34,92,70,0.75)'; q.lineWidth=5; q.lineCap='round';
  for(let i=0;i<46;i++){
    const kx=((i*89)%PW);
    q.beginPath(); q.moveTo(kx,FLOOR_Y);
    q.quadraticCurveTo(kx+((i%2)?26:-26),FLOOR_Y-70,kx+((i%2)?-14:14),FLOOR_Y-150); q.stroke();
  }
  OPEN.forEach((nx,i)=>o_porthole(q,nx,i));
  NICHE.forEach(nx=>o_niche(q,nx));
  // poort
  q.fillStyle=vgrad(q,CORN_Y,FLOOR_Y,[[0,'#0a3040'],[0.45,'#072634'],[1,'#051d29']]);
  q.fillRect(GATE_PX-150,CORN_Y,300,FLOOR_Y-CORN_Y+8);
  o_abyss(q,GATE_PX);
  q.save(); archPath(q,GATE_PX); q.lineWidth=16; q.strokeStyle='#5d6a56'; q.stroke();
  q.lineWidth=7; q.strokeStyle='#22333a'; q.stroke(); q.restore();
  // walvisribben als boogversiering
  q.strokeStyle='#8a8a6a'; q.lineWidth=9; q.lineCap='round';
  for(let i=0;i<6;i++){
    const t=i/5, ax=GATE_PX-AR.half-26+t*10, side=(i%2)?1:-1;
    q.beginPath();
    q.moveTo(GATE_PX-AR.half-22,AR.spring-10+i*30);
    q.quadraticCurveTo(GATE_PX-AR.half-56,AR.spring+i*30,GATE_PX-AR.half-44,AR.spring+34+i*30); q.stroke();
    q.beginPath();
    q.moveTo(GATE_PX+AR.half+22,AR.spring-10+i*30);
    q.quadraticCurveTo(GATE_PX+AR.half+56,AR.spring+i*30,GATE_PX+AR.half+44,AR.spring+34+i*30); q.stroke();
  }
  o_sign(q,GATE_PX);
  BANNER.forEach(bx=>o_banner(q,bx));
  SCONCE.forEach((sx,i)=>o_anemoneSconce(q,sx-16,424));
  CEIL.forEach(px=>o_globe(q,px,206));
  q.save(); q.globalCompositeOperation='lighter';
  SCONCE.forEach(sx=>pool(q,sx+6,410,170,'rgba(70,215,190,0.3)'));
  CEIL.forEach(px=>pool(q,px,204,120,'rgba(90,220,210,0.22)'));
  q.restore();
  // zandrichel waar de wand de bodem raakt
  q.fillStyle='#1d4a52'; q.fillRect(0,FLOOR_Y-22,PW,22);
  q.fillStyle='#2b6068'; q.fillRect(0,FLOOR_Y-26,PW,6);
  q.fillStyle='rgba(0,0,0,0.35)'; q.fillRect(0,FLOOR_Y-3,PW,7);
  q.fillStyle='rgba(216,234,226,0.14)';
  for(let x=0;x<PW;x+=44) q.fillRect(x+3,FLOOR_Y-19,38,4);
}
function o_roof(c){
  c.save(); roofClip(c);
  if(!_rg) _rg=vgrad(c,-130,CORN_Y+20,[[0,'#2a7f96'],[0.35,'#12566e'],[0.72,'#083348'],[1,'#051f30']]);
  c.fillStyle=_rg; c.fillRect(0,-130,W,CORN_Y+150);
  // caustiek: het licht van het wateroppervlak, ver boven je
  c.save(); c.globalCompositeOperation='lighter';
  for(let i=0;i<5;i++){
    const ph=T*0.5+i*1.1, yy=-108+i*32;
    c.strokeStyle='rgba(180,240,255,'+(0.05+0.035*Math.sin(T*1.4+i)).toFixed(3)+')';
    c.lineWidth=5+3*Math.sin(T+i);
    c.beginPath();
    for(let x=0;x<=W;x+=40){
      const y=yy+Math.sin(x*0.011+ph)*9+Math.sin(x*0.027+ph*1.7)*5;
      x?c.lineTo(x,y):c.moveTo(x,y);
    }
    c.stroke();
  }
  c.restore();
  // lichtschachten die naar beneden waaieren
  c.save(); c.globalCompositeOperation='lighter';
  [0.2,0.5,0.8].forEach((f,i)=>{
    const bx=W*f+Math.sin(T*0.28+i)*26;
    const g2=c.createLinearGradient(0,-120,0,CORN_Y+30);
    g2.addColorStop(0,'rgba(170,232,248,0.20)'); g2.addColorStop(1,'rgba(120,200,230,0)');
    c.fillStyle=g2;
    c.beginPath(); c.moveTo(bx-14,-130); c.lineTo(bx+14,-130);
    c.lineTo(bx+72,CORN_Y+30); c.lineTo(bx-70,CORN_Y+30); c.closePath(); c.fill();
  });
  c.restore();
  // school vissen in silhouet
  c.fillStyle='rgba(6,32,44,0.55)';
  for(let i=0;i<22;i++){
    const fx=((i*97+T*22)%(W+160))-80, fy=-96+((i*31)%70)+Math.sin(T*1.6+i)*5;
    c.beginPath(); c.ellipse(fx,fy,7,2.8,0.16,0,6.3); c.fill();
    c.beginPath(); c.moveTo(fx-7,fy); c.lineTo(fx-12,fy-3); c.lineTo(fx-12,fy+3); c.closePath(); c.fill();
  }
  // en er trekt een walvis over
  const wx=((T*16)%(W+900))-450;
  c.fillStyle='rgba(5,28,40,0.5)';
  c.beginPath();
  c.moveTo(wx-150,-60); c.quadraticCurveTo(wx-20,-104,wx+96,-66);
  c.quadraticCurveTo(wx+140,-58,wx+176,-92);
  c.lineTo(wx+180,-46);
  c.quadraticCurveTo(wx+132,-48,wx+92,-34);
  c.quadraticCurveTo(wx-20,-2,wx-150,-46);
  c.closePath(); c.fill();
  // kwallen die vlak onder het plafond hangen
  HANG.forEach((px,j)=>{
    const x=P(px); if(!vis(x,140)) return;
    const y=CORN_Y+bow(x)-52+Math.sin(T*0.9+j)*7;
    const gl=c.createRadialGradient(x,y,4,x,y,70);
    gl.addColorStop(0,'rgba(170,250,236,0.34)'); gl.addColorStop(0.4,'rgba(90,210,210,0.16)');
    gl.addColorStop(1,'rgba(60,180,200,0)');
    c.fillStyle=gl; c.beginPath(); c.arc(x,y,70,0,6.3); c.fill();
    for(let k=-1;k<=1;k++){
      const jx=x+k*34, jy=y+((k===0)?0:10)+Math.sin(T*1.3+j+k)*5;
      c.fillStyle='rgba(180,250,238,0.5)';
      c.beginPath(); c.ellipse(jx,jy,17-Math.abs(k)*4,13-Math.abs(k)*3,0,Math.PI,0); c.fill();
      c.fillStyle='rgba(224,150,200,0.35)';
      c.beginPath(); c.ellipse(jx,jy-3,9,6,0,Math.PI,0); c.fill();
      c.strokeStyle='rgba(190,250,240,0.45)'; c.lineWidth=1.6; c.lineCap='round';
      for(let i=-1;i<=1;i++){
        c.beginPath(); c.moveTo(jx+i*5,jy);
        c.quadraticCurveTo(jx+i*8+Math.sin(T*2+i)*4,jy+18,jx+i*6,jy+34); c.stroke();
      }
    }
  });
  c.restore();
  cornice(c,-30,8,'#5e8c8a');
  cornice(c,-23,26,'#23555c');
  cornice(c,3,8,'rgba(0,0,0,0.42)');
  c.fillStyle='#1c4a52';
  for(let i=0;i<60;i++){
    const x=P(i*(PW/60));
    if(vis(x,20)) c.fillRect(x-6,CORN_Y+bow(x)+11,12,8);
  }
}
function o_floor(c){
  c.save(); floorClip(c);
  if(!_fg) _fg=vgrad(c,FLOOR_Y,HH,[[0,'#3e5a5c'],[0.3,'#2a4348'],[1,'#0d1c22']]);
  c.fillStyle=_fg; c.fillRect(0,FLOOR_Y-24,W,HH-FLOOR_Y+24);
  // zandribbels
  c.strokeStyle='rgba(224,238,228,0.07)'; c.lineWidth=5;
  for(let k=0;k<11;k++){
    const o=18+k*26;
    c.beginPath();
    for(let x=0;x<=W;x+=18){
      const y=FLOOR_Y+bow(x)+o+Math.sin(x*0.02+k)*4;
      x?c.lineTo(x,y):c.moveTo(x,y);
    }
    c.stroke();
  }
  c.fillStyle='rgba(0,0,0,0.12)';
  srnd(661);
  for(let i=0;i<140;i++) c.fillRect(rnd()*W,FLOOR_Y+10+rnd()*270,2.4,2);
  // lichtgevende sporen naar de schermen
  c.save(); runnersClip(c);
  wedge(c,GATE_PX,96,'rgba(24,96,104,0.55)','rgba(120,240,220,0.6)');
  SCREENS.forEach(S=>wedge(c,S.px,60,'rgba(22,84,96,0.5)','rgba(110,230,215,0.5)'));
  c.restore();
  // de ring: een pad van lichtgevend koraal
  ringBand(c,104,176,'rgba(16,62,72,0.6)');
  c.save(); c.globalCompositeOperation='lighter';
  ringLine(c,108,'rgba(110,240,214,0.5)',4);
  ringLine(c,172,'rgba(110,240,214,0.5)',4);
  const pulse=0.5+0.5*Math.sin(T*1.2);
  ringLine(c,140,'rgba(90,220,230,'+(0.07+0.05*pulse)+')',26);
  c.restore();
  // stippen van plankton langs de rand van het pad
  c.save(); c.globalCompositeOperation='lighter';
  for(let k=0;k<44;k++){
    const x=P(k*(PW/44)+22); if(!vis(x,20)) continue;
    const a=0.3+0.3*Math.sin(T*1.7+k);
    c.fillStyle='rgba(150,250,226,'+a.toFixed(3)+')';
    c.beginPath(); c.arc(x,FLOOR_Y+bow(x)+108,2.6,0,6.3); c.fill();
    c.beginPath(); c.arc(x+9,FLOOR_Y+bow(x)+172,2.2,0,6.3); c.fill();
  }
  c.restore();
  floorSheen(c,'rgba(180,240,240,0.1)','rgba(0,0,0,0.45)');
  if(!_sg) _sg=vgrad(c,FLOOR_Y,FLOOR_Y+180,[[0,'rgba(150,230,235,0.12)'],[1,'rgba(120,200,220,0)']]);
  c.fillStyle=_sg; c.fillRect(0,FLOOR_Y-10,W,200);
  c.restore();
  floorEdge(c,'rgba(0,0,0,0.4)');
  const mx=P(GATE_PX);
  if(vis(mx,320)){                         // kompasroos in de bodem
    const dy=bow(mx);
    c.save(); c.translate(mx,716+dy); c.scale(1,0.3);
    c.strokeStyle='rgba(140,240,220,0.45)'; c.lineWidth=9;
    [250,196].forEach(r=>{ c.beginPath(); c.arc(0,0,r,0,6.3); c.stroke(); });
    c.strokeStyle='rgba(170,250,232,0.32)'; c.lineWidth=6;
    for(let i=0;i<8;i++){
      const a=i*0.7854;
      c.beginPath(); c.moveTo(Math.cos(a)*70,Math.sin(a)*70);
      c.lineTo(Math.cos(a)*240,Math.sin(a)*240); c.stroke();
    }
    c.restore();
    c.save(); c.globalAlpha=0.7; c.translate(mx,718+dy); c.scale(1,0.3);
    skull(c,0,-16,80,'#7fe6cd','#0b2c33',true);
    c.restore();
  }
}
function o_chest(c,x,y,s){
  c.fillStyle='#4a3a26'; c.fillRect(x-26*s,y-26*s,52*s,26*s);
  c.fillStyle='#5c4830';
  c.beginPath(); c.ellipse(x,y-26*s,26*s,15*s,0,Math.PI,0); c.fill();
  c.fillStyle='#8a7a4a'; c.fillRect(x-28*s,y-16*s,56*s,5*s);
  c.fillRect(x-4*s,y-40*s,8*s,26*s);
  c.fillStyle='rgba(120,240,214,0.35)'; c.fillRect(x-24*s,y-25*s,48*s,3*s);
  o_barnacles(c,x-26*s,y-12*s,52*s,7,(x|0));
}
function o_amphora(c,x,y,s){
  c.fillStyle='#5c4a34';
  c.beginPath(); c.ellipse(x,y-24*s,17*s,24*s,0,0,6.3); c.fill();
  c.fillRect(x-6*s,y-56*s,12*s,18*s);
  c.fillStyle='#6d5a41'; c.beginPath(); c.ellipse(x,y-56*s,10*s,4*s,0,0,6.3); c.fill();
  c.strokeStyle='#4a3c2a'; c.lineWidth=2.6*s;
  c.beginPath(); c.moveTo(x-6*s,y-52*s); c.quadraticCurveTo(x-18*s,y-46*s,x-13*s,y-36*s); c.stroke();
  c.beginPath(); c.moveTo(x+6*s,y-52*s); c.quadraticCurveTo(x+18*s,y-46*s,x+13*s,y-36*s); c.stroke();
  o_barnacles(c,x-16*s,y-20*s,32*s,5,(x*3)|0);
}
function o_props(c){
  SCREENS.forEach(S=>{ const x=P(S.px); if(vis(x,240)){
    reflectStrip(c,x,SCR_W*0.85,'rgba(120,230,220,0.18)',170); benchLight(c,x,700+bow(x),150); } });
  const gx=P(GATE_PX); if(vis(gx,260)) reflectStrip(c,gx,210,'rgba(130,240,226,0.24)',210);
  SCONCE.forEach(px=>{ const x=P(px); if(vis(x,80)) reflectStrip(c,x,58,'rgba(100,230,210,0.22)',175); });
  FLOOR_LAMPS.forEach(([px,y],i)=>{         // klompjes lichtgevend koraal
    const x=P(px); if(!vis(x,40)) return;
    const a=0.45+0.35*Math.sin(T*1.5+i);
    c.fillStyle='rgba(120,240,214,'+a.toFixed(3)+')';
    c.beginPath(); c.arc(x,y+bow(x)-6,4,0,6.3); c.fill();
    c.fillStyle='#2a5f5a';
    c.beginPath(); c.moveTo(x-5,y+bow(x)); c.lineTo(x+5,y+bow(x)); c.lineTo(x+2,y+bow(x)-8);
    c.lineTo(x-2,y+bow(x)-8); c.closePath(); c.fill();
  });
  let x=P(640);
  if(vis(x,280)){                            // een reuzenschelp met kweekbedden
    c.save(); c.translate(0,bow(x));
    c.fillStyle='#4c6b6a';
    c.beginPath(); c.ellipse(x,806,76,26,0,Math.PI,0); c.fill();
    c.fillStyle='#6d8f88';
    c.beginPath(); c.ellipse(x,802,68,20,0,Math.PI,0); c.fill();
    c.strokeStyle='#3c5556'; c.lineWidth=3;
    for(let i=-3;i<=3;i++){ c.beginPath(); c.moveTo(x+i*18,802); c.lineTo(x+i*22,784); c.stroke(); }
    c.fillStyle='rgba(180,250,236,0.55)';
    c.beginPath(); c.arc(x,794,9,0,6.3); c.fill();
    o_coral(c,x-100,816,1.1,'#2a6b6c','#b8556b');
    o_fan(c,x+108,812,1,'rgba(198,110,126,0.8)');
    c.restore();
  }
  x=P(1660);
  if(vis(x,220)){                            // rotsblokken om overheen te zwemmen
    c.save(); c.translate(0,bow(x));
    [[-60,828,74,26],[6,800,74,30],[74,830,74,24]].forEach(([d,y2,w,h])=>{
      c.fillStyle=vgrad(c,y2-h,y2,[[0,'#4a6b6c'],[1,'#20383e']]);
      rr(c,x+d-w/2,y2-h,w,h,9); c.fill();
      c.strokeStyle='rgba(0,0,0,0.3)'; c.lineWidth=2; c.stroke();
      c.fillStyle='rgba(46,107,106,0.6)'; c.fillRect(x+d-w/2+4,y2-h+2,w-8,4);
    });
    c.fillStyle='rgba(150,250,226,0.8)';
    [[-36,774],[44,764]].forEach(([d,y2])=>{ c.beginPath(); c.ellipse(x+d,y2,10,12,0,0,6.3); c.fill(); });
    c.restore();
  }
  x=P(2380);
  if(vis(x,240)){                            // een anker half in het zand
    c.save(); c.translate(0,bow(x));
    c.strokeStyle='#5a6a5c'; c.lineWidth=9; c.lineCap='round';
    c.beginPath(); c.moveTo(x-40,748); c.lineTo(x-16,830); c.stroke();
    c.lineWidth=7;
    c.beginPath(); c.moveTo(x-58,776); c.lineTo(x-16,766); c.stroke();
    c.beginPath(); c.moveTo(x-46,822); c.quadraticCurveTo(x-4,846,x+24,806); c.stroke();
    c.lineWidth=5; c.strokeStyle='#5a6a5c';
    c.beginPath(); c.arc(x-42,744,9,0,6.3); c.stroke();
    o_barnacles(c,x-56,806,70,12,3);
    o_amphora(c,x+72,828,1); o_amphora(c,x+112,834,0.8);
    c.restore();
  }
  x=P(3320);
  if(vis(x,260)){
    c.save(); c.translate(0,bow(x));
    o_chest(c,x-70,828,1.1); o_chest(c,x-6,834,0.9);
    o_amphora(c,x+52,830,1);
    crateProp(c,x+124,826,0.85);
    rock(c,x+206,760,1.2); o_coral(c,x+210,752,1.2,'#2a6b6c','#c96a52');
    c.restore();
  }
  [[120,812,1],[2140,860,0.8],[3000,872,0.9],[980,846,0.7],[2860,856,0.6]].forEach(([px,y,s])=>{
    const xx=P(px); if(!vis(xx,90)) return;
    rock(c,xx,y+bow(xx),s);
    o_coral(c,xx,y+bow(xx)-8,s*0.8,'#2a6b6c','#b8556b');
  });
}
const BUBBLES_A=[];
for(let i=0;i<44;i++) BUBBLES_A.push({px:rnd()*PW, y:600+rnd()*300, sp:16+rnd()*26, ph:rnd()*6.3, r:1.4+rnd()*3.4});
const SNOW=[];
for(let i=0;i<46;i++) SNOW.push({px:rnd()*PW, y:rnd()*820, sp:5+rnd()*9, ph:rnd()*6.3, s:1+rnd()*1.7});
const SCHOOL=[{px:1500,y:520,n:14,sp:0.5,ph:0},{px:2900,y:480,n:11,sp:-0.42,ph:2.1}];
function o_ambient(c){
  // opstijgende bellen
  BUBBLES_A.forEach(b=>{
    const x=P(b.px)+Math.sin(T*1.6+b.ph)*7;
    if(!vis(x,40)) return;
    const y=b.y-((T*b.sp)%460);
    const a=Math.max(0,1-((b.y-y)/460))*0.55;
    c.strokeStyle='rgba(206,244,255,'+a.toFixed(3)+')'; c.lineWidth=1.3;
    c.beginPath(); c.arc(x,y+bow(x),b.r,0,6.3); c.stroke();
    c.fillStyle='rgba(235,250,255,'+(a*0.5).toFixed(3)+')';
    c.beginPath(); c.arc(x-b.r*0.3,y+bow(x)-b.r*0.3,b.r*0.35,0,6.3); c.fill();
  });
  // marine snow
  c.fillStyle='rgba(215,238,236,0.26)';
  SNOW.forEach(s2=>{
    const x=P(s2.px)+Math.sin(T*0.5+s2.ph)*14;
    if(!vis(x,30)) return;
    const y=((s2.y+T*s2.sp)%900)-40;
    c.fillRect(x,y+bow(x),s2.s,s2.s);
  });
  // scholen vis die door de zaal trekken
  SCHOOL.forEach((sc2,j)=>{
    const bx=P(sc2.px+Math.sin(T*sc2.sp)*260);
    if(!vis(bx,180)) return;
    for(let i=0;i<sc2.n;i++){
      const a=T*1.4+i*0.7+sc2.ph;
      const fx=bx+((i%5)-2)*22+Math.sin(a)*6;
      const fy=sc2.y+bow(bx)+Math.floor(i/5)*16+Math.cos(a)*4;
      const dir=Math.cos(T*sc2.sp)>0?1:-1;
      c.fillStyle='rgba(168,216,224,0.75)';
      c.beginPath(); c.ellipse(fx,fy,7,3,0,0,6.3); c.fill();
      c.beginPath(); c.moveTo(fx-7*dir,fy); c.lineTo(fx-13*dir,fy-4); c.lineTo(fx-13*dir,fy+4); c.closePath(); c.fill();
      c.fillStyle='rgba(60,110,124,0.8)';
      c.beginPath(); c.arc(fx+3*dir,fy-1,1.2,0,6.3); c.fill();
    }
  });
  // een rog die laag over de bodem glijdt
  const rx=((T*34)%(PW+800))-400, x=P(rx);
  if(vis(x,220)){
    const y=690+bow(x)+Math.sin(T*0.8)*10, fl=Math.sin(T*2.2);
    c.fillStyle='rgba(28,58,66,0.7)';
    c.beginPath();
    c.moveTo(x,y-14);
    c.quadraticCurveTo(x+64,y-6+fl*12,x+96,y+10);
    c.quadraticCurveTo(x+46,y+14,x,y+16);
    c.quadraticCurveTo(x-46,y+14,x-96,y+10);
    c.quadraticCurveTo(x-64,y-6-fl*12,x,y-14);
    c.closePath(); c.fill();
    c.strokeStyle='rgba(28,58,66,0.7)'; c.lineWidth=3; c.lineCap='round';
    c.beginPath(); c.moveTo(x,y+15); c.quadraticCurveTo(x+6,y+42,x-4,y+66); c.stroke();
    c.fillStyle='rgba(180,224,230,0.5)';
    c.beginPath(); c.arc(x-9,y-6,2.4,0,6.3); c.fill();
    c.beginPath(); c.arc(x+9,y-6,2.4,0,6.3); c.fill();
  }
}
function o_fire(c){                        // geen vuur maar bioluminescentie
  c.save(); c.globalCompositeOperation='lighter';
  SCONCE.forEach((px,i)=>{
    const x=P(px); if(!vis(x,120)) return;
    pool(c,x+6,410+bow(x),90+10*Math.sin(T*1.3+i),'rgba(80,230,206,'+(0.16+0.07*Math.sin(T*1.3+i))+')');
  });
  CEIL.forEach((px,k)=>{
    const x=P(px); if(!vis(x,90)) return;
    pool(c,x,204+bow(x),70,'rgba(110,235,224,'+(0.13+0.06*Math.sin(T*1.1+k))+')');
  });
  OPEN.forEach((px,i)=>{
    const x=P(px); if(!vis(x,160)) return;
    pool(c,x,396+bow(x),150,'rgba(96,200,224,'+(0.09+0.04*Math.sin(T*0.8+i))+')');
  });
  const gx=P(GATE_PX);
  if(vis(gx,300)) pool(c,gx,FLOOR_Y+bow(gx)-30,240,'rgba(120,230,220,'+(0.11+0.04*Math.sin(T*0.9))+')');
  c.restore();
}
