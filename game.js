'use strict';
/* =========================================================
   SLOPEQUEST v3 — learn, practice & revise differential
   equations. Vanilla JS + Canvas 2D. No dependencies.

   v3 CHANGES
   • Classification fixes: per-exercise diagnosis for mixed
     pools (Bernoulli, hyperbola/circle, exact, almost-exact);
     "why" texts no longer contradict pool members
   • Fixed broken/garbled step options (uniqueness rift,
     homogeneous highlands, variable factor)
   • Undefined field points (x/y at y=0, √y below 0) render
     as gaps instead of wrong arrows
   • 7 new fields (27 total): underdamped spiral, linear-
     systems zoo, competing species, applied archipelago
     (mixing / RC / carbon dating), harvest bifurcations,
     almost-exact repairs, Euler's workshop
   • Chapter 1 trimmed of near-duplicate drills
   • Nudge hints, solution-family reveal, y-vs-t replay,
     nullcline overlay, Field Quiz, stale-level weighting,
     non-unique solutions exempt from RK4 verifier

   v3.1 PATCH
   • Diagnose-phase fix: the correct classification can no
     longer be sliced out of the option pool. Options are
     now built as "correct pick(s) first, then distractors" —
     previously single-answer levels (e.g. The Competing
     Colonies) had a 3/7 chance of showing four wrong
     options and soft-locking the phase.
   ========================================================= */

/* ---------- tiny helpers ---------- */
const $  = s => document.querySelector(s);
const $$ = s => Array.from(document.querySelectorAll(s));
const clamp = (v,a,b)=> v<a?a : v>b?b : v;
const rand  = (a,b)=> a + Math.random()*(b-a);
const lerp  = (a,b,t)=> a+(b-a)*t;
const fmt   = v => String(Math.round(v*100)/100);
function shuffle(arr){
  const a = arr.slice();
  for(let i=a.length-1;i>0;i--){ const j=(Math.random()*(i+1))|0; [a[i],a[j]]=[a[j],a[i]]; }
  return a;
}

/* ---------- equation families (diagnosis choices) ---------- */
const TYPES = [
 {id:'separable',  label:'Separable',
  miss:'Try to split it: can ALL the y’s (with dy) go on one side and ALL the x’s (with dx) on the other? Not here.'},
 {id:'linear',     label:'Linear — integrating factor',
  miss:'Linear means y appears only to the first power, multiplied by functions of x. Check the powers of y here.'},
 {id:'autonomous', label:'Autonomous — equilibrium analysis',
  miss:'Autonomous means the right side depends on y ONLY — no x allowed. This one has x in it.'},
 {id:'substitution', label:'Substitution (Bernoulli / homogeneous)',
  miss:'Not this time — no helpful substitution exists here. Look for a more direct classification.'},
 {id:'exact',      label:'Exact — potential function',
  miss:'Check M_y against N_x — here they differ, so no potential F exists. Another route is needed.'},
 {id:'secondorder',label:'Second-order linear',
  miss:'Count the derivatives: this equation has only y′, not y″.'},
 {id:'system',     label:'System of equations',
  miss:'A system needs TWO unknown functions evolving together — this track has only one.'}
];

/* =========================================================
   LEVEL SHELLS × HAND-AUTHORED EXERCISE POOLS
   Every exercise was reverse-authored: the solution was
   chosen first and differentiated to produce the DE, then
   verified by substitution. Windows are hand-tuned so the
   curve and goal sit comfortably inside the view.
   Step format: {q, o:[[text, ok?, feedback], ...]}
   Optional exercise fields: diag (override), hideEq,
   nonUnique (skip RK4 verifier — multiple solutions).
   Phase-plane fields: vec:true, f:(x,y)=>[u,v],
   tGoal, tFull (omit to auto-close the orbit), goalR.
   ========================================================= */
