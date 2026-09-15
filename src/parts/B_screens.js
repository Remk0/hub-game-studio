/* =====================================================================
   SCREENS — drawn each frame, tilted by where they sit in the view
===================================================================== */
const ROWS=[['1.','Veld','1450'],['2.','Bram','1200'],['3.','Maas','950'],['4.','Tuk','700'],['5.','Jij','0']];
const EMPTY=[['1.','—','—'],['2.','—','—'],['3.','—','—'],['4.','—','—'],['5.','Jij','0']];
function boardList(c,x,y,w,h,rows){
  c.fillStyle='rgba(5,7,14,0.9)'; c.fillRect(x,y,w,h);
  (rows||ROWS).forEach((r,i)=>{
    const ry=y+30+i*26, you=i===4;
    if(you){
      c.strokeStyle='rgba(170,190,240,0.25)'; c.lineWidth=1.2;
      c.beginPath(); c.moveTo(x+9,ry-18); c.lineTo(x+w-9,ry-18); c.stroke();
    }
    c.fillStyle=you?'#f5a83c':'#eef2ff';
    c.font=(you?'700 ':'600 ')+'13px "Work Sans",system-ui,sans-serif';
    c.textAlign='left'; c.fillText(r[0],x+8,ry); c.fillText(r[1],x+24,ry);
    c.textAlign='right'; c.fillText(r[2],x+w-8,ry);
  });
}
function pixText(c,t,x,y,col,size){
  c.fillStyle=col; c.font='700 '+size+'px ui-monospace,Menlo,Consolas,monospace';
  c.letterSpacing='1.2px'; c.fillText(t,x,y); c.letterSpacing='0px';
}
function climbPreview(c,x,y,w,h,t){
  c.fillStyle='#120b05'; c.fillRect(x,y,w,h);
  // the shaft: two rough walls with a lit face between them
  c.fillStyle='#2b1d0d'; c.fillRect(x,y,w*0.14,h); c.fillRect(x+w*0.86,y,w*0.14,h);
  const face=c.createLinearGradient(x,0,x+w,0);
  face.addColorStop(0,'rgba(139,101,53,0.24)'); face.addColorStop(0.5,'rgba(139,101,53,0.1)');
  face.addColorStop(1,'rgba(139,101,53,0.24)');
  c.fillStyle=face; c.fillRect(x+w*0.14,y,w*0.72,h);
  c.fillStyle='rgba(0,0,0,0.22)';
  for(let i=0;i<7;i++) c.fillRect(x+w*0.14,y+((t*26+i*30)%h),w*0.72,2);
  const cols=[x+w*0.29,x+w*0.5,x+w*0.71];
  const step=40, scroll=(t*34)%step;
  // handholds scrolling down as you climb
  for(let i=-1;i<Math.ceil(h/step)+1;i++){
    const gy=y+h-14-i*step+scroll;
    if(gy<y-8||gy>y+h+8) continue;
    const gx=cols[((i%3)+3)%3], bonus=(((i*7)%5)===0);
    c.fillStyle=bonus?'#e8b04a':'#8b6535';
    rr(c,gx-15,gy-5,30,9,3); c.fill();
    c.fillStyle='rgba(255,236,190,0.28)'; c.fillRect(gx-13,gy-4,26,2);
  }
  // rivals a little further down
  [['#4f8fd8',0.72,0.9],['#3fae94',0.86,0.4]].forEach(([col,fy,ph])=>{
    const rx=cols[(Math.floor(t*1.4+ph)%3)];
    c.fillStyle=col;
    c.beginPath(); c.arc(rx,y+h*fy,5,0,6.3); c.fill();
  });
  // you
  const beat=Math.floor(t*1.7), frac=(t*1.7)%1;
  const cx0=cols[((beat%3)+3)%3], cx1=cols[(((beat+1)%3)+3)%3];
  const px0=lerp(cx0,cx1,Math.min(1,frac*2.4));
  const py0=y+h*0.44-Math.sin(Math.min(1,frac*2.4)*Math.PI)*9;
  c.strokeStyle='#e8b04a'; c.lineCap='round'; c.lineWidth=4;
  c.beginPath(); c.moveTo(px0,py0+2); c.lineTo(px0-7,py0+14); c.moveTo(px0,py0+2); c.lineTo(px0+7,py0+14); c.stroke();
  c.beginPath(); c.moveTo(px0,py0+2); c.lineTo(px0-9,py0-8); c.moveTo(px0,py0+2); c.lineTo(px0+9,py0-8); c.stroke();
  c.fillStyle='#e8b04a'; c.beginPath(); c.arc(px0,py0-12,6.5,0,6.3); c.fill();
  // lava creeping up from below
  const lv=c.createLinearGradient(0,y+h-52,0,y+h);
  lv.addColorStop(0,'rgba(255,110,30,0)'); lv.addColorStop(1,'rgba(255,120,36,0.75)');
  c.fillStyle=lv; c.fillRect(x,y+h-52,w,52);
  c.fillStyle='rgba(255,196,110,'+(0.4+0.25*Math.sin(t*3))+')';
  c.fillRect(x,y+h-10-Math.sin(t*2)*3,w,10);
  c.textAlign='left';
  pixText(c,'12 m',x+7,y+14,'#e8cfa0',9);
  c.textAlign='left';
}
function nestPreview(c,x,y,w,h,t){
  c.fillStyle='#101a34'; c.fillRect(x,y,w,h*0.34);
  c.fillStyle='#f2f5ff'; c.beginPath(); c.arc(x+w*0.78,y+h*0.13,10,0,6.3); c.fill();
  c.fillStyle='rgba(120,140,190,0.5)';
  [[0.6,0.2,20,5],[0.86,0.25,16,4]].forEach(([fx,fy,rx,ry])=>{
    c.beginPath(); c.ellipse(x+w*fx,y+h*fy,rx,ry,0,0,6.3); c.fill();
  });
  const gy=y+h*0.34;
  c.fillStyle='#4a8a30'; c.fillRect(x,gy,w,y+h-gy);
  c.fillStyle='rgba(0,0,0,0.1)';
  for(let i=0;i<7;i++) c.fillRect(x,gy+9+i*16,w,6);
  c.fillStyle='#6b4a22';
  c.fillRect(x,gy+20,w,4); c.fillRect(x,gy+31,w,4);
  for(let fx=x+8;fx<x+w;fx+=28) c.fillRect(fx,gy+14,4,24);
  const tx=x+w*0.38;
  c.fillStyle='#7a5527'; c.fillRect(tx-8,gy+3,16,h*0.5);
  c.fillStyle='#96692f'; c.fillRect(tx-8,gy+3,5,h*0.5);
  const flap=Math.sin(t*3.4)*6;
  c.fillStyle='#c62b2b';
  c.beginPath();
  c.moveTo(tx-30,gy-23-flap);
  c.quadraticCurveTo(tx-22,gy-5,tx-10,gy+1);
  c.lineTo(tx+10,gy+1);
  c.quadraticCurveTo(tx+22,gy-5,tx+30,gy-23-flap);
  c.quadraticCurveTo(tx+19,gy-17,tx+12,gy-9);
  c.quadraticCurveTo(tx+6,gy-15,tx,gy-9);
  c.quadraticCurveTo(tx-6,gy-15,tx-12,gy-9);
  c.quadraticCurveTo(tx-19,gy-17,tx-30,gy-23-flap);
  c.fill();
  c.fillStyle='#a41f22';
  c.beginPath(); c.ellipse(tx,gy-14,9,11,0,0,6.3); c.fill();
  c.beginPath(); c.moveTo(tx-7,gy-23); c.lineTo(tx-4,gy-32); c.lineTo(tx-1.5,gy-23); c.closePath(); c.fill();
  c.beginPath(); c.moveTo(tx+7,gy-23); c.lineTo(tx+4,gy-32); c.lineTo(tx+1.5,gy-23); c.closePath(); c.fill();
  c.fillStyle='#1a0c0c';
  c.beginPath(); c.arc(tx-3.4,gy-17,2,0,6.3); c.fill();
  c.beginPath(); c.arc(tx+3.4,gy-17,2,0,6.3); c.fill();
  [[0.12,0.62],[0.32,0.78],[0.54,0.66],[0.7,0.86],[0.86,0.7],[0.24,0.94]].forEach(([fx,fy],i)=>{
    const wx=x+w*fx+Math.sin(t*1.2+i)*5, wy=y+h*fy;
    c.fillStyle='#0c0f18';
    c.beginPath(); c.ellipse(wx,wy,10,6,0,0,6.3); c.fill();
    c.beginPath(); c.arc(wx+8,wy-5,5,0,6.3); c.fill();
    c.beginPath(); c.moveTo(wx+5,wy-8); c.lineTo(wx+7,wy-14); c.lineTo(wx+10,wy-8); c.closePath(); c.fill();
    c.fillRect(wx-8,wy+4,3,5); c.fillRect(wx+3,wy+4,3,5);
    c.fillStyle='#e8453c';
    c.beginPath(); c.arc(wx+10,wy-6,1.4,0,6.3); c.fill();
  });
}
function dekPreview(c,x,y,w,h,t){
  c.fillStyle='#0a1410'; c.fillRect(x,y,w,h);
  c.strokeStyle='rgba(190,205,225,0.28)'; c.lineWidth=1.1;
  [[x,y,1],[x+w,y,-1]].forEach(([cx0,cy0,dir])=>{
    for(let i=1;i<=4;i++){ c.beginPath(); c.moveTo(cx0+dir*i*12,cy0); c.lineTo(cx0,cy0+i*12); c.stroke(); }
    for(let i=1;i<=3;i++){
      c.beginPath(); c.moveTo(cx0+dir*i*15,cy0); c.quadraticCurveTo(cx0+dir*i*7,cy0+i*7,cx0,cy0+i*15); c.stroke();
    }
  });
  const cx=x+w*0.42, sy=y+h*0.24+Math.sin(t*1.5)*6;
  c.strokeStyle='rgba(190,205,225,0.45)'; c.lineWidth=1.2;
  c.beginPath(); c.moveTo(cx,y); c.lineTo(cx,sy-17); c.stroke();
  c.strokeStyle='#8e2630'; c.lineWidth=3.4; c.lineCap='round';
  for(let i=0;i<4;i++){
    const oy=sy-11+i*9;
    [-1,1].forEach(d=>{
      c.beginPath(); c.moveTo(cx,sy);
      c.quadraticCurveTo(cx+d*36,oy-18,cx+d*42,oy+20); c.stroke();
    });
  }
  c.fillStyle='#14181f';
  c.beginPath(); c.ellipse(cx,sy+5,20,18,0,0,6.3); c.fill();
  c.beginPath(); c.arc(cx,sy-12,13,0,6.3); c.fill();
  c.fillStyle='#e8e4dc';
  for(let i=0;i<5;i++){
    c.beginPath(); c.moveTo(cx-10+i*5,sy+3); c.lineTo(cx-8+i*5,sy+11); c.lineTo(cx-5+i*5,sy+3); c.closePath(); c.fill();
  }
  c.fillStyle='#d8453c';
  c.beginPath(); c.arc(cx-5,sy-15,2.4,0,6.3); c.fill();
  c.beginPath(); c.arc(cx+5,sy-15,2.4,0,6.3); c.fill();
  [0.58,0.72,0.86].forEach((ry,ri)=>{
    const py=y+h*ry;
    for(let i=0;i<5;i++){
      if((i+ri)%3===2) continue;
      const px=x+5+i*(w-10)/5, pw=(w-10)/5-7;
      c.fillStyle='#8fd84a'; c.fillRect(px,py,pw,6);
      c.fillStyle='#3f7a22'; c.fillRect(px,py+5,pw,4);
    }
  });
  c.strokeStyle='rgba(120,180,90,0.35)'; c.lineWidth=1.4;
  [0.22,0.58,0.86].forEach(f=>{ c.beginPath(); c.moveTo(x+w*f,y+h*0.5); c.lineTo(x+w*f,y+h); c.stroke(); });
  c.fillStyle='#ffc46a'; c.beginPath(); c.arc(x+w*0.82,y+h*0.62,3.4,0,6.3); c.fill();
}
function dartPreview(c,x,y,w,h,t){
  c.fillStyle='#0d1020'; c.fillRect(x,y,w,h);
  const g2=c.createRadialGradient(x+w/2,y+h*0.5,4,x+w/2,y+h*0.5,w*0.7);
  g2.addColorStop(0,'rgba(255,170,80,0.16)'); g2.addColorStop(1,'rgba(255,170,80,0)');
  c.fillStyle=g2; c.fillRect(x,y,w,h);
  const cx=x+w*0.52, cy=y+h*0.5, R=Math.min(w,h)*0.38;
  c.save(); c.translate(cx,cy); c.rotate(Math.sin(t*0.3)*0.05);
  for(let i=0;i<20;i++){
    c.fillStyle=i%2?'#1c2030':'#e6dfcb';
    c.beginPath(); c.moveTo(0,0); c.arc(0,0,R,i*0.3142,(i+1)*0.3142); c.closePath(); c.fill();
  }
  [[0.58,0.66],[0.9,1.0]].forEach(([a,bb])=>{
    for(let i=0;i<20;i++){
      c.fillStyle=i%2?'#1f7a3a':'#b8302a';
      c.beginPath(); c.arc(0,0,R*bb,i*0.3142,(i+1)*0.3142);
      c.arc(0,0,R*a,(i+1)*0.3142,i*0.3142,true); c.closePath(); c.fill();
    }
  });
  c.fillStyle='#1f7a3a'; c.beginPath(); c.arc(0,0,R*0.15,0,6.3); c.fill();
  c.fillStyle='#b8302a'; c.beginPath(); c.arc(0,0,R*0.07,0,6.3); c.fill();
  c.strokeStyle='rgba(0,0,0,0.5)'; c.lineWidth=1.4;
  c.beginPath(); c.arc(0,0,R,0,6.3); c.stroke();
  c.restore();
  const tt=(t*0.55)%1, ease=tt*tt;
  const dx=lerp(x+w*1.05,cx-R*0.3,ease), dy=lerp(y+h*0.1,cy-R*0.22,ease);
  const sz=lerp(0.5,1,ease);
  c.save(); c.translate(dx,dy); c.rotate(2.5);
  c.strokeStyle='#e8eefc'; c.lineWidth=2.6*sz; c.lineCap='round';
  c.beginPath(); c.moveTo(0,0); c.lineTo(20*sz,0); c.stroke();
  c.fillStyle='#f5a83c';
  c.beginPath(); c.moveTo(20*sz,0); c.lineTo(30*sz,-5*sz); c.lineTo(30*sz,5*sz); c.closePath(); c.fill();
  c.restore();
  if(tt<0.12){
    c.fillStyle='rgba(255,230,170,'+(1-tt/0.12)*0.5+')';
    c.beginPath(); c.arc(cx-R*0.3,cy-R*0.22,18*(1-tt/0.12)+6,0,6.3); c.fill();
  }
  c.textAlign='center'; pixText(c,'T20  60',cx,y+h-7,'#f5a83c',10); c.textAlign='left';
}
function soonPreview(c,x,y,w,h,t){
  c.fillStyle='#0a0d18'; c.fillRect(x,y,w,h);
  srnd(((t*7)|0)+11); c.fillStyle='rgba(180,200,255,0.06)';
  for(let i=0;i<90;i++) c.fillRect(x+rnd()*w,y+rnd()*h,2,2);
  c.textAlign='center';
  pixText(c,'BINNENKORT',x+w/2,y+h*0.44,'#f5a83c',14);
  c.fillStyle='rgba(220,230,255,0.55)';
  c.font='600 11px "Work Sans",system-ui,sans-serif';
  c.fillText('vrij slot voor het',x+w/2,y+h*0.6);
  c.fillText('volgende spel',x+w/2,y+h*0.6+14);
  if(Math.sin(t*4)>0){ c.fillStyle='#f5a83c'; c.fillRect(x+w/2+48,y+h*0.44-10,5,11); }
  c.textAlign='left';
}
/* ---- Spookhuis: donker huis, flakkerende ramen, zwevend laken ---- */
function spookPreview(c,x,y,w,h,t){
  const sky=c.createLinearGradient(0,y,0,y+h);
  sky.addColorStop(0,'#070a16'); sky.addColorStop(1,'#0d1020');
  c.fillStyle=sky; c.fillRect(x,y,w,h);
  if(Math.sin(t*0.9)>0.965){ c.fillStyle='rgba(180,205,255,0.45)'; c.fillRect(x,y,w,h); }
  c.fillStyle='rgba(150,170,220,0.35)';
  for(let i=0;i<20;i++) c.fillRect(x+((i*97)%w),y+((i*53)%(h*0.4)),1.6,1.6);
  c.fillStyle='#050710';
  c.fillRect(x+w*0.12,y+h*0.34,w*0.58,h*0.55);
  c.beginPath(); c.moveTo(x+w*0.08,y+h*0.35); c.lineTo(x+w*0.41,y+h*0.13);
  c.lineTo(x+w*0.74,y+h*0.35); c.closePath(); c.fill();
  c.fillRect(x+w*0.56,y+h*0.16,w*0.07,h*0.2);
  [[0.2,0.44],[0.38,0.44],[0.56,0.44],[0.2,0.64],[0.56,0.64]].forEach(function(f,i){
    const lit=(Math.sin(t*2.1+i*1.7)>-0.2);
    if(lit){ c.fillStyle='rgba(255,198,94,0.16)';
      c.fillRect(x+w*f[0]-5,y+h*f[1]-5,w*0.1+10,h*0.13+10); }
    c.fillStyle=lit?'#ffc65e':'#141826';
    c.fillRect(x+w*f[0],y+h*f[1],w*0.1,h*0.13);
  });
  c.fillStyle='#1b1208'; c.fillRect(x+w*0.36,y+h*0.72,w*0.12,h*0.17);
  const gxp=x+w*(0.8+Math.sin(t*0.8)*0.06), gyp=y+h*(0.52+Math.sin(t*1.7)*0.06);
  c.fillStyle='rgba(120,180,255,0.15)';
  c.beginPath(); c.arc(gxp,gyp,26,0,6.3); c.fill();
  c.fillStyle='#eef4ff';
  c.beginPath(); c.arc(gxp,gyp-6,12,Math.PI,0);
  c.lineTo(gxp+12,gyp+10);
  for(let i=0;i<4;i++){ const dx=gxp+12-i*6, dy=gyp+10+((i%2)?6:0);
    c.quadraticCurveTo(dx-3,dy+6,dx-6,dy); }
  c.lineTo(gxp-12,gyp-6); c.closePath(); c.fill();
  c.fillStyle='#0a0d18';
  c.beginPath(); c.ellipse(gxp-4.5,gyp-7,2.2,3.2,0,0,6.3); c.fill();
  c.beginPath(); c.ellipse(gxp+4.5,gyp-7,2.2,3.2,0,0,6.3); c.fill();
}

