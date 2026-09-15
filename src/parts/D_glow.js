const glowSprite=(function(){
  const n=128, cv2=document.createElement('canvas'); cv2.width=n; cv2.height=n;
  const k=cv2.getContext('2d');
  const gl=k.createRadialGradient(n/2,n/2,1,n/2,n/2,n/2);
  gl.addColorStop(0,'rgba(255,200,118,1)');
  gl.addColorStop(0.42,'rgba(255,140,52,0.32)');
  gl.addColorStop(1,'rgba(255,120,40,0)');
  k.fillStyle=gl; k.fillRect(0,0,n,n);
  return cv2;
})();
function flame(c,x,y,s,ph,warm){
  const f=0.82+0.18*Math.sin(T*11+ph)+0.09*Math.sin(T*23+ph*2);
  const r=54*s*f;
  c.save(); c.globalAlpha=0.72*(warm||1);
  c.drawImage(glowSprite,x-r,y-r,r*2,r*2);
  c.restore();
  c.fillStyle='rgba(255,146,46,0.95)';
  c.beginPath(); c.moveTo(x,y-20*s*f);
  c.quadraticCurveTo(x+8*s,y-4*s,x,y+8*s);
  c.quadraticCurveTo(x-8*s,y-4*s,x,y-20*s*f); c.fill();
  c.fillStyle='rgba(255,232,168,0.95)';
  c.beginPath(); c.moveTo(x,y-12*s*f);
  c.quadraticCurveTo(x+4*s,y-3*s,x,y+3.5*s);
  c.quadraticCurveTo(x-4*s,y-3*s,x,y-12*s*f); c.fill();
}