const LEVELS = [

/* ===== CHAPTER 1 · THE EXPONENTIAL WILDS ===== */

{ id:1, ch:1, name:'First Contact',
  diag:{correct:['separable','autonomous','linear'],
    why:'Triple threat — it’s separable (fastest route), autonomous (only y appears), and even linear. We’ll separate.'},
  exercises:[
  { eqHTML:'dy/dx = 2y', window:{xmin:-2,xmax:1.2,ymin:-2,ymax:6}, x0:0, y0:1, xT:0.8,
    f:(x,y)=>2*y, sol:x=>Math.exp(2*x), solHTML:'y = e<sup>2x</sup>',
    steps:[
     {q:'Separate the variables — every y goes left, every x goes right:', o:[
      ['dy/y = 2 dx',1,'Clean split. Each side now has a single variable.'],
      ['dy/y² = dx',0,'Divide by y, not y² — we need dy/y.'],
      ['dy = 2y dx',0,'That’s the original equation — the y must move across with dy.']]},
     {q:'Integrate both sides:', o:[
      ['ln|y| = 2x + C',1,'∫dy/y = ln|y| and ∫2 dx = 2x.'],
      ['y = 2x + C',0,'The left side isn’t y — dy/y integrates to ln|y|.'],
      ['ln|y| = x² + C',0,'∫2 dx = 2x, not x² — the 2 is a constant.']]},
     {q:'Exponentiate to isolate y:', o:[
      ['y = C·e<sup>2x</sup>',1,'e<sup>ln|y|</sup> = y, and the constant rides along as a multiplier.'],
      ['y = e<sup>2x</sup> + C',0,'After exponentiating, “+C” becomes “×C”.'],
      ['y = C·ln(2x)',0,'Exponentiating wipes out the logarithm — no ln survives.']]},
     {q:'Apply the initial condition y(0) = 1:', o:[
      ['C = 1',1,'1 = C·e⁰ = C. The curve is y = e<sup>2x</sup>.'],
      ['C = 0',0,'Then y ≡ 0 — but our curve starts at height 1.'],
      ['C = 2',0,'Plug in: 1 = C·e⁰, so C = 1.']]}
    ],
    fact:'Exponential growth: the bigger y gets, the faster it grows. Watch the field’s arrows fan outward.'},

  { eqHTML:'dy/dx = 3y', window:{xmin:-1.5,xmax:1,ymin:-2,ymax:7.5}, x0:0, y0:1, xT:0.6,
    f:(x,y)=>3*y, sol:x=>Math.exp(3*x), solHTML:'y = e<sup>3x</sup>',
    steps:[
     {q:'Separate the variables:', o:[
      ['dy/y = 3 dx',1,'The 3 belongs with dx.'],
      ['dy/y = dx',0,'Don’t drop the 3.'],
      ['3 dy = y dx',0,'Divide by y — the 3 stays right.']]},
     {q:'Integrate both sides:', o:[
      ['ln|y| = 3x + C',1,'∫3 dx = 3x — constants ride along.'],
      ['ln|y| = x³ + C',0,'That’s ∫3x² dx — but there’s no x here.'],
      ['ln|3y| = x + C',0,'The 3 divides out: dy/y, not dy/(3y).']]},
     {q:'Exponentiate:', o:[
      ['y = C·e<sup>3x</sup>',1,'The growth rate lives in the exponent.'],
      ['y = 3C·e<sup>x</sup>',0,'The 3 goes in the exponent, not out front.'],
      ['y = C·3x',0,'Exponentiate — the log vanishes.']]},
     {q:'Apply y(0) = 1:', o:[
      ['C = 1',1,'1 = C·e⁰ = C.'],
      ['C = 3',0,'The 3 is already inside the exponent — C = 1.'],
      ['C = ⅓',0,'No division — C copies the starting value.']]}
    ],
    fact:'Rate 3: steeper than rate 2. In y′ = ky, the constant k is the growth rate.'},

  { eqHTML:'dy/dx = 2y', window:{xmin:-1.5,xmax:0.9,ymin:-2,ymax:8}, x0:0, y0:2, xT:0.5,
    f:(x,y)=>2*y, sol:x=>2*Math.exp(2*x), solHTML:'y = 2e<sup>2x</sup>',
    steps:[
     {q:'Separate the variables:', o:[
      ['dy/y = 2 dx',1,'Same split as always — the 2 stays right.'],
      ['dy = 2y dx',0,'Still tangled — divide by y.'],
      ['dy/y² = 2 dx',0,'Divide by y, not y².']]},
     {q:'Integrate both sides:', o:[
      ['ln|y| = 2x + C',1,'The starting height never enters the integration.'],
      ['ln|y| = x² + C',0,'∫2 dx = 2x, not x².'],
      ['ln|2y| = x + C',0,'The 2 divides out: dy/y.']]},
     {q:'Exponentiate:', o:[
      ['y = C·e<sup>2x</sup>',1,'The initial condition only decides C — later.'],
      ['y = 2C·e<sup>x</sup>',0,'The 2 goes in the exponent.'],
      ['y = e<sup>2x</sup> + C',0,'After exponentiating, +C becomes ×C.']]},
     {q:'Apply y(0) = 2:', o:[
      ['C = 2',1,'2 = C·e⁰ = C.'],
      ['C = 1',0,'C copies the starting value: C = 2.'],
      ['C = 4',0,'No doubling — C equals y(0) exactly.']]}
    ],
    fact:'Doubling the starting height doubles the whole curve — the shape is identical.'},

  { eqHTML:'dy/dx = y', window:{xmin:-1.5,xmax:1.4,ymin:-2,ymax:11}, x0:0, y0:3, xT:1,
    f:(x,y)=>y, sol:x=>3*Math.exp(x), solHTML:'y = 3e<sup>x</sup>',
    steps:[
     {q:'Separate the variables:', o:[
      ['dy/y = dx',1,'Coefficient 1 — the simplest split of all.'],
      ['dy = y dx',0,'Still tangled — divide by y.'],
      ['dy/y² = dx',0,'Divide by y, not y².']]},
     {q:'Integrate both sides:', o:[
      ['ln|y| = x + C',1,'∫dx = x.'],
      ['ln|y| = x²/2 + C',0,'∫1·dx = x, not x²/2.'],
      ['y = x + C',0,'The left side integrates to ln|y|.']]},
     {q:'Exponentiate:', o:[
      ['y = C·e<sup>x</sup>',1,'eˣ itself — the most famous solution family.'],
      ['y = e<sup>x</sup> + C',0,'After exponentiating, +C becomes ×C.'],
      ['y = C·x',0,'Exponentiate — the log disappears.']]},
     {q:'Apply y(0) = 3:', o:[
      ['C = 3',1,'3 = C·e⁰. So y = 3eˣ.'],
      ['C = ⅓',0,'C copies the value — no inversion.'],
      ['C = 0',0,'Then y ≡ 0 — but we start at 3.']]}
    ],
    fact:'k = 1: the pure exponential. Every solution is a vertical stretch of eˣ.'},

  { eqHTML:'dy/dx = 2y', window:{xmin:-1.2,xmax:0.6,ymin:-4,ymax:0.5}, x0:0, y0:-1, xT:0.5,
    f:(x,y)=>2*y, sol:x=>-Math.exp(2*x), solHTML:'y = −e<sup>2x</sup>',
    steps:[
     {q:'Separate the variables:', o:[
      ['dy/y = 2 dx',1,'The split doesn’t care that y is negative.'],
      ['dy/y = −2 dx',0,'The right side is +2 — the sign of y is irrelevant to the split.'],
      ['dy = 2y dx',0,'Still tangled — divide by y.']]},
     {q:'Integrate both sides:', o:[
      ['ln|y| = 2x + C',1,'The absolute value handles negative y gracefully.'],
      ['ln(y) = 2x + C',0,'y is negative here — ln needs the |·|.'],
      ['y = 2x + C',0,'The left side integrates to ln|y|.']]},
     {q:'Exponentiate:', o:[
      ['y = C·e<sup>2x</sup>',1,'C will simply come out negative.'],
      ['y = −C·e<sup>2x</sup>',0,'Let C carry the sign — no extra minus needed.'],
      ['y = C·e<sup>−2x</sup>',0,'Growth, not decay — the exponent stays +2x.']]},
     {q:'Apply y(0) = −1:', o:[
      ['C = −1',1,'−1 = C·e⁰. The curve dives away from the axis!'],
      ['C = 1',0,'−1 = C·e⁰ — C copies the (negative) value.'],
      ['C = −½',0,'No inversion — C = y(0).']]}
    ],
    fact:'Below the axis, growth runs in reverse: the curve dives away from 0. For k > 0 the x-axis is unstable — it repels from both sides.'}
  ]},

{ id:2, ch:1, name:'The Decay Channel',
  diag:{correct:['separable','autonomous','linear'],
    why:'Separable, autonomous, and linear all at once. Separation is the quick route.'},
  exercises:[
  { eqHTML:'dy/dx = −y', window:{xmin:-1,xmax:3,ymin:-1,ymax:4}, x0:0, y0:3, xT:2,
    f:(x,y)=>-y, sol:x=>3*Math.exp(-x), solHTML:'y = 3e<sup>−x</sup>',
    steps:[
     {q:'Separate the variables:', o:[
      ['dy/y = −dx',1,'The minus sign travels with the right side.'],
      ['dy/y = dx',0,'The right side is −1 — keep the sign.'],
      ['dy = −y dx',0,'Still tangled — divide by y.']]},
     {q:'Integrate both sides:', o:[
      ['ln|y| = −x + C',1,'∫−dx = −x. Signs matter!'],
      ['ln|y| = x + C',0,'∫−dx = −x, not x.'],
      ['y = −x + C',0,'The left side integrates to ln|y|.']]},
     {q:'Exponentiate:', o:[
      ['y = C·e<sup>−x</sup>',1,'A negative exponent means decay.'],
      ['y = C·e<sup>x</sup>',0,'The −x stays in the exponent.'],
      ['y = −C·x',0,'Exponentiate — the log disappears.']]},
     {q:'Apply y(0) = 3:', o:[
      ['C = 3',1,'y = 3e<sup>−x</sup> — radioactive-style decay.'],
      ['C = −3',0,'3 = C·e⁰ = C.'],
      ['C = 1/3',0,'No division happening — C copies the starting value.']]}
    ],
    fact:'Every solution decays to 0 — the x-axis is a stable equilibrium. The arrows fold inward.'},

  { eqHTML:'dy/dx = −2y', window:{xmin:-1,xmax:2.5,ymin:-1,ymax:5}, x0:0, y0:4, xT:1.5,
    f:(x,y)=>-2*y, sol:x=>4*Math.exp(-2*x), solHTML:'y = 4e<sup>−2x</sup>',
    steps:[
     {q:'Separate the variables:', o:[
      ['dy/y = −2 dx',1,'The minus and the 2 both travel right.'],
      ['dy/y = 2 dx',0,'The right side is −2 — keep the sign.'],
      ['dy = −2y dx',0,'Still tangled — divide by y.']]},
     {q:'Integrate both sides:', o:[
      ['ln|y| = −2x + C',1,'∫−2 dx = −2x.'],
      ['ln|y| = 2x + C',0,'Sign! ∫−2 dx = −2x.'],
      ['ln|y| = −x² + C',0,'That’s ∫−2x dx — but there’s no x here.']]},
     {q:'Exponentiate:', o:[
      ['y = C·e<sup>−2x</sup>',1,'Negative exponent — faster decay than e⁻ˣ.'],
      ['y = C·e<sup>2x</sup>',0,'The −2x stays in the exponent.'],
      ['y = −2C·e<sup>x</sup>',0,'Exponentiate — the log vanishes.']]},
     {q:'Apply y(0) = 4:', o:[
      ['C = 4',1,'4 = C·e⁰. So y = 4e<sup>−2x</sup>.'],
      ['C = −4',0,'4 = C·e⁰ = C.'],
      ['C = 2',0,'C copies the starting value.']]}
    ],
    fact:'Rate −2: the curve sheds half its height every ~0.35 units — twice as fast as rate −1.'},

  { eqHTML:'dy/dx = −3y', window:{xmin:-0.8,xmax:1.6,ymin:-0.5,ymax:2.8}, x0:0, y0:2, xT:1,
    f:(x,y)=>-3*y, sol:x=>2*Math.exp(-3*x), solHTML:'y = 2e<sup>−3x</sup>',
    steps:[
     {q:'Separate the variables:', o:[
      ['dy/y = −3 dx',1,'Minus and 3 both travel right.'],
      ['dy/y = 3 dx',0,'Keep the sign.'],
      ['3 dy = −y dx',0,'Divide by y — the 3 stays right.']]},
     {q:'Integrate both sides:', o:[
      ['ln|y| = −3x + C',1,'∫−3 dx = −3x.'],
      ['ln|y| = 3x + C',0,'Sign!'],
      ['ln|y| = −3x²/2 + C',0,'That’s ∫−3x dx — no x present.']]},
     {q:'Exponentiate:', o:[
      ['y = C·e<sup>−3x</sup>',1,'Steep decay in the exponent.'],
      ['y = C·e<sup>3x</sup>',0,'Decay, not growth.'],
      ['y = 3C·e<sup>−x</sup>',0,'The 3 stays in the exponent.']]},
     {q:'Apply y(0) = 2:', o:[
      ['C = 2',1,'2 = C·e⁰.'],
      ['C = −2',0,'Positive start, positive C.'],
      ['C = 6',0,'C copies the starting value.']]}
    ],
    fact:'Rate −3: a steep initial plunge, then a long flat tail hugging the x-axis.'},

  { eqHTML:'dy/dx = −y', window:{xmin:-1,xmax:3,ymin:-2.5,ymax:1}, x0:0, y0:-2, xT:2,
    f:(x,y)=>-y, sol:x=>-2*Math.exp(-x), solHTML:'y = −2e<sup>−x</sup>',
    steps:[
     {q:'Separate the variables:', o:[
      ['dy/y = −dx',1,'The split doesn’t care that y is negative.'],
      ['dy/y = dx',0,'The right side is −1.'],
      ['dy = −y dx',0,'Divide by y to split.']]},
     {q:'Integrate both sides:', o:[
      ['ln|y| = −x + C',1,'The absolute value handles negative y gracefully.'],
      ['ln(y) = −x + C',0,'y is negative here — ln needs the |·|.'],
      ['y = −x + C',0,'The left side is ln|y|.']]},
     {q:'Exponentiate:', o:[
      ['y = C·e<sup>−x</sup>',1,'C will simply come out negative.'],
      ['y = −C·e<sup>−x</sup>',0,'Let C carry the sign — no extra minus needed.'],
      ['y = C·e<sup>x</sup>',0,'Decay, not growth.']]},
     {q:'Apply y(0) = −2:', o:[
      ['C = −2',1,'−2 = C·e⁰. The curve rises toward 0 from below!'],
      ['C = 2',0,'−2 = C·e⁰ — C copies the (negative) value.'],
      ['C = −½',0,'No inversion — C = y(0).']]}
    ],
    fact:'Below the axis, decay runs in reverse: the curve climbs toward 0. The x-axis attracts from both sides.'}
  ]},

/* ===== CHAPTER 2 · THE SEPARABLE REALMS ===== */

{ id:4, ch:2, name:'The Hyperbola Gate',
  diag:{correct:['separable','substitution'],
    why:'The x’s upstairs and y’s downstairs split perfectly. (It’s also homogeneous — v = y/x would work — but separation is the fast road.)'},
  exercises:[
  { eqHTML:'dy/dx = x/y', window:{xmin:-2.5,xmax:2.5,ymin:-1,ymax:3.2}, x0:0, y0:1, xT:2,
    f:(x,y)=> y===0?NaN:x/y, sol:x=>Math.sqrt(x*x+1), solHTML:'y = √(x² + 1)',
    steps:[
     {q:'Separate — multiply both sides by y:', o:[
      ['y dy = x dx',1,'Multiplying by y clears the denominator — no fractions needed!'],
      ['dy/y = x dx',0,'That’s dividing. We want to multiply by y.'],
      ['dy = x/y dx',0,'Still tangled — the y must come across.']]},
     {q:'Integrate both sides:', o:[
      ['y²/2 = x²/2 + C',1,'∫y dy = y²/2 — don’t forget the left side!'],
      ['y = x²/2 + C',0,'The left side integrates to y²/2, not y.'],
      ['ln|y| = x²/2 + C',0,'Only dy/y integrates to a logarithm.']]},
     {q:'Multiply through by 2:', o:[
      ['y² = x² + C',1,'A family of hyperbolas!'],
      ['y = x + C',0,'√(x² + C) ≠ x + C — never split a root across a sum.'],
      ['2y = 2x + C',0,'Multiply the whole equation by 2 — powers become squares.']]},
     {q:'Apply y(0) = 1:', o:[
      ['C = 1',1,'y² = x² + 1 — a hyperbola opening upward.'],
      ['C = −1',0,'1 = 0² + C → C = 1.'],
      ['C = 2',0,'Substitute the point: 1² = 0 + C.']]},
     {q:'Why keep only the positive root y = +√(x²+1)?', o:[
      ['The initial condition y(0) = 1 > 0 locks the sign — solutions can’t cross y = 0.',1,'Exactly — uniqueness pins you to one branch.'],
      ['Both roots are valid at once',0,'A solution is a single curve; the IC picks its branch.'],
      ['The sign alternates with x',0,'Solutions can’t jump branches — that would break the DE.']]}
    ],
    fact:'Solutions are hyperbolas y² − x² = C. Flip the field upside down — it looks the same. Symmetry!'},

  { eqHTML:'dy/dx = x/y', window:{xmin:-2.5,xmax:2.5,ymin:-1,ymax:3.6}, x0:0, y0:2, xT:2,
    f:(x,y)=> y===0?NaN:x/y, sol:x=>Math.sqrt(x*x+4), solHTML:'y = √(x² + 4)',
    steps:[
     {q:'Separate — multiply both sides by y:', o:[
      ['y dy = x dx',1,'The y clears the denominator.'],
      ['dy/y = x dx',0,'Multiply, don’t divide.'],
      ['dy = x/y dx',0,'Still tangled.']]},
     {q:'Integrate both sides:', o:[
      ['y²/2 = x²/2 + C',1,'Both sides square up.'],
      ['y = x²/2 + C',0,'The left side is y²/2.'],
      ['ln|y| = x²/2 + C',0,'Only dy/y gives a log.']]},
     {q:'Multiply through by 2:', o:[
      ['y² = x² + C',1,'Hyperbola family again.'],
      ['y = x + C',0,'Never split a root across a sum.'],
      ['2y = 2x + C',0,'Powers become squares, not doubles.']]},
     {q:'Apply y(0) = 2:', o:[
      ['C = 4',1,'4 = 0 + C. So y = √(x² + 4).'],
      ['C = 2',0,'2² = 0 + C → C = 4.'],
      ['C = 16',0,'Square the 2, don’t double it.']]},
     {q:'Why the positive root only?', o:[
      ['y(0) = 2 > 0 locks the branch — solutions can’t cross y = 0.',1,'Uniqueness pins the sign.'],
      ['Both roots are valid at once',0,'The IC picks one branch.'],
      ['The sign flips at each zero of x',0,'Branch-jumping would break the DE.']]}
    ],
    fact:'Same family, higher branch: y² − x² = 4 — a wider hyperbola.'},

  { eqHTML:'dy/dx = x/y', window:{xmin:-3.2,xmax:3.2,ymin:-1,ymax:4.8}, x0:0, y0:3, xT:2.5,
    f:(x,y)=> y===0?NaN:x/y, sol:x=>Math.sqrt(x*x+9), solHTML:'y = √(x² + 9)',
    steps:[
     {q:'Separate — multiply both sides by y:', o:[
      ['y dy = x dx',1,'Multiply by y to clear the fraction.'],
      ['dy/y = x dx',0,'Multiply, don’t divide.'],
      ['dy = x/y dx',0,'Still tangled.']]},
     {q:'Integrate both sides:', o:[
      ['y²/2 = x²/2 + C',1,'Both sides square up.'],
      ['y = x²/2 + C',0,'Left side is y²/2.'],
      ['ln|y| = x²/2 + C',0,'Only dy/y gives a log.']]},
     {q:'Multiply through by 2:', o:[
      ['y² = x² + C',1,'Hyperbolas.'],
      ['y = x + C',0,'Never split a root.'],
      ['2y = 2x + C',0,'Squares, not doubles.']]},
     {q:'Apply y(0) = 3:', o:[
      ['C = 9',1,'9 = 0 + C. So y = √(x² + 9).'],
      ['C = 3',0,'3² = 0 + C → C = 9.'],
      ['C = 6',0,'Square the 3, don’t double it.']]},
     {q:'Why the positive root only?', o:[
      ['y(0) = 3 > 0 locks the branch.',1,'The IC pins the sign.'],
      ['Both roots are valid at once',0,'One curve, one branch.'],
      ['The sign alternates with x',0,'Branches can’t be swapped.']]}
    ],
    fact:'y² − x² = 9: raise the starting height and the whole hyperbola lifts with it.'},

  { eqHTML:'dy/dx = 2x/y', window:{xmin:-2.4,xmax:2.4,ymin:-1,ymax:4.4}, x0:0, y0:2, xT:2,
    f:(x,y)=> y===0?NaN:2*x/y, sol:x=>Math.sqrt(2*x*x+4), solHTML:'y = √(2x² + 4)',
    steps:[
     {q:'Separate — multiply both sides by y:', o:[
      ['y dy = 2x dx',1,'The whole 2x comes across.'],
      ['dy/y = 2x dx',0,'Multiply, don’t divide.'],
      ['y dy = x dx',0,'The right side is 2x, not x.']]},
     {q:'Integrate both sides:', o:[
      ['y²/2 = x² + C',1,'∫2x dx = x² — the 2 cancels the power-rule ½.'],
      ['y²/2 = 2x² + C',0,'∫2x dx = x², not 2x².'],
      ['y = x² + C',0,'The left side is y²/2.']]},
     {q:'Multiply through by 2:', o:[
      ['y² = 2x² + C',1,'A squashed hyperbola.'],
      ['y² = x² + C',0,'Carry the 2 across.'],
      ['2y = 4x + C',0,'Squares, not doubles.']]},
     {q:'Apply y(0) = 2:', o:[
      ['C = 4',1,'4 = 0 + C. So y = √(2x² + 4).'],
      ['C = 2',0,'2² = 0 + C → C = 4.'],
      ['C = 8',0,'Square the 2, don’t double it.']]},
     {q:'Why the positive root only?', o:[
      ['y(0) = 2 > 0 locks the branch.',1,'The IC pins the sign.'],
      ['Both roots are valid at once',0,'One curve, one branch.'],
      ['The sign alternates with x',0,'Branches can’t be swapped.']]}
    ],
    fact:'y² − 2x² = 4: a squashed hyperbola — steeper walls than the classic x².'},

  { eqHTML:'dy/dx = 2x/y³', window:{xmin:-2,xmax:2,ymin:-0.5,ymax:2.2}, x0:0, y0:1, xT:1.5,
    f:(x,y)=> y===0?NaN:2*x/(y*y*y), sol:x=>Math.pow(4*x*x+1,0.25), solHTML:'y = (4x² + 1)<sup>¼</sup>',
    diag:{correct:['separable'],
      why:'The y³ downstairs blocks the homogeneous v = y/x trick — but the variables still split cleanly.'},
    steps:[
     {q:'Separate — multiply both sides by y³:', o:[
      ['y³ dy = 2x dx',1,'The cube clears the denominator.'],
      ['dy/y³ = 2x dx',0,'Multiply, don’t divide.'],
      ['y dy = 2x dx',0,'It’s y³ downstairs — bring the whole cube across.']]},
     {q:'Integrate both sides:', o:[
      ['y⁴/4 = x² + C',1,'∫y³ dy = y⁴/4 and ∫2x dx = x².'],
      ['y⁴ = x² + C',0,'The power rule leaves y⁴/4 — don’t drop the ¼.'],
      ['y³/3 = x² + C',0,'∫y³ dy = y⁴/4 — the power rises by one.']]},
     {q:'Multiply through by 4:', o:[
      ['y⁴ = 4x² + C',1,'Quartic level curves this time!'],
      ['y² = 4x² + C',0,'Multiply the WHOLE equation by 4 — y⁴/4 becomes y⁴.'],
      ['4y = 8x + C',0,'Powers, not multiples.']]},
     {q:'Apply y(0) = 1:', o:[
      ['C = 1',1,'1 = 0 + C. So y⁴ = 4x² + 1.'],
      ['C = 4',0,'1⁴ = 0 + C → C = 1.'],
      ['C = ¼',0,'Substitute: 1⁴ = C.']]}
    ],
    fact:'y⁴ = 4x² + 1: for large x the curve hugs √(2x) — the quartic flattens the hyperbola’s walls.'}
  ]},

{ id:5, ch:2, name:'The Circular Sea',
  diag:{correct:['separable','substitution'],
    why:'Separable — and homogeneous too (only the ratio y/x appears). The minus sign curves solutions back on themselves: circles, or ellipses.'},
  exercises:[
  { eqHTML:'dy/dx = −x/y', window:{xmin:-2.6,xmax:2.6,ymin:-2.6,ymax:2.6}, x0:0, y0:2, xT:1.5,
    f:(x,y)=> y===0?NaN:-x/y,
    sol:x=>{const t=4-x*x; return t>=0?Math.sqrt(t):NaN;}, solHTML:'y = √(4 − x²)',
    steps:[
     {q:'Separate:', o:[
      ['y dy = −x dx',1,'Multiply by y, keep the minus.'],
      ['dy/y = −x dx',0,'Multiply by y — don’t divide.'],
      ['y dy = x dx',0,'The minus sign must survive the trip.']]},
     {q:'Integrate:', o:[
      ['y²/2 = −x²/2 + C',1,'Both sides square up.'],
      ['y²/2 = x²/2 + C',0,'∫−x dx = −x²/2 — sign!'],
      ['y = −x² + C',0,'The left side is y²/2.']]},
     {q:'Multiply by 2 and gather the squares:', o:[
      ['x² + y² = C',1,'A circle! Every solution is a circle centred at the origin.'],
      ['x² − y² = C',0,'Move −x² across: it becomes +x².'],
      ['x + y = C',0,'Squares, not first powers.']]},
     {q:'Apply y(0) = 2:', o:[
      ['C = 4',1,'A circle of radius 2 — trace the arc!'],
      ['C = 2',0,'0² + 2² = 4 → C = 4.'],
      ['C = 16',0,'Square the 2, don’t double it.']]}
    ],
    fact:'The field is radial — arrows sweep around the origin. Closed curves mean no equilibrium anywhere.'},

  { eqHTML:'dy/dx = −x/y', window:{xmin:-3.4,xmax:3.4,ymin:-3.4,ymax:3.4}, x0:0, y0:3, xT:2,
    f:(x,y)=> y===0?NaN:-x/y,
    sol:x=>{const t=9-x*x; return t>=0?Math.sqrt(t):NaN;}, solHTML:'y = √(9 − x²)',
    steps:[
     {q:'Separate:', o:[
      ['y dy = −x dx',1,'Multiply by y, keep the minus.'],
      ['dy/y = −x dx',0,'Multiply, don’t divide.'],
      ['y dy = x dx',0,'Keep the minus.']]},
     {q:'Integrate:', o:[
      ['y²/2 = −x²/2 + C',1,'Both sides square up.'],
      ['y²/2 = x²/2 + C',0,'Sign error.'],
      ['y = −x² + C',0,'Left side is y²/2.']]},
     {q:'Multiply by 2 and gather:', o:[
      ['x² + y² = C',1,'Circles again — radius set by the IC.'],
      ['x² − y² = C',0,'It’s a sum, not a difference.'],
      ['x + y = C',0,'Squares, not first powers.']]},
     {q:'Apply y(0) = 3:', o:[
      ['C = 9',1,'A circle of radius 3.'],
      ['C = 3',0,'0² + 3² = 9 → C = 9.'],
      ['C = 6',0,'Square the 3, don’t double it.']]}
    ],
    fact:'Radius 3 this time — the starting height IS the radius.'},

  { eqHTML:'dy/dx = −2x/y', window:{xmin:-1.6,xmax:1.6,ymin:-2.6,ymax:2.6}, x0:0, y0:2, xT:1.2,
    f:(x,y)=> y===0?NaN:-2*x/y,
    sol:x=>{const t=4-2*x*x; return t>=0?Math.sqrt(t):NaN;}, solHTML:'y = √(4 − 2x²)',
    steps:[
     {q:'Separate:', o:[
      ['y dy = −2x dx',1,'The whole −2x comes across.'],
      ['dy/y = −2x dx',0,'Multiply, don’t divide.'],
      ['y dy = 2x dx',0,'Keep the minus.']]},
     {q:'Integrate:', o:[
      ['y²/2 = −x² + C',1,'∫−2x dx = −x² — the 2 cancels the power-rule ½.'],
      ['y²/2 = −2x² + C',0,'∫−2x dx = −x², not −2x².'],
      ['y = −x² + C',0,'Left side is y²/2.']]},
     {q:'Multiply by 2 and gather:', o:[
      ['2x² + y² = C',1,'An ellipse! A squashed circle.'],
      ['x² + y² = C',0,'Carry the 2 across.'],
      ['2x + y = C',0,'Squares, not first powers.']]},
     {q:'Apply y(0) = 2:', o:[
      ['C = 4',1,'0 + 4 = C. So 2x² + y² = 4.'],
      ['C = 2',0,'0 + 2² = 4 → C = 4.'],
      ['C = 8',0,'Square the 2, don’t double it.']]}
    ],
    fact:'2x² + y² = 4 — an ellipse! Not every radial-looking field gives circles.'},

  { eqHTML:'dy/dx = −x/y', window:{xmin:-4.4,xmax:4.4,ymin:-4.4,ymax:4.4}, x0:0, y0:4, xT:2.5,
    f:(x,y)=> y===0?NaN:-x/y,
    sol:x=>{const t=16-x*x; return t>=0?Math.sqrt(t):NaN;}, solHTML:'y = √(16 − x²)',
    steps:[
     {q:'Separate:', o:[
      ['y dy = −x dx',1,'Multiply by y, keep the minus.'],
      ['dy/y = −x dx',0,'Multiply, don’t divide.'],
      ['y dy = x dx',0,'Keep the minus.']]},
     {q:'Integrate:', o:[
      ['y²/2 = −x²/2 + C',1,'Both sides square up.'],
      ['y²/2 = x²/2 + C',0,'Sign error.'],
      ['y = −x² + C',0,'Left side is y²/2.']]},
     {q:'Multiply by 2 and gather:', o:[
      ['x² + y² = C',1,'The biggest circle yet.'],
      ['x² − y² = C',0,'Sum, not difference.'],
      ['x + y = C',0,'Squares, not first powers.']]},
     {q:'Apply y(0) = 4:', o:[
      ['C = 16',1,'0 + 16 = C. Radius 4.'],
      ['C = 4',0,'0² + 4² = 16 → C = 16.'],
      ['C = 8',0,'Square the 4, don’t double it.']]}
    ],
    fact:'Radius 4: the biggest sea yet — a long, gentle arc to trace.'}
  ]},

{ id:6, ch:2, name:'Blow-Up Bay',
  diag:{correct:['separable','autonomous'],
    why:'Only y appears (autonomous) and the variables split (separable). Not linear — the y² breaks linearity.'},
  exercises:[
  { eqHTML:'dy/dx = y²', window:{xmin:-1,xmax:0.85,ymin:-1,ymax:3.2}, x0:0, y0:1, xT:0.5,
    f:(x,y)=>y*y, sol:x=>1/(1-x), solHTML:'y = 1/(1 − x)',
    steps:[
     {q:'Separate:', o:[
      ['dy/y² = dx',1,'y⁻² dy = dx — the negative power stays downstairs.'],
      ['dy/y = dx',0,'That’s for y¹ — here we divide by y².'],
      ['y² dy = dx',0,'Flip it: divide by y².']]},
     {q:'Integrate — careful with the negative power:', o:[
      ['−1/y = x + C',1,'∫y⁻² dy = −y⁻¹. The sign flip is the classic trap.'],
      ['1/y = x + C',0,'∫y⁻² = −y⁻¹ — mind the minus.'],
      ['ln|y| = x + C',0,'Only dy/y gives a logarithm.']]},
     {q:'Flip to solve for y:', o:[
      ['y = −1/(x + C)',1,'Take reciprocals of both sides.'],
      ['y = 1/(x + C)',0,'Carry the minus: −1/y = x + C.'],
      ['y = ln(x + C)',0,'No logarithm in sight.']]},
     {q:'Apply y(0) = 1:', o:[
      ['C = −1',1,'1 = −1/C → C = −1, so y = 1/(1 − x).'],
      ['C = 1',0,'Check: −1/(0 + C) = 1 needs C = −1.'],
      ['C = 0',0,'That’s division by zero!']]},
     {q:'What happens as x → 1⁻?', o:[
      ['y → ∞ — a vertical asymptote. The solution explodes in finite time.',1,'Unlike eˣ, this curve reaches infinity at a finite x!'],
      ['y → 0 smoothly',0,'The denominator 1 − x is heading to zero…'],
      ['y oscillates',0,'Nothing oscillates here — just a runaway denominator.']]}
    ],
    fact:'Finite-time blow-up: the solution hits infinity at x = 1. Stop tracing before you fall off the edge!'},

  { eqHTML:'dy/dx = y²', window:{xmin:-1,xmax:1.5,ymin:-0.5,ymax:2.2}, x0:0, y0:0.5, xT:1,
    f:(x,y)=>y*y, sol:x=>1/(2-x), solHTML:'y = 1/(2 − x)',
    steps:[
     {q:'Separate:', o:[
      ['dy/y² = dx',1,'Negative power stays downstairs.'],
      ['dy/y = dx',0,'That’s for y¹.'],
      ['y² dy = dx',0,'Flip it: divide by y².']]},
     {q:'Integrate:', o:[
      ['−1/y = x + C',1,'The sign flip is the trap.'],
      ['1/y = x + C',0,'Mind the minus.'],
      ['ln|y| = x + C',0,'Only dy/y gives a log.']]},
     {q:'Flip to solve for y:', o:[
      ['y = −1/(x + C)',1,'Reciprocals of both sides.'],
      ['y = 1/(x + C)',0,'Carry the minus.'],
      ['y = ln(x + C)',0,'No log here.']]},
     {q:'Apply y(0) = ½:', o:[
      ['C = −2',1,'½ = −1/C → C = −2. So y = 1/(2 − x).'],
      ['C = 2',0,'½ = −1/C — solve carefully: C = −2.'],
      ['C = −½',0,'Invert both sides first.']]},
     {q:'Where does this solution blow up?', o:[
      ['x = 2 — where the denominator 2 − x hits zero.',1,'A gentler start buys more runway.'],
      ['x = 1',0,'That was the y(0) = 1 variant — this one starts at ½.'],
      ['It never blows up',0,'Every denominator hits zero eventually.']]}
    ],
    fact:'A gentler start (½) buys more time: blow-up pushed from x = 1 out to x = 2.'},

  { eqHTML:'dy/dx = y²', window:{xmin:-0.5,xmax:0.45,ymin:-1,ymax:6}, x0:0, y0:2, xT:0.3,
    f:(x,y)=>y*y, sol:x=>2/(1-2*x), solHTML:'y = 2/(1 − 2x)',
    steps:[
     {q:'Separate:', o:[
      ['dy/y² = dx',1,'Negative power downstairs.'],
      ['dy/y = dx',0,'That’s for y¹.'],
      ['y² dy = dx',0,'Divide by y².']]},
     {q:'Integrate:', o:[
      ['−1/y = x + C',1,'∫y⁻² = −y⁻¹.'],
      ['1/y = x + C',0,'Mind the minus.'],
      ['ln|y| = x + C',0,'Only dy/y gives a log.']]},
     {q:'Flip to solve for y:', o:[
      ['y = −1/(x + C)',1,'Reciprocals.'],
      ['y = 1/(x + C)',0,'Carry the minus.'],
      ['y = −(x + C)',0,'No — flip it, don’t negate it.']]},
     {q:'Apply y(0) = 2:', o:[
      ['C = −½',1,'2 = −1/C → C = −½. So y = 2/(1 − 2x).'],
      ['C = ½',0,'2 = −1/C — the minus matters.'],
      ['C = −2',0,'Invert carefully: C = −½.']]},
     {q:'Where does it blow up?', o:[
      ['x = ½ — where 1 − 2x = 0.',1,'Higher start, earlier doom.'],
      ['x = 2',0,'That’s the y(0) = ½ variant.'],
      ['x = 1',0,'That’s the y(0) = 1 variant.']]}
    ],
    fact:'Higher start, earlier doom: blow-up at x = ½. The bigger y gets, the sooner it explodes.'},

  { eqHTML:'dy/dx = 2y²', window:{xmin:-0.6,xmax:0.45,ymin:-0.8,ymax:3.2}, x0:0, y0:1, xT:0.3,
    f:(x,y)=>2*y*y, sol:x=>1/(1-2*x), solHTML:'y = 1/(1 − 2x)',
    steps:[
     {q:'Separate:', o:[
      ['dy/y² = 2 dx',1,'The 2 must come across too.'],
      ['dy/y = 2 dx',0,'That’s for y¹.'],
      ['y² dy = 2 dx',0,'Divide by y².']]},
     {q:'Integrate:', o:[
      ['−1/y = 2x + C',1,'∫2 dx = 2x, and the left flips sign.'],
      ['−1/y = x² + C',0,'∫2 dx = 2x, not x².'],
      ['1/y = 2x + C',0,'Mind the minus on the left.']]},
     {q:'Flip to solve for y:', o:[
      ['y = −1/(2x + C)',1,'Reciprocals of both sides.'],
      ['y = 1/(2x + C)',0,'Carry the minus.'],
      ['y = −2/(x + C)',0,'The 2 stays with x — don’t move it.']]},
     {q:'Apply y(0) = 1:', o:[
      ['C = −1',1,'1 = −1/C → C = −1. So y = 1/(1 − 2x).'],
      ['C = 1',0,'1 = −1/C needs C = −1.'],
      ['C = −2',0,'Invert carefully: C = −1.']]},
     {q:'Where does it blow up?', o:[
      ['x = ½ — where 1 − 2x = 0.',1,'Same cliff as before, reached just as fast.'],
      ['x = 1',0,'Check the denominator: 1 − 2x = 0 at x = ½.'],
      ['x = 2',0,'Check the denominator.']]}
    ],
    fact:'Doubling the right side keeps the blow-up point but doubles the urgency everywhere else.'},

  { eqHTML:'dy/dx = y²', window:{xmin:-0.5,xmax:3,ymin:-1.5,ymax:0.5}, x0:0, y0:-1, xT:2,
    f:(x,y)=>y*y, sol:x=>-1/(x+1), solHTML:'y = −1/(x + 1)',
    steps:[
     {q:'Separate:', o:[
      ['dy/y² = dx',1,'Same split — negative y changes nothing.'],
      ['dy/y = dx',0,'That’s for y¹.'],
      ['y² dy = dx',0,'Divide by y².']]},
     {q:'Integrate:', o:[
      ['−1/y = x + C',1,'The sign flip is the trap, as always.'],
      ['1/y = x + C',0,'Mind the minus.'],
      ['ln|y| = x + C',0,'Only dy/y gives a log.']]},
     {q:'Flip to solve for y:', o:[
      ['y = −1/(x + C)',1,'Reciprocals of both sides.'],
      ['y = 1/(x + C)',0,'Carry the minus.'],
      ['y = ln(x + C)',0,'No log here.']]},
     {q:'Apply y(0) = −1:', o:[
      ['C = 1',1,'−1 = −1/C → C = 1. So y = −1/(x + 1).'],
      ['C = −1',0,'−1 = −1/(0 + C) → C = 1.'],
      ['C = 0',0,'Division by zero!']]},
     {q:'What happens as x → ∞?', o:[
      ['y → 0 from below — y = 0 is semi-stable: approached from below, blown past from above.',1,'Starting under the axis, the field lifts you gently to 0 — but above it, escape is explosive.'],
      ['y → −∞',0,'The denominator GROWS — the fraction shrinks.'],
      ['y crosses above 0',0,'Solutions can never cross y = 0 — the field is defined there but the flow slows to zero.']]}
    ],
    fact:'Semi-stable equilibrium: y = 0 attracts from below and repels from above. One line, two personalities.'},

  { eqHTML:'dy/dx = −y²', window:{xmin:-0.5,xmax:3,ymin:-0.5,ymax:1.5}, x0:0, y0:1, xT:2,
    f:(x,y)=>-y*y, sol:x=>1/(x+1), solHTML:'y = 1/(x + 1)',
    steps:[
     {q:'Separate:', o:[
      ['dy/y² = −dx',1,'The minus travels with dx.'],
      ['dy/y² = dx',0,'The right side is −1 — keep the sign.'],
      ['y² dy = −dx',0,'Divide by y².']]},
     {q:'Integrate:', o:[
      ['−1/y = −x + C',1,'Both sides carry a minus now.'],
      ['−1/y = x + C',0,'∫−dx = −x.'],
      ['1/y = −x + C',0,'The left side flips sign too.']]},
     {q:'Flip and tidy (multiply by −1 first):', o:[
      ['y = 1/(x + C)',1,'−1/y = −x + C → 1/y = x − C → y = 1/(x + C′).'],
      ['y = −1/(x + C)',0,'Multiply through by −1 first — both minuses cancel.'],
      ['y = 1/(1 − x)',0,'That’s the blow-up cousin — check the signs.']]},
     {q:'Apply y(0) = 1:', o:[
      ['C = 1',1,'1 = 1/C → C = 1. So y = 1/(x + 1).'],
      ['C = −1',0,'1 = 1/(0 + C) → C = 1.'],
      ['C = 0',0,'Division by zero!']]},
     {q:'Does this solution blow up for x > 0?', o:[
      ['Never — the denominator only grows. It decays like 1/x.',1,'Flipping the sign of y² turns explosion into a slow fade.'],
      ['At x = 1',0,'The denominator is x + 1 — zero is at x = −1, behind us.'],
      ['At x = −1',0,'True — but that’s backward in time, not ahead.']]}
    ],
    fact:'y′ = −y² is blow-up in reverse: no cliff ahead, just an ever-slower slide toward zero.'},

  { eqHTML:'dy/dx = 1 + y²', window:{xmin:-1,xmax:1.3,ymin:-1.7,ymax:4.6}, x0:0, y0:0, xT:1,
    f:(x,y)=>1+y*y, sol:x=>Math.tan(x), solHTML:'y = tan x',
    steps:[
     {q:'Separate:', o:[
      ['dy/(1 + y²) = dx',1,'The whole (1 + y²) slides under the dy.'],
      ['dy/y² = (1 + y²) dx',0,'Divide by (1 + y²) — it all goes underneath.'],
      ['(1 + y²) dy = dx',0,'Flip it: the (1 + y²) divides the LEFT side.']]},
     {q:'Integrate — recognise the arctangent:', o:[
      ['arctan(y) = x + C',1,'∫dy/(1+y²) = arctan y — the inverse-tangent integral.'],
      ['ln|1 + y²| = x + C',0,'That’s ∫y/(1+y²) dy — we have 1 on top.'],
      ['−1/(1 + y²) = x + C',0,'That’s the DERIVATIVE of arctan, not the integral.']]},
     {q:'Solve for y:', o:[
      ['y = tan(x + C)',1,'Apply tan to both sides.'],
      ['y = arctan(x + C)',0,'Undo the arctangent — apply tan.'],
      ['y = tan x + C',0,'The C lives INSIDE the tangent.']]},
     {q:'Apply y(0) = 0:', o:[
      ['C = 0',1,'0 = tan C → C = 0. So y = tan x.'],
      ['C = 1',0,'tan C = 0 forces C = 0.'],
      ['C = π/2',0,'tan(π/2) is undefined!']]},
     {q:'Where does this solution blow up?', o:[
      ['x = π/2 ≈ 1.57 — tan has vertical asymptotes.',1,'A smooth, always-positive field — yet the solution still explodes in finite time!'],
      ['It never blows up',0,'tan x has asymptotes at ±π/2.'],
      ['x = 1',0,'tan 1 ≈ 1.56 — perfectly finite.']]}
    ],
    fact:'Even a gentle-looking field can hide a cliff: tan x explodes at x = π/2, just like 1/(1−x) did at x = 1.'}
  ]},

/* ===== CHAPTER 3 · THE LINEAR LEGION ===== */

{ id:7, ch:3, name:'Equilibrium Isle',
  diag:{correct:['separable','autonomous','linear'],
    why:'Another triple threat. Autonomous thinking gives the fastest insight: find the equilibrium first.'},
  exercises:[
  { eqHTML:'dy/dx = 1 − y', window:{xmin:-1,xmax:3,ymin:-1,ymax:4}, x0:0, y0:3, xT:2,
    f:(x,y)=>1-y, sol:x=>1+2*Math.exp(-x), solHTML:'y = 1 + 2e<sup>−x</sup>',
    steps:[
     {q:'First, find the equilibrium — where does y′ = 0?', o:[
      ['y = 1',1,'Above it arrows point down, below they point up: stable!'],
      ['y = 0',0,'At y = 0, y′ = 1 — not equilibrium.'],
      ['y = −1',0,'At y = −1, y′ = 2 — flowing fast.']]},
     {q:'Separate:', o:[
      ['dy/(1 − y) = dx',1,'The whole (1 − y) divides the left side.'],
      ['dy/y = dx',0,'The denominator is (1 − y), not y.'],
      ['dy = (1 − y) dx',0,'Still mixed — divide by (1 − y).']]},
     {q:'Integrate:', o:[
      ['−ln|1 − y| = x + C',1,'Substitute u = 1 − y: ∫dy/(1−y) = −ln|1−y|.'],
      ['ln|1 − y| = x + C',0,'The chain rule contributes a minus.'],
      ['1/(1 − y) = x + C',0,'It integrates to a logarithm.']]},
     {q:'Solve for y:', o:[
      ['y = 1 + C·e<sup>−x</sup>',1,'The equilibrium 1 plus a decaying transient.'],
      ['y = C·e<sup>−x</sup>',0,'Don’t drop the equilibrium 1.'],
      ['y = 1 + C·e<sup>x</sup>',0,'Decaying, not growing — check the sign.']]},
     {q:'Apply y(0) = 3:', o:[
      ['C = 2',1,'3 = 1 + C → C = 2. The curve relaxes onto y = 1.'],
      ['C = 3',0,'3 = 1 + C → C = 2.'],
      ['C = 1',0,'Subtract the equilibrium first: C = 3 − 1.']]}
    ],
    fact:'Stable equilibrium: every solution, high or low, is herded toward y = 1. The arrows all point home.'},

  { eqHTML:'dy/dx = 2 − y', window:{xmin:-1,xmax:3,ymin:-1,ymax:6}, x0:0, y0:5, xT:2,
    f:(x,y)=>2-y, sol:x=>2+3*Math.exp(-x), solHTML:'y = 2 + 3e<sup>−x</sup>',
    steps:[
     {q:'Find the equilibrium — where y′ = 0:', o:[
      ['y = 2',1,'Arrows above point down, below point up: stable.'],
      ['y = 0',0,'At y = 0, y′ = 2.'],
      ['y = 5',0,'That’s the starting height, not the equilibrium.']]},
     {q:'Separate:', o:[
      ['dy/(2 − y) = dx',1,'The whole (2 − y) divides the left.'],
      ['dy/y = dx',0,'Denominator is (2 − y).'],
      ['dy = (2 − y) dx',0,'Still mixed.']]},
     {q:'Integrate:', o:[
      ['−ln|2 − y| = x + C',1,'u = 2 − y brings a minus.'],
      ['ln|2 − y| = x + C',0,'Chain-rule minus missing.'],
      ['1/(2 − y) = x + C',0,'It’s a logarithm.']]},
     {q:'Solve for y:', o:[
      ['y = 2 + C·e<sup>−x</sup>',1,'Equilibrium 2 plus a decaying transient.'],
      ['y = C·e<sup>−x</sup>',0,'Don’t drop the 2.'],
      ['y = 2 + C·e<sup>x</sup>',0,'Decaying, not growing.']]},
     {q:'Apply y(0) = 5:', o:[
      ['C = 3',1,'5 = 2 + C → C = 3.'],
      ['C = 5',0,'5 = 2 + C → C = 3.'],
      ['C = 2',0,'Subtract the equilibrium first.']]}
    ],
    fact:'Equilibrium at y = 2: start high, get herded down. Same physics as cooling coffee.'},

  { eqHTML:'dy/dx = y − 1', window:{xmin:-1,xmax:0.8,ymin:-3.5,ymax:2}, x0:0, y0:-1, xT:0.5,
    f:(x,y)=>y-1, sol:x=>1-2*Math.exp(x), solHTML:'y = 1 − 2e<sup>x</sup>',
    steps:[
     {q:'Find the equilibrium — where y′ = 0:', o:[
      ['y = 1',1,'y′ = 0 at y = 1 — but watch the arrows: they point AWAY. Unstable!'],
      ['y = 0',0,'At y = 0, y′ = −1.'],
      ['y = −1',0,'That’s the starting height, not the equilibrium.']]},
     {q:'Separate:', o:[
      ['dy/(y − 1) = dx',1,'The whole (y − 1) divides the left side.'],
      ['dy/y = dx',0,'Denominator is (y − 1).'],
      ['dy = (y − 1) dx',0,'Still mixed.']]},
     {q:'Integrate:', o:[
      ['ln|y − 1| = x + C',1,'u = y − 1: ∫du/u = ln|u| — no minus this time!'],
      ['−ln|y − 1| = x + C',0,'No chain-rule minus: the inside is +y.'],
      ['1/(y − 1) = x + C',0,'It’s a logarithm.']]},
     {q:'Solve for y:', o:[
      ['y = 1 + C·e<sup>x</sup>',1,'A GROWING exponential — the instability made visible.'],
      ['y = 1 + C·e<sup>−x</sup>',0,'Growing, not decaying.'],
      ['y = C·e<sup>x</sup>',0,'Don’t drop the 1.']]},
     {q:'Apply y(0) = −1:', o:[
      ['C = −2',1,'−1 = 1 + C → C = −2.'],
      ['C = 2',0,'−1 = 1 + C → C = −2.'],
      ['C = −1',0,'Subtract the 1 first.']]}
    ],
    fact:'An UNSTABLE equilibrium: start below y = 1 and you slide away forever — like a pencil balanced on its tip.'},

  { eqHTML:'dy/dx = 3 − y', window:{xmin:-1,xmax:3,ymin:-1,ymax:4.2}, x0:0, y0:1, xT:2,
    f:(x,y)=>3-y, sol:x=>3-2*Math.exp(-x), solHTML:'y = 3 − 2e<sup>−x</sup>',
    steps:[
     {q:'Find the equilibrium — where y′ = 0:', o:[
      ['y = 3',1,'Stable: arrows on both sides point toward it.'],
      ['y = 1',0,'That’s the starting height.'],
      ['y = 0',0,'At y = 0, y′ = 3.']]},
     {q:'Separate:', o:[
      ['dy/(3 − y) = dx',1,'The whole (3 − y) divides the left.'],
      ['dy/y = dx',0,'Denominator is (3 − y).'],
      ['dy = (3 − y) dx',0,'Still mixed.']]},
     {q:'Integrate:', o:[
      ['−ln|3 − y| = x + C',1,'u = 3 − y brings the minus.'],
      ['ln|3 − y| = x + C',0,'Chain-rule minus missing.'],
      ['1/(3 − y) = x + C',0,'It’s a logarithm.']]},
     {q:'Solve for y:', o:[
      ['y = 3 + C·e<sup>−x</sup>',1,'Equilibrium 3 plus a transient.'],
      ['y = C·e<sup>−x</sup>',0,'Don’t drop the 3.'],
      ['y = 3 + C·e<sup>x</sup>',0,'Decaying, not growing.']]},
     {q:'Apply y(0) = 1:', o:[
      ['C = −2',1,'1 = 3 + C → C = −2. Negative C — starting BELOW equilibrium.'],
      ['C = 2',0,'1 = 3 + C → C = −2.'],
      ['C = −4',0,'Subtract: C = 1 − 3 = −2.']]}
    ],
    fact:'Starting below the equilibrium: the field lifts you up toward y = 3. Attraction works both ways.'}
  ]},

{ id:8, ch:3, name:'The Catenary Coast',
  diag:{correct:['linear'],
    why:'The exponential term on the right blocks separation, and y appears only to first power — linear. Time for the integrating factor.'},
  exercises:[
  { eqHTML:'dy/dx + y = e<sup>x</sup>', window:{xmin:-2,xmax:2,ymin:-1,ymax:3.2}, x0:0, y0:1, xT:1.5,
    f:(x,y)=>Math.exp(x)-y, sol:x=>Math.cosh(x), solHTML:'y = ½(e<sup>x</sup> + e<sup>−x</sup>) = cosh x',
    steps:[
     {q:'Compute the integrating factor μ(x):', o:[
      ['μ = e<sup>x</sup>',1,'P(x) = 1, so μ = e^(∫1 dx) = eˣ.'],
      ['μ = e<sup>−x</sup>',0,'Standard form is y′ + y = eˣ — P(x) = +1.'],
      ['μ = x',0,'It’s an exponential of an integral.']]},
     {q:'Multiply through by eˣ. The left side collapses into:', o:[
      ['(e<sup>x</sup>y)′ = e<sup>2x</sup>',1,'The product rule makes the left a perfect derivative — that’s the whole magic of μ!'],
      ['(e<sup>x</sup>y)′ = 1',0,'eˣ · eˣ = e²ˣ on the right.'],
      ['(e<sup>−x</sup>y)′ = e<sup>2x</sup>',0,'We multiplied by eˣ, not e⁻ˣ.']]},
     {q:'Integrate both sides:', o:[
      ['e<sup>x</sup>y = e<sup>2x</sup>/2 + C',1,'∫e²ˣ dx = e²ˣ/2 — the ½ comes from the chain rule.'],
      ['e<sup>x</sup>y = e<sup>2x</sup> + C',0,'Missing the ½.'],
      ['e<sup>x</sup>y = 2e<sup>2x</sup> + C',0,'It’s e²ˣ/2, not 2e²ˣ.']]},
     {q:'Solve for y:', o:[
      ['y = e<sup>x</sup>/2 + C·e<sup>−x</sup>',1,'Divide through by eˣ.'],
      ['y = e<sup>2x</sup>/2 + C',0,'Every term gets divided by eˣ.'],
      ['y = e<sup>x</sup> + C·e<sup>−x</sup>',0,'The ½ survives the division.']]},
     {q:'Apply y(0) = 1:', o:[
      ['C = ½',1,'1 = ½ + C → C = ½. So y = ½(eˣ + e⁻ˣ) = cosh x — the hanging-chain curve!'],
      ['C = 1',0,'1 = ½ + C → C = ½.'],
      ['C = 2',0,'Subtract the ½ first.']]}
    ],
    fact:'cosh x — the catenary — is the shape of a hanging chain: two exponentials braided into one graceful arc.'},

  { eqHTML:'dy/dx + y = e<sup>−x</sup>', window:{xmin:-1,xmax:3,ymin:-0.5,ymax:1.6}, x0:0, y0:1, xT:2,
    f:(x,y)=>Math.exp(-x)-y, sol:x=>(x+1)*Math.exp(-x), solHTML:'y = (x + 1)e<sup>−x</sup>',
    steps:[
     {q:'Compute the integrating factor μ(x):', o:[
      ['μ = e<sup>x</sup>',1,'P(x) = 1 → μ = eˣ. The right side’s e⁻ˣ is irrelevant here.'],
      ['μ = e<sup>−x</sup>',0,'P is the coefficient of y: +1.'],
      ['μ = e<sup>2x</sup>',0,'P is 1, not 2.']]},
     {q:'Multiply through by eˣ. The left side collapses into:', o:[
      ['(e<sup>x</sup>y)′ = 1',1,'eˣ · e⁻ˣ = 1 — the right side collapses too!'],
      ['(e<sup>x</sup>y)′ = e<sup>2x</sup>',0,'That’s the eˣ right-hand-side case.'],
      ['(e<sup>x</sup>y)′ = e<sup>−x</sup>',0,'eˣ · e⁻ˣ = 1.']]},
     {q:'Integrate both sides:', o:[
      ['e<sup>x</sup>y = x + C',1,'∫1 dx = x.'],
      ['e<sup>x</sup>y = x²/2 + C',0,'∫1 dx = x.'],
      ['e<sup>x</sup>y = e<sup>x</sup> + C',0,'The right side became 1, not eˣ.']]},
     {q:'Solve for y:', o:[
      ['y = (x + C)e<sup>−x</sup>',1,'Divide everything by eˣ — the x stays inside the product.'],
      ['y = x + C·e<sup>−x</sup>',0,'The x is INSIDE the product — every term gets divided by eˣ.'],
      ['y = (x + C)e<sup>x</sup>',0,'Divide by eˣ, don’t multiply.']]},
     {q:'Apply y(0) = 1:', o:[
      ['C = 1',1,'1 = (0 + C)·1 → C = 1.'],
      ['C = 0',0,'1 = C·1 → C = 1.'],
      ['C = −1',0,'Plug x = 0: 1 = C.']]}
    ],
    fact:'From the start the curve only decays — but the x in (x+1)e⁻ˣ is the fingerprint of resonance: a polynomial riding a dying exponential.'},

  { eqHTML:'dy/dx + 2y = e<sup>x</sup>', window:{xmin:-1.5,xmax:2,ymin:-0.5,ymax:2.2}, x0:0, y0:1, xT:1.5,
    f:(x,y)=>Math.exp(x)-2*y, sol:x=>Math.exp(x)/3+2*Math.exp(-2*x)/3, solHTML:'y = ⅓e<sup>x</sup> + ⅔e<sup>−2x</sup>',
    steps:[
     {q:'Compute the integrating factor μ(x):', o:[
      ['μ = e<sup>2x</sup>',1,'P(x) = 2 → μ = e^(∫2 dx) = e²ˣ.'],
      ['μ = e<sup>x</sup>',0,'P is 2, not 1.'],
      ['μ = e<sup>−2x</sup>',0,'Standard form has +2y, so P = +2.']]},
     {q:'Multiply through by e²ˣ. The left side collapses into:', o:[
      ['(e<sup>2x</sup>y)′ = e<sup>3x</sup>',1,'e²ˣ · eˣ = e³ˣ.'],
      ['(e<sup>2x</sup>y)′ = e<sup>x</sup>',0,'Multiply the right side by e²ˣ too.'],
      ['(e<sup>2x</sup>y)′ = 2e<sup>3x</sup>',0,'e²ˣ · eˣ = e³ˣ — no extra 2.']]},
     {q:'Integrate both sides:', o:[
      ['e<sup>2x</sup>y = e<sup>3x</sup>/3 + C',1,'∫e³ˣ dx = e³ˣ/3.'],
      ['e<sup>2x</sup>y = e<sup>3x</sup> + C',0,'Missing the ⅓.'],
      ['e<sup>2x</sup>y = 3e<sup>3x</sup> + C',0,'It’s e³ˣ/3.']]},
     {q:'Solve for y:', o:[
      ['y = e<sup>x</sup>/3 + C·e<sup>−2x</sup>',1,'Divide through by e²ˣ.'],
      ['y = e<sup>3x</sup>/3 + C',0,'Every term gets divided by e²ˣ.'],
      ['y = e<sup>x</sup> + C·e<sup>−2x</sup>',0,'The ⅓ survives the division.']]},
     {q:'Apply y(0) = 1:', o:[
      ['C = ⅔',1,'1 = ⅓ + C → C = ⅔.'],
      ['C = ⅓',0,'1 = ⅓ + C → C = ⅔.'],
      ['C = −⅔',0,'Subtract the ⅓: C = 1 − ⅓.']]}
    ],
    fact:'Fast decay (e⁻²ˣ) chasing slow growth (eˣ/3) — the transient dies and the growth wins.'},

  { eqHTML:'dy/dx + y = e<sup>2x</sup>', window:{xmin:-1.5,xmax:1.4,ymin:-1.8,ymax:3.2}, x0:0, y0:0, xT:1,
    f:(x,y)=>Math.exp(2*x)-y, sol:x=>(Math.exp(2*x)-Math.exp(-x))/3, solHTML:'y = (e<sup>2x</sup> − e<sup>−x</sup>)/3',
    steps:[
     {q:'Compute the integrating factor μ(x):', o:[
      ['μ = e<sup>x</sup>',1,'P(x) = 1 → μ = eˣ. The right side’s e²ˣ doesn’t matter here.'],
      ['μ = e<sup>2x</sup>',0,'P is the coefficient of y, not the right side.'],
      ['μ = e<sup>−x</sup>',0,'Standard form has +y, so P = +1.']]},
     {q:'Multiply through by eˣ. The left side collapses into:', o:[
      ['(e<sup>x</sup>y)′ = e<sup>3x</sup>',1,'eˣ · e²ˣ = e³ˣ.'],
      ['(e<sup>x</sup>y)′ = e<sup>2x</sup>',0,'Multiply the right side by eˣ too.'],
      ['(e<sup>x</sup>y)′ = 3e<sup>3x</sup>',0,'No extra 3.']]},
     {q:'Integrate both sides:', o:[
      ['e<sup>x</sup>y = e<sup>3x</sup>/3 + C',1,'∫e³ˣ dx = e³ˣ/3.'],
      ['e<sup>x</sup>y = e<sup>3x</sup> + C',0,'Missing the ⅓.'],
      ['e<sup>x</sup>y = e<sup>2x</sup>/2 + C',0,'The right side became e³ˣ, not e²ˣ.']]},
     {q:'Solve for y:', o:[
      ['y = e<sup>2x</sup>/3 + C·e<sup>−x</sup>',1,'Divide through by eˣ.'],
      ['y = e<sup>3x</sup>/3 + C',0,'Every term gets divided by eˣ.'],
      ['y = e<sup>2x</sup> + C·e<sup>−x</sup>',0,'The ⅓ survives.']]},
     {q:'Apply y(0) = 0:', o:[
      ['C = −⅓',1,'0 = ⅓ + C → C = −⅓.'],
      ['C = ⅓',0,'0 = ⅓ + C → C = −⅓.'],
      ['C = 0',0,'Substitute x = 0: the left is ⅓.']]}
    ],
    fact:'Starting from rest at zero, the e²ˣ forcing takes over — the solution climbs away.'}
  ]},

{ id:9, ch:3, name:'The Ramp Run',
  diag:{correct:['linear'],
    why:'Rewrite in standard linear form. The lone x blocks separation; y appears linearly. Integrating factor time.'},
  exercises:[
  { eqHTML:'dy/dx = x − y', window:{xmin:-1,xmax:3,ymin:-2,ymax:2.6}, x0:0, y0:0, xT:2,
    f:(x,y)=>x-y, sol:x=>x-1+Math.exp(-x), solHTML:'y = x − 1 + e<sup>−x</sup>',
    steps:[
     {q:'Rewrite in standard linear form:', o:[
      ['y′ + y = x',1,'Move the −y across as +y.'],
      ['y′ − y = x',0,'y′ = x − y → y′ + y = x. Signs!'],
      ['y′ + x = y',0,'Group the y-terms on the LEFT with y′.']]},
     {q:'Integrating factor:', o:[
      ['μ = e<sup>x</sup>',1,'P(x) = 1 → μ = eˣ.'],
      ['μ = e<sup>−x</sup>',0,'Standard form has +y, so P = +1.'],
      ['μ = e<sup>x²/2</sup>',0,'P is 1, not x.']]},
     {q:'After multiplying by eˣ, the equation reads:', o:[
      ['(e<sup>x</sup>y)′ = x·e<sup>x</sup>',1,'Perfect derivative on the left — ready to integrate.'],
      ['(e<sup>x</sup>y)′ = e<sup>x</sup>',0,'The right side is x·eˣ.'],
      ['(e<sup>x</sup>y)′ = x',0,'The eˣ multiplies the whole right side.']]},
     {q:'Integrate by parts (∫x eˣ dx):', o:[
      ['e<sup>x</sup>y = (x − 1)e<sup>x</sup> + C',1,'Parts with u = x, dv = eˣdx gives (x−1)eˣ.'],
      ['e<sup>x</sup>y = x²e<sup>x</sup>/2 + C',0,'eˣ doesn’t integrate like a power of x.'],
      ['e<sup>x</sup>y = x·e<sup>x</sup> + C',0,'By parts: the antiderivative is (x−1)eˣ.']]},
     {q:'Apply y(0) = 0:', o:[
      ['C = 1',1,'0 = (0−1) + C → C = 1. So y = x − 1 + e⁻ˣ.'],
      ['C = −1',0,'0 = −1 + C → C = +1.'],
      ['C = 0',0,'Plug x = 0 into (x−1)eˣ: you get −1.']]}
    ],
    fact:'The solution chases the line y = x − 1 forever, closing the gap by exactly e⁻ˣ each step.'},

  { eqHTML:'dy/dx = 2x − y', window:{xmin:-1,xmax:3,ymin:-2.5,ymax:3.2}, x0:0, y0:0, xT:2,
    f:(x,y)=>2*x-y, sol:x=>2*x-2+2*Math.exp(-x), solHTML:'y = 2x − 2 + 2e<sup>−x</sup>',
    steps:[
     {q:'Rewrite in standard linear form:', o:[
      ['y′ + y = 2x',1,'Move the −y across as +y.'],
      ['y′ − y = 2x',0,'y′ = 2x − y → y′ + y = 2x.'],
      ['y′ + 2x = y',0,'Group the y-terms on the LEFT.']]},
     {q:'Integrating factor:', o:[
      ['μ = e<sup>x</sup>',1,'P(x) = 1 → μ = eˣ.'],
      ['μ = e<sup>2x</sup>',0,'P is the coefficient of y, not the 2x.'],
      ['μ = e<sup>−x</sup>',0,'Standard form has +y.']]},
     {q:'After multiplying by eˣ, the equation reads:', o:[
      ['(e<sup>x</sup>y)′ = 2x·e<sup>x</sup>',1,'The eˣ multiplies the whole right side.'],
      ['(e<sup>x</sup>y)′ = 2x',0,'Don’t drop the eˣ.'],
      ['(e<sup>x</sup>y)′ = e<sup>x</sup>',0,'The right side is 2x·eˣ.']]},
     {q:'Integrate by parts (∫2x eˣ dx):', o:[
      ['e<sup>x</sup>y = 2(x − 1)e<sup>x</sup> + C',1,'u = 2x: ∫2x eˣ dx = 2(x−1)eˣ.'],
      ['e<sup>x</sup>y = x²e<sup>x</sup> + C',0,'eˣ doesn’t integrate like a power.'],
      ['e<sup>x</sup>y = 2x·e<sup>x</sup> + C',0,'By parts gives 2(x−1)eˣ.']]},
     {q:'Apply y(0) = 0:', o:[
      ['C = 2',1,'0 = 2(−1) + C → C = 2.'],
      ['C = −2',0,'0 = −2 + C → C = +2.'],
      ['C = 0',0,'Plug x = 0: you get −2.']]}
    ],
    fact:'The gap to the ramp y = 2x − 2 closes at exactly 2e⁻ˣ.'},

  { eqHTML:'dy/dx = x − y', window:{xmin:-0.5,xmax:3,ymin:-1.5,ymax:4}, x0:0, y0:2, xT:2,
    f:(x,y)=>x-y, sol:x=>x-1+3*Math.exp(-x), solHTML:'y = x − 1 + 3e<sup>−x</sup>',
    steps:[
     {q:'Rewrite in standard linear form:', o:[
      ['y′ + y = x',1,'Move the −y across as +y.'],
      ['y′ − y = x',0,'Signs: it becomes +y on the left.'],
      ['y′ + x = y',0,'Group the y-terms on the LEFT.']]},
     {q:'Integrating factor:', o:[
      ['μ = e<sup>x</sup>',1,'P(x) = 1 → μ = eˣ.'],
      ['μ = e<sup>−x</sup>',0,'Standard form has +y.'],
      ['μ = e<sup>x/2</sup>',0,'P is 1.']]},
     {q:'After multiplying by eˣ, the equation reads:', o:[
      ['(e<sup>x</sup>y)′ = x·e<sup>x</sup>',1,'Same left side as before.'],
      ['(e<sup>x</sup>y)′ = x',0,'Keep the eˣ.'],
      ['(e<sup>x</sup>y)′ = 2e<sup>x</sup>',0,'The right side is x·eˣ.']]},
     {q:'Integrate by parts (∫x eˣ dx):', o:[
      ['e<sup>x</sup>y = (x − 1)e<sup>x</sup> + C',1,'Same antiderivative as before.'],
      ['e<sup>x</sup>y = x·e<sup>x</sup> + C',0,'By parts gives (x−1)eˣ.'],
      ['e<sup>x</sup>y = x²/2·e<sup>x</sup> + C',0,'eˣ doesn’t integrate like a power.']]},
     {q:'Apply y(0) = 2:', o:[
      ['C = 3',1,'2 = (0−1) + C → C = 3.'],
      ['C = −3',0,'2 = −1 + C → C = 3.'],
      ['C = 1',0,'Subtract: C = 2 + 1.']]}
    ],
    fact:'Same field as before, different launch: only C changed — the ramp is destiny.'},

  { eqHTML:'dy/dx = 1 − x + y', window:{xmin:-1.2,xmax:1.1,ymin:-1,ymax:7}, x0:0, y0:2, xT:0.8,
    f:(x,y)=>1-x+y, sol:x=>x+2*Math.exp(x), solHTML:'y = x + 2e<sup>x</sup>',
    steps:[
     {q:'Rewrite in standard linear form:', o:[
      ['y′ − y = 1 − x',1,'Move the +y across as −y.'],
      ['y′ + y = 1 − x',0,'The y crosses with a sign flip: −y.'],
      ['y′ + x = 1 + y',0,'Group the y-terms on the LEFT.']]},
     {q:'Integrating factor:', o:[
      ['μ = e<sup>−x</sup>',1,'P(x) = −1 → μ = e⁻ˣ. A NEGATIVE exponent this time!'],
      ['μ = e<sup>x</sup>',0,'Standard form has −y, so P = −1.'],
      ['μ = e<sup>x²/2</sup>',0,'P is −1, not x.']]},
     {q:'After multiplying by e⁻ˣ, the equation reads:', o:[
      ['(e<sup>−x</sup>y)′ = (1 − x)e<sup>−x</sup>',1,'The e⁻ˣ multiplies the whole right side.'],
      ['(e<sup>−x</sup>y)′ = e<sup>−x</sup>',0,'Don’t drop the (1 − x).'],
      ['(e<sup>x</sup>y)′ = (1 − x)e<sup>−x</sup>',0,'We multiplied by e⁻ˣ.']]},
     {q:'Integrate (∫(1 − x)e⁻ˣ dx):', o:[
      ['e<sup>−x</sup>y = x·e<sup>−x</sup> + C',1,'Check by differentiating: (x·e⁻ˣ)′ = (1 − x)e⁻ˣ. ✓'],
      ['e<sup>−x</sup>y = (1 − x)e<sup>−x</sup> + C',0,'Differentiate it: you get −(2 − x)e⁻ˣ.'],
      ['e<sup>−x</sup>y = x²/2·e<sup>−x</sup> + C',0,'By parts gives x·e⁻ˣ.']]},
     {q:'Apply y(0) = 2:', o:[
      ['C = 2',1,'2 = 0 + C. So y = x + 2eˣ.'],
      ['C = −2',0,'2 = 0 + C → C = 2.'],
      ['C = 0',0,'Plug x = 0: the left is 0.']]}
    ],
    fact:'A runaway ramp: the eˣ term wins and the solution escapes upward — the unstable cousin.'}
  ]},

{ id:13, ch:3, name:'The Variable Factor',
  diag:{correct:['linear'],
    why:'The lone x blocks separation, but y appears only to first power — linear. The integrating factor won’t be a plain exponential this time.'},
  exercises:[
  { eqHTML:'dy/dx + y/x = x', window:{xmin:0.7,xmax:2.5,ymin:0,ymax:2.4}, x0:1, y0:1, xT:2,
    f:(x,y)=>x-y/x, sol:x=>x*x/3+2/(3*x), solHTML:'y = x²/3 + 2/(3x)',
    steps:[
     {q:'Read off P(x) — the coefficient of y in standard form:', o:[
      ['P(x) = 1/x',1,'The y-term is (1/x)·y.'],
      ['P(x) = x',0,'P multiplies y — the right side doesn’t count.'],
      ['P(x) = 1',0,'The coefficient of y is 1/x.']]},
     {q:'Integrating factor μ = e^∫P dx:', o:[
      ['μ = x',1,'e^(ln x) = x — a first non-exponential factor!'],
      ['μ = e<sup>x</sup>',0,'∫(1/x) dx = ln x, not x.'],
      ['μ = 1/x',0,'Exponentiate the integral: e^(ln x) = x.']]},
     {q:'Multiply through by x. The left side collapses into:', o:[
      ['(xy)′ = x²',1,'x·y′ + y = (xy)′ — the product rule at work.'],
      ['(xy)′ = x',0,'x·x = x² on the right.'],
      ['(x/y)′ = x²',0,'We multiplied by x, not divided.']]},
     {q:'Integrate:', o:[
      ['xy = x³/3 + C',1,'∫x² dx = x³/3.'],
      ['xy = x² + C',0,'Power rule: ∫x² dx = x³/3.'],
      ['xy = 3x² + C',0,'It’s x³/3.']]},
     {q:'Apply y(1) = 1:', o:[
      ['C = 2/3',1,'1·1 = 1/3 + C → C = 2/3.'],
      ['C = 1/3',0,'1 = 1/3 + C → C = 2/3.'],
      ['C = 2',0,'Subtract 1/3: C = 1 − 1/3.']]},
     {q:'Solve for y:', o:[
      ['y = x²/3 + 2/(3x)',1,'Divide EVERY term by x.'],
      ['y = x²/3 + 2/3',0,'The C-term also gets divided by x.'],
      ['y = x³/3 + 2/3',0,'Divide by x, don’t just drop it.']]}
    ],
    fact:'P(x) = 1/x gives μ = x — integrating factors don’t have to be exponentials of straight lines.'},

  { eqHTML:'dy/dx − y/x = x', window:{xmin:0.5,xmax:1.8,ymin:0,ymax:5}, x0:1, y0:2, xT:1.5,
    f:(x,y)=>x+y/x, sol:x=>x*x+x, solHTML:'y = x² + x',
    steps:[
     {q:'Read off P(x) — mind the sign:', o:[
      ['P(x) = −1/x',1,'The equation is y′ − (1/x)y = x.'],
      ['P(x) = 1/x',0,'The y-term crosses with a MINUS.'],
      ['P(x) = x',0,'P multiplies y, not the right side.']]},
     {q:'Integrating factor μ = e^∫(−1/x) dx:', o:[
      ['μ = 1/x',1,'e^(−ln x) = 1/x — the reciprocal factor!'],
      ['μ = x',0,'That’s for P = +1/x. Here P = −1/x.'],
      ['μ = e<sup>−x</sup>',0,'∫(−1/x) dx = −ln x.']]},
     {q:'Multiply through by 1/x. The left side collapses into:', o:[
      ['(y/x)′ = 1',1,'(1/x)·y′ − y/x² = (y/x)′ — and the right side x·(1/x) = 1.'],
      ['(y/x)′ = x',0,'The right side also gets multiplied by 1/x.'],
      ['(xy)′ = 1',0,'We multiplied by 1/x, not x.']]},
     {q:'Integrate and apply y(1) = 2:', o:[
      ['y/x = x + C, and C = 1',1,'2/1 = 1 + C → C = 1.'],
      ['y/x = x + C, and C = 2',0,'2 = 1 + C → C = 1.'],
      ['y/x = x² + C',0,'∫1 dx = x.']]},
     {q:'Solve for y:', o:[
      ['y = x² + x',1,'Multiply through by x.'],
      ['y = x + 1',0,'Multiply the WHOLE right side by x.'],
      ['y = x² + 1',0,'C = 1 multiplies x too: +x.']]}
    ],
    fact:'Same field family, flipped sign: μ = 1/x instead of x — and the solution is a clean parabola.'},

  { eqHTML:'dy/dx + 2y/x = 1', window:{xmin:0.7,xmax:2.2,ymin:0,ymax:1.4}, x0:1, y0:1, xT:2,
    f:(x,y)=>1-2*y/x, sol:x=>x/3+2/(3*x*x), solHTML:'y = x/3 + 2/(3x²)',
    steps:[
     {q:'Integrating factor μ = e^∫(2/x) dx:', o:[
      ['μ = x²',1,'e^(2 ln x) = x².'],
      ['μ = 2x',0,'Exponentiate: e^(2 ln x) = x².'],
      ['μ = x',0,'That’s for P = 1/x — here P = 2/x.']]},
     {q:'Multiply through by x². The left side collapses into:', o:[
      ['(x²y)′ = x²',1,'x²y′ + 2xy = (x²y)′ ✓.'],
      ['(x²y)′ = 1',0,'The right side also gets multiplied by x².'],
      ['(x²y)′ = 2x²',0,'No extra 2.']]},
     {q:'Integrate:', o:[
      ['x²y = x³/3 + C',1,'∫x² dx = x³/3.'],
      ['x²y = x² + C',0,'Power rule.'],
      ['x²y = 3x³ + C',0,'It’s x³/3.']]},
     {q:'Apply y(1) = 1:', o:[
      ['C = 2/3',1,'1 = 1/3 + C → C = 2/3.'],
      ['C = 1/3',0,'1 = 1/3 + C → C = 2/3.'],
      ['C = 2',0,'Subtract the 1/3.']]},
     {q:'Solve for y:', o:[
      ['y = x/3 + 2/(3x²)',1,'Divide every term by x².'],
      ['y = x/3 + 2/3',0,'The C-term gets divided by x².'],
      ['y = x³/3 + 2/(3x²)',0,'The first term is x³/3 ÷ x² = x/3.']]}
    ],
    fact:'μ = x² tames the equation: every solution y = x/3 + C/x² straightens onto the line y = x/3 as the C/x² transient fades.'}
  ]},

/* ===== CHAPTER 4 · BOSS FIELDS ===== */

{ id:10, ch:4, name:'The Gaussian Gate',
  diag:{correct:['separable','linear'],
    why:'Separable (x and y split) and also linear (y′ − xy = 0). Separation is fastest.'},
  exercises:[
  { eqHTML:'dy/dx = x·y', window:{xmin:-2,xmax:2,ymin:-1,ymax:4}, x0:0, y0:1, xT:1.5,
    f:(x,y)=>x*y, sol:x=>Math.exp(x*x/2), solHTML:'y = e<sup>x²/2</sup>',
    steps:[
     {q:'Separate:', o:[
      ['dy/y = x dx',1,'The x joins dx on the right.'],
      ['dy/y = dx',0,'The x belongs on the right with dx.'],
      ['x dy = y dx',0,'Divide by y — the x stays put.']]},
     {q:'Integrate — watch the power:', o:[
      ['ln|y| = x²/2 + C',1,'∫x dx = x²/2. Forgetting the ½ is THE classic trap.'],
      ['ln|y| = x² + C',0,'∫x dx = x²/2 — the ½ matters.'],
      ['ln|y| = x + C',0,'The right side is x dx, not dx.']]},
     {q:'Exponentiate:', o:[
      ['y = C·e<sup>x²/2</sup>',1,'The ½ lives inside the exponent.'],
      ['y = C·e<sup>x²</sup>',0,'The ½ survives the exponentiation.'],
      ['y = C + x²/2',0,'Exponentiate — the log disappears entirely.']]},
     {q:'Apply y(0) = 1:', o:[
      ['C = 1',1,'1 = C·e⁰. So y = e^(x²/2).'],
      ['C = ½',0,'1 = C·e⁰ = C.'],
      ['C = 0',0,'Then the curve would be flat zero.']]},
     {q:'Compared to plain eˣ, this solution grows…', o:[
      ['Faster — super-exponential. e^(x²/2) leaves eˣ in the dust.',1,'The exponent itself grew — a whole new league of fast.'],
      ['Slower — the ½ dampens it',0,'The ½ sits inside the exponent of a square.'],
      ['At the same rate',0,'x²/2 overtakes x for x > 2.']]}
    ],
    fact:'e^(x²/2) is the bell curve’s cousin — its logarithm is a parabola. The field steepens as you climb.'},

  { eqHTML:'dy/dx = x·y', window:{xmin:-2,xmax:2,ymin:-1,ymax:7.5}, x0:0, y0:2, xT:1.5,
    f:(x,y)=>x*y, sol:x=>2*Math.exp(x*x/2), solHTML:'y = 2e<sup>x²/2</sup>',
    steps:[
     {q:'Separate:', o:[
      ['dy/y = x dx',1,'Same split — the starting height changes nothing here.'],
      ['dy/y = dx',0,'The x belongs on the right.'],
      ['x dy = y dx',0,'Divide by y.']]},
     {q:'Integrate:', o:[
      ['ln|y| = x²/2 + C',1,'The ½ from the power rule is the trap.'],
      ['ln|y| = x² + C',0,'∫x dx = x²/2.'],
      ['ln|y| = 2x + C',0,'The right side is x dx.']]},
     {q:'Exponentiate:', o:[
      ['y = C·e<sup>x²/2</sup>',1,'The ½ lives inside.'],
      ['y = C·e<sup>x²</sup>',0,'Keep the ½.'],
      ['y = 2C·e<sup>x²/2</sup>',0,'The 2 is decided by the IC, not here.']]},
     {q:'Apply y(0) = 2:', o:[
      ['C = 2',1,'2 = C·e⁰.'],
      ['C = 1',0,'2 = C·e⁰ = C.'],
      ['C = 4',0,'C copies the value.']]},
     {q:'Compared to 2eˣ, this solution grows…', o:[
      ['Faster — super-exponential.',1,'x²/2 eventually beats any multiple of x.'],
      ['Slower',0,'The square in the exponent wins long-term.'],
      ['At the same rate',0,'Compare exponents: x²/2 vs x.']]}
    ],
    fact:'Double the start, double the curve: 2e^(x²/2) is just a stretched Gaussian-gate.'},

  { eqHTML:'dy/dx = 2x·y', window:{xmin:-1.6,xmax:1.6,ymin:-1,ymax:5.2}, x0:0, y0:1, xT:1.2,
    f:(x,y)=>2*x*y, sol:x=>Math.exp(x*x), solHTML:'y = e<sup>x²</sup>',
    steps:[
     {q:'Separate:', o:[
      ['dy/y = 2x dx',1,'The whole 2x joins dx.'],
      ['dy/y = x dx',0,'The right side is 2x.'],
      ['2x dy = y dx',0,'Divide by y.']]},
     {q:'Integrate:', o:[
      ['ln|y| = x² + C',1,'∫2x dx = x² — the 2 cancels the power-rule ½.'],
      ['ln|y| = x²/2 + C',0,'That’s ∫x dx — we have 2x here.'],
      ['ln|y| = 2x + C',0,'The right side is 2x dx.']]},
     {q:'Exponentiate:', o:[
      ['y = C·e<sup>x²</sup>',1,'No ½ this time — it cancelled.'],
      ['y = C·e<sup>x²/2</sup>',0,'The 2 cancelled the ½.'],
      ['y = C·2x',0,'Exponentiate — the log vanishes.']]},
     {q:'Apply y(0) = 1:', o:[
      ['C = 1',1,'1 = C·e⁰.'],
      ['C = 2',0,'1 = C·e⁰ = C.'],
      ['C = ½',0,'C copies the value.']]},
     {q:'Compared to e^(x²/2), this solution grows…', o:[
      ['Faster — e^(x²) outpaces e^(x²/2).',1,'Bigger exponent, faster growth.'],
      ['Slower',0,'x² > x²/2 for x ≠ 0.'],
      ['The same',0,'The exponents differ.']]}
    ],
    fact:'e^(x²): the bell curve’s cousin with the volume turned up.'},

  { eqHTML:'dy/dx = x·y', window:{xmin:-2,xmax:2,ymin:-0.8,ymax:2.2}, x0:0, y0:0.5, xT:1.5,
    f:(x,y)=>x*y, sol:x=>0.5*Math.exp(x*x/2), solHTML:'y = ½e<sup>x²/2</sup>',
    steps:[
     {q:'Separate:', o:[
      ['dy/y = x dx',1,'Fractions split like integers.'],
      ['dy/y = dx',0,'The x belongs on the right.'],
      ['x dy = y dx',0,'Divide by y.']]},
     {q:'Integrate:', o:[
      ['ln|y| = x²/2 + C',1,'The ½ is the trap.'],
      ['ln|y| = x² + C',0,'∫x dx = x²/2.'],
      ['ln|y| = x/2 + C',0,'The right side is x dx.']]},
     {q:'Exponentiate:', o:[
      ['y = C·e<sup>x²/2</sup>',1,'The ½ lives inside.'],
      ['y = C·e<sup>x²</sup>',0,'Keep the ½.'],
      ['y = C + x²/2',0,'Exponentiate — the log disappears.']]},
     {q:'Apply y(0) = ½:', o:[
      ['C = ½',1,'½ = C·e⁰.'],
      ['C = 2',0,'½ = C·e⁰ — C copies the value.'],
      ['C = 1',0,'C equals y(0), which is ½.']]},
     {q:'Compared to e^(x²/2), this solution grows…', o:[
      ['At the same rate — just half as tall.',1,'The constant only scales; the exponent sets the pace.'],
      ['Half as fast',0,'The rate lives in the exponent, which is unchanged.'],
      ['Twice as fast',0,'Scaling doesn’t change the growth rate.']]}
    ],
    fact:'Half-height start: same super-exponential character, humbler scale.'},

  { eqHTML:'dy/dx = e<sup>x</sup>·y', window:{xmin:-1.5,xmax:1.3,ymin:-0.5,ymax:6}, x0:0, y0:1, xT:1,
    f:(x,y)=>Math.exp(x)*y, sol:x=>Math.exp(Math.exp(x)-1), solHTML:'y = e<sup>(eˣ − 1)</sup>',
    steps:[
     {q:'Separate:', o:[
      ['dy/y = e<sup>x</sup> dx',1,'The eˣ travels with dx.'],
      ['dy/y = dx',0,'The eˣ belongs on the right.'],
      ['e<sup>x</sup> dy = y dx',0,'Divide by y — eˣ stays right.']]},
     {q:'Integrate:', o:[
      ['ln|y| = e<sup>x</sup> + C',1,'∫eˣ dx = eˣ — the exponential is its own antiderivative.'],
      ['ln|y| = e<sup>x</sup>·x + C',0,'No product rule — just eˣ.'],
      ['ln|y| = x·e<sup>x</sup> + C',0,'∫eˣ dx = eˣ, plain and simple.']]},
     {q:'Exponentiate:', o:[
      ['y = C·e<sup>(eˣ)</sup>',1,'An exponential OF an exponential!'],
      ['y = C·e<sup>x</sup>',0,'The eˣ stays in the exponent — don’t simplify it away.'],
      ['y = e<sup>x</sup> + C',0,'After exponentiating, +C becomes ×C.']]},
     {q:'Apply y(0) = 1:', o:[
      ['C = 1/e',1,'1 = C·e^(e⁰) = C·e → C = 1/e. So y = e^(eˣ−1).'],
      ['C = 1',0,'e^(e⁰) = e¹ = e — not 1!'],
      ['C = e',0,'1 = C·e → C = 1/e.']]},
     {q:'Compared to e^(x²/2), this solution grows…', o:[
      ['Faster — eˣ beats x²/2 eventually.',1,'The exponential-of-exponential is the final boss of growth.'],
      ['Slower',0,'eˣ overtakes every polynomial — including x²/2.'],
      ['The same',0,'Compare the exponents: eˣ vs x²/2.']]}
    ],
    fact:'A double exponential: e^(eˣ−1) starts politely at 1, passes 140 before x = 1.8, and is past 100 million by x = 3.'}
  ]},

{ id:11, ch:4, name:'The Tidal Reach',
  diag:{correct:['separable','linear'],
    why:'The trig factor multiplies y, so the variables split (separable); y′ − (trig)y = 0 is also linear. Separate!'},
  exercises:[
  { eqHTML:'dy/dx = sin(x)·y', window:{xmin:-1,xmax:3.5,ymin:-1,ymax:5}, x0:0, y0:1, xT:2,
    f:(x,y)=>Math.sin(x)*y, sol:x=>Math.exp(1-Math.cos(x)), solHTML:'y = e<sup>1 − cos x</sup>',
    steps:[
     {q:'Separate:', o:[
      ['dy/y = sin x dx',1,'The sin x travels with dx.'],
      ['dy/y = cos x dx',0,'The right side is sin x, not cos x.'],
      ['sin x dy = y dx',0,'Divide by y — sin x stays right.']]},
     {q:'Integrate:', o:[
      ['ln|y| = −cos x + C',1,'∫sin x dx = −cos x. That minus is easy to drop!'],
      ['ln|y| = cos x + C',0,'∫sin x dx = −cos x.'],
      ['ln|y| = sin x + C',0,'That’s the derivative of sin, not the antiderivative.']]},
     {q:'Exponentiate:', o:[
      ['y = C·e<sup>−cos x</sup>',1,'The cosine rides in the exponent.'],
      ['y = C·cos x',0,'Exponentiating kills the log, not the cosine.'],
      ['y = C·e<sup>cos x</sup>',0,'The minus stays.']]},
     {q:'Apply y(0) = 1 — careful, cos 0 = 1:', o:[
      ['C = e',1,'1 = C·e⁻¹ → C = e. So y = e^(1 − cos x). Sneaky!'],
      ['C = 1',0,'cos 0 = 1, not 0 — so e^(−cos 0) = e⁻¹.'],
      ['C = 1/e',0,'Invert carefully: C = 1/e⁻¹ = e.']]},
     {q:'Where does y peak on [0, 2π]?', o:[
      ['x = π, where y = e² ≈ 7.4',1,'cos π = −1 → exponent 1 − (−1) = 2.'],
      ['x = π/2',0,'cos(π/2) = 0 → y = e, not the peak.'],
      ['x = 2π',0,'cos 2π = 1 → y = 1, back to the start.']]}
    ],
    fact:'The solution breathes with the sine wave — growing on every sin x > 0 stretch, pausing at each zero crossing.'},

  { eqHTML:'dy/dx = cos(x)·y', window:{xmin:-1,xmax:2.6,ymin:-1,ymax:3.5}, x0:0, y0:1, xT:Math.PI/2,
    f:(x,y)=>Math.cos(x)*y, sol:x=>Math.exp(Math.sin(x)), solHTML:'y = e<sup>sin x</sup>',
    steps:[
     {q:'Separate:', o:[
      ['dy/y = cos x dx',1,'The cos x travels with dx.'],
      ['dy/y = sin x dx',0,'The right side is cos x.'],
      ['cos x dy = y dx',0,'Divide by y.']]},
     {q:'Integrate:', o:[
      ['ln|y| = sin x + C',1,'∫cos x dx = sin x.'],
      ['ln|y| = −sin x + C',0,'That’s ∫−cos x dx.'],
      ['ln|y| = −cos x + C',0,'That’s ∫sin x dx — we have cos x here.']]},
     {q:'Exponentiate:', o:[
      ['y = C·e<sup>sin x</sup>',1,'The sine rides in the exponent.'],
      ['y = C·sin x',0,'Exponentiating kills the log, not the sine.'],
      ['y = C·e<sup>cos x</sup>',0,'The antiderivative was sin x.']]},
     {q:'Apply y(0) = 1:', o:[
      ['C = 1',1,'1 = C·e^(sin 0) = C·e⁰ = C. No sneaky e this time!'],
      ['C = e',0,'sin 0 = 0 — the exponent vanishes, so C = 1.'],
      ['C = 0',0,'Then y ≡ 0.']]},
     {q:'Where does y peak on [0, 2π]?', o:[
      ['x = π/2, where y = e',1,'sin(π/2) = 1 → exponent 1.'],
      ['x = π',0,'sin π = 0 → y = 1.'],
      ['x = 2π',0,'sin 2π = 0 → y = 1.']]}
    ],
    fact:'cos x drives the tide: growth until π/2, a pause at the crest, then decay — a breathing exponent.'},

  { eqHTML:'dy/dx = sin(x)·y', window:{xmin:-1,xmax:3.5,ymin:-1,ymax:10}, x0:0, y0:2, xT:2,
    f:(x,y)=>Math.sin(x)*y, sol:x=>2*Math.exp(1-Math.cos(x)), solHTML:'y = 2e<sup>1 − cos x</sup>',
    steps:[
     {q:'Separate:', o:[
      ['dy/y = sin x dx',1,'Same split — the 2 changes nothing here.'],
      ['dy/y = cos x dx',0,'The right side is sin x.'],
      ['sin x dy = y dx',0,'Divide by y.']]},
     {q:'Integrate:', o:[
      ['ln|y| = −cos x + C',1,'The minus is the trap.'],
      ['ln|y| = cos x + C',0,'∫sin x dx = −cos x.'],
      ['ln|y| = sin x + C',0,'That’s the derivative.']]},
     {q:'Exponentiate:', o:[
      ['y = C·e<sup>−cos x</sup>',1,'Cosine in the exponent.'],
      ['y = C·cos x',0,'The log dies, not the cosine.'],
      ['y = 2C·e<sup>−cos x</sup>',0,'The 2 is decided by the IC, not here.']]},
     {q:'Apply y(0) = 2:', o:[
      ['C = 2e',1,'2 = C·e⁻¹ → C = 2e. Sneaky!'],
      ['C = 2',0,'cos 0 = 1, so e^(−cos 0) = e⁻¹.'],
      ['C = 2/e',0,'Invert carefully: C = 2/e⁻¹ = 2e.']]},
     {q:'Where does y peak on [0, 2π]?', o:[
      ['x = π, where y = 2e² ≈ 14.8',1,'cos π = −1 → exponent 2.'],
      ['x = π/2',0,'cos(π/2) = 0 → y = 2e.'],
      ['x = 2π',0,'Back to the start: y = 2.']]}
    ],
    fact:'Double amplitude, same rhythm: the tide lifts the whole curve to 2e² ≈ 14.8 at its crest.'},

  { eqHTML:'dy/dx = 2cos(x)·y', window:{xmin:-1,xmax:2.6,ymin:-1,ymax:8.5}, x0:0, y0:1, xT:Math.PI/2,
    f:(x,y)=>2*Math.cos(x)*y, sol:x=>Math.exp(2*Math.sin(x)), solHTML:'y = e<sup>2 sin x</sup>',
    steps:[
     {q:'Separate:', o:[
      ['dy/y = 2cos x dx',1,'The whole 2cos x travels with dx.'],
      ['dy/y = cos x dx',0,'The right side is 2cos x.'],
      ['dy/y = 2 sin x dx',0,'That’s the derivative, not the factor.']]},
     {q:'Integrate:', o:[
      ['ln|y| = 2 sin x + C',1,'∫2cos x dx = 2 sin x.'],
      ['ln|y| = sin x + C',0,'Don’t drop the 2.'],
      ['ln|y| = −2cos x + C',0,'That’s ∫2 sin x dx.']]},
     {q:'Exponentiate:', o:[
      ['y = C·e<sup>2 sin x</sup>',1,'Twice the swing in the exponent.'],
      ['y = 2C·e<sup>sin x</sup>',0,'The 2 goes inside the exponent.'],
      ['y = C·e<sup>sin x</sup>',0,'Keep the 2 in the exponent.']]},
     {q:'Apply y(0) = 1:', o:[
      ['C = 1',1,'1 = C·e⁰.'],
      ['C = 2',0,'1 = C·e⁰ = C.'],
      ['C = e',0,'sin 0 = 0 — no sneaky e here.']]},
     {q:'Where does y peak on [0, 2π]?', o:[
      ['x = π/2, where y = e² ≈ 7.4',1,'sin(π/2) = 1 → exponent 2.'],
      ['x = π',0,'sin π = 0 → y = 1.'],
      ['x = π/4',0,'sin(π/4) ≈ 0.71 → y = e^1.41, not the peak.']]}
    ],
    fact:'A stronger tide: the exponent swings twice as far, cresting at e².'}
  ]},

{ id:12, ch:4, name:'The Logistic Throne',
  diag:{correct:['separable','autonomous','substitution'],
    why:'The famous logistic family: autonomous, separable (partial fractions) — and secretly Bernoulli too. The final boss.'},
  exercises:[
  { eqHTML:'dy/dx = y(1 − y)', window:{xmin:-3,xmax:4,ymin:-0.6,ymax:1.6}, x0:0, y0:0.5, xT:3,
    f:(x,y)=>y*(1-y), sol:x=>1/(1+Math.exp(-x)), solHTML:'y = 1/(1 + e<sup>−x</sup>)',
    steps:[
     {q:'Separate — the product must split first:', o:[
      ['dy / (y(1 − y)) = dx',1,'Both factors slide under the dy.'],
      ['dy/y = (1 − y) dx',0,'The (1 − y) must divide the LEFT side.'],
      ['dy/(1 − y) = y dx',0,'Both y and (1 − y) go underneath.']]},
     {q:'Partial fractions: 1/(y(1 − y)) = …', o:[
      ['1/y + 1/(1 − y)',1,'Check by recombining: ((1−y) + y)/(y(1−y)) = 1/(y(1−y)). ✓'],
      ['1/y − 1/(1 − y)',0,'Recombine: (1 − y − y)/(y(1−y)) — doesn’t rebuild 1.'],
      ['1/(y + 1)',0,'That’s a different denominator entirely.']]},
     {q:'Integrate:', o:[
      ['ln|y| − ln|1 − y| = x + C',1,'1/y → ln|y|; 1/(1−y) → −ln|1−y| (chain-rule minus).'],
      ['ln|y| + ln|1 − y| = x + C',0,'∫1/(1−y) dy = −ln|1 − y|.'],
      ['ln|y/(1 − y)| = ln C',0,'The right side integrates to x + C.']]},
     {q:'Exponentiate:', o:[
      ['y/(1 − y) = C·e<sup>x</sup>',1,'The log of a quotient becomes a quotient.'],
      ['y(1 − y) = C·e<sup>x</sup>',0,'Logs turn quotients INTO quotients, not products.'],
      ['y = C·e<sup>x</sup>(1 − C·e<sup>x</sup>)',0,'One step at a time — exponentiate first.']]},
     {q:'Rearrange for y (or spot the standard form):', o:[
      ['y = 1/(1 + C·e<sup>−x</sup>)',1,'The classic logistic S-curve!'],
      ['y = 1/(1 + C·e<sup>x</sup>)',0,'Forward-time growth needs e⁻ˣ in the denominator.'],
      ['y = C·e<sup>x</sup>/(1 − C·e<sup>x</sup>)',0,'Sign slip in the rearrangement.']]},
     {q:'Apply y(0) = ½, then find the carrying capacity:', o:[
      ['C = 1, and y → 1 as x → ∞',1,'½ = 1/(1+C) → C = 1. Then e⁻ˣ → 0, so y → 1. Crown secured! 👑'],
      ['C = 2, and y → 2',0,'½ = 1/(1+C) → C = 1; and the plateau is at y = 1.'],
      ['C = 1, and y → ∞',0,'e⁻ˣ vanishes, so y → 1/(1+0) = 1.']]}
    ],
    fact:'The logistic curve: slow start, explosive middle, graceful plateau. Populations, epidemics, rumours — and you just conquered it.'},

  { eqHTML:'dy/dx = y(1 − y)', window:{xmin:-3,xmax:4.5,ymin:-0.4,ymax:1.5}, x0:0, y0:0.25, xT:3,
    f:(x,y)=>y*(1-y), sol:x=>1/(1+3*Math.exp(-x)), solHTML:'y = 1/(1 + 3e<sup>−x</sup>)',
    steps:[
     {q:'Separate:', o:[
      ['dy / (y(1 − y)) = dx',1,'Both factors under the dy.'],
      ['dy/y = (1 − y) dx',0,'The (1 − y) divides the LEFT.'],
      ['dy/(1 − y) = y dx',0,'Both factors underneath.']]},
     {q:'Partial fractions:', o:[
      ['1/y + 1/(1 − y)',1,'Recombines to 1/(y(1−y)). ✓'],
      ['1/y − 1/(1 − y)',0,'Doesn’t rebuild the numerator 1.'],
      ['1/(y − 1)',0,'Different denominator.']]},
     {q:'Integrate:', o:[
      ['ln|y| − ln|1 − y| = x + C',1,'Chain-rule minus on the second log.'],
      ['ln|y| + ln|1 − y| = x + C',0,'The second term carries a minus.'],
      ['ln|y(1 − y)| = x + C',0,'It’s a difference of logs.']]},
     {q:'Exponentiate:', o:[
      ['y/(1 − y) = C·e<sup>x</sup>',1,'Quotient, not product.'],
      ['y(1 − y) = C·e<sup>x</sup>',0,'Logs turn quotients into quotients.'],
      ['y = C·e<sup>x</sup>',0,'Exponentiate the whole equation.']]},
     {q:'Rearrange for y:', o:[
      ['y = 1/(1 + C·e<sup>−x</sup>)',1,'The S-curve form.'],
      ['y = 1/(1 + C·e<sup>x</sup>)',0,'Growth forward needs e⁻ˣ.'],
      ['y = 1 − C·e<sup>−x</sup>',0,'That’s the equilibrium form from the linear chapter — the logistic rearranges into a quotient.']]},
     {q:'Apply y(0) = ¼, then the carrying capacity:', o:[
      ['C = 3, and y → 1',1,'¼ = 1/(1+C) → 1+C = 4 → C = 3.'],
      ['C = 4, and y → 1',0,'¼ = 1/(1+C) → C = 3.'],
      ['C = ¾, and y → ¾',0,'Invert both sides first: C = 3.']]}
    ],
    fact:'A slower start (¼): the S-curve takes longer to inflect, but the throne at y = 1 awaits.'},

  { eqHTML:'dy/dx = y(2 − y)', window:{xmin:-2.5,xmax:3.5,ymin:-0.5,ymax:2.6}, x0:0, y0:1, xT:2,
    f:(x,y)=>y*(2-y), sol:x=>2/(1+Math.exp(-2*x)), solHTML:'y = 2/(1 + e<sup>−2x</sup>)',
    steps:[
     {q:'Separate:', o:[
      ['dy / (y(2 − y)) = dx',1,'Both factors under the dy.'],
      ['dy/y = (2 − y) dx',0,'The (2 − y) divides the LEFT.'],
      ['dy/(2 − y) = y dx',0,'Both factors underneath.']]},
     {q:'Partial fractions: 1/(y(2 − y)) = …', o:[
      ['1/(2y) + 1/(2(2 − y))',1,'Check: (2−y+y)/(2y(2−y)) = 1/(y(2−y)). ✓'],
      ['1/y + 1/(2 − y)',0,'Recombines to 2/(y(2−y)) — off by a factor of 2.'],
      ['1/(y + 2)',0,'Different denominator.']]},
     {q:'Integrate:', o:[
      ['½ln|y| − ½ln|2 − y| = x + C',1,'The ½’s come from the partial fractions.'],
      ['½ln|y| + ½ln|2 − y| = x + C',0,'The second term carries a minus.'],
      ['ln|y| − ln|2 − y| = x + C',0,'Don’t drop the ½’s from the fractions.']]},
     {q:'Multiply by 2, then exponentiate:', o:[
      ['y/(2 − y) = C·e<sup>2x</sup>',1,'ln|y/(2−y)| = 2x + C → quotient = Ce²ˣ.'],
      ['y/(2 − y) = C·e<sup>x</sup>',0,'After multiplying by 2, the right side is 2x.'],
      ['y(2 − y) = C·e<sup>2x</sup>',0,'Quotient, not product.']]},
     {q:'Rearrange for y:', o:[
      ['y = 2/(1 + C·e<sup>−2x</sup>)',1,'Capacity 2, speed 2 — the S-curve form.'],
      ['y = 1/(1 + C·e<sup>−2x</sup>)',0,'Capacity is 2 here, not 1.'],
      ['y = 2/(1 + C·e<sup>2x</sup>)',0,'Growth forward needs the decaying exponential.']]},
     {q:'Apply y(0) = 1, then the carrying capacity:', o:[
      ['C = 1, and y → 2',1,'1 = 2/(1+C) → C = 1. The throne sits at y = 2.'],
      ['C = 2, and y → 2',0,'1 = 2/(1+C) → C = 1.'],
      ['C = 1, and y → 1',0,'The plateau matches the capacity: 2.']]}
    ],
    fact:'A taller kingdom: carrying capacity 2, and the approach runs at double speed (e⁻²ˣ).'},

  { eqHTML:'dy/dx = 2y(1 − y)', window:{xmin:-2.5,xmax:3,ymin:-0.4,ymax:1.5}, x0:0, y0:0.5, xT:2,
    f:(x,y)=>2*y*(1-y), sol:x=>1/(1+Math.exp(-2*x)), solHTML:'y = 1/(1 + e<sup>−2x</sup>)',
    steps:[
     {q:'Separate:', o:[
      ['dy / (y(1 − y)) = 2 dx',1,'The 2 must come across too.'],
      ['dy / (y(1 − y)) = dx',0,'Don’t drop the 2.'],
      ['dy/y = 2(1 − y) dx',0,'The product divides the LEFT.']]},
     {q:'Partial fractions:', o:[
      ['1/y + 1/(1 − y)',1,'Same split as the classic logistic.'],
      ['1/y − 1/(1 − y)',0,'Doesn’t rebuild 1.'],
      ['2/y + 2/(1 − y)',0,'The 2 stays on the right with dx.']]},
     {q:'Integrate:', o:[
      ['ln|y| − ln|1 − y| = 2x + C',1,'The right side integrates to 2x.'],
      ['ln|y| − ln|1 − y| = x + C',0,'The 2 doubles the right side.'],
      ['ln|y| + ln|1 − y| = 2x + C',0,'The second log carries a minus.']]},
     {q:'Exponentiate:', o:[
      ['y/(1 − y) = C·e<sup>2x</sup>',1,'Quotient equals Ce²ˣ.'],
      ['y/(1 − y) = C·e<sup>x</sup>',0,'The right side was 2x.'],
      ['y(1 − y) = C·e<sup>2x</sup>',0,'Quotient, not product.']]},
     {q:'Rearrange for y:', o:[
      ['y = 1/(1 + C·e<sup>−2x</sup>)',1,'Same capacity, steeper climb.'],
      ['y = 1/(1 + C·e<sup>−x</sup>)',0,'The exponent runs at 2x.'],
      ['y = 2/(1 + C·e<sup>−2x</sup>)',0,'Capacity is still 1.']]},
     {q:'Apply y(0) = ½:', o:[
      ['C = 1 — and the S-curve is twice as steep',1,'½ = 1/(1+C) → C = 1.'],
      ['C = 2',0,'½ = 1/(1+C) → C = 1.'],
      ['C = ½',0,'Invert both sides first.']]}
    ],
    fact:'Double-speed logistics: same capacity, steeper inflection — the classic epidemic curve.'},

  { eqHTML:'dy/dx = y(1 − y)', window:{xmin:-3,xmax:3.5,ymin:-0.3,ymax:1.4}, x0:0, y0:0.75, xT:2,
    f:(x,y)=>y*(1-y), sol:x=>3/(3+Math.exp(-x)), solHTML:'y = 3/(3 + e<sup>−x</sup>)',
    steps:[
     {q:'Separate:', o:[
      ['dy / (y(1 − y)) = dx',1,'Both factors under the dy.'],
      ['dy/y = (1 − y) dx',0,'The (1 − y) divides the LEFT.'],
      ['dy/(1 − y) = y dx',0,'Both factors underneath.']]},
     {q:'Partial fractions:', o:[
      ['1/y + 1/(1 − y)',1,'Recombines to 1/(y(1−y)). ✓'],
      ['1/y − 1/(1 − y)',0,'Doesn’t rebuild 1.'],
      ['1/(y + 1)',0,'Different denominator.']]},
     {q:'Integrate:', o:[
      ['ln|y| − ln|1 − y| = x + C',1,'Chain-rule minus on the second log.'],
      ['ln|y| + ln|1 − y| = x + C',0,'Second term carries a minus.'],
      ['ln|y(1 − y)| = x + C',0,'It’s a difference of logs.']]},
     {q:'Exponentiate:', o:[
      ['y/(1 − y) = C·e<sup>x</sup>',1,'Quotient form.'],
      ['y(1 − y) = C·e<sup>x</sup>',0,'Quotient, not product.'],
      ['y = C·e<sup>x</sup>(1 − y)',0,'Exponentiate the whole left side.']]},
     {q:'Rearrange for y:', o:[
      ['y = 1/(1 + C·e<sup>−x</sup>)',1,'The S-curve form.'],
      ['y = 1/(1 + C·e<sup>x</sup>)',0,'Growth forward needs e⁻ˣ.'],
      ['y = C·e<sup>x</sup> − 1',0,'Rearrange the quotient properly.']]},
     {q:'Apply y(0) = ¾:', o:[
      ['C = ⅓',1,'¾ = 1/(1+C) → 1+C = 4/3 → C = ⅓.'],
      ['C = ¾',0,'Invert both sides first: 1+C = 4/3.'],
      ['C = 4/3',0,'That’s 1+C, not C.']]}
    ],
    fact:'Starting past the halfway point: no dramatic inflection — a graceful glide to the crown.'}
  ]},

{ id:18, ch:4, name:"The Oracle's Field", hideEq:true,
  exercises:[
  { eqHTML:'dy/dx = 1 − y', window:{xmin:-1,xmax:3,ymin:-1,ymax:4}, x0:0, y0:3, xT:2,
    f:(x,y)=>1-y, sol:x=>1+2*Math.exp(-x), solHTML:'y = 1 + 2e<sup>−x</sup>',
    steps:[
     {q:'No equation this time — READ the field. Where do the arrows flip from pointing up to pointing down?', o:[
      ['y = 1',1,'Above it arrows point down, below they point up — the equilibrium.'],
      ['y = 0',0,'Below y = 0 the arrows still point up — the flip is higher.'],
      ['y = 3',0,'That’s just where the trace starts.']]},
     {q:'Is this field autonomous (independent of x)?', o:[
      ['Yes — every column of arrows looks identical',1,'The pattern repeats left-to-right: only y matters.'],
      ['No — the arrows change as x grows',0,'Squint horizontally: nothing changes.'],
      ['Impossible to tell without the equation',0,'Compare any two columns — they match.']]},
     {q:'Above y = 1 arrows point down; below, up. The equilibrium is:', o:[
      ['Stable — a magnet',1,'Arrows point TOWARD it from both sides.'],
      ['Unstable — a knife-edge',0,'Arrows point toward it, not away.'],
      ['Semi-stable',0,'Semi-stable needs both sides pointing the SAME way — here they converge.']]}
    ],
    fact:'You just read a differential equation off its field: equilibrium, stability, autonomy — all visible without a single symbol.'},

  { eqHTML:'dy/dx = y − 1', window:{xmin:-1,xmax:0.8,ymin:-3.5,ymax:2}, x0:0, y0:-1, xT:0.5,
    f:(x,y)=>y-1, sol:x=>1-2*Math.exp(x), solHTML:'y = 1 − 2e<sup>x</sup>',
    steps:[
     {q:'Read the field: where is the equilibrium?', o:[
      ['y = 1',1,'Arrows flip there — but watch WHICH way.'],
      ['y = −1',0,'That’s the starting height.'],
      ['y = 0',0,'At y = 0 the arrows point down — not a flip.']]},
     {q:'Below y = 1 the arrows point DOWN, and above they point UP. Classify:', o:[
      ['Unstable — arrows point AWAY from y = 1',1,'A knife-edge: everything slides off.'],
      ['Stable',0,'Stable needs arrows pointing toward it from both sides.'],
      ['Semi-stable',0,'The two sides disagree — that’s unstable, not semi.']]},
     {q:'The trace starts at y = −1, below the equilibrium. Predict its fate:', o:[
      ['Dives downward, away from y = 1, faster and faster',1,'The field accelerates as y falls — instability in action.'],
      ['Climbs up toward y = 1',0,'Below y = 1 the arrows point DOWN.'],
      ['Stays flat',0,'Only ON the equilibrium is the field flat.']]}
    ],
    fact:'Same equilibrium height as the last field, opposite personality — the arrow directions are everything.'},

  { eqHTML:'dy/dx = y(1 − y)', window:{xmin:-3,xmax:4,ymin:-0.6,ymax:1.6}, x0:0, y0:0.5, xT:3,
    f:(x,y)=>y*(1-y), sol:x=>1/(1+Math.exp(-x)), solHTML:'y = 1/(1 + e<sup>−x</sup>)',
    steps:[
     {q:'Read the field: how many equilibria (arrow-flip lines) are there?', o:[
      ['Two — at y = 0 and y = 1',1,'Both lines show a flip in the arrow direction.'],
      ['One — at y = 1',0,'Look again near the x-axis: the arrows flip there too.'],
      ['None',0,'Scan every height — two flips.']]},
     {q:'Between 0 and 1 arrows point up; below 0 and above 1 they point down. Which equilibria are stable?', o:[
      ['y = 1 stable, y = 0 unstable',1,'Arrows converge on 1 from both sides, and diverge from 0.'],
      ['Both stable',0,'Below y = 0 the arrows point DOWN — away from 0.'],
      ['y = 0 stable, y = 1 unstable',0,'Check between: arrows point UP toward 1, not away.']]},
     {q:'The trace starts at y = 0.5, between the equilibria. Predict its shape:', o:[
      ['An S-curve rising to y = 1',1,'Slow start, steep middle, graceful plateau — the logistic.'],
      ['A straight line to y = 1',0,'The field is flat near both equilibria — the curve bends.'],
      ['A dive to y = 0',0,'Between 0 and 1 the arrows point UP.']]}
    ],
    fact:'Two equilibria, one stable: the field itself told you the logistic story before any algebra.'},

  { eqHTML:'dy/dx = −x/y', window:{xmin:-2.6,xmax:2.6,ymin:-2.6,ymax:2.6}, x0:0, y0:2, xT:1.5,
    f:(x,y)=> y===0?NaN:-x/y,
    sol:x=>{const t=4-x*x; return t>=0?Math.sqrt(t):NaN;}, solHTML:'y = √(4 − x²)',
    steps:[
     {q:'Read the field: is it autonomous?', o:[
      ['No — the columns clearly change with x',1,'Left of the axis arrows tilt one way, right the other: x matters.'],
      ['Yes',0,'Compare the far-left and far-right columns — they differ.'],
      ['Can’t tell',0,'Look along any horizontal line — the arrows rotate.']]},
     {q:'The arrows appear to rotate around the origin. The solution curves are most likely:', o:[
      ['Arcs curving back — circles centred at the origin',1,'A rotating field traces closed curves.'],
      ['Straight rays outward',0,'Nothing points radially — the field swirls.'],
      ['Exponential escapes',0,'The arrows don’t fan outward; they turn.']]}
    ],
    fact:'A rotating field means closed orbits — no equilibrium anywhere, just eternal circulation.'}
  ]},

{ id:19, ch:4, name:'The Uniqueness Rift',
  diag:{correct:['separable','autonomous'],
    why:'Separable and autonomous — but watch y = 0: there the field misbehaves, and existence or uniqueness can fail.'},
  exercises:[
  { eqHTML:'dy/dx = √y', window:{xmin:0,xmax:2.5,ymin:-0.5,ymax:1.8}, x0:0, y0:0, xT:2, nonUnique:true,
    f:(x,y)=> y<0?NaN:Math.sqrt(y), sol:x=>x*x/4, solHTML:'y = x²/4',
    steps:[
     {q:'Uniqueness needs ∂f/∂y bounded. For f = √y, is ∂f/∂y = 1/(2√y) continuous at y = 0?', o:[
      ['No — it blows up at y = 0. Uniqueness is NOT guaranteed there',1,'Picard–Lindelöf needs a bounded y-derivative.'],
      ['Yes — √y is continuous everywhere',0,'f itself is continuous, but its y-DERIVATIVE explodes at 0.'],
      ['Uniqueness never depends on derivatives',0,'The theorem needs that bounded derivative — it’s the whole fine print.']]},
     {q:'How many solutions pass through (0, 0)?', o:[
      ['Infinitely many: y ≡ 0, y = x²/4, and any delayed splice of the two',1,'Wait on the axis as long as you like, then peel away.'],
      ['Exactly one',0,'Both y ≡ 0 and y = x²/4 satisfy the DE and the IC.'],
      ['None',0,'y ≡ 0 clearly works.']]},
     {q:'Separate and solve to find the non-zero branch (dy/√y = dx):', o:[
      ['2√y = x + C, so y = x²/4 (with C = 0)',1,'∫dy/√y = 2√y — then square.'],
      ['y = x²/2 + C',0,'∫dy/√y = 2√y — square the half, don’t drop it.'],
      ['y = √x + C',0,'2√y = x + C → square both sides.']]}
    ],
    fact:'At y = 0 the field’s y-derivative is infinite — solutions can peel away from y ≡ 0 whenever they like. Uniqueness is a privilege, not a right.'},

  { eqHTML:'dy/dx = 1/y', window:{xmin:-0.4,xmax:2.5,ymin:-0.5,ymax:2.6}, x0:0, y0:1, xT:2,
    f:(x,y)=> y===0?NaN:1/y, sol:x=>Math.sqrt(2*x+1), solHTML:'y = √(2x + 1)',
    steps:[
     {q:'Where is this field undefined?', o:[
      ['y = 0 — division by zero',1,'The field has no arrows on the x-axis.'],
      ['x = 0',0,'Only y appears in the denominator.'],
      ['Everywhere — it’s not a function',0,'It’s perfectly fine away from y = 0.']]},
     {q:'Can a solution ever cross y = 0?', o:[
      ['No — the field doesn’t exist there; solutions are trapped on one side',1,'Crossing would need a slope at y = 0 — there is none.'],
      ['Yes, with a sharp corner',0,'No derivative exists at the crossing — not a solution.'],
      ['Yes, smoothly',0,'Crossing would require y′ at y = 0 — undefined.']]},
     {q:'What if the IC were y(0) = 0 instead?', o:[
      ['No solution exists — the field has no arrow at y = 0',1,'Existence fails first: there is nothing to follow from (0, 0).'],
      ['Exactly one solution',0,'Uniqueness never comes up — existence itself fails at y = 0.'],
      ['Infinitely many solutions',0,'That happens when existence holds but uniqueness fails (like √y). Here there is no arrow at all.']]},
     {q:'Separate and solve (y(0) = 1):', o:[
      ['y dy = dx → y²/2 = x + C → y = √(2x + 1)',1,'C = ½; the positive branch comes from the IC.'],
      ['dy/y = dx → y = eˣ',0,'Multiply by y — the y goes upstairs.'],
      ['y = √(x + 1)',0,'y²/2 = x + ½ → y² = 2x + 1.']]}
    ],
    fact:'Solutions live exactly where the field does: y = √(2x+1) is born at (−½, 0) and dies if it ever returns.'},

  { eqHTML:'dy/dx = 3y<sup>2/3</sup>', window:{xmin:0,xmax:1.8,ymin:-0.5,ymax:4}, x0:0, y0:0, xT:1.5, nonUnique:true,
    f:(x,y)=>3*Math.cbrt(y*y), sol:x=>x*x*x, solHTML:'y = x³',
    steps:[
     {q:'Check ∂f/∂y = 2y<sup>−1/3</sup> at y = 0:', o:[
      ['It explodes — uniqueness can fail',1,'y⁻¹ᐟ³ → ∞ as y → 0.'],
      ['It’s zero — perfectly safe',0,'Negative powers blow up at zero.'],
      ['It’s continuous',0,'y⁻¹ᐟ³ has a vertical asymptote at 0.']]},
     {q:'Separate (dy/y<sup>2/3</sup> = 3 dx) and integrate:', o:[
      ['3y<sup>1/3</sup> = 3x + C → y<sup>1/3</sup> = x + C′',1,'∫y⁻²ᐟ³ dy = 3y¹ᐟ³ — the 3s cancel.'],
      ['y<sup>1/3</sup> = 3x + C',0,'The left side integrates to 3y¹ᐟ³ — divide by 3.'],
      ['ln|y| = 3x + C',0,'Only dy/y gives a log.']]},
     {q:'Apply y(0) = 0 and solve:', o:[
      ['C′ = 0, so y = x³',1,'0 = 0 + C′ → C′ = 0.'],
      ['y = x³ + 1',0,'0 = 0 + C′ → C′ = 0.'],
      ['y = (x + 1)³',0,'C′ = 0 — no shift.']]},
     {q:'But y ≡ 0 also satisfies the DE and the IC. Through (0,0) there are:', o:[
      ['Infinitely many — y = 0 for a while, then (x − c)³',1,'For every waiting time c ≥ 0 there’s a splice.'],
      ['Exactly two',0,'For every waiting time c there’s another one.'],
      ['Exactly one',0,'y ≡ 0 and y = x³ already make two.']]}
    ],
    fact:'y = x³ and y ≡ 0 through the same point — the field is too flat at y = 0 to tell them apart.'}
  ]},

{ id:26, ch:4, name:'The Harvest',
  diag:{correct:['separable','autonomous'],
    why:'Logistic with a tax — autonomous and separable, but the equilibria shift as the harvest grows. Watch them collide.'},
  exercises:[
  { eqHTML:'dy/dx = y(1 − y) − 3/16', window:{xmin:-0.5,xmax:8,ymin:-0.05,ymax:1.05}, x0:0, y0:0.5, xT:6,
    f:(x,y)=>y*(1-y)-3/16, sol:x=>(1+3*Math.exp(x/2))/(4*(1+Math.exp(x/2))), solHTML:'y = (1 + 3e<sup>x/2</sup>) / (4(1 + e<sup>x/2</sup>))',
    steps:[
     {q:'Find the equilibria — where does y(1−y) = 3/16?', o:[
      ['y = ¼ and y = ¾',1,'y² − y + 3/16 = 0 → y = (1 ± ½)/2.'],
      ['y = ½ only',0,'That’s the critical harvest — here there are two.'],
      ['None',0,'The discriminant 1 − 4(3/16) = ¼ > 0 — two roots.']]},
     {q:'Between ¼ and ¾, is y(1−y) bigger or smaller than 3/16?', o:[
      ['Bigger — arrows point UP between the equilibria',1,'y(1−y) peaks at ¼ > 3/16 in the middle of the interval.'],
      ['Smaller — arrows point down',0,'At y = ½: y(1−y) = ¼ > 3/16 — up!'],
      ['Equal — arrows flat',0,'Only AT ¼ and ¾ is the field flat.']]},
     {q:'So the stability picture is:', o:[
      ['¼ unstable, ¾ stable',1,'Up between, down outside — the classic pair.'],
      ['Both stable',0,'Between them the arrows point up — ¼ repels.'],
      ['Both unstable',0,'Above ¾ arrows point down — ¾ attracts.']]},
     {q:'Starting at y(0) = ½ (between the equilibria), the population:', o:[
      ['Rises toward ¾ — the sustainable yield',1,'The harvest is survivable: settle at ¾, yield 3/16 forever.'],
      ['Falls to ¼ and crashes',0,'Between the equilibria the field points UP.'],
      ['Stays at ½',0,'At y = ½ the field is NOT flat: ¼ − 3/16 = 1/16 > 0.']]},
     {q:'Raise the harvest to exactly h = ¼. The two equilibria would:', o:[
      ['Merge into one semi-stable point at y = ½',1,'The knife-edge — the next exercise.'],
      ['Stay separate',0,'The gap between them shrinks as h grows.'],
      ['Vanish entirely',0,'They vanish only for h > ¼ — at exactly ¼ they touch.']]}
    ],
    fact:'Sustainable harvest: any h < ¼ leaves a stable equilibrium above ½ — the population settles there and the yield continues forever.'},

  { eqHTML:'dy/dx = y(1 − y) − ¼', window:{xmin:-1,xmax:16,ymin:0.42,ymax:0.7}, x0:0, y0:0.6, xT:15,
    f:(x,y)=>y*(1-y)-0.25, sol:x=>0.5+1/(x+10), solHTML:'y = ½ + 1/(x + 10)',
    steps:[
     {q:'Equilibria of y′ = y(1−y) − ¼:', o:[
      ['Exactly one: y = ½ (a double root)',1,'y² − y + ¼ = (y − ½)².'],
      ['Two: ¼ and ¾',0,'That was h = 3/16.'],
      ['None',0,'None happens only for h > ¼.']]},
     {q:'Factor: y′ = −(y − ½)². The sign of y′:', o:[
      ['Negative on BOTH sides of ½ — always down',1,'A perfect square never changes sign.'],
      ['Positive below, negative above',0,'That would make ½ stable — but −(y−½)² ≤ 0 everywhere.'],
      ['Positive on both sides',0,'−(y−½)² ≤ 0 everywhere.']]},
     {q:'So y = ½ is:', o:[
      ['Semi-stable — approached from above, repelling from below',1,'Arrows point down on both sides: above falls toward it, below falls away.'],
      ['Stable',0,'Below ½ the flow moves AWAY (downward).'],
      ['Unstable',0,'From above it IS approached — that’s the “semi”.']]},
     {q:'Solve: dy/(y−½)² = −dx gives:', o:[
      ['y = ½ + 1/(x + C)',1,'−1/(y−½) = −x + C → flip.'],
      ['y = ½ + ln(x + C)',0,'∫du/u² = −1/u — a power, not a log.'],
      ['y = ½ + e⁻ˣ',0,'The integral of 1/u² is −1/u, not an exponential.']]},
     {q:'Apply y(0) = 0.6:', o:[
      ['C = 10 — y = ½ + 1/(x + 10)',1,'0.1 = 1/C → C = 10.'],
      ['C = 0.1',0,'1/(y−½) = x + C: at x = 0, 1/0.1 = 10 = C.'],
      ['C = 5',0,'y(0) − ½ = 0.1 = 1/C → C = 10.']]}
    ],
    fact:'The critical harvest h = ¼: the equilibria have merged into a single knife-edge. Any harder and the population crashes.'},

  { eqHTML:'dy/dx = y(1 − y) − 5/16', window:{xmin:-0.5,xmax:8,ymin:-0.15,ymax:1.15}, x0:0, y0:1, xT:7,
    f:(x,y)=>y*(1-y)-5/16, sol:x=>0.5+0.25*Math.tan(Math.atan(2)-x/4), solHTML:'y = ½ + ¼·tan(arctan 2 − x/4)',
    steps:[
     {q:'Equilibria of y′ = y(1−y) − 5/16:', o:[
      ['None — the discriminant 1 − 5/4 is negative',1,'y(1−y) peaks at ¼ < 5/16: the harvest beats the growth.'],
      ['Two, at ¼ and ¾',0,'That’s h = 3/16.'],
      ['One, at ½',0,'The double root happens at h = ¼ exactly.']]},
     {q:'Since y(1−y) ≤ ¼ < 5/16 for every y:', o:[
      ['y′ < 0 everywhere — the field points down at every height',1,'No refuge: decline is universal.'],
      ['y′ > 0 near y = 1',0,'Even at the peak y = ½, y(1−y) = ¼ < 5/16.'],
      ['y′ = 0 somewhere',0,'¼ < 5/16 — the parabola never reaches the harvest line.']]},
     {q:'Predict the population from y(0) = 1:', o:[
      ['Declines and hits zero — extinction — in finite time',1,'Near y = 0 the field is ≈ −5/16, relentlessly down.'],
      ['Declines but levels off',0,'There is no equilibrium to level off at.'],
      ['Stabilizes at the old equilibrium ¾',0,'¾ was erased — at y = ¾: 0.75·0.25 − 0.3125 = −0.125 < 0.']]},
     {q:'Substitute w = y − ½. The equation becomes:', o:[
      ['w′ = −(w² + 1/16)',1,'Complete the square: y − y² = ¼ − (y−½)².'],
      ['w′ = −w²',0,'The constant survives: ¼ − 5/16 = −1/16.'],
      ['w′ = −(w² − 1/16)',0,'Sign: y − y² − 5/16 = ¼ − w² − 5/16 = −(w² + 1/16).']]},
     {q:'The arctangent integral gives w = ¼·tan(C − x/4). Extinction (y = 0) happens at:', o:[
      ['x = 8·arctan(2) ≈ 8.9',1,'tan(arctan 2 − x/4) = −2 → x = 8 arctan 2.'],
      ['x = 4',0,'Check: at x = 4, tan(arctan2 − 1) = tan(0.107) ≈ 0.11 — still positive.'],
      ['Never — y approaches 0 asymptotically',0,'The field near y = 0 is ≈ −5/16, not ≈ 0 — it plows through.']]}
    ],
    fact:'Overharvesting: with no equilibrium left, decline is unstoppable — the population hits zero near x ≈ 8.9, and the model (with the species) ends.'}
  ]},

{ id:28, ch:4, name:"Euler's Workshop",
  diag:{correct:['separable','autonomous','linear'],
    why:'Growth and decay — but this time you’ll walk the tangent lines yourself. Euler’s method, by hand.'},
  exercises:[
  { eqHTML:'dy/dx = y', window:{xmin:-1,xmax:1.4,ymin:-0.5,ymax:4.2}, x0:0, y0:1, xT:1,
    f:(x,y)=>y, sol:x=>Math.exp(x), solHTML:'y = e<sup>x</sup>',
    steps:[
     {q:'Euler’s method, h = 0.5, from (0, 1). Step 1: y₁ = y₀ + h·f(0, y₀):', o:[
      ['y₁ = 1 + 0.5·1 = 1.5',1,'Follow the tangent line for half a unit.'],
      ['y₁ = 1 + 0.5·0 = 1',0,'f(0, 1) = y₀ = 1 — the slope is 1, not 0.'],
      ['y₁ = 1.25',0,'h·f = 0.5 × 1 = 0.5.']]},
     {q:'Step 2: y₂ = y₁ + h·f(0.5, y₁):', o:[
      ['y₂ = 1.5 + 0.5·1.5 = 2.25',1,'Each step multiplies by 1.5.'],
      ['y₂ = 1.5 + 0.5·1 = 2',0,'The slope at the NEW point is f = y₁ = 1.5.'],
      ['y₂ = 2.5',0,'1.5 × 1.5 = 2.25.']]},
     {q:'The true value: e¹ ≈ 2.718. Euler’s 2.25 is:', o:[
      ['Too low — eˣ is convex, so tangent lines dip beneath it',1,'Every tangent undershoots a bending-up curve.'],
      ['Too high',0,'2.25 < 2.718 — it undershoots.'],
      ['Exact',0,'2.25 ≠ 2.718.']]},
     {q:'Halve the step: h = 0.25 gives y₄ = 1.25⁴ ≈ 2.44. As h shrinks:', o:[
      ['The estimate climbs toward e — error shrinks with h',1,'Euler is first-order accurate: halve h, halve the error.'],
      ['The error stays the same',0,'2.44 is closer to 2.718 than 2.25 was.'],
      ['The estimate drops further',0,'Smaller steps hug the curve more closely.']]},
     {q:'With h = 0.5, each step multiplies y by 1.5. The true solution multiplies by e^0.5 per step. The gap:', o:[
      ['1.5 < e^0.5 ≈ 1.649 — Euler always lags',1,'The discrete growth rate undershoots the continuous one.'],
      ['1.5 > e^0.5',0,'e^0.5 ≈ 1.649 > 1.5.'],
      ['They’re equal',0,'1.5 ≠ 1.649.']]}
    ],
    fact:'Euler walks tangent lines; on a convex curve every tangent dips below. Turn on the 📐 overlay in the trace and watch the staircase hug the curve.'},

  { eqHTML:'dy/dx = −y', window:{xmin:-0.5,xmax:3,ymin:-0.5,ymax:3.5}, x0:0, y0:3, xT:2,
    f:(x,y)=>-y, sol:x=>3*Math.exp(-x), solHTML:'y = 3e<sup>−x</sup>',
    steps:[
     {q:'Euler, h = 0.5, from (0, 3). Step 1:', o:[
      ['y₁ = 3 − 0.5·3 = 1.5',1,'The tangent slopes down at −3.'],
      ['y₁ = 3 − 0.5·1.5 = 2.25',0,'One step at a time: y₁ = 3 + 0.5·(−3) = 1.5.'],
      ['y₁ = 2.5',0,'h·f = 0.5 × (−3) = −1.5.']]},
     {q:'Step 2:', o:[
      ['y₂ = 1.5 − 0.5·1.5 = 0.75',1,'The slope at the new point is −y₁ = −1.5.'],
      ['y₂ = 1.5 − 0.5·3 = 0',0,'The slope is evaluated at the NEW point: −y₁ = −1.5.'],
      ['y₂ = 1.0',0,'1.5 × 0.5 = 0.75.']]},
     {q:'True value at x = 1: 3e⁻¹ ≈ 1.10. Euler’s 0.75 is:', o:[
      ['Too low — the decay curve is convex, so tangents cut beneath it',1,'The curve flattens as it falls; straight lines overshoot the drop.'],
      ['Too high',0,'0.75 < 1.10.'],
      ['Exact',0,'0.75 ≠ 1.10.']]},
     {q:'With step h, each step multiplies y by (1 − h). After n = x/h steps: y = 3(1−h)^(x/h). As h → 0 this approaches:', o:[
      ['3e⁻ˣ — the true solution',1,'(1 − h)^(1/h) → e⁻¹: the discrete becomes continuous.'],
      ['0',0,'The limit of (1−h)^(x/h) is e⁻ˣ, not 0.'],
      ['3',0,'Only for h = 0 exactly — the limit is the exponential.']]},
     {q:'So Euler’s decay is:', o:[
      ['Slightly too fast — it undershoots a convex falling curve',1,'Every tangent line dives below the flattening curve.'],
      ['Slightly too slow',0,'0.75 vs 1.10 — it fell too far.'],
      ['Sometimes fast, sometimes slow',0,'On this convex curve it’s always low.']]}
    ],
    fact:'(1 − h)^(1/h) → e⁻¹: Euler’s staircase converges to the exponential — the discrete becomes continuous as h → 0.'}
  ]},

/* ===== CHAPTER 5 · THE SUBSTITUTION STRONGHOLD ===== */

{ id:14, ch:5, name:'The Bernoulli Beast',
  diag:{correct:['substitution'],
    why:'Bernoulli — a stray power of y is the tell. Substitute v = y^(1−n) to linearise.'},
  exercises:[
  { eqHTML:'dy/dx + y = y²', window:{xmin:-1,xmax:0.6,ymin:0.5,ymax:5.5}, x0:0, y0:2, xT:0.4,
    f:(x,y)=>y*y-y, sol:x=>1/(1-Math.exp(x)/2), solHTML:'y = 1/(1 − e<sup>x</sup>/2)',
    diag:{correct:['separable','autonomous','substitution'],
      why:'Bernoulli (n = 2) — and the right side y² − y also splits (separable) and depends on y alone (autonomous). We’ll ride the substitution.'},
    steps:[
     {q:'Bernoulli check: y′ + Py = Q·yⁿ. Here n = ?', o:[
      ['n = 2',1,'The right side carries y².'],
      ['n = 1',0,'Then it would be linear — but the right side has y².'],
      ['n = 0',0,'y⁰ = 1 — the right side is a square.']]},
     {q:'Substitute v = y<sup>(1−n)</sup>. With n = 2:', o:[
      ['v = 1/y',1,'v = y⁻¹ — reciprocals tame the square.'],
      ['v = y²',0,'That’s yⁿ itself — we need y^(1−n).'],
      ['v = √y',0,'That’s n = ½ thinking — we need y⁻¹.']]},
     {q:'Divide the equation by y² and rewrite in v (using v′ = −y′/y²):', o:[
      ['v′ − v = −1',1,'y′/y² + 1/y = 1 → −v′ + v = 1 → v′ − v = −1. LINEAR in v!'],
      ['v′ + v = −1',0,'Sign check: −v′ + v = 1 flips to v′ − v = −1.'],
      ['v′ = v²',0,'The whole point of the substitution is to LINEARISE the equation.']]},
     {q:'Solve the linear equation for v (μ = e⁻ˣ):', o:[
      ['v = 1 + C·eˣ',1,'(e⁻ˣv)′ = −e⁻ˣ → e⁻ˣv = e⁻ˣ + C.'],
      ['v = 1 + C·e⁻ˣ',0,'After dividing by e⁻ˣ, the C rides along as eˣ.'],
      ['v = −1 + C·eˣ',0,'The particular solution of v′ − v = −1 is v = 1.']]},
     {q:'Back-substitute v = 1/y and apply y(0) = 2:', o:[
      ['y = 1/(1 − eˣ/2)',1,'v(0) = ½ = 1 + C → C = −½.'],
      ['y = 1/(1 + eˣ/2)',0,'C = −½ — the minus survives.'],
      ['y = 1 − eˣ/2',0,'v is the RECIPROCAL of y — flip it.']]},
     {q:'This is secretly the logistic y′ = y(y − 1). Starting at y = 2 (above the equilibrium y = 1), the solution…', o:[
      ['Blows up at x = ln 2 — escape from an unstable equilibrium',1,'Above y = 1 the arrows point up: runaway.'],
      ['Settles onto y = 1',0,'Arrows above y = 1 point UP — away.'],
      ['Decays to 0',0,'0 is the far equilibrium; you’re on the wrong side of 1.']]}
    ],
    fact:'Bernoulli’s substitution v = y^(1−n) turns powers into linear equations — and here it unmasked a runaway logistic.'},

  { eqHTML:'dy/dx + y = x·y²', window:{xmin:-0.5,xmax:2.5,ymin:0,ymax:1.5}, x0:0, y0:1, xT:2,
    f:(x,y)=>x*y*y-y, sol:x=>1/(x+1), solHTML:'y = 1/(x + 1)',
    steps:[
     {q:'Bernoulli check: the right side is x·y², so n = ?', o:[
      ['n = 2',1,'y′ + y = x·y² — textbook Bernoulli.'],
      ['n = 1',0,'Linear would have no y².'],
      ['n = x',0,'n is the POWER of y, not the coefficient.']]},
     {q:'Substitute:', o:[
      ['v = 1/y',1,'n = 2 → v = y⁻¹.'],
      ['v = 1/y²',0,'That’s y⁻² — for n = 3.'],
      ['v = xy',0,'The substitution depends only on the power of y.']]},
     {q:'Divide by y² and rewrite in v:', o:[
      ['v′ − v = −x',1,'y′/y² + 1/y = x → −v′ + v = x → v′ − v = −x.'],
      ['v′ + v = −x',0,'Flip carefully: −v′ + v = x → v′ − v = −x.'],
      ['v′ − v = x',0,'Move v across: the right side is −x.']]},
     {q:'Solve for v (μ = e⁻ˣ, integrate by parts):', o:[
      ['v = x + 1 + C·eˣ',1,'(e⁻ˣv)′ = −xe⁻ˣ → e⁻ˣv = (x+1)e⁻ˣ + C.'],
      ['v = x + C·eˣ',0,'∫−xe⁻ˣ dx = (x+1)e⁻ˣ — the +1 matters.'],
      ['v = −x + 1 + C·eˣ',0,'By parts gives (x+1)e⁻ˣ.']]},
     {q:'Apply y(0) = 1 (so v(0) = 1):', o:[
      ['C = 0 — so y = 1/(x + 1)',1,'1 = 0 + 1 + C → C = 0.'],
      ['C = 1',0,'1 = 1 + C → C = 0.'],
      ['C = −1',0,'v(0) = 1 = 1 + C → C = 0.']]}
    ],
    fact:'With C = 0 the exotic substitution collapses to the humble y = 1/(x+1) — fancy routes can lead to familiar places.'},

  { eqHTML:'dy/dx + y = y³', window:{xmin:-1,xmax:2,ymin:0,ymax:1}, x0:0, y0:0.5, xT:1.5,
    f:(x,y)=>y*y*y-y, sol:x=>1/Math.sqrt(1+3*Math.exp(2*x)), solHTML:'y = 1/√(1 + 3e<sup>2x</sup>)',
    diag:{correct:['separable','autonomous','substitution'],
      why:'Bernoulli with n = 3 — and y³ − y also separates. The substitution is the general tool.'},
    steps:[
     {q:'Bernoulli check: n = ?', o:[
      ['n = 3',1,'The right side carries y³.'],
      ['n = 2',0,'Cubes, not squares.'],
      ['n = 1',0,'Linear would have no y³.']]},
     {q:'Substitute v = y<sup>(1−n)</sup> = y<sup>−2</sup>. Then v′ = −2y<sup>−3</sup>y′. Divide the equation by y³:', o:[
      ['v′ − 2v = −2',1,'y′/y³ + 1/y² = 1 → −v′/2 + v = 1 → v′ − 2v = −2.'],
      ['v′ + 2v = −2',0,'Flip carefully: −v′/2 + v = 1 → v′ − 2v = −2.'],
      ['v′ − 2v = 2',0,'Move v across: −2 lands on the right.']]},
     {q:'Solve for v (μ = e⁻²ˣ):', o:[
      ['v = 1 + C·e²ˣ',1,'(e⁻²ˣv)′ = −2e⁻²ˣ → e⁻²ˣv = e⁻²ˣ + C.'],
      ['v = 1 + C·e⁻²ˣ',0,'After dividing by e⁻²ˣ, the C rides as e²ˣ.'],
      ['v = −2 + C·e²ˣ',0,'The particular solution of v′ − 2v = −2 is v = 1.']]},
     {q:'Apply y(0) = ½ (so v(0) = 1/y² = 4):', o:[
      ['C = 3',1,'4 = 1 + C → C = 3.'],
      ['C = 4',0,'Subtract the 1: C = 3.'],
      ['C = ¼',0,'v(0) = 1/y(0)² = 4, not ¼.']]},
     {q:'Solve for y:', o:[
      ['y = 1/√(1 + 3e²ˣ)',1,'v = y⁻², so y = v^(−½) — the reciprocal square root.'],
      ['y = 1/(1 + 3e²ˣ)',0,'v = y⁻² — take a square root, not a reciprocal.'],
      ['y = √(1 + 3e²ˣ)',0,'y is the reciprocal of the root.']]}
    ],
    fact:'n = 3 doubles the exponent game: the solution dives toward 0 like e⁻ˣ — every power of y leaves a fingerprint.'}
  ]},

{ id:15, ch:5, name:'The Homogeneous Highlands',
  diag:{correct:['substitution'],
    why:'Degree-zero in x and y — only the ratio y/x matters. Substitute v = y/x.'},
  exercises:[
  { eqHTML:'dy/dx = (x + y)/x', window:{xmin:0.3,xmax:2.6,ymin:0,ymax:4.3}, x0:1, y0:1, xT:2.2,
    f:(x,y)=>1+y/x, sol:x=>x*Math.log(x)+x, solHTML:'y = x ln x + x',
    diag:{correct:['linear','substitution'],
      why:'Double route: homogeneous (degree 0) → v = y/x, or linear with P(x) = −1/x. The substitution is the scenic route — take it.'},
    steps:[
     {q:'Rewrite to expose the ratio y/x:', o:[
      ['y′ = 1 + y/x',1,'Divide every term by x.'],
      ['y′ = x + y',0,'Divide EVERY term by x.'],
      ['y′ = (1 + y)/x',0,'The x divides the whole right side: 1 + y/x.']]},
     {q:'Substitute v = y/x (so y = vx and y′ = v + xv′):', o:[
      ['v + xv′ = 1 + v',1,'Both sides carry a +v — they’ll cancel.'],
      ['v + xv′ = 1',0,'The right side keeps its +v.'],
      ['xv′ = 1 + v',0,'The left side is v + xv′ — the v appears twice.']]},
     {q:'The v’s cancel. Now:', o:[
      ['xv′ = 1, so dv = dx/x',1,'Separable in v! Divide by x.'],
      ['xv′ = v',0,'The v’s cancelled — only 1 remains.'],
      ['v′ = 1',0,'Divide by x: v′ = 1/x.']]},
     {q:'Integrate:', o:[
      ['v = ln|x| + C',1,'∫dx/x = ln|x|.'],
      ['v = x + C',0,'∫dx/x = ln|x|.'],
      ['v = 1/x + C',0,'That’s the derivative of ln x.']]},
     {q:'Back-substitute v = y/x and apply y(1) = 1:', o:[
      ['y = x ln x + x',1,'y = x(ln x + C) and 1 = 1·(0 + C) → C = 1.'],
      ['y = ln x + C',0,'Multiply through by x.'],
      ['y = x ln x + 1',0,'The C is multiplied by x: C = 1 gives +x.']]}
    ],
    fact:'Homogeneous equations only care about the ratio y/x — rescale both axes and the field looks identical.'},

  { eqHTML:'dy/dx = (y² + xy)/x²', window:{xmin:0.5,xmax:1.8,ymin:0,ymax:4.6}, x0:1, y0:1, xT:1.5,
    f:(x,y)=>(y*y+x*y)/(x*x), sol:x=>x/(1-Math.log(x)), solHTML:'y = x/(1 − ln x)',
    steps:[
     {q:'Expose the ratio (divide by x²):', o:[
      ['y′ = (y/x)² + y/x',1,'y²/x² = (y/x)² and xy/x² = y/x.'],
      ['y′ = y² + y',0,'Divide every term by x².'],
      ['y′ = (y² + y)/x²',0,'The xy term also gets divided — giving y/x.']]},
     {q:'Substitute v = y/x (y = vx, y′ = v + xv′):', o:[
      ['v + xv′ = v² + v',1,'The right side keeps both terms.'],
      ['v + xv′ = v²',0,'The +v survives the substitution.'],
      ['xv′ = v² + v',0,'The left side carries v + xv′.']]},
     {q:'Cancel and separate:', o:[
      ['dv/v² = dx/x',1,'xv′ = v² — the v’s cancel on the left.'],
      ['dv/v = dx/x',0,'After cancelling, v² is downstairs.'],
      ['v² dv = dx/x',0,'Divide by v², don’t multiply.']]},
     {q:'Integrate:', o:[
      ['−1/v = ln|x| + C',1,'∫v⁻² dv = −v⁻¹ — mind the minus.'],
      ['ln|v| = ln|x| + C',0,'Only dv/v gives a log — here it’s dv/v².'],
      ['1/v = ln|x| + C',0,'∫v⁻² dv = −v⁻¹.']]},
     {q:'Back-substitute and apply y(1) = 1 (so v(1) = 1):', o:[
      ['y = x/(1 − ln x)',1,'−1 = 0 + C → C = −1; y = −x/(ln x − 1).'],
      ['y = x/(1 + ln x)',0,'C = −1 — the minus flips the denominator.'],
      ['y = 1 − ln x',0,'Multiply through by x, then invert v.']]}
    ],
    fact:'The solution escapes to infinity at x = e — the substitution tamed the equation, not the blow-up.'},

  { eqHTML:'dy/dx = (x² + y²)/(xy)', window:{xmin:0.6,xmax:2.2,ymin:0.4,ymax:3.4}, x0:1, y0:1, xT:2,
    f:(x,y)=>(x*x+y*y)/(x*y), sol:x=>x*Math.sqrt(1+2*Math.log(x)), solHTML:'y = x√(1 + 2 ln x)',
    steps:[
     {q:'Expose the ratio:', o:[
      ['y′ = x/y + y/x',1,'x²/(xy) = x/y and y²/(xy) = y/x.'],
      ['y′ = 1 + y²/x²',0,'x²/(xy) = x/y — flip it properly.'],
      ['y′ = (x + y)²/x',0,'Split the fraction first.']]},
     {q:'Substitute v = y/x:', o:[
      ['v + xv′ = 1/v + v',1,'The right side keeps both 1/v and v.'],
      ['v + xv′ = 1/v',0,'The +v survives.'],
      ['xv′ = 1/v',0,'The left side is v + xv′.']]},
     {q:'Cancel and separate:', o:[
      ['v dv = dx/x',1,'xv′ = 1/v — multiply by v.'],
      ['dv/v = dx/x',0,'After cancelling, v is upstairs.'],
      ['dv = v dx/x',0,'Multiply by v: v dv = dx/x.']]},
     {q:'Integrate:', o:[
      ['v²/2 = ln|x| + C',1,'∫v dv = v²/2.'],
      ['ln|v| = ln|x| + C',0,'It’s v dv, not dv/v.'],
      ['v² = ln|x| + C',0,'∫v dv = v²/2 — keep the ½.']]},
     {q:'Back-substitute (v = y/x) and apply y(1) = 1:', o:[
      ['y² = x²(1 + 2 ln x)',1,'½ = 0 + C → C = ½; multiply by 2x².'],
      ['y = x(1 + 2 ln x)',0,'v² = 1 + 2 ln x, and y = xv — square the bracket.'],
      ['y² = x² + 2 ln x',0,'Multiply the WHOLE equation by 2x².']]},
     {q:'Take the positive root (y(1) = 1 > 0):', o:[
      ['y = x√(1 + 2 ln x)',1,'The IC is positive — positive branch.'],
      ['y = √(1 + 2 ln x)',0,'Multiply by x, don’t just root.'],
      ['y = −x√(1 + 2 ln x)',0,'The IC is positive — positive branch.']]}
    ],
    fact:'y = x√(1 + 2 ln x): the substitution turned a tangle of squares into a power rule.'}
  ]},

/* ===== CHAPTER 6 · THE EXACT EMPIRE ===== */

{ id:16, ch:6, name:'The Potential Fields',
  diag:{correct:['exact','substitution'],
    why:'M_y = N_x — the form is a perfect derivative dF. (Homogeneous too — v = y/x is a second road — but the potential is the scenic one.)'},
  exercises:[
  { eqHTML:'2xy dx + x² dy = 0', window:{xmin:0.7,xmax:2.5,ymin:0,ymax:2.2}, x0:1, y0:1, xT:2,
    f:(x,y)=> y===0?NaN:-2*y/x, sol:x=>1/(x*x), solHTML:'x²y = 1 → y = 1/x²',
    diag:{correct:['separable','linear','exact'],
      why:'Triple route: the variables split (separable), M_y = 2x = N_x (exact), and dy/dx = −2y/x is linear too. We’ll hunt the potential.'},
    steps:[
     {q:'Exactness test — compute M_y and N_x for M = 2xy, N = x²:', o:[
      ['M_y = 2x = N_x — exact!',1,'The mixed partials agree.'],
      ['M_y = 2y, N_x = x — not exact',0,'∂(2xy)/∂y = 2x — the y differentiates away.'],
      ['M_y = 2xy, N_x = x²',0,'Differentiate with respect to the OTHER variable.']]},
     {q:'Find the potential F with F_x = M. Integrate 2xy in x:', o:[
      ['F = x²y + g(y)',1,'Treat y as a constant while integrating in x.'],
      ['F = x²y²/2 + g(y)',0,'∫2xy dx = x²y — the y just watches.'],
      ['F = 2xy + g(y)',0,'∫2x dx = x².']]},
     {q:'Match F_y = N = x² to find g(y):', o:[
      ['g′(y) = 0 — so g is constant',1,'F_y = x² + g′ = x² ✓.'],
      ['g(y) = y²',0,'Then F_y = x² + 2y ≠ x².'],
      ['g(y) = xy',0,'g depends only on y.']]},
     {q:'The equation says dF = 0, so:', o:[
      ['x²y = C',1,'F is the PRODUCT x²y.'],
      ['x² + y = C',0,'F is the product, not the sum.'],
      ['x²y² = C',0,'The potential is x²y.']]},
     {q:'Apply y(1) = 1:', o:[
      ['y = 1/x²',1,'C = 1.'],
      ['y = 1/x',0,'C = x²y = 1 — then divide by x².'],
      ['y = x²',0,'1 = C·1² → C = 1, and y = C/x².']]}
    ],
    fact:'Exactness is a free lunch: when M_y = N_x, the solution is a level curve of the potential F.'},

  { eqHTML:'(2x + y) dx + (x + 2y) dy = 0', window:{xmin:-1.2,xmax:1.2,ymin:-1.2,ymax:1.3}, x0:0, y0:1, xT:0.9,
    f:(x,y)=>-(2*x+y)/(x+2*y),
    sol:x=>{const t=4-3*x*x; return t>=0?(-x+Math.sqrt(t))/2:NaN;}, solHTML:'x² + xy + y² = 1',
    steps:[
     {q:'Exactness test for M = 2x + y, N = x + 2y:', o:[
      ['M_y = 1 = N_x — exact!',1,'Both mixed partials equal 1.'],
      ['M_y = 2, N_x = 2y',0,'∂(2x+y)/∂y = 1.'],
      ['M_y = 2x, N_x = x',0,'Differentiate with respect to the OTHER variable.']]},
     {q:'Integrate M = 2x + y in x:', o:[
      ['F = x² + xy + g(y)',1,'∫(2x + y)dx = x² + xy.'],
      ['F = x² + xy + y²',0,'Not yet — g(y) is decided by N.'],
      ['F = 2x + xy + g(y)',0,'∫2x dx = x².']]},
     {q:'Match F_y = x + 2y:', o:[
      ['g(y) = y² — so F = x² + xy + y²',1,'F_y = x + g′ = x + 2y → g′ = 2y.'],
      ['g(y) = 2y',0,'Then F_y = x + 2y + 2y — too much.'],
      ['g(y) = xy',0,'g depends only on y.']]},
     {q:'Level curves F = C; apply y(0) = 1:', o:[
      ['x² + xy + y² = 1 — an ellipse!',1,'At (0,1): F = 1.'],
      ['x² + xy + y² = 0',0,'At (0,1): F = 1.'],
      ['x² + y² = 1 — a circle',0,'The xy term tilts it into an ellipse.']]},
     {q:'Solve the quadratic y² + xy + (x² − 1) = 0 for the branch through (0, 1):', o:[
      ['y = (−x + √(4 − 3x²))/2',1,'Quadratic formula; the + root keeps y(0) = 1.'],
      ['y = (−x − √(4 − 3x²))/2',0,'That’s the lower branch — y(0) = −1.'],
      ['y = (x + √(4 − 3x²))/2',0,'b = +x in the formula gives −x out front.']]}
    ],
    fact:'Tilted ellipses x² + xy + y² = C — exact equations hide conic sections in plain sight.'},

  { eqHTML:'(3x² + y) dx + (x + 2y) dy = 0', window:{xmin:0,xmax:1.45,ymin:0,ymax:2.2}, x0:1, y0:1, xT:1.2,
    f:(x,y)=>-(3*x*x+y)/(x+2*y),
    sol:x=>{const t=12+x*x-4*x*x*x; return t>=0?(-x+Math.sqrt(t))/2:NaN;}, solHTML:'x³ + xy + y² = 3',
    steps:[
     {q:'Exactness test for M = 3x² + y, N = x + 2y:', o:[
      ['M_y = 1 = N_x — exact!',1,'Both mixed partials equal 1.'],
      ['M_y = 3x, N_x = 1',0,'∂(3x²+y)/∂y = 1.'],
      ['M_y = 1, N_x = 2',0,'∂(x+2y)/∂x = 1.']]},
     {q:'Integrate M in x:', o:[
      ['F = x³ + xy + g(y)',1,'∫(3x² + y)dx = x³ + xy.'],
      ['F = x³ + xy + y²',0,'g(y) is decided by N — not yet.'],
      ['F = 3x² + xy + g(y)',0,'∫3x² dx = x³.']]},
     {q:'Match F_y = x + 2y:', o:[
      ['g(y) = y² — so F = x³ + xy + y²',1,'F_y = x + g′ = x + 2y ✓.'],
      ['g(y) = 2y²',0,'Then F_y = x + 4y.'],
      ['g(y) = y',0,'Then F_y = x + 1.']]},
     {q:'Apply y(1) = 1:', o:[
      ['x³ + xy + y² = 3',1,'1 + 1 + 1 = 3.'],
      ['x³ + xy + y² = 1',0,'F(1,1) = 3.'],
      ['x³ + xy + y² = 0',0,'F(1,1) = 3.']]},
     {q:'Solve the quadratic for the branch through (1, 1):', o:[
      ['y = (−x + √(12 + x² − 4x³))/2',1,'y² + xy + (x³ − 3) = 0 → quadratic formula.'],
      ['y = (−x − √(12 + x² − 4x³))/2',0,'That branch gives y(1) = −2.'],
      ['y = (x + √(12 + x² − 4x³))/2',0,'The formula gives −x out front.']]}
    ],
    fact:'Cubics meet quadratics: the level curves of x³ + xy + y² arc over and dive — the field remembers both.'}
  ]},

{ id:27, ch:6, name:'The Almost-Exact',
  diag:{correct:['substitution'],
    why:'Degree-zero in x and y — only the ratio y/x matters. (There’s a hidden second road: repair the exactness.)'},
  exercises:[
  { eqHTML:'2y dx + x dy = 0', window:{xmin:0.65,xmax:2.3,ymin:0,ymax:5}, x0:1, y0:2, xT:2,
    f:(x,y)=> x===0?NaN:-2*y/x, sol:x=>2/(x*x), solHTML:'x²y = 2 → y = 2/x²',
    diag:{correct:['separable','linear','substitution'],
      why:'Triple route: it separates, it’s linear (P = 2/x), it’s homogeneous — and its differential form can be repaired into exactness. We’ll take the repair road.'},
    steps:[
     {q:'Exactness test for M = 2y, N = x:', o:[
      ['M_y = 2 but N_x = 1 — NOT exact',1,'The mixed partials disagree.'],
      ['M_y = 2 = N_x — exact',0,'∂x/∂x = 1, not 2.'],
      ['M_y = 2y, N_x = x',0,'Differentiate with respect to the OTHER variable.']]},
     {q:'Compute (M_y − N_x)/N:', o:[
      ['(2 − 1)/x = 1/x — a function of x alone!',1,'When this happens, an integrating factor μ(x) exists.'],
      ['(2 − 1)/y = 1/y',0,'Divide by N = x, the coefficient of dy.'],
      ['(1 − 2)/x = −1/x',0,'M_y − N_x = 2 − 1 = +1.']]},
     {q:'The integrating factor:', o:[
      ['μ = e^∫(1/x)dx = x',1,'Multiplying by x will repair the form.'],
      ['μ = 1/x',0,'Exponentiate the INTEGRAL: e^(ln x) = x.'],
      ['μ = e^x',0,'∫(1/x)dx = ln x — the factor is x.']]},
     {q:'Multiply through by x: 2xy dx + x² dy = 0. Now:', o:[
      ['M_y = 2x = N_x — exact, with potential F = x²y',1,'The repair worked — a perfect derivative again.'],
      ['Still not exact',0,'∂(2xy)/∂y = 2x = ∂(x²)/∂x ✓.'],
      ['Exact, with F = xy²',0,'∫2xy dx = x²y — the y just watches.']]},
     {q:'Apply y(1) = 2 to x²y = C:', o:[
      ['C = 2 — y = 2/x²',1,'The repaired form’s level curve.'],
      ['C = 2 — y = 2x²',0,'y = C/x², not Cx².'],
      ['C = 4',0,'1²·2 = 2 = C.']]}
    ],
    fact:'When (M_y − N_x)/N depends on x alone, μ(x) = e^∫(M_y−N_x)/N dx repairs the form. Here the whole repair was just: multiply by x.'},

  { eqHTML:'(2x² + xy) dx + (x² + 2xy) dy = 0', window:{xmin:0.4,xmax:2.1,ymin:-0.1,ymax:2.0}, x0:1, y0:1, xT:1.6,
    f:(x,y)=>{const d=x*x+2*x*y; return d===0?NaN:-(2*x*x+x*y)/d;},
    sol:x=>{const t=12-3*x*x; return t>=0?(-x+Math.sqrt(t))/2:NaN;}, solHTML:'x² + xy + y² = 3',
    steps:[
     {q:'Exactness test for M = 2x² + xy, N = x² + 2xy:', o:[
      ['M_y = x, N_x = 2x + 2y — NOT exact',1,'They disagree almost everywhere.'],
      ['M_y = 2x, N_x = 2x — exact',0,'∂(2x²+xy)/∂y = x; ∂(x²+2xy)/∂x = 2x + 2y.'],
      ['M_y = x, N_x = x — exact',0,'∂(x²+2xy)/∂x = 2x + 2y.']]},
     {q:'Compute (M_y − N_x)/N:', o:[
      ['(x − 2x − 2y)/(x² + 2xy) = −1/x — x alone!',1,'The numerator factors as −(x + 2y) and cancels.'],
      ['+1/x',0,'M_y − N_x = x − (2x + 2y) = −(x + 2y) — negative.'],
      ['−1/y',0,'Divide by N = x² + 2xy — the (x + 2y) cancels, leaving −1/x.']]},
     {q:'The integrating factor:', o:[
      ['μ = e^(−∫dx/x) = 1/x',1,'A division this time — the reciprocal repair.'],
      ['μ = x',0,'That’s for +1/x — here the exponent is negative.'],
      ['μ = x²',0,'e^(−ln x) = 1/x.']]},
     {q:'Multiply by 1/x: (2x + y) dx + (x + 2y) dy = 0. This is:', o:[
      ['Exact — M_y = 1 = N_x, with F = x² + xy + y²',1,'A familiar tilted-ellipse potential.'],
      ['Still not exact',0,'∂(2x+y)/∂y = 1 = ∂(x+2y)/∂x ✓.'],
      ['Exact, with F = x² + y²',0,'Don’t drop the xy cross term.']]},
     {q:'Apply y(1) = 1:', o:[
      ['x² + xy + y² = 3',1,'1 + 1 + 1 = 3.'],
      ['x² + xy + y² = 1',0,'F(1,1) = 3.'],
      ['x² + xy + y² = 9',0,'Add them: 1 + 1 + 1.']]}
    ],
    fact:'Divide by x and the tangle becomes a tilted ellipse — the integrating factor didn’t just help, it revealed a conic in hiding.'}
  ]},

/* ===== CHAPTER 7 · THE REAL-WORLD REALMS ===== */

{ id:17, ch:7, name:"Newton's Furnace",
  diag:{correct:['separable','autonomous','linear'],
    why:'Triple threat again — and the equilibrium has a physical meaning: ambient temperature, or terminal velocity. The physics is just attraction to it.'},
  exercises:[
  { eqHTML:'dy/dx = −½(y − 20)', window:{xmin:-1,xmax:6,ymin:0,ymax:100}, x0:0, y0:90, xT:5,
    f:(x,y)=>-0.5*(y-20), sol:x=>20+70*Math.exp(-x/2), solHTML:'y = 20 + 70e<sup>−x/2</sup>',
    steps:[
     {q:'Coffee at 90° in a 20° room. Where is the equilibrium — the temperature the field flows toward?', o:[
      ['y = 20 — the room temperature',1,'Newton’s law: the gap to ambient decays.'],
      ['y = 90',0,'That’s the starting temperature, not the target.'],
      ['y = 0',0,'At y = 0: y′ = −½(−20) = 10 — flowing up.']]},
     {q:'Separate:', o:[
      ['dy/(y − 20) = −½ dx',1,'Subtract the 20 first: the denominator is (y − 20).'],
      ['dy/y = −½ dx',0,'The ambient 20 must move first.'],
      ['dy/(20 − y) = −½ dx',0,'1/(20−y) = −1/(y−20) — flipping the denominator flips the sign too.']]},
     {q:'Integrate:', o:[
      ['ln|y − 20| = −x/2 + C',1,'∫−½ dx = −x/2.'],
      ['ln|y − 20| = −x + C',0,'The ½ survives: ∫−½dx = −x/2.'],
      ['−1/(y − 20) = −x/2 + C',0,'It integrates to a logarithm.']]},
     {q:'Solve for y:', o:[
      ['y = 20 + C·e<sup>−x/2</sup>',1,'Equilibrium plus a decaying gap.'],
      ['y = C·e<sup>−x/2</sup>',0,'Don’t drop the ambient 20.'],
      ['y = 20 + C·e<sup>−x</sup>',0,'The ½ lives in the exponent.']]},
     {q:'Apply y(0) = 90:', o:[
      ['C = 70',1,'90 = 20 + C.'],
      ['C = 90',0,'Subtract the room temperature first.'],
      ['C = 45',0,'90 − 20 = 70 — no halving.']]},
     {q:'After a long time (x → ∞), the coffee:', o:[
      ['Approaches 20° — never quite reaching it',1,'e^(−x/2) → 0 but never lands.'],
      ['Reaches exactly 20° in finite time',0,'Exponentials decay forever without landing.'],
      ['Keeps cooling below 20°',0,'The field pushes BACK toward 20 from below.']]}
    ],
    fact:'Newton’s law of cooling: the gap to room temperature decays exponentially. Your coffee is always 70·e^(−x/2) above 20°.'},

  { eqHTML:'dy/dx = −(y − 5)', window:{xmin:-0.5,xmax:4,ymin:0,ymax:45}, x0:0, y0:40, xT:3.5,
    f:(x,y)=>-(y-5), sol:x=>5+35*Math.exp(-x), solHTML:'y = 5 + 35e<sup>−x</sup>',
    steps:[
     {q:'Soup at 40° in a 5° fridge. The equilibrium is:', o:[
      ['y = 5 — fridge temperature',1,'Everything flows toward the ambient.'],
      ['y = 40',0,'That’s the start.'],
      ['y = 0',0,'At y = 0: y′ = 5 — flowing up.']]},
     {q:'Separate:', o:[
      ['dy/(y − 5) = −dx',1,'Subtract the 5 first.'],
      ['dy/y = −dx',0,'The ambient 5 must move first.'],
      ['dy = −(y − 5) dx',0,'Still mixed — divide by (y − 5).']]},
     {q:'Integrate and solve:', o:[
      ['ln|y − 5| = −x + C → y = 5 + C·e⁻ˣ',1,'Log, then exponentiate.'],
      ['ln|y − 5| = x + C',0,'∫−dx = −x.'],
      ['y = 5 + C·e⁻⁵ˣ',0,'The rate is 1, not 5.']]},
     {q:'Apply y(0) = 40:', o:[
      ['C = 35',1,'40 = 5 + C.'],
      ['C = 40',0,'Subtract the fridge temperature first.'],
      ['C = 8',0,'40 − 5 = 35.']]},
     {q:'Each unit of time, the gap to 5° multiplies by:', o:[
      ['1/e ≈ 0.37',1,'e⁻ˣ — about 63% of the gap vanishes per unit time.'],
      ['½',0,'That’s half-life thinking — here it’s e⁻¹ per unit.'],
      ['e ≈ 2.72',0,'The gap SHRINKS.']]}
    ],
    fact:'Same mathematics as radioactive decay — temperature gaps and isotopes both forget exponentially.'},

  { eqHTML:'dy/dx = (60 − y)/2', window:{xmin:-0.5,xmax:5,ymin:0,ymax:70}, x0:0, y0:10, xT:4,
    f:(x,y)=>(60-y)/2, sol:x=>60-50*Math.exp(-x/2), solHTML:'y = 60 − 50e<sup>−x/2</sup>',
    steps:[
     {q:'A cold drink at 10° in a 60° room. Rewrite in “gap” form:', o:[
      ['y′ = −½(y − 60)',1,'(60 − y)/2 = −(y − 60)/2 — warming is cooling run backward.'],
      ['y′ = ½(y − 60)',0,'(60−y)/2 = −(y−60)/2 — mind the sign.'],
      ['y′ = ½(y + 60)',0,'The gap is (y − 60), with a minus.']]},
     {q:'The equilibrium is:', o:[
      ['y = 60 — the room',1,'The field flows toward the ambient temperature.'],
      ['y = 10',0,'That’s the start.'],
      ['y = 30',0,'At y = 30: y′ = 15 — still flowing up.']]},
     {q:'Solve (separate, integrate, exponentiate):', o:[
      ['y = 60 + C·e<sup>−x/2</sup>',1,'Same recipe as cooling.'],
      ['y = 60 + C·e<sup>x/2</sup>',0,'Warming still means the gap DECAYS.'],
      ['y = C·e<sup>−x/2</sup>',0,'Don’t drop the ambient 60.']]},
     {q:'Apply y(0) = 10:', o:[
      ['C = −50 — negative, because we start BELOW the equilibrium',1,'10 = 60 + C → C = −50.'],
      ['C = 50',0,'10 = 60 + C → C = −50.'],
      ['C = 10',0,'Subtract the 60 first.']]},
     {q:'The solution rises toward 60. Does it ever overshoot?', o:[
      ['Never — exponential approach has no overshoot',1,'First-order equations can’t oscillate.'],
      ['Once, then settles',0,'Overshoot needs a second derivative — we only have y′.'],
      ['Forever, oscillating',0,'Oscillation is a second-order phenomenon.']]}
    ],
    fact:'Warming is just cooling with a negative gap: y = 60 − 50e^(−x/2) climbs the same exponential curve, mirrored.'},

  { eqHTML:'dv/dx = 10 − v', window:{xmin:-0.5,xmax:5,ymin:0,ymax:12}, x0:0, y0:0, xT:4,
    f:(x,y)=>10-y, sol:x=>10*(1-Math.exp(-x)), solHTML:'v = 10(1 − e<sup>−x</sup>)',
    steps:[
     {q:'A skydiver: gravity pulls at 10 m/s², drag pushes back at v. The equilibrium has a famous name:', o:[
      ['Terminal velocity — v = 10',1,'Where gravity and drag balance.'],
      ['Escape velocity',0,'Nothing escapes here — the field converges.'],
      ['The equilibrium is 0',0,'At v = 0: v′ = 10 — falling hard.']]},
     {q:'Separate:', o:[
      ['dv/(10 − v) = dx',1,'The whole (10 − v) divides the left.'],
      ['dv/v = dx',0,'The denominator is (10 − v).'],
      ['dv = (10 − v) dx',0,'Still mixed.']]},
     {q:'Integrate:', o:[
      ['−ln|10 − v| = x + C',1,'u = 10 − v brings the chain-rule minus.'],
      ['ln|10 − v| = x + C',0,'The minus from du is missing.'],
      ['1/(10 − v) = x + C',0,'It’s a logarithm.']]},
     {q:'Solve for v:', o:[
      ['v = 10 − C·e⁻ˣ',1,'Exponentiate: 10 − v = C·e⁻ˣ.'],
      ['v = 10 + C·e⁻ˣ',0,'10 − v = Ce⁻ˣ → v = 10 − Ce⁻ˣ.'],
      ['v = C·e⁻ˣ',0,'Don’t drop the terminal velocity 10.']]},
     {q:'Apply v(0) = 0:', o:[
      ['C = 10 — so v = 10(1 − e⁻ˣ)',1,'0 = 10 − C → C = 10.'],
      ['C = 0',0,'0 = 10 − C → C = 10.'],
      ['C = 10 — so v = 10e⁻ˣ',0,'v = 10 − 10e⁻ˣ — the gap to 10 decays.']]}
    ],
    fact:'Terminal velocity is just a stable equilibrium with a dramatic name: gravity and drag agree on 10 m/s.'}
  ]},

{ id:25, ch:7, name:'The Applied Archipelago',
  diag:{correct:['separable','autonomous','linear'],
    why:'Triple threats, every one — tanks, circuits and isotopes all run on the same engine.'},
  exercises:[
  { eqHTML:'dA/dx = 1 − A/10', window:{xmin:-1,xmax:22,ymin:-1,ymax:11.5}, x0:0, y0:0, xT:20,
    f:(x,y)=>1-y/10, sol:x=>10*(1-Math.exp(-x/10)), solHTML:'A = 10(1 − e<sup>−x/10</sup>)',
    steps:[
     {q:'A 50 L tank: 5 L/min flows IN at 0.2 kg/L of salt; 5 L/min drains out, well-mixed. Set up the DE:', o:[
      ['dA/dx = 1 − A/10',1,'Inflow 5·0.2 = 1 kg/min; outflow 5·(A/50) = A/10 kg/min.'],
      ['dA/dx = 1 − A/5',0,'Outflow concentration is A/50, times 5 L/min → A/10.'],
      ['dA/dx = 5 − A/10',0,'Inflow is 5 × 0.2 = 1 kg/min, not 5.']]},
     {q:'The equilibrium — the steady-state salt amount:', o:[
      ['A = 10 kg',1,'1 − A/10 = 0. The tank saturates at 10.'],
      ['A = 5 kg',0,'Set 1 − A/10 = 0 → A = 10.'],
      ['A = 50 kg',0,'50 is the volume, not the salt load.']]},
     {q:'Solve (it’s linear — or separate):', o:[
      ['A = 10 + C·e<sup>−x/10</sup>',1,'Equilibrium plus a decaying gap.'],
      ['A = 10 + C·e<sup>−10x</sup>',0,'The rate is 1/10 — the exponent is −x/10.'],
      ['A = C·e<sup>−x/10</sup>',0,'Don’t drop the equilibrium 10.']]},
     {q:'Apply A(0) = 0 (pure water at the start):', o:[
      ['C = −10 — A = 10(1 − e<sup>−x/10</sup>)',1,'Starting empty means a NEGATIVE gap.'],
      ['C = 10',0,'0 = 10 + C → C = −10.'],
      ['C = 0',0,'Then A ≡ 10 — but the tank starts pure.']]},
     {q:'After a very long time:', o:[
      ['A approaches 10 kg but never quite arrives',1,'The gap 10e^(−x/10) decays forever.'],
      ['A reaches exactly 10 kg',0,'Exponentials never land.'],
      ['A keeps growing past 10',0,'Past 10 the field points down.']]}
    ],
    fact:'The tank forever trails its equilibrium by 10e^(−x/10) kg — the same exponential gap as cooling coffee and falling skydivers. One equation, many costumes.'},

  { eqHTML:'dv/dx = (12 − v)/2', window:{xmin:-0.5,xmax:7,ymin:-1,ymax:13.5}, x0:0, y0:0, xT:6,
    f:(x,y)=>(12-y)/2, sol:x=>12*(1-Math.exp(-x/2)), solHTML:'v = 12(1 − e<sup>−x/2</sup>)',
    steps:[
     {q:'A capacitor charges through a resistor from a 12 V supply (time constant RC = 2). The DE:', o:[
      ['dv/dx = (12 − v)/2',1,'The gap to the supply decays at rate 1/RC.'],
      ['dv/dx = 12 − v/2',0,'The whole gap (12 − v) is divided by 2.'],
      ['dv/dx = (v − 12)/2',0,'Charging closes the gap — the sign runs toward 12.']]},
     {q:'The equilibrium:', o:[
      ['v = 12 — the supply voltage',1,'The capacitor can never exceed what feeds it.'],
      ['v = 6',0,'Set (12 − v)/2 = 0 → v = 12.'],
      ['v = 0',0,'At v = 0 the field points UP — charging.']]},
     {q:'Solve with v(0) = 0:', o:[
      ['v = 12(1 − e<sup>−x/2</sup>)',1,'C = −12 in v = 12 + Ce^(−x/2).'],
      ['v = 12(1 − e<sup>−2x</sup>)',0,'The time constant is 2 → exponent −x/2.'],
      ['v = 12e<sup>−x/2</sup>',0,'That decays from 12 — we start at 0 and climb.']]},
     {q:'After one time constant (x = 2), the gap to 12 has shrunk to:', o:[
      ['e⁻¹ ≈ 37% of its original size',1,'About 63% charged — the classic rule of thumb.'],
      ['50%',0,'Exponential, not halving: the factor is e⁻¹.'],
      ['e⁻¹ ≈ 63%',0,'Close — 63% of the gap is GONE, 37% REMAINS.']]},
     {q:'Does the voltage ever overshoot 12?', o:[
      ['Never — first-order systems approach monotonically',1,'No inertia, no overshoot.'],
      ['Once, then settles',0,'Overshoot needs a second derivative — a first-order circuit has none.'],
      ['Forever, ringing',0,'That’s an LC circuit — add an inductor first!']]}
    ],
    fact:'Charging a capacitor is cooling coffee run backwards: the gap to the target always decays like e^(−x/RC). One time constant = 63% of the way there.'},

  { eqHTML:'dy/dx = −(ln2/10)·y', window:{xmin:-1,xmax:42,ymin:-0.1,ymax:1.15}, x0:0, y0:1, xT:20,
    f:(x,y)=>-(Math.LN2/10)*y, sol:x=>Math.pow(2,-x/10), solHTML:'y = 2<sup>−x/10</sup>',
    steps:[
     {q:'An isotope has half-life 10 (centuries): y(10) = ½. With y = Ce^(kx) and y(0) = 1, find k:', o:[
      ['k = −ln2/10 ≈ −0.069',1,'e^(10k) = ½ → 10k = −ln 2.'],
      ['k = −ln10/2',0,'Take ln of BOTH sides: 10k = −ln 2.'],
      ['k = −10 ln2',0,'Divide by 10: k = −ln2/10.']]},
     {q:'So the DE is:', o:[
      ['dy/dx = −(ln2/10)·y',1,'A gentle decay rate ≈ 0.069 per century.'],
      ['dy/dx = −(ln10/2)·y',0,'k = −ln2/10 from the half-life.'],
      ['dy/dx = −10·ln2·y',0,'That’s 100× too fast.']]},
     {q:'The solution:', o:[
      ['y = 2<sup>−x/10</sup>',1,'Each 10 units halves y — written as a power of 2.'],
      ['y = e<sup>−10x</sup>',0,'The rate is ln2/10 ≈ 0.069, not 10.'],
      ['y = 10<sup>−x/2</sup>',0,'Halving means base 2, exponent −x/10.']]},
     {q:'A specimen with ¼ of the isotope remaining is how old?', o:[
      ['x = 20 — two half-lives',1,'¼ = (½)².'],
      ['x = 10',0,'One half-life leaves ½, not ¼.'],
      ['x = 40',0,'Four half-lives would leave 1/16.']]},
     {q:'Compared with y′ = −y (k = −1), this isotope decays:', o:[
      ['~14× more slowly',1,'1/0.069 ≈ 14.5.'],
      ['At the same rate',0,'k ≈ 0.069 vs 1 — far gentler.'],
      ['Faster',0,'Small |k| means slow decay.']]}
    ],
    fact:'Half-life 10, k = ln2/10 ≈ 0.069: after 20 centuries a quarter remains, after 40 only 6%. Archaeology is just logarithms.'}
  ]},

/* ===== CHAPTER 8 · THE PHASE PLAINS ===== */

{ id:20, ch:8, name:'The Oscillator Abyss', vec:true,
  diag:{correct:['secondorder'],
    why:'y″ appears — second-order linear. Convert to a system and enter the phase plane: horizontal = y, vertical = y′.'},
  exercises:[
  { eqHTML:'y″ = −y', icHTML:'y(0) = 1, y′(0) = 0',
    window:{xmin:-1.5,xmax:1.5,ymin:-1.5,ymax:1.5}, x0:1, y0:0, tGoal:Math.PI/2, tFull:Math.PI*2, goalR:0.28,
    f:(x,y)=>[y,-x], solHTML:'y = cos x',
    steps:[
     {q:'Convert to a first-order system: let v = y′. Then:', o:[
      ['y′ = v, v′ = −y',1,'y″ = v′ and the equation says y″ = −y.'],
      ['y′ = −v, v′ = y',0,'y″ = v′ = −y — keep the minus with y.'],
      ['y′ = y, v′ = −v',0,'v is the DERIVATIVE of y, not a copy.']]},
     {q:'Find the equilibria of the system:', o:[
      ['Only (0, 0) — the origin',1,'Set both v and −y to zero.'],
      ['(1, 0) and (0, 1)',0,'At (1,0): v′ = −1 — moving.'],
      ['Everywhere on the v-axis',0,'v′ = −y = 0 needs y = 0, AND y′ = v = 0 too.']]},
     {q:'Characteristic equation of y″ + y = 0:', o:[
      ['r² + 1 = 0',1,'Move −y across: y″ + y = 0.'],
      ['r² − 1 = 0',0,'That would be y″ = y.'],
      ['r + 1 = 0',0,'y″ contributes r².']]},
     {q:'The roots are r = ±i. The general solution is:', o:[
      ['y = C₁cos x + C₂sin x',1,'Pure imaginary roots → oscillation.'],
      ['y = C₁eˣ + C₂e⁻ˣ',0,'Those are the REAL-root solutions (r = ±1).'],
      ['y = C₁ + C₂x',0,'That’s the repeated-root r = 0 case.']]},
     {q:'Apply y(0) = 1, y′(0) = 0:', o:[
      ['y = cos x',1,'1 = C₁; y′ = −C₁sin + C₂cos → 0 = C₂.'],
      ['y = sin x',0,'sin 0 = 0 ≠ 1.'],
      ['y = cos x + sin x',0,'y′(0) = 1 ≠ 0.']]},
     {q:'In the phase plane (horizontal y, vertical y′), this solution traces:', o:[
      ['A circle — clockwise',1,'From (1,0) the velocity dips first: v = −sin x < 0.'],
      ['A circle — counterclockwise',0,'Check the first move: v goes negative — downward on screen.'],
      ['A spiral inward',0,'No damping — the energy never dies.']]}
    ],
    fact:'y″ = −y is the perfect spring: in the (y, y′) plane every orbit is a circle — a perpetual trade-off between position and velocity.'},

  { eqHTML:'y″ + 2y′ + y = 0', icHTML:'y(0) = 1, y′(0) = 0',
    window:{xmin:-0.3,xmax:1.2,ymin:-0.55,ymax:1.2}, x0:1, y0:0, tGoal:3, tFull:6, goalR:0.16,
    f:(x,y)=>[y,-2*y-x], solHTML:'y = (1 + x)e<sup>−x</sup>',
    steps:[
     {q:'Characteristic equation:', o:[
      ['r² + 2r + 1 = 0',1,'y″ → r², 2y′ → 2r, y → 1.'],
      ['r² + 2r = 0',0,'The y term contributes +1.'],
      ['r² + r + 1 = 0',0,'The y′ coefficient is 2.']]},
     {q:'Factor it:', o:[
      ['(r + 1)² = 0 — a repeated real root r = −1',1,'Perfect square.'],
      ['(r + 2)(r − 1) = 0',0,'Expand: r² + r − 2 ≠ r² + 2r + 1.'],
      ['r = ±i',0,'That’s no damping — but we have a 2y′ term.']]},
     {q:'Repeated root: the general solution is:', o:[
      ['y = (C₁ + C₂x)e⁻ˣ',1,'The repeated root forces the extra x.'],
      ['y = C₁e⁻ˣ + C₂eˣ',0,'Distinct roots only.'],
      ['y = e⁻ˣ(C₁cos x + C₂sin x)',0,'That’s complex roots.']]},
     {q:'Apply y(0) = 1, y′(0) = 0:', o:[
      ['C₁ = 1, C₂ = 1 — y = (1 + x)e⁻ˣ',1,'y(0) = C₁ = 1; y′(0) = C₂ − C₁ = 0 → C₂ = 1.'],
      ['C₁ = 1, C₂ = 0',0,'y′(0) = C₂ − C₁ = 0 forces C₂ = 1.'],
      ['C₁ = 0, C₂ = 1',0,'y(0) = C₁ = 1.']]},
     {q:'This is critical damping — the mass:', o:[
      ['Returns to rest as fast as possible without oscillating',1,'The goldilocks zone of damping.'],
      ['Oscillates around 0',0,'No complex roots — no oscillation.'],
      ['Overshoots once',0,'(1+x)e⁻ˣ > 0 for x > −1 — it never crosses zero.']]}
    ],
    fact:'Critical damping: the repeated root r = −1 shows up as the extra x in (1+x)e⁻ˣ — the fastest dead stop nature allows.'},

  { eqHTML:'y″ = y', icHTML:'y(0) = 1, y′(0) = 0',
    window:{xmin:-0.6,xmax:2.8,ymin:-0.6,ymax:2.8}, x0:1, y0:0, tGoal:1, tFull:1.6, goalR:0.3,
    f:(x,y)=>[y,x], solHTML:'y = cosh x',
    steps:[
     {q:'Convert to a system (v = y′):', o:[
      ['y′ = v, v′ = y',1,'y″ = v′ = y.'],
      ['y′ = −v, v′ = −y',0,'The equation says y″ = +y.'],
      ['y′ = y, v′ = v',0,'v is the derivative of y.']]},
     {q:'Characteristic equation and roots:', o:[
      ['r² − 1 = 0 → r = ±1 — real, opposite signs',1,'A saddle in the making.'],
      ['r² + 1 = 0 → r = ±i',0,'That’s y″ = −y.'],
      ['r² − 2r + 1 = 0 → r = 1 repeated',0,'There’s no y′ term here.']]},
     {q:'General solution:', o:[
      ['y = C₁eˣ + C₂e⁻ˣ',1,'Distinct real roots.'],
      ['y = (C₁ + C₂x)eˣ',0,'That’s a repeated root.'],
      ['y = C₁cos x + C₂sin x',0,'That’s imaginary roots.']]},
     {q:'Apply y(0) = 1, y′(0) = 0:', o:[
      ['C₁ = C₂ = ½ — y = ½(eˣ + e⁻ˣ) = cosh x',1,'C₁ + C₂ = 1 and C₁ − C₂ = 0.'],
      ['y = sinh x',0,'sinh 0 = 0 ≠ 1.'],
      ['y = eˣ',0,'y′(0) = 1 ≠ 0.']]},
     {q:'In the phase plane, the orbit y² − v² = 1 is:', o:[
      ['A hyperbola — the signature of a saddle',1,'Flip the sign of y″ = −y and circles burst into hyperbolas.'],
      ['A circle',0,'Circles belong to y″ = −y.'],
      ['A spiral',0,'There’s no damping term.']]}
    ],
    fact:'y″ = y is the inverted spring: the phase-plane circles of y″ = −y become hyperbolas — the saddle, source of all instability.'}
  ]},

{ id:21, ch:8, name:'The Ecological Expanse', vec:true,
  diag:{correct:['system'],
    why:'Two unknowns evolving together — a system. Welcome to the phase plane of predator and prey.'},
  exercises:[
  { eqHTML:'x′ = x(1 − y), y′ = y(x − 1)', icHTML:'x(0) = 2, y(0) = ½',
    window:{xmin:-0.2,xmax:3.2,ymin:-0.2,ymax:3.2}, x0:2, y0:0.5, tGoal:2, goalR:0.35,
    f:(x,y)=>[x*(1-y), y*(x-1)], solHTML:'closed orbit around (1, 1)',
    steps:[
     {q:'Find the equilibria (both x′ = 0 AND y′ = 0):', o:[
      ['(0, 0) and (1, 1)',1,'x′ = 0 on x = 0 or y = 1; y′ = 0 on y = 0 or x = 1.'],
      ['Only (1, 1)',0,'(0,0) also works — both populations extinct.'],
      ['Only (0, 0)',0,'(1,1) also works — the coexistence point.']]},
     {q:'The nullclines x′ = 0 are the lines:', o:[
      ['x = 0 and y = 1',1,'Prey stops changing on these lines.'],
      ['x = 1 and y = 0',0,'Those are the PREDATOR nullclines.'],
      ['x = y',0,'Not a nullcline of this system.']]},
     {q:'Start at (2, ½): prey x = 2, predators y = ½. Which way does the state move?', o:[
      ['Right and up — prey grows (few predators), predators grow (much food)',1,'x′ = 2(½) = 1 > 0 and y′ = ½(1) = ½ > 0.'],
      ['Left and down',0,'Both derivatives are positive at (2, ½).'],
      ['Straight up',0,'x′ = 1 — the prey grows too.']]},
     {q:'The orbits of Lotka–Volterra are:', o:[
      ['Closed loops around (1, 1) — populations cycle forever',1,'Neither species wins: the eternal dance.'],
      ['Spirals into (1, 1)',0,'No damping term — the cycle never decays.'],
      ['Escapes to infinity',0,'The invariant x + y − ln x − ln y confines every orbit.']]}
    ],
    fact:'Lotka–Volterra: lynx and hares, predators and prey — closed orbits mean the cycle repeats forever, powered by nothing.'},

  { eqHTML:'x′ = x(1 − y), y′ = y(x − 1)', icHTML:'x(0) = 1.5, y(0) = 1.8',
    window:{xmin:-0.2,xmax:3.2,ymin:-0.2,ymax:3.2}, x0:1.5, y0:1.8, tGoal:2, goalR:0.35,
    f:(x,y)=>[x*(1-y), y*(x-1)], solHTML:'closed orbit around (1, 1)',
    steps:[
     {q:'This system has a conserved quantity. Check V = x + y − ln x − ln y:', o:[
      ['dV/dt = 0 — V is constant on every orbit',1,'x′(1−1/x) + y′(1−1/y) = (1−y)(x−1) + (x−1)(y−1) = 0. ✓'],
      ['dV/dt = 1',0,'Expand both terms — they cancel exactly.'],
      ['V only exists near (1,1)',0,'It’s conserved on EVERY orbit in the positive quadrant.']]},
     {q:'Because V is conserved, orbits:', o:[
      ['Are level curves of V — closed loops around (1, 1)',1,'A conserved quantity traps the motion on a loop.'],
      ['Spiral outward',0,'Conservation forbids drift.'],
      ['Are straight lines',0,'Level curves of V curve around the minimum at (1,1).']]},
     {q:'Start at (1.5, 1.8) — more predators than prey can sustain. What happens first?', o:[
      ['Prey decline (x′ < 0), dragging predators down later',1,'x′ = 1.5(1 − 1.8) < 0 — the feast ends.'],
      ['Prey keep growing',0,'With y = 1.8 > 1, the prey are being eaten faster than they breed.'],
      ['Predators die immediately',0,'y′ = 1.8(0.5) > 0 — plenty of food for now.']]},
     {q:'The point (0, 0) is what kind of equilibrium?', o:[
      ['A saddle — extinct prey but surviving predators fall to it; extinct predators let prey explode',1,'The axes are the stable/unstable directions.'],
      ['A stable spiral',0,'Nothing spirals on the axes.'],
      ['A center',0,'Centers have closed loops around them — not here.']]}
    ],
    fact:'One conserved quantity, infinite closed orbits: the Lotka–Volterra invariant V = x + y − ln x − ln y is the ecologist’s energy.'}
  ]},

{ id:22, ch:8, name:'The Spiral Abyss', vec:true,
  diag:{correct:['secondorder'],
    why:'y″ appears — a damped second-order oscillator. To the phase plane, where damping becomes a spiral.'},
  exercises:[
  { eqHTML:'y″ + 2y′ + 2y = 0', icHTML:'y(0) = 1, y′(0) = 0',
    window:{xmin:-0.35,xmax:1.15,ymin:-0.75,ymax:1.15}, x0:1, y0:0, tGoal:Math.PI, tFull:Math.PI*2, goalR:0.22,
    f:(x,y)=>[y,-2*x-2*y], solHTML:'y = e<sup>−x</sup>(cos x + sin x)',
    steps:[
     {q:'Characteristic equation of y″ + 2y′ + 2y = 0:', o:[
      ['r² + 2r + 2 = 0',1,'y″ → r², 2y′ → 2r, 2y → 2.'],
      ['r² + 2r = 0',0,'The y term contributes +2.'],
      ['r² + r + 2 = 0',0,'The y′ coefficient is 2.']]},
     {q:'Solve the quadratic (discriminant 4 − 8 = −4):', o:[
      ['r = −1 ± i',1,'(−2 ± 2i)/2 — complex roots with real part −1.'],
      ['r = 1 ± i',0,'−b/2 = −1 — the real part is negative.'],
      ['r = −1 ± 2i',0,'√(−4) = 2i, and the 2 cancels: −1 ± i.']]},
     {q:'Complex roots α ± βi give which general solution?', o:[
      ['y = e⁻ˣ(C₁cos x + C₂sin x)',1,'Real part −1 in the exponential, imaginary part 1 is the frequency.'],
      ['y = eˣ(C₁cos x + C₂sin x)',0,'The real part −1 belongs in the exponent.'],
      ['y = e⁻ˣ(C₁cos 2x + C₂sin 2x)',0,'The frequency is β = 1, not 2.']]},
     {q:'Apply y(0) = 1 and y′(0) = 0:', o:[
      ['C₁ = 1, C₂ = 1 — y = e⁻ˣ(cos x + sin x)',1,'y(0) = C₁ = 1; y′(0) = −C₁ + C₂ = 0 → C₂ = 1.'],
      ['C₁ = 1, C₂ = 0',0,'y′(0) = −C₁ + C₂ = 0 forces C₂ = 1.'],
      ['C₁ = 1, C₂ = −1',0,'y′(0) = −C₁ + C₂ — with C₂ = −1 that’s −2 ≠ 0.']]},
     {q:'In the phase plane, complex roots with negative real part make the origin a:', o:[
      ['Spiral sink — every orbit spirals inward',1,'Rotation from ±i, attraction from the −1.'],
      ['Spiral source',0,'The real part is negative — inward, not outward.'],
      ['Center',0,'A center needs real part exactly 0 — pure ±i.']]},
     {q:'After one full period 2π, the oscillation’s amplitude has multiplied by:', o:[
      ['e⁻²π ≈ 0.002 — essentially dead',1,'The envelope e⁻ˣ evaluated at 2π.'],
      ['e⁻π ≈ 0.043',0,'That’s half a period’s worth of decay.'],
      ['½',0,'Exponential decay, not halving — the factor is e⁻²π.']]}
    ],
    fact:'Underdamped: the oscillator rings like a bell underwater — each full swing is e⁻²π ≈ 0.2% of the last. In the phase plane: a spiral sink.'},

  { eqHTML:'y″ + 2y′ + 2y = 0', icHTML:'y(0) = 0, y′(0) = 1',
    window:{xmin:-0.15,xmax:0.45,ymin:-0.25,ymax:1.15}, x0:0, y0:1, tGoal:Math.PI/2, tFull:Math.PI*2, goalR:0.16,
    f:(x,y)=>[y,-2*x-2*y], solHTML:'y = e<sup>−x</sup> sin x',
    steps:[
     {q:'The characteristic roots are r = −1 ± i (same equation). The general solution is:', o:[
      ['y = e⁻ˣ(C₁cos x + C₂sin x)',1,'Same family — the ICs pick the member.'],
      ['y = e⁻ˣ(C₁cos x − C₂sin x)',0,'Both trig terms ride the same e⁻ˣ.'],
      ['y = C₁e⁻ˣ + C₂eˣ',0,'Those are real roots — ours are complex.']]},
     {q:'Apply y(0) = 0:', o:[
      ['C₁ = 0, so y = C₂e⁻ˣ sin x',1,'cos 0 = 1 kills the first term.'],
      ['C₂ = 0, so y = C₁e⁻ˣ cos x',0,'y(0) = C₁ — to get 0, C₁ must vanish.'],
      ['C₁ = C₂',0,'Only C₁ is pinned by y(0) = 0.']]},
     {q:'Apply y′(0) = 1 (differentiate C₂e⁻ˣ sin x):', o:[
      ['C₂ = 1 — y = e⁻ˣ sin x',1,'y′ = C₂e⁻ˣ(cos x − sin x), so y′(0) = C₂.'],
      ['C₂ = −1',0,'y′(0) = +C₂ — no minus.'],
      ['C₂ = 0',0,'Then y ≡ 0, but y′(0) = 1.']]},
     {q:'The envelope of the oscillation:', o:[
      ['y lives between −e⁻ˣ and e⁻ˣ',1,'|sin x| ≤ 1, so e⁻ˣ sin x is trapped by ±e⁻ˣ.'],
      ['y lives between −1 and 1',0,'The e⁻ˣ decay tightens the trap as x grows.'],
      ['y lives between ±eˣ',0,'Decay, not growth — the envelope shrinks.']]},
     {q:'The first peak occurs at x = π/4, where y =', o:[
      ['e<sup>−π/4</sup>·sin(π/4) ≈ 0.32',1,'The product of a dying exponential and a rising sine.'],
      ['1',0,'The envelope has already fallen below 1 by π/4.'],
      ['0.5',0,'e^(−π/4) ≈ 0.456, times √2/2 ≈ 0.707 — about 0.32.']]}
    ],
    fact:'Same spiral sink, different seat: every initial condition is a different entry onto the same inward spiral — the envelope e⁻ˣ rules them all.'}
  ]},

{ id:23, ch:8, name:'The Equilibrium Zoo', vec:true,
  diag:{correct:['system'],
    why:'Two unknowns, straight-line rules — a linear system. The eigenvalues decide the personality of the origin.'},
  exercises:[
  { eqHTML:'x′ = x, y′ = −2y', icHTML:'x(0) = 0.4, y(0) = 1.2',
    window:{xmin:-0.3,xmax:1.5,ymin:-0.3,ymax:1.6}, x0:0.4, y0:1.2, tGoal:1, tFull:1.4, goalR:0.15,
    f:(x,y)=>[x,-2*y], solHTML:'orbit: x²y = 0.192',
    steps:[
     {q:'The system is diagonal — read off the eigenvalues:', o:[
      ['λ = 1 and −2',1,'x′ = x grows (λ = 1), y′ = −2y decays (λ = −2).'],
      ['λ = 1 and 2',0,'y′ = −2y — the second eigenvalue is negative.'],
      ['λ = −1 and −2',0,'x′ = +x — the first eigenvalue is positive.']]},
     {q:'Eigenvalues of opposite signs make the origin a:', o:[
      ['Saddle',1,'One direction attracts, the other repels.'],
      ['Node sink',0,'A sink needs both eigenvalues negative.'],
      ['Spiral',0,'Spirals need complex eigenvalues — these are real.']]},
     {q:'Which axis is the STABLE direction (flow toward 0)?', o:[
      ['The y-axis — λ = −2 pulls y to 0',1,'Solutions starting on the y-axis plunge into the origin.'],
      ['The x-axis',0,'λ = 1 there — the x-axis repels.'],
      ['Both axes',0,'Only the y-axis has a negative eigenvalue.']]},
     {q:'Orbits conserve x²y (check: d/dt(x²y) = 2x²y + x²(−2y) = 0). Through (0.4, 1.2):', o:[
      ['x²y = 0.192',1,'0.16 × 1.2 — orbits are curves y = 0.192/x².'],
      ['x²y = 0.48',0,'That’s xy — the invariant squares the x.'],
      ['xy² = 0.48',0,'Square the x, not the y: d/dt(x²y) = 0.']]},
     {q:'Predict your trace from (0.4, 1.2):', o:[
      ['x grows while y collapses — the orbit hugs the x-axis as it escapes right',1,'The unstable direction wins in the long run.'],
      ['The orbit spirals into the origin',0,'Real eigenvalues — no rotation.'],
      ['The orbit approaches the y-axis',0,'The y-direction decays; the orbit leaves it behind.']]}
    ],
    fact:'A saddle: swoop in along the stable axis, fling out along the unstable one. Orbits remember x²y = C forever.'},

  { eqHTML:'x′ = −x, y′ = −3y', icHTML:'x(0) = 1, y(0) = 1',
    window:{xmin:-0.3,xmax:1.3,ymin:-0.3,ymax:1.3}, x0:1, y0:1, tGoal:2, tFull:3, goalR:0.15,
    f:(x,y)=>[-x,-3*y], solHTML:'orbit: y = x³',
    steps:[
     {q:'Eigenvalues of x′ = −x, y′ = −3y:', o:[
      ['λ = −1 and −3',1,'Both negative — everything flows to the origin.'],
      ['λ = 1 and 3',0,'Both signs are negative here.'],
      ['λ = −1 and 3',0,'y′ = −3y — both decay.']]},
     {q:'Both eigenvalues negative → the origin is a:', o:[
      ['Node sink',1,'No rotation (real roots), all inward.'],
      ['Saddle',0,'A saddle needs opposite signs.'],
      ['Spiral sink',0,'Real eigenvalues can’t spiral.']]},
     {q:'As t → ∞, orbits approach the origin tangent to which direction?', o:[
      ['The x-axis — the SLOW direction (λ = −1)',1,'The fast component e⁻³ᵗ dies first; e⁻ᵗ lingers.'],
      ['The y-axis — the fast direction',0,'Fast decay vanishes quickly — orbits don’t hug it.'],
      ['No preferred direction',0,'The rates differ, so one dominates the approach.']]},
     {q:'Eliminate t (x = e⁻ᵗ, y = e⁻³ᵗ):', o:[
      ['y = x³',1,'(e⁻³ᵗ) = (e⁻ᵗ)³.'],
      ['y = 3x',0,'Cube, don’t multiply: e⁻³ᵗ = (e⁻ᵗ)³.'],
      ['y = x',0,'The rates differ — the orbit curves.']]},
     {q:'From (1, 1), the trace:', o:[
      ['Curves down to the origin, flattening onto the x-axis',1,'y = x³ dives faster than x.'],
      ['A straight line to the origin',0,'Only the axes themselves go straight in.'],
      ['Circles the origin',0,'No complex eigenvalues — no rotation.']]}
    ],
    fact:'Distinct negative eigenvalues make a node: every orbit slams into the origin tangent to the slow direction — the fast decay dies first.'},

  { eqHTML:'x′ = x − y, y′ = x + y', icHTML:'x(0) = 0.5, y(0) = 0',
    window:{xmin:-0.3,xmax:1.6,ymin:-0.3,ymax:1.6}, x0:0.5, y0:0, tGoal:1, tFull:1.3, goalR:0.16,
    f:(x,y)=>[x-y,x+y], solHTML:'orbit: r = ½eᵗ, counterclockwise',
    steps:[
     {q:'The matrix [[1, −1], [1, 1]] has trace 2 and determinant 2. The eigenvalues are:', o:[
      ['λ = 1 ± i',1,'λ² − 2λ + 2 = 0 → (2 ± √(−4))/2.'],
      ['λ = −1 ± i',0,'−trace/2 = +1 — the real part is positive.'],
      ['λ = ±i',0,'Pure imaginary needs trace 0 — here it’s 2.']]},
     {q:'Complex eigenvalues with POSITIVE real part make the origin a:', o:[
      ['Spiral source',1,'Rotation from ±i, explosion from the +1.'],
      ['Spiral sink',0,'Positive real part pushes outward.'],
      ['Center',0,'A center needs real part 0.']]},
     {q:'Which way does the rotation go? Evaluate the field at (1, 0):', o:[
      ['(1, 1) — up and right: counterclockwise',1,'The field points “ahead and around” the circle.'],
      ['(1, −1) — down and right: clockwise',0,'x′ = 1 − 0 = 1, y′ = 1 + 0 = 1 — both positive.'],
      ['(−1, 0) — pure left',0,'Compute: x′ = x − y = 1, y′ = x + y = 1.']]},
     {q:'The distance from the origin grows like:', o:[
      ['eᵗ — after one time unit, ×e ≈ 2.72',1,'The real part 1 drives the growth.'],
      ['t — linearly',0,'Complex eigenvalues mean exponential radius.'],
      ['It stays constant',0,'That’s a center — the real part is +1.']]},
     {q:'Predict your trace from (0.5, 0):', o:[
      ['Spirals outward, counterclockwise',1,'Follow the arrows — out and around.'],
      ['Spirals inward',0,'The real part is positive — outward.'],
      ['Escapes straight along the x-axis',0,'There are no real eigenvectors — nothing goes straight.']]}
    ],
    fact:'Spiral source: rotation from the imaginary part, explosion from the positive real part. Run time backwards and it’s a spiral sink.'}
  ]},

{ id:24, ch:8, name:'The Competing Colonies', vec:true,
  diag:{correct:['system'],
    why:'Two species competing — a nonlinear system. Nullclines and equilibria tell the story.'},
  exercises:[
  { eqHTML:'x′ = x(2 − x − y/2), y′ = y(2 − x/2 − y)', icHTML:'x(0) = 0.3, y(0) = 0.8',
    window:{xmin:-0.2,xmax:2.3,ymin:-0.2,ymax:2.3}, x0:0.3, y0:0.8, tGoal:4, tFull:6, goalR:0.22,
    f:(x,y)=>[x*(2-x-y/2), y*(2-x/2-y)], solHTML:'orbit into the coexistence node (4/3, 4/3)',
    steps:[
     {q:'Find ALL equilibria (x′ = 0 AND y′ = 0):', o:[
      ['(0,0), (2,0), (0,2) and (4/3, 4/3)',1,'Axes give three; the nullclines 2x+y=4 and x+2y=4 cross at (4/3, 4/3).'],
      ['Only (0, 0) and (4/3, 4/3)',0,'(2,0) and (0,2) also work — one species alone at its carrying capacity.'],
      ['Only (4/3, 4/3)',0,'Three more live on the axes.']]},
     {q:'The x-nullclines (where x′ = 0) are:', o:[
      ['x = 0 and 2x + y = 4',1,'x(2 − x − y/2) = 0.'],
      ['x = 0 and x + 2y = 4',0,'Those are the y-nullclines.'],
      ['y = 0 and x = 2',0,'y = 0 is a y-nullcline, and the slanted one is 2x + y = 4.']]},
     {q:'Each species limits ITSELF (coefficient 1) more than it limits the other (½). The coexistence point (4/3, 4/3) is:', o:[
      ['Stable — a genuine attractor',1,'Self-limitation damps the swings: orbits settle in.'],
      ['A saddle — one species wins',0,'Mutual limitation is weaker than self-limitation, so neither wins.'],
      ['A center — neutral cycles',0,'That’s Lotka–Volterra; self-limitation here kills the cycles.']]},
     {q:'Starting at (0.3, 0.8) — a few of each — predict the future:', o:[
      ['Both grow and settle at coexistence (4/3, 4/3)',1,'The node attracts everything nearby.'],
      ['x drives y extinct',0,'Neither can exclude the other here.'],
      ['Eternal cycles around (4/3, 4/3)',0,'Real eigenvalues — no cycling.']]},
     {q:'Compared with Lotka–Volterra, this system’s self-limitation turns the neutral center into:', o:[
      ['A stable node — cycles die out',1,'The −x² and −y² terms drain the “energy”.'],
      ['A bigger center',0,'Self-limitation is dissipative — it can’t preserve cycles.'],
      ['A source',0,'It attracts, not repels.']]}
    ],
    fact:'Self-limitation stabilizes coexistence: because each species restrains itself (1) more than its rival (½), the coexistence node genuinely attracts — no more eternal cycles.'},

  { eqHTML:'x′ = x(2 − x − y/2), y′ = y(2 − x/2 − y)', icHTML:'x(0) = 1.8, y(0) = 0.3',
    window:{xmin:-0.2,xmax:2.3,ymin:-0.2,ymax:2.3}, x0:1.8, y0:0.3, tGoal:4, tFull:6, goalR:0.22,
    f:(x,y)=>[x*(2-x-y/2), y*(2-x/2-y)], solHTML:'orbit into the coexistence node (4/3, 4/3)',
    steps:[
     {q:'At (1.8, 0.3): x′ = 1.8(2 − 1.8 − 0.15) = 0.09 — barely moving. Why?', o:[
      ['x sits almost on its nullcline 2x + y = 4 (here 3.9)',1,'Self-limitation: x is near its solo carrying capacity.'],
      ['x is near extinction',0,'x = 1.8 is large — it’s self-crowding, not rarity.'],
      ['The predators ate them',0,'y = 0.3 is small — competition, not predation.']]},
     {q:'Meanwhile y′ = 0.3(2 − 0.9 − 0.3) = 0.24 — y grows freely. Why?', o:[
      ['y is far from its nullcline x + 2y = 4 (here 2.4)',1,'Plenty of room for the y population.'],
      ['y has no nullcline',0,'Every species has one: x + 2y = 4.'],
      ['y limits itself less than x does',0,'Both self-limit with coefficient 1 — it’s the position that matters.']]},
     {q:'As y grows, the pair crosses the nullcline 2x + y = 4. Then x′ becomes:', o:[
      ['Negative — x gets pushed back below 2',1,'Crowding by y adds to x’s self-crowding.'],
      ['Positive — x escapes to infinity',0,'Past the nullcline the field pushes x down.'],
      ['Zero forever — x freezes',0,'Only ON the nullcline is x′ = 0.']]},
     {q:'The final state of this story:', o:[
      ['Coexistence at (4/3, 4/3)',1,'The stable node wins — neither species loses.'],
      ['x wins, y extinct',0,'(2, 0) is a saddle — not the destination from here.'],
      ['Oscillation forever',0,'Real eigenvalues — no cycles.']]}
    ],
    fact:'Read the nullclines like a map: between them the field points up-right; crossing one flips a component’s sign. The intersection is destiny.'}
  ]}
];