/* ---- De Reus: schaduwreus stapt over het hunebed ---- */
function giantPreview(c,x,y,w,h,t){
  const sky=c.createLinearGradient(0,y,0,y+h);
  sky.addColorStop(0,'#101a3a'); sky.addColorStop(0.62,'#1d2b4e'); sky.addColorStop(1,'#0a0f1e');
  c.fillStyle=sky; c.fillRect(x,y,w,h);
  c.fillStyle='rgba(255,240,200,0.9)';
  c.beginPath(); c.arc(x+w*0.18,y+h*0.18,10,0,6.3); c.fill();
  const step=Math.sin(t*1.1), gxp=x+w*(0.62+step*0.05);
  c.fillStyle='#050812';
  c.fillRect(gxp-30,y+h*0.12,60,h*0.5);
  c.beginPath(); c.arc(gxp,y+h*0.12,22,0,6.3); c.fill();
  c.fillRect(gxp-50,y+h*0.2,20,h*0.34);
  c.fillRect(gxp+30,y+h*0.2,20,h*0.34);
  c.fillRect(gxp-26,y+h*0.6,22,h*(0.28+step*0.04));
  c.fillRect(gxp+6,y+h*0.6,22,h*(0.28-step*0.04));
  c.fillStyle='#ff7a2f';
  c.beginPath(); c.arc(gxp-8,y+h*0.12,4,0,6.3); c.fill();
  c.beginPath(); c.arc(gxp+8,y+h*0.12,4,0,6.3); c.fill();
  c.fillStyle='#16321c'; c.fillRect(x,y+h*0.78,w,h*0.22);
  c.fillStyle='#0f2415';
  for(let i=0;i<4;i++) c.fillRect(x,y+h*0.8+i*9,w,3);
  c.fillStyle='#5b6274';
  [0.1,0.26,0.42].forEach(function(fx){ c.fillRect(x+w*fx,y+h*0.62,w*0.06,h*0.2); });
  c.fillRect(x+w*0.08,y+h*0.58,w*0.42,h*0.06);
  c.fillStyle='rgba(255,255,255,0.12)'; c.fillRect(x+w*0.08,y+h*0.58,w*0.42,3);
  const px2=x+w*(0.18+((t*0.16)%0.45));
  c.fillStyle='#ffcf7a'; c.fillRect(px2,y+h*0.84,5,11); c.fillRect(px2+1,y+h*0.8,3,4);
}

