"""Injecteert in elk spel één regel die de score van de speler naar de hub stuurt."""

REPORTER = """
<script>
/* brug naar de HUB: elk spel meldt de score van de speler */
window.__hub=function(v){
  v=Math.max(0,Math.round(+v||0));
  try{ parent.postMessage({hub:'score',game:'__GID__',v:v},'*'); }catch(e){}
};
</script>
"""

# per spel: (zoek, vervang) — één haakje op het moment dat een potje telt
HOOKS = {
 'toren': [(
   " if(punten>SAVE.best)SAVE.best=punten;",
   " if(punten>SAVE.best)SAVE.best=punten;\n window.__hub&&window.__hub(punten);")],

 'nest': [(
   "function toHub(){\n  if(score>best)best=score;",
   "function toHub(){\n  window.__hub&&window.__hub(score);\n  if(score>best)best=score;")],

 'spook': [(
   "  else{score++;coinFx={t:1.2,x:d.x+d.w/2,y:d.base-d.h/2};}",
   "  else{score++;window.__hub&&window.__hub(score);coinFx={t:1.2,x:d.x+d.w/2,y:d.base-d.h/2};}")],

 'oche': [(
   "        submitScore(flight.name,flight.roundTotal);",
   "        submitScore(flight.name,flight.roundTotal);\n"
   "        if(flight.who==='you'&&window.__hub) window.__hub(flight.roundTotal);")],

 'reus': [(
   "  r.geteld=true;zetScore(r.naam,r.afstand);\n  if(!r.bot)punten+=Math.floor(r.afstand);",
   "  r.geteld=true;zetScore(r.naam,r.afstand);\n"
   "  if(!r.bot){punten+=Math.floor(r.afstand);window.__hub&&window.__hub(r.afstand);}")],

 'hal': [(
   "function nieuweScore(naam, score){\n  scores.push({naam, score});",
   "function nieuweScore(naam, score){\n"
   "  if(naam==='JIJ'&&window.__hub) window.__hub(score);\n"
   "  scores.push({naam, score});")],
}

def wire(gid, html):
    """Zet de brug in het spel en haak hem aan de plek waar de score telt."""
    hits = 0
    for find, repl in HOOKS.get(gid, []):
        if find not in html:
            raise AssertionError('score-hook niet gevonden in ' + gid + ': ' + find[:60])
        html = html.replace(find, repl, 1)
        hits += 1
    return REPORTER.replace('__GID__', gid) + html, hits