const CHAPTERS = [
 {name:'The Exponential Wilds', desc:'Growth & decay — y′ = ky and friends'},
 {name:'The Separable Realms',   desc:'Hyperbolas, circles & finite-time blow-up'},
 {name:'The Linear Legion',     desc:'Equilibria & the integrating factor'},
 {name:'Boss Fields',           desc:'Mixed techniques, hidden fields, uniqueness, harvests & Euler'},
 {name:'The Substitution Stronghold', desc:'Bernoulli powers & homogeneous ratios'},
 {name:'The Exact Empire',       desc:'Potential functions, tilted conics & almost-exact repairs'},
 {name:'The Real-World Realms', desc:'Cooling, mixing, circuits, isotopes & terminal velocity'},
 {name:'The Phase Plains',      desc:'Oscillators, spirals, linear systems & ecology'}
];

const FORMULAS = [
 {ch:1, items:['<span class="math">y′ = ky ⟹ y = Ce<sup>kx</sup></span>',
   'k &gt; 0 growth, k &lt; 0 decay; half-life = ln2/|k|',
   'C = y(0) — the constant copies the start']},
 {ch:2, items:['<span class="math">dy/g(y) = f(x)dx ⟹ G(y) = F(x) + C</span>',
   '<span class="math">∫dy/y = ln|y|</span>, <span class="math">∫dy/y² = −1/y</span>',
   'x/y family → hyperbolas; −x/y → circles',
   'Blow-up: <span class="math">y′ = y² ⟹ y = 1/(C−x)</span>']},
 {ch:3, items:['<span class="math">y′ + P(x)y = Q(x)</span>, μ = e^∫P dx, <span class="math">(μy)′ = μQ</span>',
   'Equilibria: stable (arrows toward), unstable (away)',
   'μ can be x or 1/x — not just exponentials']},
 {ch:4, items:['<span class="math">y′ = f(x)·y ⟹ y = Ce^∫f dx</span>',
   'Logistic: <span class="math">y′ = y(1−y) ⟹ y = 1/(1+Ce⁻ˣ)</span>',
   'Reading fields: equilibria, autonomy (identical columns), stability',
   'Harvest h: equilibria merge at h = ¼, vanish beyond',
   'Euler: <span class="math">yₙ₊₁ = yₙ + h·f(xₙ, yₙ)</span> — error ~ O(h)']},
 {ch:5, items:['Bernoulli <span class="math">y′ + Py = Qyⁿ</span>: substitute <span class="math">v = y<sup>1−n</sup></span> → linear',
   'Homogeneous: substitute <span class="math">v = y/x</span>, so <span class="math">y′ = v + xv′</span>']},
 {ch:6, items:['<span class="math">M dx + N dy = 0</span> exact ⟺ <span class="math">M_y = N_x</span>',
   'Find F with F_x = M, F_y = N; solution is <span class="math">F = C</span>',
   'Almost-exact: if <span class="math">(M_y − N_x)/N = g(x)</span>, then <span class="math">μ(x) = e^∫g dx</span> repairs it']},
 {ch:7, items:['Newton cooling: <span class="math">y′ = −k(y − A) ⟹ y = A + Ce<sup>−kx</sup></span>',
   'Terminal velocity = the stable equilibrium',
   'Mixing: dA/dt = inflow − outflow · RC: gap decays like e<sup>−x/RC</sup> · half-life → k = ln2/T']},
 {ch:8, items:['<span class="math">y″ + py′ + qy = 0</span> → characteristic <span class="math">r² + pr + q = 0</span>',
   'Real distinct: Ce^rx · Repeated: (C₁+C₂x)e^rx · Complex α±βi: e^αx(cos βx, sin βx)',
   'Phase plane (y, y′): center = circles, saddle = hyperbolas, damping = spiral',
   'Linear systems: λ real opposite → saddle · both &lt; 0 → node sink · complex → spiral (Re λ &lt; 0 = sink)',
   'Lotka–Volterra: <span class="math">x′ = x(1−y), y′ = y(x−1)</span>; invariant x + y − ln x − ln y']}
];

