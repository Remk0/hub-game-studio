function bushClump(c,x,y,w,h,col,col2){
  srnd((x*13+y)|0);
  for(let i=0;i<Math.max(7,w/14);i++){
    const bx=x+rnd()*w, by=y+rnd()*h*0.7, r=h*(0.32+rnd()*0.5);
    c.fillStyle=rnd()<0.4?col2:col;
    c.beginPath(); c.arc(bx,by,r,0,6.3); c.fill();
  }
}
function rock(c,x,y,s){
  const rg=c.createLinearGradient(0,y-30*s,0,y);
  rg.addColorStop(0,'#5a627c'); rg.addColorStop(1,'#333a52');
  c.fillStyle=rg;
  c.beginPath(); c.moveTo(x-34*s,y); c.lineTo(x-22*s,y-26*s); c.lineTo(x+4*s,y-34*s);
  c.lineTo(x+28*s,y-20*s); c.lineTo(x+36*s,y); c.closePath(); c.fill();
  c.strokeStyle='rgba(0,0,0,0.3)'; c.lineWidth=1.6; c.stroke();
}
function crateProp(c,x,y,s){
  const w=62*s,h=54*s;
  const cg=c.createLinearGradient(0,y-h,0,y);
  cg.addColorStop(0,'#7d5528'); cg.addColorStop(1,'#4b3114');
  c.fillStyle=cg; c.fillRect(x-w/2,y-h,w,h);
  c.strokeStyle='#33220e'; c.lineWidth=3*s; c.strokeRect(x-w/2,y-h,w,h);
  c.strokeStyle='#8a6230'; c.lineWidth=4*s;
  c.beginPath(); c.moveTo(x-w/2+3,y-h+3); c.lineTo(x+w/2-3,y-3);
  c.moveTo(x+w/2-3,y-h+3); c.lineTo(x-w/2+3,y-3); c.stroke();
}
function barrelProp(c,x,y,s){
  const w=44*s,h=58*s;
  const bd=c.createLinearGradient(x-w/2,0,x+w/2,0);
  bd.addColorStop(0,'#3d2a12'); bd.addColorStop(0.45,'#7a5223'); bd.addColorStop(1,'#3a270f');
  c.fillStyle=bd; rr(c,x-w/2,y-h,w,h,8*s); c.fill();
  c.strokeStyle='#2a1a08'; c.lineWidth=3.4*s;
  [0.72,0.42,0.14].forEach(t=>{ c.beginPath(); c.moveTo(x-w/2,y-h*t); c.lineTo(x+w/2,y-h*t); c.stroke(); });
}
function pumpkinProp(c,x,y,s){
  c.fillStyle='#8f3d14'; c.beginPath(); c.ellipse(x,y-26*s,40*s,30*s,0,0,6.3); c.fill();
  c.fillStyle='#d9761d'; c.beginPath(); c.ellipse(x,y-28*s,35*s,27*s,0,0,6.3); c.fill();
  c.fillStyle='#e8892a';
  c.beginPath(); c.ellipse(x-10*s,y-28*s,13*s,25*s,0,0,6.3); c.fill();
  c.beginPath(); c.ellipse(x+10*s,y-28*s,13*s,25*s,0,0,6.3); c.fill();
  c.fillStyle='#3d5a1e'; c.fillRect(x-4*s,y-62*s,8*s,14*s);
  c.fillStyle='#2a1206';
  c.beginPath(); c.moveTo(x-20*s,y-36*s); c.lineTo(x-7*s,y-36*s); c.lineTo(x-13*s,y-23*s); c.closePath(); c.fill();
  c.beginPath(); c.moveTo(x+20*s,y-36*s); c.lineTo(x+7*s,y-36*s); c.lineTo(x+13*s,y-23*s); c.closePath(); c.fill();
  c.beginPath(); c.moveTo(x-19*s,y-17*s); c.lineTo(x-9*s,y-22*s); c.lineTo(x,y-16*s); c.lineTo(x+9*s,y-22*s);
  c.lineTo(x+19*s,y-17*s); c.lineTo(x+10*s,y-7*s); c.lineTo(x-10*s,y-7*s); c.closePath(); c.fill();
}
function benchLight(c,cx,y,w){
  c.fillStyle='#4c351d'; rr(c,cx-w/2,y-18,w,18,4); c.fill();
  c.fillStyle='#63451f'; rr(c,cx-w/2,y-18,w,6,3); c.fill();
  c.fillStyle='#3a2813'; c.fillRect(cx-w/2+7,y,9,14); c.fillRect(cx+w/2-16,y,9,14);
  c.fillStyle='#ffca6e'; rr(c,cx-w*0.36,y-14,w*0.72,6,3); c.fill();
}
function ropeStanchion(c,x,y,s){
  c.fillStyle='#463a58'; c.fillRect(x-3.5*s,y-54*s,7*s,54*s);
  c.fillStyle='#2f2842'; c.beginPath(); c.ellipse(x,y,13*s,4.5*s,0,0,6.3); c.fill();
  c.fillStyle='#d8ab4a'; c.beginPath(); c.arc(x,y-58*s,7*s,0,6.3); c.fill();
}
function checkerFlag(c,x,y,h,tilt){
  c.save(); c.translate(x,y); c.rotate(tilt||0);
  c.fillStyle='#3d4460'; c.fillRect(-3,-h,6,h);
  const s=13;
  for(let r=0;r<3;r++) for(let col=0;col<3;col++){
    c.fillStyle=((r+col)%2)?'#f0f3fb':'#191d2e';
    c.fillRect(3+col*s,-h+6+r*s,s,s);
  }
  c.restore();
}
function candleAt(c,x,y,s){
  c.fillStyle='#e8e2d0'; c.fillRect(x-3.4*s,y-13*s,6.8*s,13*s);
}
const BUSH_CACHE=(function(){
  const out=[];
  for(let i=0;i<26;i++){
    srnd(i*977+13); const blob=[];
    for(let j=0;j<10;j++) blob.push([rnd()*130, rnd()*36, 17+rnd()*26, rnd()<0.4]);
    out.push(blob);
  }
  return out;
})();
const FLOOR_CANDLES=[];