/* ---- De Hal: papier-en-inkt console met vier knoppen ---- */
function monsterPreview(c,x,y,w,h,t){
  c.fillStyle='#F1F0EC'; c.fillRect(x,y,w,h);
  c.strokeStyle='#15150F'; c.lineWidth=1.4; c.strokeRect(x+4.5,y+4.5,w-9,h-9);
  c.fillStyle='#15150F'; c.fillRect(x+4,y+4,w-8,14);
  c.fillStyle='#F1F0EC'; c.font='700 8px "Work Sans",system-ui,sans-serif';
  c.textAlign='left'; c.fillText('DE HAL',x+10,y+14);
  c.textAlign='right'; c.fillText((((t*10)|0)%99)+'s',x+w-10,y+14);
  c.textAlign='left';
  c.strokeStyle='#15150F'; c.lineWidth=1.6;
  c.beginPath(); c.moveTo(x+6,y+h*0.82); c.lineTo(x+w-6,y+h*0.82); c.stroke();
  const bx=x+w*0.14, by=y+h*0.52;
  c.fillStyle='#fff'; c.fillRect(bx,by,w*0.46,h*0.2);
  c.strokeStyle='#15150F'; c.lineWidth=1.4; c.strokeRect(bx,by,w*0.46,h*0.2);
  for(let i=0;i<4;i++){
    const on=((((t*1.6)|0)%4)===i);
    c.fillStyle=on?'#E03A25':'#C9C8C1';
    c.beginPath(); c.arc(bx+w*0.08+i*w*0.1,by+h*0.1,5,0,6.3); c.fill();
    c.strokeStyle='#15150F'; c.lineWidth=1.2; c.stroke();
  }
  c.fillStyle='#15150F'; c.fillRect(bx+w*0.2,by+h*0.2,w*0.06,h*0.1);
  function stick(fx,fy,k,dir){
    c.strokeStyle='#15150F'; c.lineWidth=2; c.lineCap='round';
    c.beginPath(); c.arc(fx,fy-13*k,4*k,0,6.3); c.stroke();
    c.beginPath(); c.moveTo(fx,fy-9*k); c.lineTo(fx,fy-3*k);
    c.moveTo(fx,fy-8*k); c.lineTo(fx+5*k*dir,fy-5*k);
    c.moveTo(fx,fy-8*k); c.lineTo(fx-4*k*dir,fy-4*k);
    c.moveTo(fx,fy-3*k); c.lineTo(fx-4*k,fy);
    c.moveTo(fx,fy-3*k); c.lineTo(fx+4*k,fy);
    c.stroke();
  }
  stick(x+w*(0.3+Math.sin(t*1.4)*0.08),y+h*0.82,1.15,1);
  stick(x+w*0.7,y+h*0.82,1.05,-1);
  const mh=h*(0.2+0.08*Math.max(0,Math.sin(t*0.9)));
  c.fillStyle='#E03A25';
  c.beginPath();
  c.moveTo(x+w*0.82,y+h*0.82); c.lineTo(x+w*0.82,y+h*0.82-mh);
  c.quadraticCurveTo(x+w*0.9,y+h*0.82-mh-12,x+w*0.97,y+h*0.82-mh);
  c.lineTo(x+w*0.97,y+h*0.82); c.closePath(); c.fill();
  c.fillStyle='#F1F0EC';
  c.beginPath(); c.arc(x+w*0.87,y+h*0.82-mh+5,2,0,6.3); c.fill();
  c.beginPath(); c.arc(x+w*0.93,y+h*0.82-mh+5,2,0,6.3); c.fill();
}