/* =========================================================
   EXERCISE POOLS — shuffle-bag selection + resolution
   ========================================================= */
const bags = {};
const lastPicked = {};

function refillBag(levelIdx){
  const n = LEVELS[levelIdx].exercises.length;
  const bag = shuffle(Array.from({length:n}, (_,i)=>i));
  const last = lastPicked[levelIdx];
  if(n>1 && last!==undefined && bag[bag.length-1]===last){
    const j = Math.floor(Math.random()*(n-1));
    [bag[bag.length-1], bag[j]] = [bag[j], bag[bag.length-1]];
  }
  return bag;
}
function pickExerciseIdx(levelIdx){
  if(!bags[levelIdx] || bags[levelIdx].length===0) bags[levelIdx] = refillBag(levelIdx);
  const idx = bags[levelIdx].pop();
  lastPicked[levelIdx] = idx;
  return idx;
}
function expandSteps(steps){
  return steps.map(s=>({ q:s.q, opts:s.o.map(o=>({t:o[0], ok:!!o[1], fb:o[2]})) }));
}
function resolveExercise(levelIdx, exIdx){
  const shell = LEVELS[levelIdx], ex = shell.exercises[exIdx];
  return {
    id:shell.id, ch:shell.ch, name:shell.name,
    diag:ex.diag || shell.diag, hideEq:ex.hideEq!==undefined?ex.hideEq:!!shell.hideEq,
    vec:!!shell.vec, icHTML:ex.icHTML||shell.icHTML||'',
    eqHTML:ex.eqHTML, window:ex.window, x0:ex.x0, y0:ex.y0, xT:ex.xT,
    tGoal:ex.tGoal, tFull:ex.tFull, goalR:ex.goalR,
    f:ex.f, sol:ex.sol, solHTML:ex.solHTML,
    steps:expandSteps(ex.steps), fact:ex.fact
  };
}

