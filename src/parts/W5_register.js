
/* =====================================================================
   DE VIER WERELDEN
===================================================================== */
const THEMES={
  castle:{ id:'castle', name:'Kasteel', sub:'koepelzaal bij nacht', glyph:'🏰',
    wall:c_wall, roof:c_roof, floor:c_floor, props:c_props, fire:c_fire, ambient:c_ambient,
    sky:'#05060f',
    cab:['#aab4c8','#8d97ad','#6b7490'], cabEdge:'#5b6480', cabLeg:'#4c5470', cabFoot:'#3a4160',
    cabBezel:'#161c2e', cabGlass:'rgba(130,220,255,0.45)', cabStrip:'#7b8399', cabStrip2:'#5f6884', cabBtn:'#39405c', cabScrew:'rgba(60,68,90,0.8)',
    boardBack:'#1b2039', boardEdge:'#4b5476', boardFrame:'#2a3150', boardInk:'#e8eeff', boardInk2:'#10152a', boardGlow:'rgba(255,190,110,0.2)',
    plaque:'#121a33', plaqueEdge:'rgba(215,225,255,0.55)', plaqueInk:'#f4f7ff',
    accent:'#f5a83c', ringLive:'120,235,160', vign:'rgba(4,6,16,0.62)',
    hint:'← → rondlopen · ↑ ↓ naar voren · ENTER spelen · 1-4 wereld' },
  volcano:{ id:'volcano', name:'Vulkaan', sub:'onder de krater', glyph:'🌋',
    wall:v_wall, roof:v_roof, floor:v_floor, props:v_props, fire:v_fire, ambient:v_ambient,
    sky:'#0a0504',
    cab:['#4e3a30','#3a2a22','#241812'], cabEdge:'#6b4c3a', cabLeg:'#3a2a22', cabFoot:'#241812',
    cabBezel:'#1a100c', cabGlass:'rgba(255,160,70,0.45)', cabStrip:'#6b5142', cabStrip2:'#4a3428', cabBtn:'#2e2019', cabScrew:'rgba(70,50,38,0.85)',
    boardBack:'#160d0a', boardEdge:'#3c2a22', boardFrame:'#241a15', boardInk:'#ffe0c2', boardInk2:'#0e0806', boardGlow:'rgba(255,130,40,0.24)',
    plaque:'#1d100c', plaqueEdge:'rgba(255,150,60,0.55)', plaqueInk:'#ffd9a8',
    accent:'#ff9c3a', ringLive:'255,150,60', vign:'rgba(12,4,2,0.66)',
    hint:'← → rondlopen · ↑ ↓ naar voren · ENTER spelen · 1-4 wereld' },
  ocean:{ id:'ocean', name:'Diepzee', sub:'de gezonken zaal', glyph:'🌊',
    wall:o_wall, roof:o_roof, floor:o_floor, props:o_props, fire:o_fire, ambient:o_ambient,
    sky:'#04121d',
    cab:['#5f8a8c','#3f6870','#26454e'], cabEdge:'#2e6b6a', cabLeg:'#2e5158', cabFoot:'#1d3a42',
    cabBezel:'#08222c', cabGlass:'rgba(120,240,220,0.45)', cabStrip:'#7d9a8e', cabStrip2:'#4e6d66', cabBtn:'#2a4a4c', cabScrew:'rgba(52,80,80,0.85)',
    boardBack:'#08222c', boardEdge:'#2e4a4e', boardFrame:'#123943', boardInk:'#dcfaf2', boardInk2:'#04161e', boardGlow:'rgba(70,210,190,0.22)',
    plaque:'#08222c', plaqueEdge:'rgba(120,240,220,0.5)', plaqueInk:'#dcfaf2',
    accent:'#7fe6cd', ringLive:'110,240,214', vign:'rgba(2,14,22,0.66)',
    hint:'← → zwemmen · ↑ ↓ naar voren · ENTER spelen · 1-4 wereld' },
  space:{ id:'space', name:'Ruimte', sub:'het ringstation', glyph:'🚀',
    wall:s_wall, roof:s_roof, floor:s_floor, props:s_props, fire:s_fire, ambient:s_ambient,
    sky:'#01030a',
    cab:['#5b6c80','#3c4a5c','#242f3c'], cabEdge:'#46586c', cabLeg:'#39485a', cabFoot:'#1d2733',
    cabBezel:'#0b141d', cabGlass:'rgba(127,216,255,0.5)', cabStrip:'#7d8b9c', cabStrip2:'#55677a', cabBtn:'#28323e', cabScrew:'rgba(56,70,88,0.85)',
    boardBack:'#0b141d', boardEdge:'#38465a', boardFrame:'#1b2430', boardInk:'#e4f5ff', boardInk2:'#050c14', boardGlow:'rgba(90,200,255,0.2)',
    plaque:'#07101a', plaqueEdge:'rgba(127,216,255,0.55)', plaqueInk:'#e4f5ff',
    accent:'#7fd8ff', ringLive:'127,216,255', vign:'rgba(1,4,10,0.68)',
    hint:'← → rondlopen · ↑ ↓ naar voren · ENTER spelen · 1-4 wereld' },
};
const THEME_ORDER=['castle','volcano','ocean','space'];

function setTheme(k,quiet){
  if(!THEMES[k]) return;
  THEME_KEY=k; TH=THEMES[k];
  _fg=null; _sg=null; _rg=null; _wg=null;
  if(typeof makeVignette==='function') makeVignette();
  bakePano();
  document.body.style.background=TH.sky;
  if(typeof syncThemeBar==='function') syncThemeBar();
  if(!quiet&&typeof showToast==='function') showToast('Wereld: '+TH.name+' — '+TH.sub);
}