function drawScreen(c,S,t){
  const cx=P(S.px);
  if(!vis(cx,260)) return;
  const sh=bowSlope(cx);                 // exactly the wall's own slope, so it stays glued to it
  const x=cx-SCR_W/2, y=SCR_Y+bow(cx);
  c.save(); c.translate(cx,y+SCR_H/2); c.transform(1,sh,0,1,0,0); c.translate(-cx,-(y+SCR_H/2));
  // plaque
  const pw=SCR_W-16, px0=x+8, py=y-42;
  c.fillStyle='#121a33'; rr(c,px0,py,pw,38,7); c.fill();
  c.strokeStyle='rgba(215,225,255,0.55)'; c.lineWidth=2.2; rr(c,px0,py,pw,38,7); c.stroke();
  skull(c,px0+23,py+18,10,'#f2f6ff','#121a33',true);
  c.textAlign='left'; c.fillStyle='#f4f7ff';
  c.letterSpacing='0.5px';
  let tfs=15, avail=pw-48;
  do{ c.font='700 '+tfs+'px "Work Sans",system-ui,sans-serif'; tfs-=0.5; }
  while(tfs>10 && c.measureText(S.title).width>avail);
  c.fillText(S.title,px0+40,py+24); c.letterSpacing='0px';
  // cabinet
  const bodyG=c.createLinearGradient(0,y,0,y+SCR_H);
  bodyG.addColorStop(0,'#aab4c8'); bodyG.addColorStop(0.5,'#8d97ad'); bodyG.addColorStop(1,'#6b7490');
  c.fillStyle=bodyG; rr(c,x,y,SCR_W,SCR_H,18); c.fill();
  c.strokeStyle='#5b6480'; c.lineWidth=2.6; rr(c,x,y,SCR_W,SCR_H,18); c.stroke();
  c.strokeStyle='rgba(255,255,255,0.32)'; c.lineWidth=1.8; rr(c,x+4,y+4,SCR_W-8,SCR_H-8,15); c.stroke();
  const gx=x+17, gy=y+17, gw=SCR_W-34, gh=SCR_H-58;
  c.fillStyle='#161c2e'; rr(c,gx-7,gy-7,gw+14,gh+14,8); c.fill();
  c.fillStyle='#04060c'; rr(c,gx,gy,gw,gh,5); c.fill();
  // glass content
  c.save(); c.beginPath(); c.rect(gx,gy,gw,gh); c.clip();
  const hud=24, bw=Math.round(gw*0.5);
  const inner=(S.id==='toren'||S.id==='spook'||S.id==='reus');
  const boardX=inner?gx:gx+gw-bw, gameX=inner?gx+bw:gx;
  c.fillStyle='#05080f'; c.fillRect(gx,gy,gw,hud);
  c.textAlign='left';
  pixText(c,'SCORE',gx+6,gy+11,'#e6ecff',7.5);
  pixText(c,'000000',gx+6,gy+21,'#e6ecff',7.5);
  const lab={dart:'PIJLEN',climb:'GREEP',nest:'LEVENS',spook:'ANGST',giant:'LEVENS',monster:'KRACHT'}[S.kind]||'LEVENS';
  const val={dart:'3/3',climb:'100%',nest:'3/3',spook:'88%',giant:'3/3',monster:'MAX'}[S.kind]||'000000';
  pixText(c,lab,gx+62,gy+11,'#e6ecff',7.5);
  pixText(c,val,gx+62,gy+21,'#e6ecff',7.5);
  const mid={nest:'WEB 4/4',dart:'RONDE 1',climb:'ZANDSTEEN',spook:'NACHT 1',giant:'HUNEBED',monster:'DE HAL'}[S.kind]||'— — —';
  c.textAlign='center'; pixText(c,mid,gx+gw*0.56,gy+18,'#f5a83c',9);
  c.textAlign='right';
  pixText(c,'TIME',gx+gw-6,gy+11,'#e6ecff',7.5);
  pixText(c,'00:00',gx+gw-6,gy+21,'#e6ecff',7.5);
  c.textAlign='left';
  const pw2=gw-bw, ph2=gh-hud;
  if(S.kind==='climb') climbPreview(c,gameX,gy+hud,pw2,ph2,t);
  else if(S.kind==='nest') nestPreview(c,gameX,gy+hud,pw2,ph2,t);
  else if(S.kind==='dart') dartPreview(c,gameX,gy+hud,pw2,ph2,t);
  else if(S.kind==='spook') spookPreview(c,gameX,gy+hud,pw2,ph2,t);
  else if(S.kind==='giant') giantPreview(c,gameX,gy+hud,pw2,ph2,t);
  else if(S.kind==='monster') monsterPreview(c,gameX,gy+hud,pw2,ph2,t);
  else soonPreview(c,gameX,gy+hud,pw2,ph2,t);
  boardList(c,boardX,gy+hud,bw,ph2,S.kind==='soon'?EMPTY:ROWS);
  c.globalAlpha=0.045; c.fillStyle='#9fc4ff';
  for(let yy=gy;yy<gy+gh;yy+=4) c.fillRect(gx,yy,gw,1.6);
  c.globalAlpha=1;
  const glg=c.createLinearGradient(gx,gy,gx+gw,gy+gh);
  glg.addColorStop(0,'rgba(255,255,255,0.08)'); glg.addColorStop(0.42,'rgba(255,255,255,0)');
  c.fillStyle=glg; c.fillRect(gx,gy,gw,gh);
  if(S.status==='live'){
    const pulse=0.55+0.45*Math.sin(T*4);
    c.fillStyle='rgba(95,217,140,'+pulse+')';
    c.beginPath(); c.arc(gx+13,gy+gh-13,4.6,0,6.3); c.fill();
    c.fillStyle='rgba(200,255,220,0.92)'; c.font='700 10px "Work Sans",system-ui,sans-serif';
    c.fillText('LIVE',gx+22,gy+gh-9);
  }
  c.restore();
  c.strokeStyle='rgba(130,220,255,0.45)'; c.lineWidth=1.4; rr(c,gx,gy,gw,gh,5); c.stroke();
  // control strip
  const cyy=y+SCR_H-34;
  c.fillStyle='#7b8399'; c.fillRect(x+17,cyy,SCR_W-34,24);
  c.fillStyle='#5f6884'; c.fillRect(x+17,cyy,SCR_W-34,3);
  c.fillStyle='#2b3245'; rr(c,x+30,cyy+5,44,14,3); c.fill();
  c.strokeStyle='rgba(255,255,255,0.13)'; c.lineWidth=1.2;
  for(let i=0;i<4;i++){ c.beginPath(); c.moveTo(x+34,cyy+8+i*3); c.lineTo(x+70,cyy+8+i*3); c.stroke(); }
  [[x+SCR_W-44,'#ffb44a'],[x+SCR_W-74,'#f2f6ff'],[x+92,'#7fe08a']].forEach(([lx,col])=>{
    c.fillStyle='#39405c'; rr(c,lx-9,cyy+4,18,16,3); c.fill();
    c.fillStyle=col; c.beginPath(); c.arc(lx,cyy+12,4.6,0,6.3); c.fill();
  });
  c.fillStyle='rgba(60,68,90,0.8)';
  [[x+11,y+11],[x+SCR_W-11,y+11],[x+11,y+SCR_H-11],[x+SCR_W-11,y+SCR_H-11]].forEach(([sx2,sy2])=>{
    c.beginPath(); c.arc(sx2,sy2,3.4,0,6.3); c.fill();
  });
  c.restore();
  // legs + plinth stand upright on the floor
  const fy=FLOOR_Y+bow(cx);
  c.fillStyle='#4c5470';
  c.fillRect(cx-90,y+SCR_H,18,fy-(y+SCR_H)+8);
  c.fillRect(cx+72,y+SCR_H,18,fy-(y+SCR_H)+8);
  c.fillStyle='#3a4160'; c.fillRect(cx-SCR_W/2+28,fy-2,SCR_W-56,14);
}