/* ---------- persistence ---------- */
const SAVE_KEY='slopequest-v2';
function defaultSave(){ return {stars:{}, xp:0, sound:true, practice:false, errs:{}, played:{}}; }
let save = defaultSave();
try{
  const raw = localStorage.getItem(SAVE_KEY);
  if(raw) save = Object.assign(defaultSave(), JSON.parse(raw));
}catch(e){}
function persist(){ try{ localStorage.setItem(SAVE_KEY, JSON.stringify(save)); }catch(e){} }

/* ---------- error log (weak spots) ---------- */
function logErr(key){
  save.errs = save.errs || {};
  save.errs[key] = (save.errs[key]||0) + 1;
  persist();
}
function levelErrs(id){
  let n = 0;
  for(const k in (save.errs||{})) if(+k.split(':')[0]===id) n += save.errs[k];
  return n;
}

/* ---------- sound ---------- */
const Snd = {
  ctx:null,
  ensure(){
    if(!save.sound) return;
    if(!this.ctx){ try{ this.ctx = new (window.AudioContext||window.webkitAudioContext)(); }catch(e){} }
    if(this.ctx && this.ctx.state==='suspended') this.ctx.resume();
  },
  tone(f,d,type,vol,delay){
    if(!save.sound||!this.ctx) return;
    try{
      const t0=this.ctx.currentTime+(delay||0);
      const o=this.ctx.createOscillator(), g=this.ctx.createGain();
      o.type=type||'sine'; o.frequency.value=f;
      g.gain.setValueAtTime(0.0001,t0);
      g.gain.exponentialRampToValueAtTime(vol||0.12,t0+0.015);
      g.gain.exponentialRampToValueAtTime(0.0001,t0+d);
      o.connect(g); g.connect(this.ctx.destination);
      o.start(t0); o.stop(t0+d+0.05);
    }catch(e){}
  },
  correct(){ this.ensure(); this.tone(523,.1,'sine',.12); this.tone(784,.14,'sine',.12,.09); },
  wrong(){   this.ensure(); this.tone(150,.22,'sawtooth',.07); this.tone(110,.22,'sawtooth',.06,.06); },
  star(i){   this.ensure(); this.tone(660+i*170,.16,'triangle',.14); },
  win(){     this.ensure(); [523,659,784,1047].forEach((f,i)=>this.tone(f,.18,'triangle',.12,i*.11)); },
  peek(){    this.ensure(); this.tone(1200,.08,'sine',.06); this.tone(1600,.1,'sine',.05,.07); },
  tick(){    this.ensure(); this.tone(880,.04,'sine',.05); }
};
window.addEventListener('pointerdown',()=>Snd.ensure(),{once:true});

/* ---------- game state ---------- */
const G = {
  screen:'title', levelIdx:0, exIdx:0, level:null, phase:'idle',
  focus:100, stepIdx:0, stars:0, gainedXP:0, revealT:0, time:0,
  mixed:false, practice:false, eulerH:0, orbit:null, showNullclines:false,
  trace:{pts:[],active:false,done:false,peeked:false,peekUntil:0,yCross:null,score:0,adh:0,end:0}
};

function showScreen(id){
  $$('.screen').forEach(s=>s.classList.toggle('active', s.id===id));
  G.screen = id.replace('screen-','');
}

/* ---------- canvas & coordinates ---------- */
const canvas = $('#game-canvas'), ctx = canvas.getContext('2d'), wrap = $('#canvas-wrap');
let dpr=1, cw=0, chh=0;
let view = {xmin:-3, xmax:3, ymin:-2, ymax:2};

const px = x => (x-view.xmin)/(view.xmax-view.xmin)*cw;
const py = y => chh-(y-view.ymin)/(view.ymax-view.ymin)*chh;
const toMathX = p => view.xmin + p/cw*(view.xmax-view.xmin);
const toMathY = p => view.ymin + (1-p/chh)*(view.ymax-view.ymin);

function safeF(x,y){
  let m;
  try{ m = G.level ? G.level.f(x,y) : 0; }catch(e){ m=0; }
  if(typeof m!=='number'||isNaN(m)) return 0;
  if(!isFinite(m)) return m>0 ? 1e6 : -1e6;
  return clamp(m,-1e6,1e6);
}
/* unified vector accessor: scalar → (1, m); vec → (u, v).
   Returns null where the field is UNDEFINED (e.g. x/y at y = 0). */
function fieldVec(x,y){
  if(G.level && G.level.vec){
    let u=0,v=0;
    try{ const w=G.level.f(x,y); u=w[0]; v=w[1]; }catch(e){}
    const fix=t=>{ if(typeof t!=='number'||isNaN(t)) return null;
      if(!isFinite(t)) return t>0?1e6:-1e6; return clamp(t,-1e6,1e6); };
    const fu=fix(u), fv=fix(v);
    if(fu===null||fv===null) return null;
    return [fu,fv];
  }
  let m;
  try{ m = G.level ? G.level.f(x,y) : 0; }catch(e){ m=0; }
  if(typeof m!=='number'||isNaN(m)) return null;   /* field undefined here */
  if(!isFinite(m)) return [1, m>0?1e6:-1e6];
  return [1, clamp(m,-1e6,1e6)];
}

/* ---------- phase-plane orbit (RK4, computed per level) ---------- */
function integrateVec(f, x0, y0, tMax, dt){
  const pts=[{t:0,x:x0,y:y0}];
  let x=x0, y=y0, t=0;
  const n=Math.min(6000, Math.ceil(tMax/dt));
  for(let i=0;i<n;i++){
    const k1=f(x,y), k2=f(x+dt/2*k1[0], y+dt/2*k1[1]),
          k3=f(x+dt/2*k2[0], y+dt/2*k2[1]), k4=f(x+dt*k3[0], y+dt*k3[1]);
    x += dt/6*(k1[0]+2*k2[0]+2*k3[0]+k4[0]);
    y += dt/6*(k1[1]+2*k2[1]+2*k3[1]+k4[1]);
    t += dt;
    if(!isFinite(x)||!isFinite(y)) break;
    pts.push({t,x,y});
  }
  return pts;
}
function computeOrbit(L){
  const dt=0.004, tMax=L.tFull||16;
  const pts=integrateVec(L.f, L.x0, L.y0, tMax, dt);
  if(!L.tFull){ /* auto-close loops */
    for(let i=0;i<pts.length;i++){
      const p=pts[i];
      if(p.t>2 && Math.hypot(p.x-L.x0,p.y-L.y0)<0.06){ pts.length=i+1; break; }
    }
  }
  return pts;
}
function orbitAt(t){
  const p=G.orbit;
  if(!p||!p.length) return {x:G.level.x0,y:G.level.y0};
  if(t<=0) return p[0];
  if(t>=p[p.length-1].t) return p[p.length-1];
  let lo=0, hi=p.length-1;
  while(hi-lo>1){ const mid=(lo+hi)>>1; (p[mid].t<=t)?lo=mid:hi=mid; }
  const a=p[lo], b=p[hi], s=(t-a.t)/(b.t-a.t||1e-9);
  return {x:lerp(a.x,b.x,s), y:lerp(a.y,b.y,s)};
}
/* scalar RK4 — used for the solution-family sketch */
function rk4Scalar(f, x0, y0, xEnd, n){
  const pts=[{x:x0,y:y0}];
  let x=x0, y=y0;
  const h=(xEnd-x0)/n;
  for(let i=0;i<n;i++){
    const k1=f(x,y); if(isNaN(k1)) break;
    const k2=f(x+h/2,y+h*k1/2); if(isNaN(k2)) break;
    const k3=f(x+h/2,y+h*k2/2); if(isNaN(k3)) break;
    const k4=f(x+h,y+h*k3); if(isNaN(k4)) break;
    y+=h/6*(k1+2*k2+2*k3+k4); x+=h;
    if(!isFinite(y)) break;
    pts.push({x,y});
  }
  return pts;
}

/* ---------- pre-rendered slope field ---------- */
const fieldCv = document.createElement('canvas');
function buildField(){
  if(cw<2||chh<2) return;
  fieldCv.width=canvas.width; fieldCv.height=canvas.height;
  const c=fieldCv.getContext('2d');
  c.setTransform(dpr,0,0,dpr,0,0);
  const g=c.createLinearGradient(0,0,0,chh);
  g.addColorStop(0,'#0d1424'); g.addColorStop(1,'#0a0f1d');
  c.fillStyle=g; c.fillRect(0,0,cw,chh);
  const nx=Math.round(clamp(cw/46,8,26)), ny=Math.round(clamp(chh/46,6,20));
  c.strokeStyle='rgba(120,160,255,0.07)'; c.lineWidth=1;
  for(let i=0;i<=nx;i++){ const X=Math.round(px(view.xmin+(view.xmax-view.xmin)*i/nx))+.5;
    c.beginPath(); c.moveTo(X,0); c.lineTo(X,chh); c.stroke(); }
  for(let j=0;j<=ny;j++){ const Y=Math.round(py(view.ymin+(view.ymax-view.ymin)*j/ny))+.5;
    c.beginPath(); c.moveTo(0,Y); c.lineTo(cw,Y); c.stroke(); }
  c.strokeStyle='rgba(160,190,255,0.28)'; c.lineWidth=1.5;
  const ax=px(0), ay=py(0);
  if(ax>=0&&ax<=cw){ c.beginPath(); c.moveTo(ax,0); c.lineTo(ax,chh); c.stroke(); }
  if(ay>=0&&ay<=chh){ c.beginPath(); c.moveTo(0,ay); c.lineTo(cw,ay); c.stroke(); }
  const cols=Math.round(clamp(cw/38,8,30)), rows=Math.round(clamp(chh/38,6,24));
  const cellW=cw/cols, cellH=chh/rows;
  c.lineCap='round'; c.lineWidth=1.6;
  for(let i=0;i<cols;i++)for(let j=0;j<rows;j++){
    const ccx=(i+.5)*cellW, ccy=(j+.5)*cellH;
    const fv=fieldVec(toMathX(ccx), toMathY(ccy));
    if(!fv){ /* field undefined here — mark with a faint dot, no arrow */
      c.fillStyle='rgba(150,170,210,.20)';
      c.beginPath(); c.arc(ccx,ccy,1.6,0,Math.PI*2); c.fill();
      continue;
    }
    const [u,v]=fv;
    const ang=Math.atan2(v,u); /* screen dir (cos,−sin) ∝ (u,−v) */
    const L=Math.min(cellW,cellH)*0.62;
    const dxs=Math.cos(ang)*L/2, dys=-Math.sin(ang)*L/2;
    const t=Math.abs(ang)/(Math.PI/2);
    c.strokeStyle=`rgba(110,190,255,${0.16+0.3*t})`;
    c.beginPath(); c.moveTo(ccx-dxs,ccy-dys); c.lineTo(ccx+dxs,ccy+dys); c.stroke();
  }
}

/* ---------- nullcline overlay (phase-plane levels) ---------- */
const nullCv = document.createElement('canvas');
function buildNullclines(){
  nullCv.width=canvas.width; nullCv.height=canvas.height;
  const c=nullCv.getContext('2d');
  c.setTransform(dpr,0,0,dpr,0,0);
  if(!G.level||!G.level.vec||cw<2) return;
  const cols=64, rows=44;
  const grid=[];
  for(let j=0;j<=rows;j++)for(let i=0;i<=cols;i++){
    const x=view.xmin+(view.xmax-view.xmin)*i/cols;
    const y=view.ymin+(view.ymax-view.ymin)*(1-j/rows);
    grid.push(fieldVec(x,y));
  }
  const at=(i,j)=>grid[j*(cols+1)+i];
  const drawZero=(comp,color)=>{
    c.fillStyle=color;
    for(let i=0;i<cols;i++)for(let j=0;j<rows;j++){
      const a=at(i,j), b=at(i+1,j), d=at(i,j+1);
      if(!a||!b||!d) continue;
      if((a[comp]>0)!==(b[comp]>0)){
        const t=a[comp]/(a[comp]-b[comp]||1e-9);
        const X=px(view.xmin+(view.xmax-view.xmin)*(i+t)/cols);
        const Y=py(view.ymin+(view.ymax-view.ymin)*(1-j/rows));
        c.beginPath(); c.arc(X,Y,1.7,0,Math.PI*2); c.fill();
      }
      if((a[comp]>0)!==(d[comp]>0)){
        const t=a[comp]/(a[comp]-d[comp]||1e-9);
        const X=px(view.xmin+(view.xmax-view.xmin)*i/cols);
        const Y=py(view.ymin+(view.ymax-view.ymin)*(1-(j+t)/rows));
        c.beginPath(); c.arc(X,Y,1.7,0,Math.PI*2); c.fill();
      }
    }
  };
  drawZero(0,'rgba(255,154,98,.55)');   /* x′ = 0 */
  drawZero(1,'rgba(167,139,250,.55)');  /* y′ = 0 */
  c.font='600 10px system-ui,sans-serif';
  c.fillStyle='rgba(255,154,98,.9)'; c.fillText('◈ x′=0',10,18);
  c.fillStyle='rgba(167,139,250,.9)'; c.fillText('◈ y′=0',10,32);
}

function resizeCanvas(){
  const r=wrap.getBoundingClientRect();
  if(r.width<2||r.height<2) return;
  dpr=Math.min(window.devicePixelRatio||1,2);
  cw=r.width; chh=r.height;
  canvas.width=Math.round(cw*dpr); canvas.height=Math.round(chh*dpr);
  canvas.style.width=cw+'px'; canvas.style.height=chh+'px';
  ctx.setTransform(dpr,0,0,dpr,0,0);
  buildField();
  if(G.showNullclines) buildNullclines();
}
new ResizeObserver(resizeCanvas).observe(wrap);

/* ---------- flow particles ---------- */
let parts=[];
function newPart(){
  const x=rand(view.xmin,view.xmax), y=rand(view.ymin,view.ymax);
  return {x,y,ox:x,oy:y,age:0,life:rand(3,7)};
}
function initParts(){
  parts=[];
  const n=Math.round(clamp(cw*chh/9000,40,110));
  for(let i=0;i<n;i++){ const p=newPart(); p.age=rand(0,p.life); parts.push(p); }
}
function stepParts(dt){
  const sp=(view.xmax-view.xmin)/9;
  for(const p of parts){
    const fv=fieldVec(p.x,p.y);
    if(!fv){ Object.assign(p,newPart()); continue; }   /* undefined field — respawn */
    const [u,v]=fv, d=Math.hypot(u,v)||1;
    p.ox=p.x; p.oy=p.y;
    p.x+=(u/d)*sp*dt; p.y+=(v/d)*sp*dt; p.age+=dt;
    if(p.age>p.life||p.x>view.xmax||p.x<view.xmin||p.y>view.ymax||p.y<view.ymin){
      Object.assign(p,newPart());
    }
  }
}
function drawParts(){
  ctx.save(); ctx.globalCompositeOperation='lighter';
  ctx.lineWidth=1.4; ctx.lineCap='round';
  for(const p of parts){
    const a=clamp(Math.min(p.age*1.5,(p.life-p.age)*1.5),0,1)*0.45;
    if(a<=0.02) continue;
    ctx.strokeStyle=`rgba(130,215,255,${a})`;
    ctx.beginPath(); ctx.moveTo(px(p.ox),py(p.oy)); ctx.lineTo(px(p.x),py(p.y)); ctx.stroke();
  }
  ctx.restore();
}

/* ---------- solution curve drawing ---------- */
function drawSolution(color,width,progress){
  if(progress===undefined) progress=1;
  const L=G.level;
  ctx.save();
  ctx.strokeStyle=color; ctx.lineWidth=width; ctx.lineJoin='round'; ctx.lineCap='round';
  if(width>=3){ ctx.shadowColor=color; ctx.shadowBlur=14; }
  ctx.beginPath();
  if(L.vec){
    const n=90, tEnd=L.tGoal*progress;
    for(let i=0;i<=n;i++){
      const p=orbitAt(tEnd*i/n), X=px(p.x), Y=py(p.y);
      i===0?ctx.moveTo(X,Y):ctx.lineTo(X,Y);
    }
  }else{
    const n=90, xa=L.x0, xb=L.x0+(L.xT-L.x0)*progress;
    let started=false;
    for(let i=0;i<=n;i++){
      const x=lerp(xa,xb,i/n), y=L.sol(x);
      if(!isFinite(y)){ started=false; continue; }
      const X=px(x), Y=py(y);
      if(!started){ ctx.moveTo(X,Y); started=true; } else ctx.lineTo(X,Y);
    }
  }
  ctx.stroke(); ctx.restore();
}
function drawSolutionFull(color,width){
  const L=G.level;
  ctx.save();
  ctx.strokeStyle=color; ctx.lineWidth=width; ctx.lineJoin='round';
  ctx.beginPath();
  if(L.vec){
    G.orbit.forEach((p,i)=> i===0?ctx.moveTo(px(p.x),py(p.y)):ctx.lineTo(px(p.x),py(p.y)));
  }else{
    const n=140; let started=false;
    for(let i=0;i<=n;i++){
      const x=lerp(view.xmin,view.xmax,i/n), y=L.sol(x);
      if(!isFinite(y)){ started=false; continue; }
      const X=px(x), Y=py(y);
      if(!started){ ctx.moveTo(X,Y); started=true; } else ctx.lineTo(X,Y);
    }
  }
  ctx.stroke(); ctx.restore();
}

/* ---------- solution family (reveal: the general solution, sketched) ---------- */
function drawFamily(){
  const L=G.level;
  ctx.save();
  ctx.strokeStyle='rgba(255,255,255,.15)'; ctx.lineWidth=1.5; ctx.lineJoin='round';
  const stroke=pts=>{
    ctx.beginPath(); let started=false;
    for(const p of pts){
      if(!isFinite(p.x)||!isFinite(p.y)){ started=false; continue; }
      const X=px(p.x), Y=py(p.y);
      if(!started){ ctx.moveTo(X,Y); started=true; } else ctx.lineTo(X,Y);
    }
    ctx.stroke();
  };
  if(L.vec){
    const d=(view.xmax-view.xmin)/16;
    const tMax=L.tFull ? L.tFull*0.85 : 14;
    [[d,0],[-d,0],[0,d],[0,-d]].forEach(([dx,dy])=>{
      stroke(integrateVec(L.f, L.x0+dx, L.y0+dy, tMax, 0.005));
    });
  }else{
    const sf=(x,y)=>{ try{ const m=L.f(x,y); return (typeof m==='number')?m:NaN; }catch(e){ return NaN; } };
    const dy0=(view.ymax-view.ymin)/8;
    for(let k=-2;k<=2;k++){
      if(k===0) continue;
      const y0=L.y0+k*dy0;
      stroke(rk4Scalar(sf,L.x0,y0,view.xmax,220));
      stroke(rk4Scalar(sf,L.x0,y0,view.xmin,220));
    }
  }
  ctx.restore();
}

/* ---------- time-series inset (phase-plane levels, reveal) ---------- */
function drawTimeSeries(){
  const L=G.level; if(!L.vec||!G.orbit||G.orbit.length<2) return;
  const w=Math.min(180,Math.max(120,cw*0.3)), h=w*0.5;
  const bx=cw-w-14, by=14;
  let lo=Infinity, hi=-Infinity;
  for(const p of G.orbit){ if(p.t>L.tGoal) break; if(p.x<lo)lo=p.x; if(p.x>hi)hi=p.x; }
  if(!isFinite(lo)||!isFinite(hi)){ lo=0; hi=1; }
  if(hi-lo<1e-9){ hi=lo+1; }
  ctx.save();
  ctx.fillStyle='rgba(10,15,29,.85)';
  ctx.strokeStyle='rgba(120,160,255,.3)'; ctx.lineWidth=1;
  ctx.fillRect(bx,by,w,h); ctx.strokeRect(bx,by,w,h);
  ctx.strokeStyle='rgba(77,227,255,.95)'; ctx.lineWidth=2; ctx.beginPath();
  const n=120, tEnd=L.tGoal*G.revealT;
  for(let i=0;i<=n;i++){
    const t=tEnd*i/n, p=orbitAt(t);
    const X=bx+8+(w-16)*(t/L.tGoal);
    const Y=by+h-8-(h-16)*clamp((p.x-lo)/(hi-lo),0,1);
    i===0?ctx.moveTo(X,Y):ctx.lineTo(X,Y);
  }
  ctx.stroke();
  ctx.fillStyle='rgba(143,163,200,.95)'; ctx.font='600 10px system-ui,sans-serif';
  ctx.fillText('y vs t', bx+8, by+14);
  ctx.restore();
}

/* ---------- Euler overlay ---------- */
function eulerPoints(){
  const L=G.level, h=G.eulerH, pts=[{x:L.x0,y:L.y0}];
  if(L.vec){
    let x=L.x0,y=L.y0,t=0,guard=0;
    while(t<L.tGoal-1e-9 && guard++<10000){
      const fv=fieldVec(x,y);
      if(!fv) break;
      const [u,v]=fv; x+=h*u; y+=h*v; t+=h; pts.push({x,y});
    }
  }else{
    let x=L.x0,y=L.y0,guard=0;
    while(x<L.xT-1e-9 && guard++<10000){
      y+=h*safeF(x,y); x+=h; pts.push({x,y});
    }
  }
  return pts;
}
function drawEuler(){
  if(!G.eulerH||!G.level) return;
  const pts=eulerPoints();
  ctx.save();
  ctx.strokeStyle='rgba(255,154,98,.9)'; ctx.lineWidth=2; ctx.setLineDash([7,5]);
  ctx.beginPath();
  pts.forEach((p,i)=> i===0?ctx.moveTo(px(p.x),py(p.y)):ctx.lineTo(px(p.x),py(p.y)));
  ctx.stroke(); ctx.setLineDash([]);
  ctx.fillStyle='rgba(255,154,98,.95)';
  pts.forEach(p=>{ ctx.beginPath(); ctx.arc(px(p.x),py(p.y),3,0,Math.PI*2); ctx.fill(); });
  ctx.restore();
}

/* ---------- main game render ---------- */
function drawGame(dt){
  G.time+=dt;
  if(cw<2||chh<2) return;
  ctx.clearRect(0,0,cw,chh);
  ctx.drawImage(fieldCv,0,0,cw,chh);
  if(G.showNullclines && G.level && G.level.vec && nullCv.width>0){
    ctx.drawImage(nullCv,0,0,cw,chh);
  }
  stepParts(dt); drawParts();
  if(!G.level) return;
  const L=G.level;

  /* goal */
  ctx.save();
  if(L.vec){
    const gp=orbitAt(L.tGoal), r=Math.max(10, (L.goalR||0.25)/(view.xmax-view.xmin)*cw);
    const pulse=2+1.5*Math.sin(G.time*5);
    ctx.strokeStyle='rgba(255,209,102,.85)'; ctx.lineWidth=2.5;
    ctx.beginPath(); ctx.arc(px(gp.x),py(gp.y),r,0,Math.PI*2); ctx.stroke();
    ctx.strokeStyle='rgba(255,209,102,.35)';
    ctx.beginPath(); ctx.arc(px(gp.x),py(gp.y),r+pulse,0,Math.PI*2); ctx.stroke();
    ctx.fillStyle='#ffd166'; ctx.font='600 11px system-ui,sans-serif';
    ctx.fillText('GOAL', px(gp.x)+r+6, py(gp.y)+4);
  }else{
    const gx=px(L.xT);
    ctx.strokeStyle='rgba(255,209,102,0.85)'; ctx.lineWidth=2; ctx.setLineDash([10,8]);
    ctx.beginPath(); ctx.moveTo(gx,0); ctx.lineTo(gx,chh); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle='#ffd166';
    ctx.beginPath(); ctx.moveTo(gx,16); ctx.lineTo(gx+26,24); ctx.lineTo(gx,32); ctx.closePath(); ctx.fill();
    ctx.fillStyle='rgba(255,209,102,.9)'; ctx.font='600 11px system-ui,sans-serif';
    ctx.fillText('GOAL', gx+6, 48);
  }
  ctx.restore();

  /* start dot */
  const sx=px(L.x0), sy=py(L.y0);
  const pulse=3+2.5*Math.sin(G.time*5);
  ctx.save();
  ctx.strokeStyle='rgba(77,227,255,.9)'; ctx.lineWidth=2;
  ctx.beginPath(); ctx.arc(sx,sy,10+pulse,0,Math.PI*2); ctx.stroke();
  ctx.fillStyle='#4de3ff';
  ctx.beginPath(); ctx.arc(sx,sy,5,0,Math.PI*2); ctx.fill();
  ctx.restore();

  if(G.trace.peeked && !G.trace.done && performance.now()<G.trace.peekUntil){
    drawSolution('rgba(255,255,255,.55)',2);
  }

  if(G.trace.pts.length>1){
    ctx.save();
    ctx.strokeStyle='#4de3ff'; ctx.lineWidth=3.5; ctx.lineJoin='round'; ctx.lineCap='round';
    ctx.shadowColor='rgba(77,227,255,.8)'; ctx.shadowBlur=12;
    ctx.beginPath();
    ctx.moveTo(px(G.trace.pts[0].x),py(G.trace.pts[0].y));
    for(let i=1;i<G.trace.pts.length;i++) ctx.lineTo(px(G.trace.pts[i].x),py(G.trace.pts[i].y));
    ctx.stroke(); ctx.restore();
  }

  drawEuler();

  if(G.phase==='reveal'){
    G.revealT=Math.min(1,G.revealT+dt/1.4);
    drawFamily();
    drawSolutionFull('rgba(255,209,102,.25)',1.5);
    drawSolution('#ffd166',3.5,G.revealT);
    if(L.vec) drawTimeSeries();
    ctx.save();
    ctx.setLineDash([4,4]); ctx.strokeStyle='rgba(255,255,255,.5)'; ctx.lineWidth=1.5;
    ctx.beginPath();
    if(L.vec){
      const gp=orbitAt(L.tGoal), last=G.trace.pts[G.trace.pts.length-1]||gp;
      ctx.moveTo(px(gp.x),py(gp.y)); ctx.lineTo(px(last.x),py(last.y));
    }else{
      const yT=L.sol(L.xT), ty=py(yT), cy=py(G.trace.yCross), gx=px(L.xT);
      ctx.moveTo(gx,ty); ctx.lineTo(gx,cy);
    }
    ctx.stroke(); ctx.setLineDash([]);
    if(L.vec){
      const gp=orbitAt(L.tGoal), last=G.trace.pts[G.trace.pts.length-1]||gp;
      ctx.fillStyle='#ffd166'; ctx.beginPath(); ctx.arc(px(gp.x),py(gp.y),6,0,Math.PI*2); ctx.fill();
      ctx.fillStyle='#4de3ff'; ctx.beginPath(); ctx.arc(px(last.x),py(last.y),6,0,Math.PI*2); ctx.fill();
    }else{
      const yT=L.sol(L.xT), ty=py(yT), cy=py(G.trace.yCross), gx=px(L.xT);
      ctx.fillStyle='#ffd166'; ctx.beginPath(); ctx.arc(gx,ty,6,0,Math.PI*2); ctx.fill();
      ctx.fillStyle='#4de3ff'; ctx.beginPath(); ctx.arc(gx,cy,6,0,Math.PI*2); ctx.fill();
    }
    ctx.restore();
  }
}

/* ---------- title screen background ---------- */
const tcv=$('#title-canvas'), tctx=tcv.getContext('2d');
let tw=0, th=0;
const TVIEW={xmin:-4.6,xmax:4.6,ymin:-3,ymax:3};
const tpx=x=>(x-TVIEW.xmin)/(TVIEW.xmax-TVIEW.xmin)*tw;
const tpy=y=>th-(y-TVIEW.ymin)/(TVIEW.ymax-TVIEW.ymin)*th;
const tf=(x,y)=>Math.sin(x)*Math.cos(y);
let tparts=[];
function resizeTitle(){
  const r=tcv.getBoundingClientRect();
  if(r.width<2||r.height<2) return;
  const td=Math.min(window.devicePixelRatio||1,2);
  tw=r.width; th=r.height;
  tcv.width=Math.round(tw*td); tcv.height=Math.round(th*td);
  tctx.setTransform(td,0,0,td,0,0);
}
function initTitleParts(){
  tparts=[];
  for(let i=0;i<70;i++){
    const x=rand(TVIEW.xmin,TVIEW.xmax), y=rand(TVIEW.ymin,TVIEW.ymax);
    tparts.push({x,y,ox:x,oy:y,age:rand(0,4),life:rand(3,7)});
  }
}
function drawTitle(dt){
  if(tw<2) return;
  const g=tctx.createLinearGradient(0,0,0,th);
  g.addColorStop(0,'#0b1120'); g.addColorStop(1,'#0e1730');
  tctx.fillStyle=g; tctx.fillRect(0,0,tw,th);
  const cols=Math.max(4,Math.round(tw/56)), rows=Math.max(3,Math.round(th/56));
  const cwx=tw/cols, chx=th/rows;
  tctx.lineWidth=1.3; tctx.lineCap='round'; tctx.strokeStyle='rgba(110,190,255,0.13)';
  for(let i=0;i<cols;i++)for(let j=0;j<rows;j++){
    const ccx=(i+.5)*cwx, ccy=(j+.5)*chx;
    const xm=TVIEW.xmin+(TVIEW.xmax-TVIEW.xmin)*(i+.5)/cols;
    const ym=TVIEW.ymin+(TVIEW.ymax-TVIEW.ymin)*(1-(j+.5)/rows);
    const ang=Math.atan(tf(xm,ym));
    const L=Math.min(cwx,chx)*0.52;
    const dxs=Math.cos(ang)*L/2, dys=-Math.sin(ang)*L/2;
    tctx.beginPath(); tctx.moveTo(ccx-dxs,ccy-dys); tctx.lineTo(ccx+dxs,ccy+dys); tctx.stroke();
  }
  for(const p of tparts){
    const m=tf(p.x,p.y), d=Math.hypot(1,m);
    p.ox=p.x; p.oy=p.y;
    p.x+=(1/d)*0.6*dt; p.y+=(m/d)*0.6*dt; p.age+=dt;
    if(p.age>p.life||p.x>TVIEW.xmax||p.x<TVIEW.xmin||p.y>TVIEW.ymax||p.y<TVIEW.ymin){
      p.x=rand(TVIEW.xmin,TVIEW.xmax); p.y=rand(TVIEW.ymin,TVIEW.ymax);
      p.ox=p.x; p.oy=p.y; p.age=0; p.life=rand(3,7); continue;
    }
    const a=clamp(Math.min(p.age*1.5,(p.life-p.age)*1.5),0,1)*0.5;
    if(a<=0.02) continue;
    tctx.strokeStyle=`rgba(130,215,255,${a})`; tctx.lineWidth=1.5;
    tctx.beginPath(); tctx.moveTo(tpx(p.ox),tpy(p.oy)); tctx.lineTo(tpx(p.x),tpy(p.y)); tctx.stroke();
  }
}

/* ---------- main loop ---------- */
let lastT=performance.now();
function frame(t){
  const dt=Math.min(0.05,(t-lastT)/1000); lastT=t;
  if(G.screen==='title') drawTitle(dt);
  else if(G.screen==='game') drawGame(dt);
  requestAnimationFrame(frame);
}

/* ---------- HUD, damage, fail ---------- */
function updateHUD(){
  const L=G.level;
  const label = G.mixed ? '🎲 Mixed Review' : `Field ${G.levelIdx+1}/${LEVELS.length}`;
  $('#hud-level').textContent = `${label} · ${L.name}` + (G.practice?' · PRACTICE':'');
  const bar=$('#focus-bar');
  bar.style.width=Math.max(0,G.focus)+'%';
  bar.classList.toggle('low',G.focus<=30);
  $('#hud-focus-num').textContent=Math.max(0,Math.round(G.focus))+'%';
}
function damage(n){
  if(G.practice) return; /* practice mode: no focus drain */
  G.focus-=n;
  const w=$('#focus-wrap');
  w.classList.remove('hit'); void w.offsetWidth; w.classList.add('hit');
  updateHUD();
  if(G.focus<=0){ G.focus=0; updateHUD(); failLevel(); }
}
function failLevel(){
  G.phase='failed';
  Snd.wrong();
  updateBanner();
  $('#phase-panel').innerHTML=`
    <div class="phase-label danger">OUT OF FOCUS</div>
    <div class="phase-q">The field overwhelmed you. Every wrong move taught you something — review the feedback and try again.</div>
    <div class="row-btns">
      <button class="btn btn-primary" id="btn-retry-fail">↻ Retry this field</button>
      <button class="btn btn-ghost" id="btn-map-fail">🗺 Back to map</button>
    </div>`;
  $('#btn-retry-fail').onclick=()=>startLevel(G.levelIdx, G.exIdx);
  $('#btn-map-fail').onclick=goMap;
}

/* ---------- toast ---------- */
let toastTimer=null;
function toast(msg){
  const t=$('#toast'); t.textContent=msg; t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer=setTimeout(()=>t.classList.remove('show'),1800);
}

/* ---------- equation banner (respects hidden-equation levels) ---------- */
function updateBanner(){
  const L=G.level; if(!L) return;
  const hidden = L.hideEq && (G.phase==='diagnose'||G.phase==='steps');
  const eq = hidden ? 'dy/dx = ???' : L.eqHTML;
  const ic = L.vec ? L.icHTML : `y(${fmt(L.x0)}) = ${fmt(L.y0)}`;
  $('#eq-banner').innerHTML = `<b>${eq}</b><span class="ic">${ic}</span>`;
}

/* ---------- hint (nudge) wiring ---------- */
function wireHint(box){
  const btn=$('#btn-hint'); if(!btn) return;
  btn.onclick=()=>{
    const cands=Array.from(box.querySelectorAll('.choice')).filter(b=>
      b.dataset.ok==='0' && !b.disabled &&
      !b.classList.contains('wrong') && !b.classList.contains('eliminated'));
    if(!cands.length) return;
    const pick=cands[(Math.random()*cands.length)|0];
    pick.classList.add('eliminated'); pick.disabled=true;
    btn.disabled=true;
    damage(8);
    const fb=$('#fb');
    if(fb){ fb.className='feedback'; fb.innerHTML='<span class="dim">💡 One wrong option eliminated — read the survivors closely.</span>'; }
  };
}

/* ---------- PHASE 1: diagnose ---------- */
function renderDiagnose(){
  G.phase='diagnose'; updateBanner();
  $('#phase-panel').innerHTML=`
    <div class="phase-label">PHASE 1 · DIAGNOSE</div>
    <div class="phase-q">Study the field. What kind of equation is this?</div>
    <div class="choices" id="choices"></div>
    <button class="btn btn-ghost btn-small" id="btn-hint">💡 Nudge <span class="pill">−8 focus</span></button>
    <div class="feedback" id="fb" aria-live="polite"></div>`;
  const box=$('#choices');
  /* random 4 options, 1–2 of them correct.
     FIX (v3.1): keep the correct pick(s) FIRST, then fill the remaining
     slots with distractors. Never slice the combined pool — that could
     cut the correct answer entirely (four wrong options, phase
     soft-locked). */
  const correct=G.level.diag.correct;
  const right=shuffle(TYPES.filter(t=>correct.includes(t.id))).slice(0,Math.min(2,correct.length));
  const wrong=shuffle(TYPES.filter(t=>!correct.includes(t.id))).slice(0,4-right.length);
  const shown=shuffle(right.concat(wrong));
  shown.forEach(t=>{
    const b=document.createElement('button');
    b.className='choice'; b.innerHTML=t.label;
    b.dataset.ok=correct.includes(t.id)?'1':'0';
    b.onclick=()=>{
      if(G.phase!=='diagnose') return;
      if(correct.includes(t.id)){
        b.classList.add('correct');
        box.querySelectorAll('.choice').forEach(x=>x.disabled=true);
        $('#fb').className='feedback good';
        $('#fb').innerHTML='✔ '+G.level.diag.why;
        Snd.correct();
        setTimeout(()=>{ if(G.phase==='diagnose') renderSteps(); },1400);
      }else{
        b.classList.add('wrong'); b.disabled=true;
        $('#fb').className='feedback bad';
        $('#fb').innerHTML='✘ '+t.miss;
        Snd.wrong();
        logErr(G.level.id+':diag');
        damage(10);
      }
    };
    box.appendChild(b);
  });
  wireHint(box);
}

/* ---------- PHASE 2: solve step by step ---------- */
function renderSteps(){ G.phase='steps'; G.stepIdx=0; updateBanner(); renderStep(); }
function renderStep(){
  const st=G.level.steps[G.stepIdx];
  const dots=G.level.steps.map((_,i)=>
    `<span class="dot ${i<G.stepIdx?'done':i===G.stepIdx?'cur':''}"></span>`).join('');
  $('#phase-panel').innerHTML=`
    <div class="phase-label">PHASE 2 · SOLVE — step ${G.stepIdx+1} of ${G.level.steps.length}</div>
    <div class="step-dots">${dots}</div>
    <div class="phase-q">${st.q}</div>
    <div class="choices" id="choices"></div>
    <button class="btn btn-ghost btn-small" id="btn-hint">💡 Nudge <span class="pill">−8 focus</span></button>
    <div class="feedback" id="fb" aria-live="polite"></div>`;
  const box=$('#choices');
  shuffle(st.opts).forEach(o=>{
    const b=document.createElement('button');
    b.className='choice math'; b.innerHTML=o.t;
    b.dataset.ok=o.ok?'1':'0';
    b.onclick=()=>{
      if(G.phase!=='steps') return;
      if(o.ok){
        b.classList.add('correct');
        box.querySelectorAll('.choice').forEach(x=>x.disabled=true);
        $('#fb').className='feedback good';
        $('#fb').innerHTML='✔ '+o.fb;
        Snd.correct();
        setTimeout(()=>{
          if(G.phase!=='steps') return;
          G.stepIdx++;
          if(G.stepIdx>=G.level.steps.length) renderTrace();
          else renderStep();
        },1500);
      }else{
        b.classList.add('wrong'); b.disabled=true;
        $('#fb').className='feedback bad';
        $('#fb').innerHTML='✘ '+o.fb;
        Snd.wrong();
        logErr(G.level.id+':'+G.stepIdx);
        damage(15);
      }
    };
    box.appendChild(b);
  });
  wireHint(box);
}

/* ---------- PHASE 3: trace ---------- */
const EULER_STEPS=[0,0.5,0.25,0.1];
function renderTrace(){
  G.phase='trace'; updateBanner();
  const L=G.level;
  const goalText = L.vec
    ? 'reach the <b class="gold">gold goal ring</b>. You are sketching the real orbit!'
    : 'cross the <b class="gold">gold goal line</b>. You are sketching the real solution!';
  $('#phase-panel').innerHTML=`
    <div class="phase-label">PHASE 3 · TRACE</div>
    <div class="phase-q">Press &amp; drag from the <b>pulsing dot</b> (or use arrow keys), follow the arrows, and ${goalText}</div>
    <div class="row-btns">
      <button class="btn btn-ghost btn-small" id="btn-peek">👁 Peek at solution <span class="pill">−1 ★</span></button>
      <button class="btn btn-ghost btn-small" id="btn-euler">📐 Euler overlay: off</button>
      ${L.vec?'<button class="btn btn-ghost btn-small" id="btn-null">◈ Nullclines: off</button>':''}
      <button class="btn btn-ghost btn-small" id="btn-retrace">↺ Restart trace</button>
    </div>
    <div class="feedback" id="fb"><span class="dim">Tip: move slowly and let the field guide your finger. The Euler overlay shows the classic h-step approximation.</span></div>`;
  $('#btn-peek').onclick=doPeek;
  $('#btn-euler').onclick=()=>{
    const i=EULER_STEPS.indexOf(G.eulerH);
    G.eulerH=EULER_STEPS[(i+1)%EULER_STEPS.length];
    $('#btn-euler').innerHTML = G.eulerH
      ? `📐 Euler overlay: h = ${G.eulerH}`
      : '📐 Euler overlay: off';
  };
  const bn=$('#btn-null');
  if(bn) bn.onclick=()=>{
    G.showNullclines=!G.showNullclines;
    if(G.showNullclines) buildNullclines();
    bn.innerHTML=G.showNullclines?'◈ Nullclines: on':'◈ Nullclines: off';
  };
  $('#btn-retrace').onclick=()=>{
    if(!G.trace.done){
      G.trace.pts=[]; G.trace.active=false;
      toast('Trace cleared — start from the dot');
    }
  };
}
function doPeek(){
  if(G.trace.peeked||G.trace.done) return;
  G.trace.peeked=true; G.trace.peekUntil=performance.now()+1600;
  Snd.peek();
  const b=$('#btn-peek'); if(b) b.disabled=true;
  toast('The true curve glows briefly…');
}

/* pointer input */
function evtPt(e){
  const r=canvas.getBoundingClientRect();
  return {x:e.clientX-r.left, y:e.clientY-r.top};
}
canvas.addEventListener('pointerdown',e=>{
  if(G.phase!=='trace'||G.trace.done) return;
  e.preventDefault();
  const p=evtPt(e), pts=G.trace.pts;
  const sx=px(G.level.x0), sy=py(G.level.y0);
  if(pts.length===0){
    if(Math.hypot(p.x-sx,p.y-sy)<44){
      pts.push({x:G.level.x0,y:G.level.y0});
      G.trace.active=true; Snd.tick();
      try{ canvas.setPointerCapture(e.pointerId); }catch(_){}
    }else toast('Start at the pulsing dot!');
  }else{
    const last=pts[pts.length-1];
    if(Math.hypot(p.x-px(last.x),p.y-py(last.y))<40){
      G.trace.active=true; Snd.tick();
      try{ canvas.setPointerCapture(e.pointerId); }catch(_){}
    }else toast('Continue from the end of your line');
  }
});
canvas.addEventListener('pointermove',e=>{
  if(!G.trace.active||G.trace.done||G.phase!=='trace') return;
  const p=evtPt(e), pts=G.trace.pts;
  const last=pts[pts.length-1];
  if(Math.hypot(p.x-px(last.x),p.y-py(last.y))<3) return;
  const nx=toMathX(clamp(p.x,0,cw)), ny=toMathY(clamp(p.y,0,chh));
  pts.push({x:nx,y:ny});
  checkTraceFinish();
});
const endTrace=()=>{ G.trace.active=false; };
canvas.addEventListener('pointerup',endTrace);
canvas.addEventListener('pointercancel',endTrace);
canvas.addEventListener('contextmenu',e=>e.preventDefault());

/* keyboard tracing (accessibility) */
window.addEventListener('keydown',e=>{
  if(G.screen!=='game'||G.phase!=='trace'||G.trace.done) return;
  const map={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,1],ArrowDown:[0,-1]};
  if(!map[e.key]) return;
  e.preventDefault();
  if(G.trace.pts.length===0){
    G.trace.pts.push({x:G.level.x0,y:G.level.y0}); Snd.tick();
  }
  const [dx,dy]=map[e.key];
  const stepX=(view.xmax-view.xmin)/44, stepY=(view.ymax-view.ymin)/44;
  const last=G.trace.pts[G.trace.pts.length-1];
  G.trace.pts.push({
    x:clamp(last.x+dx*stepX, view.xmin, view.xmax),
    y:clamp(last.y+dy*stepY, view.ymin, view.ymax)
  });
  checkTraceFinish();
});

/* shared finish detection (pointer + keyboard) */
function checkTraceFinish(){
  const pts=G.trace.pts, L=G.level;
  if(pts.length<2) return;
  const prev=pts[pts.length-2], nx=pts[pts.length-1];
  if(L.vec){
    const gp=orbitAt(L.tGoal), r=L.goalR||0.25;
    if(Math.hypot(nx.x-gp.x, nx.y-gp.y)<r) finishTrace();
  }else{
    if(prev.x<L.xT && nx.x>=L.xT){
      const t=(L.xT-prev.x)/(nx.x-prev.x);
      G.trace.yCross=lerp(prev.y,nx.y,t);
      finishTrace();
    }
  }
}

function lineAngleDiff(a,b){
  let d=Math.abs(a-b)%Math.PI;
  return Math.min(d,Math.PI-d);
}
function scoreTrace(){
  const pts=G.trace.pts, L=G.level;
  let w=0,e=0;
  for(let i=1;i<pts.length;i++){
    const dx=pts[i].x-pts[i-1].x, dy=pts[i].y-pts[i-1].y;
    const len=Math.hypot(dx,dy);
    if(len<1e-9) continue;
    const fv=fieldVec((pts[i].x+pts[i-1].x)/2,(pts[i].y+pts[i-1].y)/2);
    if(!fv) continue;   /* field undefined along this segment — skip it */
    const [u,v]=fv;
    const d=lineAngleDiff(Math.atan2(dy,dx), Math.atan2(v,u));
    e+=d*len; w+=len;
  }
  const avgDeg=w>0?(e/w)*180/Math.PI:90;
  G.trace.adh=Math.round(clamp(100-avgDeg*1.4,0,100));
  if(L.vec){
    const gp=orbitAt(L.tGoal), r=L.goalR||0.25;
    const last=pts[pts.length-1];
    const dist=Math.hypot(last.x-gp.x,last.y-gp.y);
    G.trace.end=Math.round(clamp(100-50*dist/r,25,100));
  }else{
    const yTrue=L.sol(L.xT);
    const err=Math.abs(G.trace.yCross-yTrue)/(view.ymax-view.ymin);
    G.trace.end=Math.round(clamp(100-err*260,0,100));
  }
  G.trace.score=Math.round(0.6*G.trace.adh+0.4*G.trace.end);
}
function finishTrace(){
  G.trace.active=false; G.trace.done=true;
  scoreTrace();
  G.phase='reveal'; G.revealT=0;
  Snd.win();
  awardStars();
  renderReveal();
}

/* ---------- PHASE 4: reveal ---------- */
function awardStars(){
  const combined=0.4*G.focus+0.6*G.trace.score;
  let stars=combined>=78?3:combined>=52?2:1;
  if(G.trace.peeked) stars=Math.max(1,stars-1); /* peek always costs */
  G.stars=stars;
  if(G.practice){ G.gainedXP=0; return; }
  const old=save.stars[G.level.id]||0;
  G.gainedXP=Math.max(10,(old===0?50:0)+Math.max(0,stars-old)*50); /* replay always earns XP */
  save.stars[G.level.id]=Math.max(old,stars);
  save.xp+=G.gainedXP;
  persist();
}
function renderReveal(){
  const last=G.levelIdx>=LEVELS.length-1;
  const starEls=[0,1,2].map(i=>
    `<span class="rstar ${i<G.stars?'lit':''}" style="animation-delay:${(.15+i*.28).toFixed(2)}s">★</span>`).join('');
  const recap=G.level.steps.map((s,i)=>{
    const ok=s.opts.find(o=>o.ok);
    return `<div class="rc-step"><div class="rc-q">${i+1}. ${s.q}</div><div class="rc-a">✔ ${ok?ok.t:''}</div></div>`;
  }).join('');
  $('#phase-panel').innerHTML=`
    <div class="phase-label gold">PHASE 4 · REVEAL</div>
    <div class="result-stars">${starEls}</div>
    <div class="solution-box">
      <span class="sol-label">SOLUTION</span>
      <span class="math big">${G.level.solHTML}</span>
    </div>
    <div class="score-grid">
      <div><span class="sg-val">${Math.max(0,Math.round(G.focus))}%</span><span class="sg-lab">Focus</span></div>
      <div><span class="sg-val">${G.trace.adh}%</span><span class="sg-lab">Field adherence</span></div>
      <div><span class="sg-val">${G.trace.end}%</span><span class="sg-lab">Endpoint accuracy</span></div>
      <div><span class="sg-val">${G.practice?'—':'+'+G.gainedXP}</span><span class="sg-lab">${G.practice?'practice':'XP earned'}</span></div>
    </div>
    ${G.practice?'<div class="practice-note">PRACTICE MODE — no stars or XP saved</div>':''}
    <div class="fact">💡 ${G.level.fact}</div>
    <details class="recap"><summary>📋 FULL WORKED SOLUTION</summary>${recap}</details>
    <div class="row-btns">
      <button class="btn btn-ghost" id="btn-retry">↻ Retry</button>
      ${G.mixed
        ? '<button class="btn btn-primary" id="btn-next">🎲 Another random field ▸</button>'
        : (last?'':'<button class="btn btn-primary" id="btn-next">Next field ▸</button>')}
      <button class="btn btn-ghost" id="btn-map2">🗺 Map</button>
    </div>`;
  for(let i=0;i<G.stars;i++) setTimeout(()=>Snd.star(i),200+i*280);
  $('#btn-retry').onclick=()=>startLevel(G.levelIdx, G.exIdx);
  if(G.mixed) $('#btn-next').onclick=startMixed;
  else if(!last) $('#btn-next').onclick=()=>startLevel(G.levelIdx+1);
  $('#btn-map2').onclick=goMap;
}

/* ---------- level flow ---------- */
function startLevel(i, exIdx, mixed){
  G.levelIdx=i;
  G.mixed=!!mixed;
  G.practice=!!save.practice;
  G.exIdx = (typeof exIdx==='number') ? exIdx : pickExerciseIdx(i);
  G.level = resolveExercise(i, G.exIdx);
  G.orbit = G.level.vec ? computeOrbit(G.level) : null;
  view={...G.level.window};
  G.focus=100; G.stepIdx=0; G.stars=0; G.revealT=0; G.eulerH=0; G.showNullclines=false;
  G.trace={pts:[],active:false,done:false,peeked:false,peekUntil:0,yCross:null,score:0,adh:0,end:0};
  save.played=save.played||{};
  save.played[LEVELS[i].id]=Date.now();
  persist();
  showScreen('screen-game');
  updateBanner();
  updateHUD();
  if(G.level.hideEq || !G.level.diag) renderSteps(); /* hidden fields: read first */
  else renderDiagnose();
  requestAnimationFrame(()=>{ resizeCanvas(); initParts(); });
}
function startMixed(){
  /* weighted random level — more logged misses or stale fields are more likely */
  const now=Date.now();
  const weights=LEVELS.map(l=>{
    const last=(save.played||{})[l.id]||0;
    const stale=(!last||now-last>3*864e5)?2:0;   /* untouched for 3+ days */
    return 1+levelErrs(l.id)+stale;
  });
  const total=weights.reduce((a,b)=>a+b,0);
  let r=Math.random()*total, idx=0;
  for(let i=0;i<weights.length;i++){ r-=weights[i]; if(r<=0){ idx=i; break; } }
  startLevel(idx, undefined, true);
}
function goMap(){
  G.phase='idle'; G.level=null; G.orbit=null;
  renderMap(); showScreen('screen-map');
}

/* ---------- map & title ---------- */
function renderMap(){
  const el=$('#chapters'); el.innerHTML='';
  CHAPTERS.forEach((ch,ci)=>{
    const sec=document.createElement('section'); sec.className='chapter';
    sec.innerHTML=`<div class="chapter-head"><span class="chapter-num">${ci+1}</span>
      <div><h2>${ch.name}</h2><p>${ch.desc}</p></div></div>`;
    const grid=document.createElement('div'); grid.className='level-grid';
    LEVELS.forEach((l,idx)=>{
      if(l.ch!==ci+1) return;
      const st=save.stars[l.id]||0;
      const btn=document.createElement('button');
      btn.className='level-node'+(st===3?' mastered':''); /* all fields unlocked */
      btn.innerHTML=`<span class="ln-num">${idx+1}</span>
           <span class="ln-stars">${'★'.repeat(st)}${'☆'.repeat(3-st)}</span>
           <span class="ln-name">${l.name}</span>`;
      btn.onclick=()=>{ Snd.ensure(); startLevel(idx); };
      grid.appendChild(btn);
    });
    sec.appendChild(grid); el.appendChild(sec);
  });
  $('#xp-total').textContent=save.xp;
  renderWeakSpots();
}
function renderWeakSpots(){
  const el=$('#weak-spots');
  const spots=LEVELS.map((l,i)=>({l,i,n:levelErrs(l.id)})).filter(s=>s.n>0).sort((a,b)=>b.n-a.n);
  if(!spots.length){ el.innerHTML=''; return; }
  el.innerHTML=`<div class="weak-box"><h3>⚠ WEAK SPOTS — your most-missed fields (Mixed Review drills these hardest)</h3>
    <div class="weak-list">${spots.slice(0,8).map(s=>
      `<span class="weak-tag">Field ${s.i+1} · ${s.l.name} — ${s.n} miss${s.n>1?'es':''}</span>`).join('')}</div></div>`;
}
function renderTitleStats(){
  const tot=LEVELS.reduce((s,l)=>s+(save.stars[l.id]||0),0);
  const done=LEVELS.filter(l=>(save.stars[l.id]||0)>0).length;
  $('#title-stats').innerHTML = tot>0
    ? `<span>★ ${tot}/${LEVELS.length*3}</span><span>·</span><span>${done}/${LEVELS.length} fields charted</span>`
    : `<span>${LEVELS.length} fields await — all unlocked</span>`;
}

/* ---------- formula cards ---------- */
function renderFormulas(){
  const body=$('#formulas-body'); body.innerHTML='';
  FORMULAS.forEach(f=>{
    const chIdx=f.ch-1, ch=CHAPTERS[chIdx];
    const unlocked=LEVELS.some(l=>l.ch===f.ch && (save.stars[l.id]||0)>0);
    const card=document.createElement('div');
    card.className='formula-card'+(unlocked?'':' locked');
    card.innerHTML=`<h3>${ch.name}</h3><ul>${f.items.map(i=>`<li>${i}</li>`).join('')}</ul>`;
    body.appendChild(card);
  });
}

/* ---------- field quiz (match equation → slope field) ---------- */
const FIELDQUIZ=[
 {eq:'dy/dx = −x/y', why:'The arrows rotate around the origin — solutions are circles.',
  opts:[
   {f:(x,y)=>y===0?NaN:-x/y, w:{xmin:-2.4,xmax:2.4,ymin:-2.4,ymax:2.4}, ok:1, note:''},
   {f:(x,y)=>2*y, w:{xmin:-1.5,xmax:1.5,ymin:-1,ymax:6}, ok:0, note:'That outward fan from the x-axis is y′ = 2y.'},
   {f:(x,y)=>y*y, w:{xmin:-1,xmax:1,ymin:-1,ymax:3}, ok:0, note:'Flat along y = 0, climbing on both sides — that’s y′ = y².'},
   {f:(x,y)=>x-y, w:{xmin:-1,xmax:3,ymin:-2,ymax:2.6}, ok:0, note:'That’s the ramp field of y′ = x − y.'}]},
 {eq:'dy/dx = x/y', why:'Arrows rise away from the origin in the right half — hyperbolas.',
  opts:[
   {f:(x,y)=>y===0?NaN:x/y, w:{xmin:-2.5,xmax:2.5,ymin:-1,ymax:3.2}, ok:1, note:''},
   {f:(x,y)=>y===0?NaN:-x/y, w:{xmin:-2.4,xmax:2.4,ymin:-2.4,ymax:2.4}, ok:0, note:'Those arrows rotate around the origin — that’s y′ = −x/y (circles).'},
   {f:(x,y)=>2*y, w:{xmin:-1.5,xmax:1.5,ymin:-1,ymax:6}, ok:0, note:'That outward fan from the x-axis is y′ = 2y.'},
   {f:(x,y)=>y*(1-y), w:{xmin:-3,xmax:4,ymin:-0.6,ymax:1.6}, ok:0, note:'Two flip lines at y = 0 and y = 1 — the logistic y′ = y(1−y).'}]},
 {eq:'dy/dx = y²', why:'Flat along y = 0, climbing on both sides — runaway growth.',
  opts:[
   {f:(x,y)=>y*y, w:{xmin:-1,xmax:1,ymin:-1,ymax:3}, ok:1, note:''},
   {f:(x,y)=>-y*y, w:{xmin:-0.5,xmax:3,ymin:-0.5,ymax:1.5}, ok:0, note:'That’s y′ = −y² — decaying toward the axis from above.'},
   {f:(x,y)=>1+y*y, w:{xmin:-1,xmax:1.3,ymin:-1.7,ymax:4.6}, ok:0, note:'Always upward, steepening — that’s y′ = 1 + y² (the tan field).'},
   {f:(x,y)=>2*y, w:{xmin:-1.5,xmax:1.5,ymin:-1,ymax:6}, ok:0, note:'That outward fan from the x-axis is y′ = 2y.'}]},
 {eq:'dy/dx = 1 − y', why:'Flip line at y = 1: arrows down above, up below — a stable equilibrium.',
  opts:[
   {f:(x,y)=>1-y, w:{xmin:-1,xmax:3,ymin:-1,ymax:4}, ok:1, note:''},
   {f:(x,y)=>y-1, w:{xmin:-1,xmax:0.8,ymin:-3.5,ymax:2}, ok:0, note:'That’s y′ = y − 1 — the UNstable twin (arrows up above y = 1).'},
   {f:(x,y)=>3-y, w:{xmin:-1,xmax:3,ymin:-1,ymax:4.2}, ok:0, note:'Same shape, but the flip is at y = 3 — that’s y′ = 3 − y.'},
   {f:(x,y)=>y===0?NaN:-x/y, w:{xmin:-2.4,xmax:2.4,ymin:-2.4,ymax:2.4}, ok:0, note:'Those arrows rotate around the origin — that’s y′ = −x/y (circles).'}]},
 {eq:'dy/dx = y(1 − y)', why:'Two flip lines at y = 0 and y = 1 — the logistic S-field.',
  opts:[
   {f:(x,y)=>y*(1-y), w:{xmin:-3,xmax:4,ymin:-0.6,ymax:1.6}, ok:1, note:''},
   {f:(x,y)=>1-y, w:{xmin:-1,xmax:3,ymin:-1,ymax:4}, ok:0, note:'Only ONE flip line, at y = 1 — that’s y′ = 1 − y.'},
   {f:(x,y)=>y*y, w:{xmin:-1,xmax:1,ymin:-1,ymax:3}, ok:0, note:'Flat along y = 0, climbing on both sides — that’s y′ = y².'},
   {f:(x,y)=>y===0?NaN:x/y, w:{xmin:-2.5,xmax:2.5,ymin:-1,ymax:3.2}, ok:0, note:'Arrows rise away from the origin in the right half — y′ = x/y (hyperbolas).'}]},
 {eq:'dy/dx = x·y', why:'Up in the first and third quadrants, down in the others — the sign of xy.',
  opts:[
   {f:(x,y)=>x*y, w:{xmin:-2,xmax:2,ymin:-1,ymax:4}, ok:1, note:''},
   {f:(x,y)=>2*y, w:{xmin:-1.5,xmax:1.5,ymin:-1,ymax:6}, ok:0, note:'That outward fan from the x-axis is y′ = 2y.'},
   {f:(x,y)=>x-y, w:{xmin:-1,xmax:3,ymin:-2,ymax:2.6}, ok:0, note:'That’s the ramp field of y′ = x − y.'},
   {f:(x,y)=>y===0?NaN:-x/y, w:{xmin:-2.4,xmax:2.4,ymin:-2.4,ymax:2.4}, ok:0, note:'Those arrows rotate around the origin — that’s y′ = −x/y (circles).'}]},
 {eq:'dy/dx = x − y', why:'A diagonal flip line y = x with arrows crossing it downward — the ramp field.',
  opts:[
   {f:(x,y)=>x-y, w:{xmin:-1,xmax:3,ymin:-2,ymax:2.6}, ok:1, note:''},
   {f:(x,y)=>1-x+y, w:{xmin:-1.2,xmax:1.1,ymin:-1,ymax:7}, ok:0, note:'That’s y′ = 1 − x + y — the runaway ramp (mirror of x − y).'},
   {f:(x,y)=>x*y, w:{xmin:-2,xmax:2,ymin:-1,ymax:4}, ok:0, note:'Up in the first and third quadrants, down in the others — y′ = xy.'},
   {f:(x,y)=>-y, w:{xmin:-1,xmax:3,ymin:-1,ymax:4}, ok:0, note:'Pure decay toward the x-axis — y′ = −y.'}]},
 {eq:'dy/dx = sin(x)·y', why:'The arrows breathe left-to-right — growth stretches, decay stretches: a tidal field.',
  opts:[
   {f:(x,y)=>Math.sin(x)*y, w:{xmin:-1,xmax:3.5,ymin:-1,ymax:5}, ok:1, note:''},
   {f:(x,y)=>x*y, w:{xmin:-2,xmax:2,ymin:-1,ymax:4}, ok:0, note:'Up in the first and third quadrants, down in the others — y′ = xy.'},
   {f:(x,y)=>2*y, w:{xmin:-1.5,xmax:1.5,ymin:-1,ymax:6}, ok:0, note:'That outward fan from the x-axis is y′ = 2y.'},
   {f:(x,y)=>y===0?NaN:x/y, w:{xmin:-2.5,xmax:2.5,ymin:-1,ymax:3.2}, ok:0, note:'Arrows rise away from the origin in the right half — y′ = x/y (hyperbolas).'}]}
];
let quizState=null;
function drawMiniField(cnv,f,win){
  const S=230; cnv.width=S; cnv.height=S;
  const c=cnv.getContext('2d');
  c.fillStyle='#0b1120'; c.fillRect(0,0,S,S);
  const X=x=>(x-win.xmin)/(win.xmax-win.xmin)*S;
  const Y=y=>S-(y-win.ymin)/(win.ymax-win.ymin)*S;
  c.strokeStyle='rgba(120,160,255,.08)'; c.lineWidth=1;
  for(let i=1;i<4;i++){
    c.beginPath(); c.moveTo(S*i/4,0); c.lineTo(S*i/4,S); c.stroke();
    c.beginPath(); c.moveTo(0,S*i/4); c.lineTo(S,S*i/4); c.stroke();
  }
  const cols=11, rows=9, cw2=S/cols, ch2=S/rows;
  c.lineCap='round'; c.lineWidth=2;
  for(let i=0;i<cols;i++)for(let j=0;j<rows;j++){
    const cx=(i+.5)*cw2, cy=(j+.5)*ch2;
    const xm=win.xmin+(win.xmax-win.xmin)*(i+.5)/cols;
    const ym=win.ymin+(win.ymax-win.ymin)*(1-(j+.5)/rows);
    let m; try{ m=f(xm,ym); }catch(e){ m=NaN; }
    if(typeof m!=='number'||isNaN(m)) continue;
    const ang=!isFinite(m) ? Math.PI/2*(m>0?1:-1) : Math.atan(m);
    const L=Math.min(cw2,ch2)*0.62;
    const dxs=Math.cos(ang)*L/2, dys=-Math.sin(ang)*L/2;
    c.strokeStyle='rgba(110,190,255,.55)';
    c.beginPath(); c.moveTo(cx-dxs,cy-dys); c.lineTo(cx+dxs,cy+dys); c.stroke();
  }
}
function renderQuiz(){
  const body=$('#quiz-body');
  if(!quizState) quizState={i:0,score:0,firstTry:true,locked:false,order:shuffle(FIELDQUIZ.map((_,k)=>k))};
  if(quizState.i>=quizState.order.length){
    body.innerHTML=`<div class="quiz-done">🎯 You matched <b>${quizState.score} / ${quizState.order.length}</b> fields.</div>
      <div class="row-btns"><button class="btn btn-primary" id="quiz-restart">↻ Again</button></div>`;
    $('#quiz-restart').onclick=()=>{ quizState=null; renderQuiz(); };
    return;
  }
  const q=FIELDQUIZ[quizState.order[quizState.i]];
  const opts=shuffle(q.opts.map(o=>({...o})));
  body.innerHTML=`<div class="quiz-q"><span class="math">Q${quizState.i+1}. ${q.eq}</span> — which slope field is this?</div>
    <div class="quiz-grid" id="quiz-grid"></div>
    <div class="feedback" id="quiz-fb"></div>`;
  const grid=$('#quiz-grid');
  quizState.firstTry=true; quizState.locked=false;
  opts.forEach(o=>{
    const d=document.createElement('div');
    d.className='quiz-opt';
    const cnv=document.createElement('canvas');
    d.appendChild(cnv);
    grid.appendChild(d);
    drawMiniField(cnv,o.f,o.w);
    d.onclick=()=>{
      if(quizState.locked) return;
      if(o.ok){
        d.classList.add('correct');
        quizState.locked=true;
        if(quizState.firstTry) quizState.score++;
        $('#quiz-fb').className='feedback good';
        $('#quiz-fb').innerHTML='✔ '+q.why;
        Snd.correct();
        setTimeout(()=>{ quizState.i++; renderQuiz(); },1500);
      }else{
        d.classList.add('wrong');
        quizState.firstTry=false;
        $('#quiz-fb').className='feedback bad';
        $('#quiz-fb').innerHTML='✘ '+o.note;
        Snd.wrong();
      }
    };
  });
}

/* ---------- wiring ---------- */
$('#btn-play').onclick=()=>{ Snd.ensure(); renderMap(); showScreen('screen-map'); };
$('#btn-mixed').onclick=()=>{ Snd.ensure(); startMixed(); };
$('#btn-quiz').onclick=()=>{ Snd.ensure(); quizState=null; renderQuiz(); $('#modal-quiz').classList.add('open'); };
$('#btn-formulas').onclick=()=>{ renderFormulas(); $('#modal-formulas').classList.add('open'); };
$('#btn-howto').onclick=()=>$('#modal-howto').classList.add('open');
$('#btn-settings').onclick=()=>$('#modal-settings').classList.add('open');
$('#btn-back-title').onclick=()=>{ renderTitleStats(); showScreen('screen-title'); resizeTitle(); };
$('#btn-quit').onclick=goMap;

$$('.modal').forEach(m=>{
  m.addEventListener('click',e=>{ if(e.target===m) m.classList.remove('open'); });
  m.querySelectorAll('[data-close]').forEach(b=>b.onclick=()=>m.classList.remove('open'));
});
const sndToggle=$('#snd-toggle');
sndToggle.checked=save.sound;
sndToggle.onchange=()=>{
  save.sound=sndToggle.checked; persist();
  if(save.sound){ Snd.ensure(); Snd.correct(); }
};
const practiceToggle=$('#practice-toggle');
practiceToggle.checked=!!save.practice;
practiceToggle.onchange=()=>{ save.practice=practiceToggle.checked; persist(); };
$('#btn-reset').onclick=()=>{
  if(confirm('Erase all progress (stars, XP and error log)?')){
    save=defaultSave(); persist();
    Object.keys(bags).forEach(k=>delete bags[k]);
    Object.keys(lastPicked).forEach(k=>delete lastPicked[k]);
    sndToggle.checked=true; practiceToggle.checked=false;
    renderTitleStats();
    $('#modal-settings').classList.remove('open');
  }
};
window.addEventListener('resize',()=>{ resizeCanvas(); resizeTitle(); });

/* ---------- boot-time verification (dev safety net) ---------- */
function verifyAll(){
  LEVELS.forEach((L,li)=>L.exercises.forEach((ex,ei)=>{
    /* integrity: exactly one correct option per step */
    (ex.steps||[]).forEach((s,si)=>{
      const n=s.o.filter(o=>o[1]).length;
      if(n!==1) console.warn(`L${L.id} ex${ei} step${si}: ${n} correct options (need exactly 1)`);
    });
    if(!L.vec){
      if(typeof ex.sol!=='function') return;
      const icErr=Math.abs((ex.sol(ex.x0)||NaN)-ex.y0);
      if(!(icErr<1e-9)) console.warn(`L${L.id} ex${ei}: sol(x0) ≠ y0`);
      if(ex.nonUnique) return; /* expected: multiple solutions through the IC */
      /* RK4 check: sol vs f */
      let x=ex.x0, y=ex.y0; const h=(ex.xT-ex.x0)/2000, f=ex.f;
      for(let i=0;i<2000;i++){
        const k1=f(x,y), k2=f(x+h/2,y+h*k1/2), k3=f(x+h/2,y+h*k2/2), k4=f(x+h,y+h*k3);
        y+=h/6*(k1+2*k2+2*k3+k4); x+=h;
      }
      const err=Math.abs(y-ex.sol(ex.xT));
      if(!(err<1e-3)) console.warn(`L${L.id} ex${ei}: RK4 end ${y.toFixed(4)} vs sol ${ex.sol(ex.xT).toFixed(4)}`);
    }else{
      /* vec: self-consistency at two step sizes */
      const run=dt=>{ let x=ex.x0,y=ex.y0,t=0;
        while(t<ex.tGoal-1e-12){ const [u,v]=ex.f(x,y); x+=dt*u; y+=dt*v; t+=dt; }
        return [x,y]; };
      const a=run(0.001), b=run(0.0005);
      if(Math.hypot(a[0]-b[0],a[1]-b[1])>1e-4) console.warn(`L${L.id} ex${ei}: vec orbit unstable`);
    }
  }));
}
verifyAll();

/* ---------- boot ---------- */
renderTitleStats();
resizeTitle();
initTitleParts();
requestAnimationFrame(frame);
