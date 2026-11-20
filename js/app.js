(function(){
"use strict";
/* The one thing to set before launch: the address briefs are sent to. Leave empty to hide it. */
var CONTACT_EMAIL = "hello@altylabs.com";
var FORM_ENDPOINT = "https://formsubmit.co/ajax/hello@altylabs.com";
var PAGE_HREF = {"process":"/process/","readiness":"/readiness/","contact":"/contact/","industries":"/industries/","dental-labs":"/industries/dental-labs/","land-surveyors":"/industries/land-surveyors/","distributors":"/industries/distributors/","case-distributor":"/case-studies/rj-industrial-supply/","case-ejt-fitness":"/case-studies/ejt-fitness/","case-studies":"/case-studies/","distributor":"/case-studies/rj-industrial-supply/","ejt-fitness":"/case-studies/ejt-fitness/"};
function pageHref(h){ return PAGE_HREF[h] || ("#"+h); }
var PATH_TO_PAGE = {"/":"home","/process/":"process","/readiness/":"readiness","/contact/":"contact","/industries/":"industries","/industries/dental-labs/":"dental-labs","/industries/land-surveyors/":"land-surveyors","/industries/distributors/":"distributors","/case-studies/":"case-studies","/case-studies/rj-industrial-supply/":"case-distributor","/case-studies/ejt-fitness/":"case-ejt-fitness"};
var PAGE_META = {"home": {"title": "Alty Labs — custom AI systems and software", "desc": "Alty Labs builds custom AI systems and software that draft the skilled work filling your team's week, inside the tools you already use.", "canonical": "https://altylabs.com/"}, "process": {"title": "Identify, develop, adopt. — Alty Labs", "desc": "Most AI projects fail before or after the build, so we put a stage on each side of it.", "canonical": "https://altylabs.com/process/"}, "readiness": {"title": "Is your business ready for a custom AI system? — Alty Labs", "desc": "Eight questions, about two minutes. You get a readiness score out of 100 and a straight answer: fix, buy or build. Nothing is sent anywhere.", "canonical": "https://altylabs.com/readiness/"}, "contact": {"title": "Book a workflow review. — Alty Labs", "desc": "Tell us about one piece of work that costs your team time.", "canonical": "https://altylabs.com/contact/"}, "industries": {"title": "Industries — Alty Labs", "desc": "Our systems run in distribution, fitness, land surveying and dental labs.", "canonical": "https://altylabs.com/industries/"}, "dental-labs": {"title": "Prescription intake for dental labs — Alty Labs", "desc": "Paper slips, emailed PDFs, scanner portal notes and phone photos, read and turned into a finished case in your lab software. Missing details are caught when the box arrives, and a person approves every case before it is saved.", "canonical": "https://altylabs.com/industries/dental-labs/"}, "land-surveyors": {"title": "Title research and proposals for land surveyors, assembled with sources — Alty Labs", "desc": "Registers, plans, instruments, the neighbours' records and your own archive, gathered and summarized for the surveyor's review. Every line links to the page it came from. The surveyor decides.", "canonical": "https://altylabs.com/industries/land-surveyors/"}, "distributors": {"title": "AI order entry for plumbing, HVAC and industrial distributors — Alty Labs", "desc": "Emailed POs and phone photos of handwritten contractor lists, read, matched to your exact SKUs, and drafted as sales orders in your accounting software for one-click approval.", "canonical": "https://altylabs.com/industries/distributors/"}, "case-studies": {"title": "Case studies — Alty Labs", "desc": "A selection of systems we have put into production, written up with the client's own numbers.", "canonical": "https://altylabs.com/case-studies/"}, "case-distributor": {"title": "How RJ Industrial Supply cut PO entry from 8 minutes to about a minute — Alty Labs", "desc": "About fifty purchase orders a day were being typed in by hand. An AI order-intake system now reads them, translates shorthand to exact SKUs and drafts the sales order in NetSuite for one-click approval.", "canonical": "https://altylabs.com/case-studies/rj-industrial-supply/"}, "case-ejt-fitness": {"title": "How EJT Fitness launched a custom coaching app to scale beyond 110 clients and unlock online revenue — Alty Labs", "desc": "Coaching ran across spreadsheets, texts and third-party apps. EJT Fitness now has its own web and mobile platform, built around how the coaches already work.", "canonical": "https://altylabs.com/case-studies/ejt-fitness/"}};
window.__ALTY_SPA = 1;
if ("scrollRestoration" in history) history.scrollRestoration = "manual";

function normPath(p){
  if (!p || p === "/") return "/";
  if (!/\.[a-zA-Z0-9]+$/.test(p) && p.charAt(p.length-1) !== "/") p += "/";
  return p;
}
function pageFromPath(p){ return PATH_TO_PAGE[normPath(p)] || null; }
function setMeta(page){
  var m = PAGE_META[page] || PAGE_META.home;
  document.title = m.title;
  var c = document.querySelector('link[rel="canonical"]');
  if (c) c.setAttribute("href", m.canonical);
  var d = document.querySelector('meta[name="description"]');
  if (d) d.setAttribute("content", m.desc);
}

var NS = "http://www.w3.org/2000/svg", ACC = "#ff5a36", BG = "#0a0b0d", TXT = "#ecedee", DIM = "#8d9199";
function $(id){return document.getElementById(id);}
function el(tag, attrs, text){ var n = document.createElementNS(NS, tag); for (var k in attrs) n.setAttribute(k, attrs[k]); if (text != null) n.textContent = text; return n; }
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c];});}
function li(a){return a.map(function(x){return "<li>"+esc(x)+"</li>";}).join("");}
function activate(node, fn){
  node.setAttribute("tabindex","0"); node.setAttribute("role","button"); node.classList.add("clickable");
  node.addEventListener("click", fn);
  node.addEventListener("keydown", function(e){ if(e.key==="Enter"||e.key===" "){e.preventDefault();fn();} });
}

/* ---------- isometric helper ---------- */
var PRE = {
  dark:["#1d2026","#0f1114","#15171b","#5a5e67"], sel:[ACC,"#9c2f18","#c8401f",BG], light:[TXT,"#8d9199","#b9bcc2",BG],
  base:["#121418","#0b0c0e","#0e0f12","#2a2d33"], ghost:["none","none","none","#5a5e67"], few:[ACC,"#9c2f18","#c8401f",BG],
  some:["#3a3d45","#1f2126","#2a2c33",BG], none:["#101114","#101114","#101114","#26282d"]
};
function pt(o,x,y,z){return [o.x+(x-y)*o.a, o.y+(x+y)*o.a/2-z];}
function isoBox(o, ix, iy, wx, wy, h){
  function P(x,y,z){var p=pt(o,x,y,z);return p[0].toFixed(1)+" "+p[1].toFixed(1);}
  var g = el("g",{});
  g.appendChild(el("path",{class:"s1",d:"M"+P(ix,iy+wy,h)+"L"+P(ix+wx,iy+wy,h)+"L"+P(ix+wx,iy+wy,0)+"L"+P(ix,iy+wy,0)+"Z"}));
  g.appendChild(el("path",{class:"s2",d:"M"+P(ix+wx,iy,h)+"L"+P(ix+wx,iy+wy,h)+"L"+P(ix+wx,iy+wy,0)+"L"+P(ix+wx,iy,0)+"Z"}));
  g.appendChild(el("path",{class:"top",d:"M"+P(ix,iy,h)+"L"+P(ix+wx,iy,h)+"L"+P(ix+wx,iy+wy,h)+"L"+P(ix,iy+wy,h)+"Z"}));
  return g;
}
function paint(g, name, dash){
  var c = PRE[name];
  [["top",c[0]],["s1",c[1]],["s2",c[2]]].forEach(function(p){
    var e = g.querySelector("."+p[0]); e.setAttribute("fill",p[1]); e.setAttribute("stroke",c[3]); e.setAttribute("stroke-width","1"); e.setAttribute("stroke-linejoin","round");
    if(dash) e.setAttribute("stroke-dasharray",dash); else e.removeAttribute("stroke-dasharray");
  });
}
function balloon(g, x, y, n, on){
  g.appendChild(el("path",{d:"M"+x+" "+(y+13)+"V"+(y+28),stroke:on?ACC:"#5a5e67","stroke-width":"1"}));
  g.appendChild(el("circle",{cx:x,cy:y,r:12,fill:on?ACC:BG,stroke:on?ACC:"#5a5e67","stroke-width":"1"}));
  g.appendChild(el("text",{x:x,y:y+4,"text-anchor":"middle","font-size":"11.5","font-weight":"500",style:"fill:"+(on?BG:TXT)},String(n)));
}

/* ---------- case studies ---------- */
var cases = [
  {key:"distributor", path:"/case-studies/rj-industrial-supply/", banner:["/img/rj-banner.jpg","RJ Industrial Supply Inc. logo"], crumb:"Distribution", client:"An industrial supply distributor", name:"RJ Industrial Supply Inc.", where:"Industrial supply distributor, North Bay, Ontario", logo:"/img/rj-logo.png", lw:903, lh:278, tile:true,
   title:"How RJ Industrial Supply cut PO entry from 8 minutes to about a minute",
   summary:"About fifty purchase orders a day were being typed in by hand. An AI order-intake system now reads them, translates shorthand to exact SKUs and drafts the sales order in NetSuite for one-click approval.",
   card:{kind:"Industrial supply distributor, North Bay", title:"Orders that enter themselves", metric:"8 min → ~1 min", cap:"to enter each purchase order", rows:[["Photo of a handwritten order","Read"],["3/4 copper 90s x 20","Matched"],["Sales order","Drafted"],["Your approval","1 click"]]},
   stats:[["28 h","saved every week (~104 h a month)"],["85% faster","per order"],["5 weeks","to deploy on NetSuite"]],
   snap:[["Client","RJ Industrial Supply Inc."],["Business","Industrial supply distributor, North Bay, Ontario"],["Tech stack","NetSuite"],["Order volume","~50 customer POs a day (~250 a week), mostly emailed PDFs and smartphone photos of handwritten lists"],["Deployed","5 weeks"]],
   body:[
    {h:"The bottleneck", ul:[
      ["About 6.7 hours a day lost to typing.","At ~8 minutes per PO across about 50 orders a day, manual order entry consumed about 33.5 hours a week."]]},
    {h:"What we built", p:["Deployed in about 5 weeks on top of their existing NetSuite setup, with full client ownership and zero per-order fees."], ul:[
      ["Multi-format intake.","Reads emailed PDFs and phone photos of handwritten orders automatically."],
      ["Shorthand translation.","Maps trade shorthand, such as “3/4 copper 90s x 20”, directly to exact SKUs in their item catalog."],
      ["One-click NetSuite drafting.","Builds the complete sales order inside NetSuite for human review and one-click approval."]], demo:true},
    {h:"Inside the system", p:["Take the intake system apart step by step. Dark blocks are drafted by the system. The light block is a person's decision."], fig:"model"},
    {h:"Results", fig:"table"}],
   cols:["Operational metric","Before","After","Net impact"],
   rows:[["Order entry time per PO","~8 minutes","~1 to 1.5 minutes (review)","85% faster per order"],["Daily order-entry load (50 POs/day)","~6.7 hours/day (~33.5 hrs/wk)","~1.1 hours/day (~5.5 hrs/wk)","28 hours/week saved (~104 hours/month)"]],
   pipe:[["Order in","Emailed PDF or a phone photo of a handwritten list"],["Read","Lines, quantities and customer picked out"],["Matched","Shorthand mapped to exact SKUs in the catalog"],["Drafted","Complete sales order built inside NetSuite"],["Approved","Reviewed in about 1 to 1.5 minutes and approved with one click"]],
   steps:[
    {t:"Order in", b:"~50 POs a day, each keyed in by hand at ~8 minutes.", a:"Reads emailed PDFs and phone photos of handwritten orders automatically."},
    {t:"Match items", b:"Shorthand transcribed by hand.", a:"Maps trade shorthand such as “3/4 copper 90s x 20” to exact SKUs in their item catalog."},
    {t:"Sales order", b:"Typed into NetSuite line by line.", a:"Builds the complete sales order inside NetSuite, on the setup they already had."},
    {t:"Approve", h:1, b:"There was no review step. Every order was manual keying.", a:"A person reviews each order in about 1 to 1.5 minutes and approves with one click."}]},

  {key:"ejt-fitness", path:"/case-studies/ejt-fitness/", banner:["/img/ejt-card.jpg","The EJT Fitness client app on a phone"], crumb:"Fitness and coaching", client:"EJT Fitness", name:"EJT Fitness", where:"Online fitness and coaching agency", logo:"/img/logo-ejt.png", lw:520, lh:160,
   title:"How EJT Fitness launched a custom coaching app to scale beyond 110 clients and unlock online revenue",
   summary:"Coaching ran across spreadsheets, texts and third-party apps. EJT Fitness now has its own web and mobile platform, built around how its trainers coach.",
   card:{kind:"EJT Fitness, coaching agency", title:"A coaching platform of their own", metric:"87%", cap:"of 110 clients actively use the app", rows:[["Meal photo","Logged"],["Calories","Estimated"],["Workout","Completed"],["Trainer dashboard","Updated"]]},
   stats:[["87%","of 110 clients actively use the app"],["6 trainers","coaching on one platform"],["3 months","from kickoff to launch"]],
   snap:[["Business","EJT Fitness, personal training and coaching agency"],["Team and roster","6 trainers supporting 110 active clients"],["System","Custom web and mobile coaching platform"],["Timeline","Built and launched in 3 months. Live in production for 6 months"]],
   body:[
    {h:"The bottleneck", ul:[
      ["Scattered coaching tools.","Managing workouts, nutrition tracking and client check-ins across separate spreadsheets, texts and third-party apps slowed down daily coaching workflows."],
      ["Limited visibility into adherence.","Trainers lacked real-time insight into what clients were actually eating and lifting between sessions, making it harder to adjust plans quickly or drive consistent results."],
      ["Capacity ceiling.","Heavy manual check-in and nutrition-logging friction capped how many clients each trainer could effectively manage and prevented the agency from scaling a true remote and online coaching model."]]},
    {h:"What we built", p:["A custom web and mobile coaching platform tailored specifically to EJT Fitness's methodology, built in 3 months."], ul:[
      ["Centralized program and nutrition management.","Trainers build, assign and update custom workout routines and nutrition plans from a single dashboard."],
      ["Photo-based AI calorie tracking.","Clients log meals simply by snapping a photo of their food, eliminating tedious manual barcode scanning and macro entry."],
      ["Real-time exercise and adherence visibility.","Clients log workouts in-app while trainers get live visibility into workout completion, nutrition consistency and progress trends."]],
      img:["/img/ejt-trainer.jpg","The trainer dashboard on a laptop, with monthly client progress and a compliance ranking","Trainer dashboard: client progress and compliance in one place"], fig:"pipe"},
    {h:"Results after 6 months in production", img:["/img/ejt-admin.jpg","The admin view on a desktop monitor, with users, roles and weekly activity","Admin view: users, roles and weekly activity across the agency"], fig:"table"}],
   cols:["Business and operational metric","Impact"],
   rows:[["Platform adoption","87% of 110 clients actively using the app across 6 trainers in the first 6 months"],["New revenue stream","Enabled EJT Fitness to launch and scale fully online coaching clients alongside in-person training"],["Trainer capacity","Reduced manual check-in friction, allowing each of the 6 trainers to take on more clients without sacrificing coaching quality"],["Pricing power","Elevated the client experience into a proprietary, high-touch product, allowing the agency to command premium pricing"],["Client outcomes","Real-time adherence visibility enabled faster program adjustments and more efficient progress per client"]],
   pipe:[["Plan","Trainers build and assign workouts and nutrition plans"],["Meal photo","A client snaps a photo of a meal"],["Estimated","AI estimates the calories. No barcode scanning"],["Logged","Meals and workouts are logged in-app"],["Coached","Trainers see adherence live and adjust the plan"]]}
];
function tableHTML(c){
  var hi = c.cols.length===2 ? 1 : 2;
  return "<div class='card'><div class='tscroll'><table class='tbl'><thead><tr>"+c.cols.map(function(x){return "<th>"+esc(x)+"</th>";}).join("")+"</tr></thead><tbody>"+
    c.rows.map(function(r){return "<tr>"+r.map(function(x,j){return "<td"+(j===hi?" class='a'":"")+">"+esc(x)+"</td>";}).join("")+"</tr>";}).join("")+"</tbody></table></div></div>";
}
var CSFIG = {
  "distributor": "<svg class='sv cs-dist' viewBox='0 0 300 150' aria-hidden='true'><text x='16' y='22' class='lbl'>Handwritten order</text><text x='284' y='22' class='lbl res' text-anchor='end'>Sales order drafted</text>"+
    "<g transform='rotate(-3 72 84)'><rect class='paper' x='16' y='36' width='112' height='100' rx='4'/>"+
    [56,76,96,116].map(function(y,i){return "<path class='hw' style='--d:"+(i*.5)+"s' d='M26 "+y+"c6-5 10 5 16 0s10-5 16 0 10 5 16 0 10-5 16 0 8 4 14 0'/>";}).join("")+"</g>"+
    [56,76,96,116].map(function(y,i){return "<path class='cn' pathLength='1' style='--d:"+(i*.5+.2)+"s' d='M134 "+y+"C158 "+y+" 156 "+y+" 180 "+y+"'/><g class='sku' style='--d:"+(i*.5+.45)+"s'><rect x='184' y='"+(y-8)+"' width='100' height='16' rx='5'/><rect class='skb' x='192' y='"+(y-2)+"' width='"+[48,56,40,52][i]+"' height='4' rx='2'/><path class='ck' d='M268 "+y+"l3 3 6-6'/></g>";}).join("")+"</svg>",
  "ejt-fitness": "<svg class='sv cs-ejt' viewBox='0 0 300 150' aria-hidden='true'><text x='16' y='22' class='lbl'>Client app</text><text x='284' y='22' class='lbl res' text-anchor='end'>Trainer sees it live</text>"+
    "<rect class='phone' x='110' y='30' width='80' height='114' rx='12'/>"+
    "<circle class='plate' cx='150' cy='70' r='22'/><circle class='food' cx='142' cy='64' r='7'/><circle class='food f2' cx='157' cy='66' r='6'/><ellipse class='food f3' cx='150' cy='79' rx='9' ry='5'/>"+
    "<path class='crn' d='M122 46v-6h6M178 46v-6h-6M122 94v6h6M178 94v6h-6'/>"+
    "<rect class='flash' x='112' y='32' width='76' height='110' rx='11'/>"+
    "<circle class='rtrack' cx='150' cy='122' r='11'/><path class='rarc' pathLength='1' d='M150 111A11 11 0 1 1 139.54 125.4'/>"+
    [0,1,2].map(function(i){return "<g class='log' style='--d:"+(1.4+i*.3)+"s'><rect x='16' y='"+(44+i*26)+"' width='80' height='20' rx='5'/><rect class='th' x='21' y='"+(48+i*26)+"' width='12' height='12' rx='3'/><rect class='lb' x='38' y='"+(52+i*26)+"' width='"+[44,36,50][i]+"' height='4' rx='2'/></g>";}).join("")+
    [0,1,2,3].map(function(i){var h=[22,34,30,46][i];return "<rect class='bar' style='--d:"+(1.8+i*.15)+"s' x='"+(212+i*18)+"' y='"+(126-h)+"' width='11' height='"+h+"' rx='2'/>";}).join("")+
    "<path class='axis' d='M206 127H284'/><text x='206' y='142' class='lbl'>Adherence</text></svg>"
};
function logoHTML(c, size){
  return "<span class='clogo "+(size||"")+(c.tile?" tile-w":"")+"'><img src='"+c.logo+"' alt='"+esc(c.name)+"' width='"+c.lw+"' height='"+c.lh+"' loading='lazy'></span>";
}
function cardHTML(c){
  return "<a class='card ccard' href='"+(c.path||("#case-"+c.key))+"'>"+(c.banner ? "<div class='cimg'><img src='"+c.banner[0]+"' alt='"+esc(c.banner[1])+"' width='1600' height='700' loading='lazy'></div>" : CSFIG[c.key])+
    "<div class='cbody'><span class='mono'>"+esc(c.name)+"</span><h3>"+esc(c.card.title)+"</h3><div><div class='metric'>"+esc(c.card.metric)+"</div><span class='dim' style='font-size:.94rem'>"+esc(c.card.cap)+"</span></div><span class='go'>Read the case study</span></div></a>";
}
function modelHTML(px){
  return "<div class='stack' style='gap:14px'><div class='seg' role='group' aria-label='Before or after' style='align-self:flex-start'><button type='button' id='"+px+"-before' aria-pressed='false'>Before</button><button type='button' id='"+px+"-after' aria-pressed='true'>With the system</button></div>"+
    "<div class='card fig'><svg id='"+px+"-svg' viewBox='0 0 540 300' role='group' aria-label='System steps'></svg></div>"+
    "<div class='card list' id='"+px+"-list' role='group' aria-label='Steps'></div><div class='card panel' id='"+px+"-panel' aria-live='polite'></div></div>";
}
function buildCases(){
  $("home-cases").innerHTML = cases.map(cardHTML).join("");
  $("index-cases").innerHTML = cases.map(cardHTML).join("");
  $("case-pages").innerHTML = cases.map(function(c,ci){
    var nx = cases[(ci+1)%cases.length];
    var body = c.body.map(function(s){
      var h = (s.h?"<h2>"+esc(s.h)+"</h2>":"")+(s.p?s.p.map(function(x){return "<p>"+esc(x)+"</p>";}).join(""):"")+
        (s.ul?"<ul>"+s.ul.map(function(x){return "<li><strong>"+esc(x[0])+"</strong> "+esc(x[1])+"</li>";}).join("")+"</ul>":"");
      if (s.img) h += "<figure class='cfig'><div class='cfig-in'><img src='"+s.img[0]+"' alt='"+esc(s.img[1])+"' width='1000' height='750' loading='lazy'></div><figcaption class='mono'>"+esc(s.img[2])+"</figcaption></figure>";
      if (s.fig==="pipe") h += "<div class='card pipe anim' data-items='.pn'>"+c.pipe.map(function(x){return "<div class='pn'><b>"+esc(x[0])+"</b><span>"+esc(x[1])+"</span></div>";}).join("")+"</div>";
      if (s.demo) h += "<figure class='cfig'><div class='cfig-in cfig-demo'><iframe src='/demo/rj-po-demo.html' title='Animated demo: a PO email becomes a NetSuite sales order' loading='lazy'></iframe></div><figcaption class='mono'>Demo: a PO email becomes a NetSuite sales order.</figcaption></figure>";
      if (s.fig==="model") h += modelHTML("m"+ci);
      if (s.fig==="table") h += tableHTML(c);
      if (s.fig==="shots") h += "<div class='card shots' data-c='"+ci+"'><div class='seg' role='group' aria-label='Screens'>"+c.shots.map(function(x,i){return "<button type='button' data-i='"+i+"' aria-pressed='"+(i===1)+"'>"+esc(x[1])+"</button>";}).join("")+"</div>"+
        "<figure><img src='"+c.shots[1][0]+"' alt='The quoting agent' width='1320' height='860' loading='lazy'><figcaption class='mono' style='margin-top:10px'>"+esc(c.shots[1][2])+"</figcaption></figure></div>";
      return h;
    }).join("");
    return "<div class='page' data-page='case-"+c.key+"'><section class='art-hero'><div class='wrap stack' style='gap:26px'>"+
      "<a class='crumb' href='/case-studies/'>Case studies / "+esc(c.crumb)+"</a><div class='cbar'>"+logoHTML(c,"lg")+"<div><b>"+esc(c.name)+"</b><span class='mono'>"+esc(c.where)+"</span></div></div><h1>"+esc(c.title)+"</h1><p class='lede'>"+esc(c.summary)+"</p>"+
      "<div class='stats' style='margin-top:22px'>"+c.stats.map(function(s){return "<div><b>"+esc(s[0])+"</b><span>"+esc(s[1])+"</span></div>";}).join("")+"</div>"+
"</div></section>"+
      "<section><div class='wrap art'><div class='prose'>"+body+"</div><aside class='card snap'>"+c.snap.map(function(s){return "<div><small>"+esc(s[0])+"</small>"+esc(s[1])+"</div>";}).join("")+"</aside></div></section>"+
      "<section><div class='wrap stack' style='gap:20px'><a class='card next' href='"+(nx.path||("#case-"+nx.key))+"'><div><span class='mono'>Next case study</span><h3 style='font-size:1.4rem;margin-top:6px'>"+esc(nx.title)+"</h3></div><span class='btn ghost small'>Read</span></a>"+
      "<div class='actions'><a class='btn' href='/contact/'>Book a workflow review</a><a class='btn ghost' href='/#roi'>Calculate your ROI</a><a class='btn ghost' href='/case-studies/'>All case studies</a></div></div></section></div>";
  }).join("");
  $("case-pages").addEventListener("click",function(e){
    var btn = e.target.closest && e.target.closest(".shots button"); if(!btn) return;
    var box = btn.closest(".shots"), s = cases[+box.getAttribute("data-c")].shots[+btn.getAttribute("data-i")];
    box.querySelectorAll("button").forEach(function(x){x.setAttribute("aria-pressed",String(x===btn));});
    box.querySelector("img").src = s[0]; box.querySelector("figcaption").textContent = s[2];
  });
  cases.forEach(function(c,ci){ if (c.steps) makeModel("m"+ci, c); });
}

/* ---------- take-apart model ---------- */

/* ---------- industry hero figures ---------- */
function hfigWrap(title, svg){ return "<div class='card hfig'><div class='wf-head'><span class='mono'>"+esc(title)+"</span><span class='pill'><i></i>Running</span></div>"+svg+"</div>"; }
var M = "font-family='Geist Mono,ui-monospace,monospace'";
function heroDental(){
  var slip = [["Dr. R. Lee, Harbour Dental","h"],["Pt 0417","h"],["Crown #14","h"],["Zirconia","h"],["Shade: ____","x"],["Due Nov 26","h"]];
  var rows = [["Doctor","Dr. R. Lee","known customer",0],["Patient","0417","",0],["Tooth","#14","valid",0],["Type","Crown","",0],["Material","Zirconia","",0],["Shade","Missing","flagged",1],["Due","Nov 26","fits 5-day turnaround",0]];
  var hand = "font-family=\"'Segoe Print','Bradley Hand','Comic Sans MS',cursive\" font-style='italic'";
  var s = "<svg viewBox='0 0 520 300' role='img' aria-label='A handwritten prescription slip is read into a case draft, the missing shade is flagged, a message to the dental office is drafted, and the case waits for approval'>"+
    "<g transform='rotate(-2.5 115 150)'><rect x='18' y='24' width='196' height='252' rx='4' fill='rgba(255,255,255,.07)' stroke='rgba(255,255,255,.18)'/>"+
    "<text x='32' y='48' "+M+" font-size='9' fill='#8d9199'>Rx slip, photographed at receiving</text>"+
    slip.map(function(l,i){ var y = 80+i*32; return "<text x='32' y='"+y+"' "+hand+" font-size='"+(i===0?12.5:14.5)+"' fill='"+(l[1]==="x"?"#ff5a36":"#c5c7cc")+"'>"+esc(l[0])+"</text>"; }).join("")+
    "</g>"+
    "<path class='hs' style='--d:.2s' d='M24 30V272' stroke='#ff5a36' stroke-width='1.6'/>"+
    "<rect x='230' y='12' width='278' height='276' rx='8' fill='#181a1f' stroke='rgba(255,255,255,.09)'/>"+
    "<text x='244' y='36' font-size='12.5' font-weight='600' fill='#ecedee'>Case draft</text><text x='494' y='36' "+M+" font-size='9' fill='#8d9199' text-anchor='end'>lab software</text>"+
    rows.map(function(r,i){ var y = 60+i*21, d = .6+i*.35, c = r[3]?"#ff5a36":"#ecedee";
      return "<g class='h-in' style='--d:"+d+"s'><text x='244' y='"+y+"' "+M+" font-size='9' fill='#8d9199'>"+esc(r[0])+"</text><text x='310' y='"+y+"' font-size='10.5' fill='"+c+"'>"+esc(r[1])+"</text>"+
        (r[2]?"<text x='494' y='"+y+"' "+M+" font-size='8.5' fill='"+(r[3]?"#ff5a36":"#8d9199")+"' text-anchor='end'>"+esc(r[2])+"</text>":"")+"</g>"; }).join("")+
    "<path d='M244 210H494' stroke='rgba(255,255,255,.12)'/>"+
    "<g class='h-in' style='--d:3.3s'><rect x='244' y='218' width='250' height='30' rx='8' fill='rgba(255,90,54,.10)' stroke='#ff5a36' stroke-dasharray='3 2'/>"+
      "<text x='254' y='237' font-size='10' fill='#ecedee'>“Shade wasn't specified for #14, please confirm.”</text></g>"+
    "<g class='pulse' style='--d:4s'><rect x='244' y='256' width='150' height='22' rx='11' fill='#ecedee'/><text x='319' y='271' font-size='10.5' font-weight='600' fill='#0a0b0d' text-anchor='middle'>Approve and save</text></g>"+
    "<text class='h-in' style='--d:4s' x='494' y='271' "+M+" font-size='10' fill='#ff5a36' text-anchor='end'>30 s review</text></svg>";
  return hfigWrap("Prescription to case", s);
}
function heroSurvey(){
  function poly(p){ return p.map(function(q){return q.join(" ");}).join(" "); }
  var N=[[116,50],[206,44],[210,104],[120,110]], E=[[210,104],[296,98],[300,180],[216,186]], S=[[126,192],[216,186],[220,248],[130,254]], W=[[40,114],[120,110],[126,192],[46,198]];
  var nb = [[N,"PIN …0141",163,80],[E,"PIN …0143",256,145],[S,"PIN …0144",173,224],[W,"PIN …0140",83,156]];
  var docs = [["Parcel register","PIN 03215-0142"],["Reference plan","43R-12345"],["Instrument","Easement, as in"],["Prior survey","Found in your archive"],["Neighbour registers","4 of 4 read"]];
  var s = "<svg viewBox='0 0 520 300' role='img' aria-label='A subject parcel and its four neighbours are researched, an easement is flagged, and a sourced brief is assembled for the surveyor'>"+
    "<rect x='12' y='12' width='306' height='276' rx='8' fill='rgba(255,255,255,.02)' stroke='rgba(255,255,255,.09)'/>"+
    "<text x='24' y='34' "+M+" font-size='10' fill='#8d9199'>Subject and neighbours</text>"+
    "<g transform='translate(298 30)'><path d='M0-11l5 11-5-3-5 3z' fill='#ecedee'/></g>"+
    nb.map(function(n,i){ var d = 1.3+i*.35; return "<g class='h-in' style='--d:"+d+"s'><polygon points='"+poly(n[0])+"' fill='rgba(255,255,255,.05)' stroke='rgba(255,255,255,.32)' stroke-dasharray='4 3'/><text x='"+n[2]+"' y='"+n[3]+"' "+M+" font-size='8.5' fill='#8d9199' text-anchor='middle'>"+n[1]+"</text></g>"; }).join("")+
    "<polygon class='h-in' style='--d:1s' points='120,110 210,104 216,186 126,192' fill='rgba(255,90,54,.10)'/>"+
    "<path class='h-draw' style='--d:.2s' pathLength='1' d='M120 110L210 104L216 186L126 192Z' fill='none' stroke='#ecedee' stroke-width='1.6'/>"+
    "<g class='h-in' style='--d:2.9s'><polygon points='126,192 216,186 215.4,177 125.4,183' fill='rgba(255,90,54,.22)' stroke='#ff5a36' stroke-dasharray='3 2'/><text x='170' y='174' "+M+" font-size='8' fill='#ff5a36' text-anchor='middle'>EASEMENT</text></g>"+
    "<text class='h-in' style='--d:1s' x='168' y='150' "+M+" font-size='9' fill='#ecedee' text-anchor='middle'>SUBJECT</text>"+
    [[120,110],[210,104],[216,186],[126,192]].map(function(c){return "<rect class='h-in' style='--d:.9s' x='"+(c[0]-3)+"' y='"+(c[1]-3)+"' width='6' height='6' fill='#ff5a36'/>";}).join("")+
    "<rect x='330' y='12' width='178' height='276' rx='8' fill='#181a1f' stroke='rgba(255,255,255,.09)'/>"+
    "<text x='344' y='36' font-size='12.5' font-weight='600' fill='#ecedee'>Research brief</text>"+
    docs.map(function(dc,i){ var y = 52+i*36, d = 1.5+i*.45; return "<g class='h-in' style='--d:"+d+"s'><rect x='344' y='"+y+"' width='152' height='30' rx='6' fill='#111317' stroke='rgba(255,255,255,.09)'/><text x='354' y='"+(y+13)+"' font-size='10.5' fill='#ecedee'>"+esc(dc[0])+"</text><text x='354' y='"+(y+24)+"' "+M+" font-size='8.5' fill='#8d9199'>"+esc(dc[1])+"</text><path d='M478 "+(y+15)+"l3 3 6-6' fill='none' stroke='#ff5a36' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'/></g>"; }).join("")+
    "<g class='pulse' style='--d:4s'><rect x='344' y='242' width='152' height='26' rx='13' fill='#ff5a36'/><text x='420' y='259' font-size='10.5' font-weight='600' fill='#0a0b0d' text-anchor='middle'>Ready for the surveyor</text></g></svg>";
  return hfigWrap("New survey inquiry", s);
}
function heroDist(){
  var lines = ["3/4 cu 90s x20","1/2 pex 100' x4","3/4 ball valve x6","1/2 SB tee x30","tape + dope x2"];
  var rows = [["CU-90-075","3/4″ Cu 90° elbow","20"],["PEX-050-100","1/2″ PEX, 100 ft","4"],["BV-075","3/4″ ball valve","6"],["SBT-050","1/2″ push-fit tee","30"],["TPE-PTFE","Thread tape + dope","2"]];
  var s = "<svg viewBox='0 0 520 300' role='img' aria-label='A handwritten contractor order is read line by line and matched to SKUs in a draft sales order, ready for one-click approval'>"+
    "<g transform='rotate(-2.5 115 150)'><rect x='18' y='24' width='196' height='252' rx='4' fill='rgba(255,255,255,.07)' stroke='rgba(255,255,255,.18)'/>"+
    "<text x='32' y='50' "+M+" font-size='9' fill='#8d9199'>Photo of order, job 2214</text>"+
    lines.map(function(l,i){ var y = 86+i*38, d = .4+i*.6; return "<text x='32' y='"+y+"' font-family=\"'Segoe Print','Bradley Hand','Comic Sans MS',cursive\" font-style='italic' font-size='15' fill='#c5c7cc'>"+esc(l)+"</text><path class='h-grow' style='--d:"+d+"s' d='M30 "+(y+6)+"H196' stroke='#ff5a36' stroke-width='1.6'/>"; }).join("")+"</g>"+
    "<rect x='230' y='24' width='278' height='252' rx='8' fill='#181a1f' stroke='rgba(255,255,255,.09)'/>"+
    "<text x='244' y='48' font-size='12.5' font-weight='600' fill='#ecedee'>Sales order, draft</text><text x='494' y='48' "+M+" font-size='9' fill='#8d9199' text-anchor='end'>accounting</text>"+
    "<text x='244' y='70' "+M+" font-size='8.5' fill='#8d9199'>SKU</text><text x='326' y='70' "+M+" font-size='8.5' fill='#8d9199'>ITEM</text><text x='494' y='70' "+M+" font-size='8.5' fill='#8d9199' text-anchor='end'>QTY</text>"+
    "<path d='M244 76H494' stroke='rgba(255,255,255,.12)'/>"+
    rows.map(function(r,i){ var y = 96+i*28, d = .7+i*.6; return "<g class='h-in' style='--d:"+d+"s'><text x='244' y='"+y+"' "+M+" font-size='9.5' fill='#ecedee'>"+esc(r[0])+"</text><text x='326' y='"+y+"' font-size='10.5' fill='#c5c7cc'>"+esc(r[1])+"</text><text x='494' y='"+y+"' "+M+" font-size='10.5' fill='#ecedee' text-anchor='end'>"+r[2]+"</text></g>"; }).join("")+
    "<path d='M244 236H494' stroke='rgba(255,255,255,.12)'/>"+
    "<g class='pulse' style='--d:4s'><rect x='244' y='244' width='164' height='22' rx='11' fill='#ecedee'/><text x='326' y='259' font-size='10.5' font-weight='600' fill='#0a0b0d' text-anchor='middle'>Approve order</text></g>"+
    "<text class='h-in' style='--d:4s' x='494' y='259' "+M+" font-size='10' fill='#ff5a36' text-anchor='end'>~1 min review</text></svg>";
  return hfigWrap("Handwritten order to sales order", s);
}
var HERO = {"dental-labs":heroDental, "land-surveyors":heroSurvey, "distributors":heroDist};
function setupHeroFigs(){
  var still = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var figs = Array.prototype.slice.call(document.querySelectorAll(".hfig")); if (still || !figs.length || !("IntersectionObserver" in window)) return;
  function replay(f){ f.classList.remove("play"); void f.getBoundingClientRect(); f.classList.add("play"); }
  var vis = new Map();
  var io = new IntersectionObserver(function(es){ es.forEach(function(e){ vis.set(e.target, e.isIntersecting); if (e.isIntersecting) replay(e.target); }); },{threshold:.3});
  figs.forEach(function(f){ io.observe(f); });
  setInterval(function(){ if (document.hidden) return; figs.forEach(function(f){ if (vis.get(f)) replay(f); }); }, 9000);
}

/* ---------- alternative step-model views ---------- */
function drawLanes(svg, steps, st, after, onSel){
  var lanes = after ? ["System","Clerk","Surveyor"] : ["","By hand",""], n = steps.length, x0 = 134, gap = (498-x0)/(n-1);
  lanes.forEach(function(l,i){
    var y = 30+i*84;
    svg.appendChild(el("rect",{x:"96",y:String(y),width:"436",height:"70",rx:"10",fill:"rgba(255,255,255,"+(l?".025":".01")+")",stroke:"rgba(255,255,255,"+(l?".09":".04")+")"}));
    if (l) svg.appendChild(el("text",{x:"86",y:String(y+39),"text-anchor":"end","font-size":"10.5",style:"fill:#8d9199"},l));
  });
  function laneOf(s){ if (!after) return 1; return !s.h ? 0 : (s.who||"").indexOf("clerk")>-1 ? 1 : 2; }
  var pts = steps.map(function(s,i){ return [x0+i*gap, 30+laneOf(s)*84+28]; });
  var d = "M"+pts[0][0]+" "+pts[0][1];
  for (var i=1;i<pts.length;i++){ var mx = (pts[i-1][0]+pts[i][0])/2; d += "H"+mx+"V"+pts[i][1]+"H"+pts[i][0]; }
  svg.appendChild(el("path",{d:d,fill:"none",stroke:after?"rgba(255,90,54,.55)":"rgba(255,255,255,.25)","stroke-width":"1.5","stroke-dasharray":after?"":"4 3"}));
  steps.forEach(function(s,i){
    var on = i===st.sel, p = pts[i], g = el("g",{class:"lane-node","aria-label":"Step "+(i+1)+": "+s.t});
    g.appendChild(el("rect",{x:String(p[0]-24),y:String(p[1]-15),width:"48",height:"30",rx:"8",fill:on?ACC:(after&&s.h?TXT:"#1d2026"),stroke:on?ACC:"#5a5e67"}));
    g.appendChild(el("text",{x:String(p[0]),y:String(p[1]+4),"text-anchor":"middle","font-size":"11","font-weight":"500",style:"fill:"+(on||(after&&s.h)?BG:TXT)},String(i+1)));
    g.appendChild(el("text",{x:String(p[0]),y:String(p[1]+30),"text-anchor":"middle","font-size":"9",style:"fill:"+(on?TXT:DIM)},s.t));
    activate(g,function(){onSel(i);}); svg.appendChild(g);
  });
}
function drawFlow(svg, steps, st, after, onSel){
  var n = steps.length, x0 = 70, x1 = 470, gap = (x1-x0)/(n-1), y = 170;
  svg.appendChild(el("text",{x:"270",y:"58","text-anchor":"middle","font-size":"30","font-weight":"600",style:"fill:"+(after?ACC:TXT)+";letter-spacing:-.03em;font-family:var(--sans)"},after?"~1 min":"8 min"));
  svg.appendChild(el("text",{x:"270",y:"80","text-anchor":"middle","font-size":"10.5",style:"fill:"+DIM},after?"per order, reviewed and approved":"per order, typed by hand"));
  svg.appendChild(el("rect",{x:String(x0-30),y:String(y-6),width:String(x1-x0+60),height:"12",rx:"6",fill:"rgba(255,255,255,.04)",stroke:"rgba(255,255,255,.12)","stroke-dasharray":after?"":"4 3"}));
  if (after){ var pk = el("g",{class:"pkt"}); pk.appendChild(el("rect",{x:String(x0-22),y:String(y-22),width:"26",height:"18",rx:"3",fill:TXT})); pk.appendChild(el("path",{d:"M"+(x0-17)+" "+(y-16)+"h16M"+(x0-17)+" "+(y-11)+"h10",stroke:BG,"stroke-width":"1.6"})); svg.appendChild(pk); }
  steps.forEach(function(s,i){
    var on = i===st.sel, cx = x0+i*gap, g = el("g",{class:"lane-node","aria-label":"Step "+(i+1)+": "+s.t});
    g.appendChild(el("circle",{cx:String(cx),cy:String(y),r:"24",fill:on?ACC:(after&&s.h?TXT:"#1d2026"),stroke:on?ACC:"#5a5e67","stroke-dasharray":!after&&!on?"4 3":""}));
    g.appendChild(el("text",{x:String(cx),y:String(y+5),"text-anchor":"middle","font-size":"13","font-weight":"500",style:"fill:"+(on||(after&&s.h)?BG:TXT)},String(i+1)));
    g.appendChild(el("text",{x:String(cx),y:String(y+46),"text-anchor":"middle","font-size":"11","font-weight":"500",style:"fill:"+TXT},s.t));
    g.appendChild(el("text",{x:String(cx),y:String(y+62),"text-anchor":"middle","font-size":"9",style:"fill:"+(s.h?ACC:DIM)},s.h?"person approves":(after?"system":"by hand")));
    activate(g,function(){onSel(i);}); svg.appendChild(g);
  });
}

function makeModel(px, c){
  var st = {after:true, sel:2};
  function draw(){
    var steps = c.steps, n = steps.length, after = st.after;
    if (st.sel >= n) st.sel = n-1;
    var svg = $(px+"-svg"); svg.textContent = "";
    if (c.view==="lanes" || c.view==="flow"){ (c.view==="lanes"?drawLanes:drawFlow)(svg, steps, st, after, function(i){ st.sel=i; draw(); }); }
    else {
    var sp = n>4 ? 1.62 : 2.5, span = (n-1)*sp+1.7, o = {x:96,y:70,a:Math.min(38, 420/span)};
    var base = isoBox(o,-0.3,-0.3,(n-1)*sp+1.7,1.7,5); paint(base,"base"); svg.appendChild(base);
    steps.forEach(function(s,i){
      var on = i===st.sel, ghost = !after && s.h && !s.keep, hgt = after?38:(ghost?1:9);
      var g = isoBox(o, i*sp, 0, 1.1, 1.1, hgt);
      g.setAttribute("class","plate"); g.setAttribute("aria-label","Step "+(i+1)+": "+s.t+(s.h?", a person decides":""));
      if (on) paint(g,"sel", ghost?"4 3":null); else if (ghost) paint(g,"ghost","4 3"); else if (!after) paint(g,"dark","4 3"); else paint(g, s.h?"light":"dark");
      var p = pt(o, i*sp+.55, .55, hgt);
      if (s.h && (after || s.keep)){ g.appendChild(el("circle",{cx:p[0],cy:p[1]-3,r:4.5,fill:BG})); g.appendChild(el("path",{d:"M"+(p[0]-8)+" "+(p[1]+8)+"q8 -11 16 0",fill:"none",stroke:BG,"stroke-width":"2","stroke-linecap":"round"})); }
      balloon(g, p[0], p[1]-44, i+1, on);
      g.style.transform = on ? "translateY(-10px)" : "";
      activate(g,function(){st.sel=i;draw();});
      svg.appendChild(g);
    });
    }
    var list = $(px+"-list"); list.innerHTML = "";
    steps.forEach(function(s,i){
      var x = document.createElement("button"); x.type="button"; x.setAttribute("aria-pressed",String(i===st.sel));
      x.innerHTML = "<span>"+(i+1)+"</span>"+esc(s.t)+"<em>"+(s.h?(s.who||"person decides"):(after?"system drafts":"by hand"))+"</em>";
      x.addEventListener("click",function(){st.sel=i;draw();});
      list.appendChild(x);
    });
    var s = steps[st.sel];
    $(px+"-panel").innerHTML = "<h3>"+(st.sel+1)+". "+esc(s.t)+"</h3><div class='cols'><div><h4>Before</h4><p class='dim'>"+esc(s.b)+"</p></div><div><h4 style='color:var(--accent)'>With the system</h4><p>"+esc(s.a)+"</p></div></div>";
    $(px+"-before").setAttribute("aria-pressed", String(!after)); $(px+"-after").setAttribute("aria-pressed", String(after));
  }
  $(px+"-before").addEventListener("click",function(){st.after=false;draw();});
  $(px+"-after").addEventListener("click",function(){st.after=true;draw();});
  draw();
}

/* ---------- what we build: exploded stack ---------- */
var kinds = [
  {n:"Customer-facing apps", stat:"87% client adoption in the first 6 months.", d:"Mobile and web apps your customers use, with the staff tools behind them.",
   who:"EJT Fitness", what:"A trainer dashboard and a client app with photo-based calorie tracking and workout logging. 87% of their 110 clients use it.", href:"case-ejt-fitness",
   fit:"Your service continues between visits, and a generic app does not match how you deliver it.", not:"A booking or loyalty product already covers what you need."},
  {n:"Agents for expert work", d:"An agent reads what comes in, checks it the way your most experienced person would, and drafts the output. A person reviews it.",
   who:"Dental labs", what:"Reads each prescription, checks the doctor, tooth numbers, shade and due date against the lab's own rules, and drafts the message to the office when something is missing.", href:"dental-labs",
   fit:"Skilled people spend much of their week on work that follows a pattern.", not:"The work comes up a few times a month, or there is no past work to draw on."},
  {n:"Research and knowledge systems", d:"An agent gathers records and past work from the places your team would search, and returns a summary with its sources.",
   who:"Land surveyors", what:"Reads parcel registers, plans and instruments, searches the firm's archive, drafts records requests and assembles a research brief with every line linked to its source.", href:"land-surveyors",
   fit:"Jobs begin with hours of looking things up.", not:"The records are not yet somewhere software can reach."},
  {n:"Document and order intake", stat:"Order entry cut from 8 minutes to about a minute. 28 hours a week saved.", d:"Emails, PDFs and photos of handwriting are read, matched to your own items and records, and drafted as entries for approval.",
   who:"An industrial supply distributor", what:"Reads emailed PDFs and photos of handwritten orders, maps shorthand to exact SKUs and drafts the sales order in NetSuite. Entry went from ~8 minutes to about 1 to 1.5 minutes.", href:"case-distributor",
   fit:"Someone keys in orders or documents every day, and mistakes are costly.", not:"Volumes are low enough that typing it in is cheaper."},
  {n:"System integrations", stat:"Live in 5 weeks on existing accounting and inventory software. Zero per-order fees.", d:"Part of every build. The system reads from and writes to the software you already run, so nothing is entered twice.",
   who:"An industrial supply distributor", what:"Sales orders are built directly inside the NetSuite setup they already had.", href:"case-distributor",
   fit:"The same details are typed into more than one system.", not:"A system cannot export or connect. Replace it first."}
];
var kSel = 1, plates = [];
function buildStack(){
  var list = $("svc-list"), svg = $("stack-svg"), cx=195, w=150, h=44, t=12;
  list.textContent = ""; svg.textContent = ""; plates = [];
  kinds.forEach(function(s,i){
    var b = document.createElement("button"); b.type="button"; b.innerHTML = "<span>"+(i+1)+"</span>"+esc(s.n);
    b.addEventListener("click",function(){kSel=i;drawStack();}); list.appendChild(b);
  });
  for (var i=kinds.length-1;i>=0;i--){ (function(i){
    var y = 26 + i*46, g = el("g",{class:"plate","aria-label":"Layer "+(i+1)+": "+kinds[i].n});
    g.appendChild(el("path",{class:"s1",d:"M"+(cx-w)+" "+(y+h)+"L"+cx+" "+(y+2*h)+"V"+(y+2*h+t)+"L"+(cx-w)+" "+(y+h+t)+"Z"}));
    g.appendChild(el("path",{class:"s2",d:"M"+(cx+w)+" "+(y+h)+"L"+cx+" "+(y+2*h)+"V"+(y+2*h+t)+"L"+(cx+w)+" "+(y+h+t)+"Z"}));
    g.appendChild(el("path",{class:"top",d:"M"+cx+" "+y+"L"+(cx+w)+" "+(y+h)+"L"+cx+" "+(y+2*h)+"L"+(cx-w)+" "+(y+h)+"Z"}));
    g.appendChild(el("path",{class:"det",fill:"none","stroke-width":"1",d:"M"+(cx-w/2)+" "+(y+h/2)+"L"+(cx+w/2)+" "+(y+h*1.5)+"M"+(cx+w/2)+" "+(y+h/2)+"L"+(cx-w/2)+" "+(y+h*1.5)}));
    g.appendChild(el("path",{class:"lead",fill:"none","stroke-width":"1",d:"M"+(cx+w)+" "+(y+h)+"H"+(cx+w+42)}));
    g.appendChild(el("circle",{class:"bal",cx:cx+w+56,cy:y+h,r:13,"stroke-width":"1"}));
    g.appendChild(el("text",{x:cx+w+56,y:y+h+4,"text-anchor":"middle","font-size":"12"},String(i+1)));
    activate(g,function(){kSel=i;drawStack();});
    svg.appendChild(g); plates[i]=g;
  })(i); }
}
function drawStack(){
  Array.prototype.forEach.call($("svc-list").children,function(b,i){b.setAttribute("aria-pressed",String(i===kSel));});
  plates.forEach(function(g,i){
    var on = i===kSel, c = PRE[on?"sel":"dark"];
    g.style.transform = "translateY(calc("+(on ? -14 : i<kSel ? -28 : 0)+"px + "+((2-i)*30)+"px * (1 - var(--ex, 1))))";
    [["top",0],["s1",1],["s2",2]].forEach(function(p){ var e=g.querySelector("."+p[0]); e.setAttribute("fill",c[p[1]]); e.setAttribute("stroke",c[3]); e.setAttribute("stroke-width","1"); e.setAttribute("stroke-linejoin","round"); });
    g.querySelector(".det").setAttribute("stroke", on ? "rgba(10,11,13,.35)" : "rgba(255,255,255,.07)");
    g.querySelector(".lead").setAttribute("stroke", on ? ACC : "#5a5e67");
    g.querySelector(".bal").setAttribute("fill", on ? ACC : BG); g.querySelector(".bal").setAttribute("stroke", on ? ACC : "#5a5e67");
    g.querySelector("text").setAttribute("style","fill:"+(on?BG:TXT));
  });
  var s = kinds[kSel];
  $("svc-panel").innerHTML = "<span class='mono'>"+(kSel+1)+" of "+kinds.length+"</span><h3 style='font-size:1.5rem;letter-spacing:-.03em'>"+esc(s.n)+"</h3><p class='dim'>"+esc(s.d)+"</p>"+
    (s.stat ? "<div class='callout'><b>In production</b>"+esc(s.stat)+"</div>" : "")+
    "<div class='cols'><div><h4>Fits when</h4><p class='dim'>"+esc(s.fit)+"</p></div><div><h4>Does not fit when</h4><p class='dim'>"+esc(s.not)+"</p></div></div>";
}

/* ---------- process ---------- */
var stages = [
  {n:"Identify", sub:"Check readiness, map the work",
   d:"We begin with an AI readiness assessment: are your processes stable, is your information reachable, does your team have room for change? Some businesses stop here with a list of basics to fix or a product to buy. If you are ready, we sit with the people who do the work, map each workflow, and mark every retype, wait and chase.",
   we:["Assess readiness: process, data, tools, people","Map workflows as they really happen","Rank fixes by hours saved against effort to build"],
   you:["A plain answer: fix, buy or build","A marked-up map of your workflows","A fixed scope for the first build, if one is justified"]},
  {n:"Develop", sub:"Build it around how you work",
   d:"We write the software. It is shaped to your process and connected to the tools you already pay for. You see working software early, test it on real jobs, and tell us what is wrong while it is still cheap to change.",
   we:["Design the build with the people who will use it","Develop and connect it to your existing systems","Test against your real cases, including the awkward ones"],
   you:["Working software you have already tried","Integrations with your current tools","Plain-language documentation"]},
  {n:"Adopt", sub:"Make the new way the normal way",
   d:"This is the stage most projects skip, and the reason so many tools sit unused. We train your team on their real work, run the new process alongside the old one until it is trusted, and fix friction as it appears.",
   we:["Train each role on its own tasks","Stay close through the first weeks of live use","Measure usage and time saved, then tune"],
   you:["A team that uses the tool without being asked","Playbooks for new team members","A report on what the build is saving"]}
];
var stSel = 0;
function buildProcess(){
  $("stage-tabs").textContent = "";
  stages.forEach(function(s,i){
    var b = document.createElement("button"); b.type="button";
    b.innerHTML = "<span class='nm'><b>0"+(i+1)+"</b>"+esc(s.n)+"</span><span class='sub'>"+esc(s.sub)+"</span>";
    b.addEventListener("click",function(){stSel=i;drawProcess();}); $("stage-tabs").appendChild(b);
  });
}
function drawProcess(){
  var s = stages[stSel], svg = $("proc-svg"), o = {x:330,y:120,a:40};
  Array.prototype.forEach.call($("stage-tabs").children,function(b,i){b.setAttribute("aria-pressed",String(i===stSel));});
  svg.textContent = "";
  var base = isoBox(o,-0.4,-0.4,3.2,7.0,5); paint(base,"base"); svg.appendChild(base);
  stages.slice().reverse().forEach(function(st,j){
    var i = stages.length-1-j, iy = (stages.length-1-i)*2.1, on = i===stSel, h = 26+i*34, g = isoBox(o, 0, iy, 2.4, 2, h);
    g.setAttribute("class","plate"); g.setAttribute("aria-label","Stage "+(i+1)+": "+st.n); paint(g, on?"sel":"dark");
    var p = pt(o, 1.2, iy+1, h);
    g.appendChild(el("text",{x:p[0],y:p[1]+4,"text-anchor":"middle","font-size":"12.5","font-weight":"500",style:"fill:"+(on?BG:TXT)},st.n));
    balloon(g, p[0], p[1]-50, i+1, on);
    activate(g,function(){stSel=i;drawProcess();}); svg.appendChild(g);
  });
  $("proc-panel").innerHTML = "<span class='mono'>Stage "+(stSel+1)+" of 3</span><h3 style='font-size:1.6rem;letter-spacing:-.03em'>"+esc(s.n)+"</h3><p class='dim'>"+esc(s.d)+"</p>"+
    "<div><div class='h4'>What we do</div><ul>"+li(s.we)+"</ul></div><div><div class='h4' style='color:var(--accent)'>What you get</div><ul>"+li(s.you)+"</ul></div>"+
    (stSel===0 ? "<div class='actions'><a class='btn ghost small' href='/readiness/'>Try the short readiness check</a></div>" : "");
}

/* ---------- field of 100 ---------- */
var fieldText = {
  few:"Has a system running. Skilled work gets drafted, a person decides.",
  some:"Pays for an AI tool. People still paste between the same manual steps.",
  none:"Not using AI yet."
};
function drawField(){
  var svg = $("field"), o = {x:320,y:84,a:29}, cells = [], few = 0;
  svg.textContent = "";
  for (var r=0;r<10;r++) for (var c=0;c<10;c++) cells.push([r,c]);
  cells.sort(function(a,b){return (a[0]+a[1])-(b[0]+b[1]);});
  cells.forEach(function(rc){
    var i = rc[0]*10+rc[1], k = (i*37)%100, t = k<14 ? "few" : k<76 ? "some" : "none";
    var g = isoBox(o, rc[1], rc[0], .8, .8, t==="few"?48:t==="some"?11:3);
    g.setAttribute("class","blk"+(t==="few"?" rise":"")); g.setAttribute("data-k",t); g.setAttribute("data-n",i+1); paint(g,t);
    if (t==="few") g.style.setProperty("--i", few++);
    svg.appendChild(g);
  });
  function read(e){ var g = e.target.closest && e.target.closest(".blk"); if(!g) return; $("field-read").textContent = "Business "+g.getAttribute("data-n")+". "+fieldText[g.getAttribute("data-k")]; }
  svg.addEventListener("mouseover",read); svg.addEventListener("click",read);
}

/* ---------- calculator ---------- */
function money(n){return "$"+Math.round(n).toLocaleString("en-US");}
function calc(){
  var p=+$("c-people").value, h=+$("c-hours").value, r=+$("c-rate").value, s=+$("c-share").value/100;
  $("o-people").textContent=p; $("o-hours").textContent=h+" h"; $("o-rate").textContent="$"+r; $("o-share").textContent=Math.round(s*100)+"%";
  var hours=p*h*s*48, year=hours*r;
  $("r-days").textContent=Math.round(hours/8).toLocaleString("en-US"); $("r-year").textContent=money(year); $("r-month").textContent=money(year/12);
}
["c-people","c-hours","c-rate","c-share"].forEach(function(id){$(id).addEventListener("input",calc);});

/* ---------- readiness check ---------- */
var qs = [
  {q:"How is the work you most want to fix done today?", o:["Differently each time. It lives in people's heads","Roughly the same way, but not written down","The same steps every time, and documented"]},
  {q:"Where does the information for it live?", o:["Paper, email and memory","Spreadsheets and shared drives","A system of record such as an ERP, CRM, accounting or project system"]},
  {q:"How often does this work come up?", o:["A few times a month","Several times a week","Many times a day"]},
  {q:"How many people handle it?", o:["One","Two to four","Five or more"]},
  {q:"Have you looked for off-the-shelf software that does it?", o:["Not yet","Yes, and one product covers most of what we need","Yes, and nothing fits how we work"]},
  {q:"Who would own this change inside your business?", o:["Nobody has the time","Me, alongside everything else","A named person with time set aside"]},
  {q:"How does your team feel about changing how they work?", o:["Resistant","Mixed","They are asking for it"]},
  {q:"Is your team using AI tools today?", o:["No","A few people, on their own","Yes, with agreed rules about what data goes in"]}
];
var PTS = [[2,7,10],[2,7,10],[3,8,10],[5,9,10],[7,4,10],[2,7,10],[3,7,10],[4,8,10]];
var LOW = [0,0,0,0,1,0,0,0];
var TIPS = ["Write the work down as it should run, and get everyone doing it one way","Move the information into one place. A well-kept spreadsheet is enough to start","Keep a simple log of how often the work comes up and how long it takes","Note how many hours a week that one person spends on it","Try the product you found first, and note what it cannot do","Name one person who owns the change and give them time for it","Involve the people who do the work before anything is built","Agree simple rules for what company data may go into AI tools"];
var ans = qs.map(function(){return null;}), qi = 0, quizDone = false, lastSummary = "", shown = 0, interacted = false;
var STILL = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
function pts(i){ return ans[i]==null ? 0 : PTS[i][ans[i]]; }
function scoreNow(){
  var got = 0, max = 0, n = 0;
  ans.forEach(function(v,i){ if (v!=null){ got += PTS[i][v]; max += 10; n++; } });
  return {n:n, s: max ? Math.round(got/max*100) : 0};
}
function dimsNow(){
  function has(){ for (var k=0;k<arguments.length;k++) if (ans[arguments[k]]!=null) return true; return false; }
  return [["Process",pts(0),10,has(0)],["Information",pts(1),10,has(1)],["Volume",pts(2)+pts(3),20,has(2,3)],["Fit for custom",pts(4),10,has(4)],["People",pts(5)+pts(6),20,has(5,6)],["AI habits",pts(7),10,has(7)]];
}
function bandOf(s){ return s>=60 ? ["Ready to build","var(--accent)"] : s>=40 ? ["Almost there","#e9c46a"] : ["Not ready yet","#8d9199"]; }
function verdictOf(){
  var s = scoreNow().s, lows = [], v, body, steps, ready = false, close = false;
  ans.forEach(function(x,i){ if (x===LOW[i]) lows.push(TIPS[i]); });
  if (s >= 60){
    ready = true; v = "You're ready for a first build";
    body = "Your answers show enough structure and volume for a custom system to pay back. A workflow review will show what to build first and what it should return.";
    steps = ["Book a workflow review","Bring one piece of work and the people who do it","Expect a written scope before any build starts"];
    if (ans[4]===1) steps.push("Bring the product you found. We build only what it cannot do");
    if (ans[5]===0) steps.push("Name one person to own the rollout");
  } else if (s >= 40){
    close = true; v = "Almost there";
    body = "Most of the pieces are in place. A workflow review will show whether to close the gaps below before a first build, or during it.";
    steps = lows.slice(0,3).concat(["Book a workflow review to confirm where to start"]);
  } else {
    v = "Not ready yet";
    body = "The basics need work before a custom system would pay back. Fixing them costs little and pays back on its own.";
    steps = lows.slice(0,4).concat(["Take the check again in a few months"]);
  }
  return {v:v, body:body, steps:steps, ready:ready, close:close};
}
function tweenNum(node, from, to){
  if (STILL || from===to){ node.textContent = to; return; }
  var t0 = null;
  function f(ts){ if(!t0) t0 = ts; var p = Math.min(1,(ts-t0)/700), e = 1-Math.pow(1-p,3); node.textContent = Math.round(from+(to-from)*e); if (p<1) requestAnimationFrame(f); }
  requestAnimationFrame(f);
}
function buildReady(){
  $("scorecard").innerHTML =
    "<div class='qmeta'><span class='mono' id='sc-title'>Progress</span><span class='mono' id='sc-n'></span></div>"+
    "<svg class='gauge' viewBox='0 0 240 150' role='img' aria-labelledby='sc-num'><path class='trk' d='M24 124A96 96 0 0 1 216 124'/><path class='val' id='sc-arc' pathLength='100' d='M24 124A96 96 0 0 1 216 124' style='stroke-dashoffset:100'/>"+
    "<text class='tk' x='24' y='144' text-anchor='middle'>0</text><text class='tk' id='sc-max' x='216' y='144' text-anchor='middle'>8</text>"+
    "<text class='num' id='sc-num' x='120' y='118' text-anchor='middle'>0</text><text class='of' id='sc-of' x='120' y='138' text-anchor='middle'>of 8 answered</text></svg>"+
    "<div class='band'><b id='sc-band'>Answer to see your score</b><span class='mono' id='sc-hint'></span></div>"+
    "<div class='dimrows' id='sc-dims'></div>";
  $("quiz").addEventListener("click", function(e){
    var b = e.target.closest && e.target.closest("[data-act]"); if (!b) return;
    var act = b.getAttribute("data-act");
    if (act==="pick") pick(+b.getAttribute("data-j"));
    else if (act==="back") back();
    else if (act==="next"){ if (ans[qi]!=null){ advance(); } }
    else if (act==="jump"){ interacted = true; qi = +b.getAttribute("data-i"); quizDone = false; renderQuiz(true); renderScore(); }
    else if (act==="retake"){ ans = qs.map(function(){return null;}); qi = 0; quizDone = false; lastSummary = ""; renderQuiz(true); renderScore(); }
    else if (act==="copy"){
      var st=function(ok){ var n=$("ready-state"); if(n) n.textContent = ok ? "Copied." : "Copy did not work here. Select the text and copy it by hand."; };
      try{ navigator.clipboard.writeText(lastSummary).then(function(){st(true);},function(){st(false);}); }catch(err){st(false);}
    }
  });
  document.addEventListener("keydown", function(e){
    var on = document.querySelector(".page.on"); if (!on || on.getAttribute("data-page")!=="readiness" || quizDone) return;
    if (e.target.closest && e.target.closest("input,textarea,select")) return;
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    var k = e.key.toLowerCase(), map = {"1":0,"2":1,"3":2,"a":0,"b":1,"c":2};
    if (k in map){ e.preventDefault(); pick(map[k]); }
    else if (k==="arrowleft" || k==="backspace"){ if (qi>0){ e.preventDefault(); back(); } }
  });
}
function firstOpen(){ for (var i=0;i<ans.length;i++) if (ans[i]==null) return i; return ans.length; }
function pick(j){
  interacted = true; ans[qi] = j; renderQuiz(false); renderScore();
  setTimeout(advance, STILL ? 0 : 260);
}
function advance(){
  if (firstOpen() >= qs.length && (qi === qs.length-1 || firstOpen() === qs.length)){ quizDone = true; }
  else { qi = Math.min(qs.length-1, ans[qi+1]!=null ? firstOpen() : qi+1); }
  renderQuiz(true); renderScore();
}
function back(){ interacted = true; if (quizDone){ quizDone = false; qi = qs.length-1; } else if (qi>0) qi--; renderQuiz(true); renderScore(); }
function progHTML(){
  var open = firstOpen();
  return "<div class='qprog' role='group' aria-label='Questions'>"+qs.map(function(q,i){
    var cls = (i===qi && !quizDone) ? "cur" : ans[i]!=null ? "on" : "";
    return "<button type='button' class='"+cls+"' data-act='jump' data-i='"+i+"' aria-label='Question "+(i+1)+"'"+(i>open?" disabled":"")+"><i></i></button>";
  }).join("")+"</div>";
}
function renderQuiz(enter){
  var q = $("quiz"), h;
  if (!quizDone){
    var Q = qs[qi];
    h = progHTML()+"<div class='qbody"+(enter?" enter":"")+"'><div class='qmeta'><span class='mono' style='color:var(--accent)'>Question "+(qi+1)+" of "+qs.length+"</span><span class='mono'>Think of one piece of work</span></div>"+
      "<h2 class='qtext' id='qtext'>"+esc(Q.q)+"</h2><div class='opts' role='radiogroup' aria-labelledby='qtext'>"+
      Q.o.map(function(o,j){ return "<button type='button' class='opt2' role='radio' aria-checked='"+(ans[qi]===j)+"' data-act='pick' data-j='"+j+"'><kbd>"+(j+1)+"</kbd><span>"+esc(o)+"</span></button>"; }).join("")+
      "</div></div><div class='qnav'><button type='button' class='linkbtn' data-act='back'"+(qi===0?" disabled":"")+">Back</button><span class='mono'>Press <kbd>1</kbd> <kbd>2</kbd> <kbd>3</kbd> to answer</span>"+
      (ans[qi]!=null ? "<button type='button' class='btn small' data-act='next'>Next</button>" : "<span></span>")+"</div>";
  } else {
    var r = verdictOf(), sc = scoreNow().s, bd = bandOf(sc);
    h = progHTML()+"<div class='qbody"+(enter?" enter":"")+"'><span class='mono' style='color:var(--accent)'>Your result</span><h2 class='verdict'>"+esc(r.v)+"</h2><p class='dim'>"+esc(r.body)+"</p>"+
      "<div><div class='h4'>What to do next</div><ul class='result-list'>"+li(r.steps)+"</ul></div></div>"+
      "<div class='qnav' style='flex-wrap:wrap'><div class='actions'>"+(r.ready||r.close?"<a class='btn' href='/contact/'>Book a workflow review</a>":"<a class='btn ghost' href='/contact/'>Get a second opinion</a>")+
      "<button type='button' class='btn ghost' data-act='copy'>Copy my result</button><button type='button' class='linkbtn' data-act='retake'>Retake</button></div><span class='mono' id='ready-state'></span></div>";
    lastSummary = "AI readiness check (Alty Labs)\nScore: "+sc+"/100 ("+bd[0]+")\nResult: "+r.v+"\n"+r.body+"\n\n"+dimsNow().map(function(d){return d[0]+": "+d[1]+"/"+d[2];}).join("\n")+"\n\nNext steps:\n- "+r.steps.join("\n- ");
  }
  q.innerHTML = h;
  if (interacted && !quizDone){ var f = q.querySelector(".opt2[aria-checked='true']") || q.querySelector(".opt2"); if (f) f.focus({preventScroll:true}); }
  if (interacted && quizDone){ var v = q.querySelector(".verdict"); if (v){ v.setAttribute("tabindex","-1"); v.focus({preventScroll:true}); } }
}
function renderScore(){
  var r = scoreNow(), arc = $("sc-arc");
  if (!quizDone){
    var pct = Math.round(r.n/qs.length*100);
    arc.style.strokeDashoffset = 100 - pct; arc.style.stroke = "var(--text)"; arc.style.opacity = r.n ? 1 : 0;
    $("sc-num").textContent = r.n; shown = 0;
    $("sc-of").textContent = "of "+qs.length+" answered";
    $("sc-title").textContent = "Progress"; $("sc-max").textContent = qs.length;
    $("sc-n").textContent = pct+"% complete";
    $("sc-band").textContent = r.n < qs.length ? "Your score appears when you finish" : "Finishing up";
    $("sc-band").style.color = "";
    $("sc-hint").textContent = "";
    $("sc-dims").innerHTML = "";
    return;
  }
  var bd = bandOf(r.s);
  arc.style.opacity = 1; arc.style.stroke = bd[1];
  arc.style.strokeDashoffset = 100;
  requestAnimationFrame(function(){ requestAnimationFrame(function(){ arc.style.strokeDashoffset = 100 - Math.max(r.s,1); }); });
  tweenNum($("sc-num"), 0, r.s); shown = r.s;
  $("sc-of").textContent = "out of 100";
  $("sc-title").textContent = "Readiness score"; $("sc-max").textContent = "100";
  $("sc-n").textContent = "Complete";
  $("sc-band").textContent = bd[0]; $("sc-band").style.color = bd[1];
  $("sc-hint").textContent = "";
  $("sc-dims").innerHTML = dimsNow().map(function(d){
    var p = Math.round(d[1]/d[2]*100);
    return "<div class='dimrow'><span>"+esc(d[0])+"</span><span class='dbar'><i class='"+(p<50?"lo":"")+"' style='width:0' data-w='"+p+"'></i></span><span>"+p+"%</span></div>";
  }).join("");
  setTimeout(function(){ $("sc-dims").querySelectorAll("i[data-w]").forEach(function(x){ x.style.width = x.getAttribute("data-w")+"%"; }); }, 60);
}
function drawReady(){ renderQuiz(false); renderScore(); }

/* ---------- contact ---------- */
if (CONTACT_EMAIL){
  $("email-line").hidden = false; $("email-link").textContent = CONTACT_EMAIL; $("email-link").href = "mailto:"+CONTACT_EMAIL;
  $("foot-email").hidden = false; $("foot-email").textContent = CONTACT_EMAIL; $("foot-email").href = "mailto:"+CONTACT_EMAIL;
}
$("brief").addEventListener("submit",function(e){
  e.preventDefault();
  var name=$("f-name").value.trim(), biz=$("f-biz").value.trim(), email=$("f-email").value.trim();
  if(!name||!biz){$("f-err").textContent="Add your name and business name.";return;}
  if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)){$("f-err").textContent="Enter an email address we can reply to.";return;}
  $("f-err").textContent="";
  var text="Workflow review request\n\nName: "+name+"\nBusiness: "+biz+"\nEmail: "+email+"\nIndustry: "+$("f-ind").value+"\nTeam size: "+$("f-size").value+
    "\nWhere the time goes: "+$("f-area").value+"\n\nThe work:\n"+($("f-msg").value.trim()||"(not described yet)")+(lastSummary?"\n\n"+lastSummary:"");
  $("brief-text").textContent=text;
  $("mail-brief").href="mailto:"+CONTACT_EMAIL+"?subject="+encodeURIComponent("Workflow review: "+biz)+"&body="+encodeURIComponent(text);
  $("copy-state").textContent = "";
  if ($("f-hp").value) return;
  var btn = $("f-send"); btn.disabled = true; btn.textContent = "Sending…";
  $("brief-out").hidden = true; $("sent-ok").hidden = true;
  function fail(){ btn.disabled = false; btn.textContent = "Send my brief"; $("brief-out").hidden = false; $("brief-out").scrollIntoView({block:"nearest"}); }
  var ctl = window.AbortController ? new AbortController() : null, to = setTimeout(function(){ if (ctl) ctl.abort(); }, 15000);
  fetch(FORM_ENDPOINT, {method:"POST", headers:{"Content-Type":"application/json","Accept":"application/json"}, signal: ctl ? ctl.signal : undefined,
    body: JSON.stringify({_subject:"Workflow review: "+biz, _replyto:email, _template:"box", _captcha:"false", name:name, business:biz, email:email,
      industry:$("f-ind").value, team_size:$("f-size").value, time_goes:$("f-area").value, message:$("f-msg").value.trim()||"(not described yet)", readiness:lastSummary||""})})
  .then(function(r){ return r.json().catch(function(){ return {}; }).then(function(j){ return {ok:r.ok, j:j}; }); })
  .then(function(res){ clearTimeout(to);
    if (res.ok && String(res.j.success) === "true"){
      $("brief").hidden = true; $("sent-line").textContent = "We'll reply to "+email+". If it's urgent, email hello@altylabs.com directly.";
      $("sent-ok").hidden = false; $("sent-ok").focus(); $("sent-ok").scrollIntoView({block:"nearest"});
    } else fail();
  }).catch(function(){ clearTimeout(to); fail(); });
});
$("copy-brief").addEventListener("click",function(){
  var done=function(ok){$("copy-state").textContent= ok ? "Copied." : "Copy did not work here. Select the text above and copy it by hand.";};
  try{ navigator.clipboard.writeText($("brief-text").textContent).then(function(){done(true);},function(){done(false);}); }catch(err){done(false);}
});

/* ---------- animated workflows: one shared ticker, only while visible ---------- */
var anims = [];
function paintAnim(a){
  var active = null;
  Array.prototype.forEach.call(a.items,function(it,i){
    var st = i < a.step ? "d" : i === a.step ? "a" : "";
    it.classList.toggle("d", st==="d"); it.classList.toggle("a", st==="a");
    var tag = it.querySelector("b"); if (tag && it.hasAttribute("data-done")) tag.textContent = st==="d" ? it.getAttribute("data-done") : st==="a" ? "Working" : "Queued";
    if (st==="a") active = it;
  });
  if (a.el.hasAttribute("data-group")){
    var sel = a.el.getAttribute("data-items");
    a.el.querySelectorAll(a.el.getAttribute("data-group")).forEach(function(g){
      var its = g.querySelectorAll(sel), first = Array.prototype.indexOf.call(a.items, its[0]), last = first + its.length - 1;
      g.classList.toggle("live", a.step >= first && a.step <= last);
      g.classList.toggle("done", a.step > last);
    });
  }
  if (a.el.classList.contains("wf")){
    var tool = active ? active.getAttribute("data-t") : null;
    a.el.querySelectorAll(".wn,.wl").forEach(function(g){ var k = g.getAttribute("data-t"); g.classList.toggle("on", k!==null && (k===tool || (k==="in" && a.step===0))); });
  }
}
function drawStepBuild(){
  var svg = $("step-dev"); if(!svg) return; svg.textContent = ""; var o = {x:116,y:66,a:17};
  var base = isoBox(o,-0.3,-0.3,6.3,1.6,4); paint(base,"base"); svg.appendChild(base);
  [[0,20,"light",0],[1.6,28,"dark",.5],[3.2,24,"sel",1.2],[4.8,20,"light",0]].forEach(function(b){
    var g = isoBox(o,b[0],0,1,1,b[1]); paint(g,b[2]);
    if (b[3]){ g.setAttribute("class","drop"); g.style.setProperty("--d", b[3]+"s"); }
    svg.appendChild(g);
  });
  var t1 = el("text",{x:"16",y:"122",class:"lbl"},"Your tools"), t2 = el("text",{x:"284",y:"122",class:"lbl","text-anchor":"end"},"New system");
  svg.appendChild(t1); svg.appendChild(t2);
}
function setupAnims(){
  var still = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.querySelectorAll(".anim").forEach(function(elm){
    var a = {el:elm, items:elm.querySelectorAll(elm.getAttribute("data-items")), step:0, vis:false, hold:+(elm.getAttribute("data-hold")||1), t:0};
    a.step = a.items.length; paintAnim(a); anims.push(a);
  });
  if (still || !("IntersectionObserver" in window)) return;
  /* card grids: every card loops on its own, no turn-taking and no pause */
  var loops = [];
  anims = anims.filter(function(a){
    if (!a.el.classList.contains("cases-anim") && !a.el.classList.contains("steps-anim")) return true;
    a.el.classList.add("loopc");
    Array.prototype.forEach.call(a.items, function(it,i){ it.classList.remove("d"); it.classList.add("a"); loops.push({it:it, off:i*350, base:-1e9}); });
    return false;
  });
  var CYC = 4200, vis = new Map();
  var lio = new IntersectionObserver(function(es){ es.forEach(function(e){
    var was = vis.get(e.target); vis.set(e.target, e.isIntersecting);
    if (e.isIntersecting && !was) loops.forEach(function(l){ if (l.it === e.target) l.base = performance.now() - CYC + l.off; });
  }); }, {threshold:.15});
  loops.forEach(function(l){ lio.observe(l.it); });
  function restart(l){
    l.it.classList.add("out");
    setTimeout(function(){ l.it.classList.remove("a"); void l.it.offsetWidth; l.it.classList.add("a"); l.it.classList.remove("out"); }, 280);
  }
  (function tick(now){
    if (!document.hidden) loops.forEach(function(l){
      if (!vis.get(l.it)) return;
      if (now - l.base >= CYC){ l.base = now; restart(l); }
    });
    requestAnimationFrame(tick);
  })(performance.now());
  var io = new IntersectionObserver(function(es){ es.forEach(function(e){ anims.forEach(function(a){ if(a.el===e.target){ a.vis = e.isIntersecting; if(a.vis){ a.step = 0; a.t = 0; paintAnim(a); } } }); }); },{threshold:.35});
  anims.forEach(function(a){ io.observe(a.el); });
  setInterval(function(){
    if (document.hidden) return;
    anims.forEach(function(a){ if(!a.vis) return; a.t++; if (a.t % a.hold) return; a.step = a.step >= a.items.length + 2 ? 0 : a.step + 1; paintAnim(a); });
  }, 1300);
}


/* ---------- industry pages ---------- */
function wfHTML(g){
  var n = g.tools.length, H = Math.max(226, n*56+2), mid = H/2, svg = "";
  g.tools.forEach(function(x,i){ var cy = 29+i*56+(H-(n*56+2))/2; svg += "<g class='wl' data-t='"+i+"'><path d='M316 "+mid+"C360 "+mid+" 356 "+cy+" 400 "+cy+"'/><path class='flow' d='M316 "+mid+"C360 "+mid+" 356 "+cy+" 400 "+cy+"'/></g>"; });
  svg = "<g class='wl' data-t='in'><path d='M122 "+mid+"H204'/><path class='flow' d='M122 "+mid+"H204'/></g>"+svg;
  svg += "<g class='wn' data-t='in'><rect x='10' y='"+(mid-20)+"' width='112' height='40' rx='8'/><text x='66' y='"+(mid+4)+"'>"+esc(g.src)+"</text></g>";
  svg += "<g class='wn agent'><rect x='204' y='"+(mid-30)+"' width='112' height='60' rx='10'/><text x='260' y='"+(mid+5)+"'>"+esc(g.agent||"Agent")+"</text></g>";
  g.tools.forEach(function(x,i){ var cy = 29+i*56+(H-(n*56+2))/2; svg += "<g class='wn' data-t='"+i+"'><rect x='400' y='"+(cy-17)+"' width='112' height='34' rx='8'/><text x='456' y='"+(cy+4)+"'>"+esc(x)+"</text></g>"; });
  return "<div class='card wf anim' data-items='li' aria-label='Animated example: "+esc(g.title)+"'><div class='wf-head'><span class='mono'>Workflow: "+esc(g.title)+"</span><span class='pill'><i></i>Running</span></div>"+
    "<svg viewBox='0 0 520 "+H+"' aria-hidden='true'>"+svg+"</svg><ul class='feed'>"+g.feed.map(function(f){return "<li data-t='"+f[1]+"' data-done='"+esc(f[2])+"'><span>"+esc(f[0])+"</span><b></b></li>";}).join("")+"</ul></div>";
}
var inds = {
  "dental-labs":{
    form:"Dental lab", crumb:"Dental labs", eyebrow:"For dental labs",
    h1:"Prescription intake for dental labs",
    lede:"Paper slips, emailed PDFs, scanner portal notes and phone photos, read and turned into a finished case in your lab software. Missing details are caught when the box arrives, and a person approves every case before it is saved.",
    chips:["Paper Rx slips","Emailed PDFs","iTero and 3Shape notes","Text and WhatsApp photos","Field reading","Rule checks","Office follow-ups","Case creation"],
    wf:{title:"new prescription", src:"Rx slip", tools:["Customers","Shades","Turnaround","Your approval"],
      feed:[["Read a photographed slip: crown, #14","in","Done"],["Doctor matched to a known customer","0","Done"],["No shade given for #14","1","Flagged"],["Due date fits your turnaround","2","Done"],["Case filled in, office message drafted","3","Needs you"]]},
    stats:[["5 min → 30 s","per prescription, typed versus reviewed"],["4 channels","paper, email, scanner portals and phone photos, in one queue"],["Every case","approved by a person before it is saved"]],
    painH:"Where the time goes at the receiving desk",
    pains:[["Five minutes of typing per case","Every slip is read and keyed into the lab software field by field, often from handwriting."],["Problems found at the bench","A missing shade or an unclear tooth number is often noticed only when a technician picks up the case, and the due date does not move."],["Afternoons on the phone","Each missing detail means a call to the dental office, time on hold, and a note on the case about who said what."]],
    steps:[
      {t:"Collect", b:"Slips in the box, PDFs in the inbox, portal notes in another tab, photos on someone's phone.", a:"Watches the lab's inbox and a scan folder, with a phone photo upload at the receiving desk. Everything lands in one queue."},
      {t:"Read", b:"Someone reads each slip, handwriting included.", a:"An AI vision model pulls out the doctor, practice, patient name or ID, tooth numbers, restoration type, material, shade, due date, special instructions and any attached files."},
      {t:"Check", b:"Problems surface when a technician starts the case.", a:"Is the doctor a known customer? Is the tooth number valid? Does the shade make sense for the material? Can the due date be met with your turnaround times? Is anything required missing?"},
      {t:"Flag", b:"A phone call to the office that eats someone's afternoon.", a:"Drafts the message to the dental office, such as “Shade wasn't specified for #14, please confirm.” Your staff send it."},
      {t:"Approve", h:1, keep:1, who:"staff approve", b:"About 5 minutes of typing per case.", a:"Staff see the slip on one side and the filled-in case on the other, fix anything that is off and click approve. About 30 seconds."},
      {t:"Create", b:"Retyped into the lab software.", a:"The case is created in your lab software through its API or an import file, or as a last resort by filling in the screen automatically."}],
    stepsNote:"Dark blocks are done by the system. The light block is your staff's approval. Switch to Before to see the same case done by hand.",
    checksH:"What it checks before a case is created", checksP:"The questions get asked when the box arrives, not when a technician picks up the case.",
    checks:[["Known customer","The doctor and practice are matched to an existing customer account."],["Valid tooth numbers","Tooth numbers are checked for validity and against the restoration type."],["Shade against material","The shade is checked against the shades available for that material."],["Due date against turnaround","The requested date is checked against your turnaround times for that restoration and material."],["Required fields","Anything your lab needs that is missing is flagged, with a drafted message to the office."],["Attached files","Scans and photos sent with the prescription are attached to the case."]],
    build:["Collecting slips, PDFs, portal notes and photos in one queue","Reading every field, handwriting included","Checking each case against your customers, materials and turnaround times","Drafting follow-up messages to dental offices","Creating the approved case in your lab software"],
    stay:["Approving every case","Sending messages to offices","Your turnaround times and pricing","Doctor relationships","The lab work"],
    proof:{type:"pilot", h:"How we set it up", p:"It is tested on your own prescriptions before it touches your lab software.",
      steps:[["Sample your intake","We collect a few weeks of real slips, PDFs, portal notes and photos, including the messy ones."],["Encode your rules","Your customer list, materials, shades and turnaround times become the checks."],["Shadow mode","New cases are read and checked alongside your usual entry, so your staff can compare them field by field."],["Connect your software","Cases are created through your lab software's API or import file, or by filling in the screen where neither exists."]]},
    fit:"You receive a steady flow of cases from many offices, and someone spends a large part of the day typing them in.",
    notfit:"Nearly all of your cases already arrive digitally with complete, structured prescriptions.",
    faq:[["Which lab software does it work with?","It creates cases through your software's API or an import file where one exists. As a last resort it fills in the screen automatically, the same way your staff would."],
         ["Is anything saved without a person seeing it?","No. Every case is shown next to the original slip, and nothing is created in your software until someone approves it."],
         ["Does it contact dental offices on its own?","No. It drafts the message, such as asking for a missing shade, and your staff decide whether to send it."],
         ["Can it read handwritten slips?","Yes. Scanned and photographed slips are read by an AI vision model. Anything it is unsure of is highlighted for the person approving."],
         ["What about cases sent through iTero or 3Shape?","Notes from the scanner portal are read like any other prescription, and the attached files go with the case."]]},

  "land-surveyors":{
    form:"Surveying or engineering", crumb:"Land surveyors", eyebrow:"For land surveying firms",
    h1:"Title research and proposals for land surveyors, assembled with sources",
    lede:"Registers, plans, instruments, the neighbours' records and your own archive, gathered and summarized for the surveyor's review. Every line links to the page it came from. The surveyor decides.",
    chips:["Inquiry intake","Repeat-job check","Parcel register reading","Teraview pull lists","Archive and PSRI search","Records requests","Proposal drafts","Research brief"],
    wf:{title:"new survey inquiry", src:"Inquiry", tools:["Parcel register","Neighbours","Plans and instruments","Your archive","Surveyor review"],
      feed:[["Read the inquiry and opened the job","in","Done"],["Checked the archive for nearby work","3","Done"],["Read the parcel register","0","Done"],["Easement found in the register","0","Flagged"],["Listed the neighbouring parcels","1","Done"],["Pull list ready for the clerk","2","Ready"],["Brief ready for the surveyor","4","Needs you"]]},
    stats:[["2 stages","a quick quote in minutes, full research only after the client accepts"],["Every line","linked to the document page it came from"],["Your instance","private to your firm and hosted in Canada"]],
    painH:"Why research eats the office's week",
    pains:[["Most of it is clerical","Deciding what to buy, then reading long registers full of mortgages and discharges that don't matter to the survey."],["Records take days to arrive","Plans held by other firms are requested by email and chased by hand, so jobs sit waiting."],["Quotes wait on research","Messy records mean more work, so proposals stall until someone has looked. Meanwhile the profession is short of people."]],
    stages:[["Stage 1: Quick quote","Minutes, before the job is won",[["New job.","Paste the inquiry email or call notes. The client, address, job type, purpose and deadline are filled in, with follow-up questions for anything missing."],["Repeat check.","If you have surveyed this property or a neighbour before, the old job shows up immediately."],["Quick pull.","The clerk buys only the subject register. The system reads it and raises flags: water boundaries, old township lots, unconverted land, easements."],["Proposal.","The fee and proposal are drafted in your template, with each fee line explained. The surveyor approves it."]]],
            ["Stage 2: Full research","After the client accepts",[["Pull list.","One daily list of exactly what to buy in Teraview for all accepted jobs, minus anything already on file. About 5 to 10 minutes per job for the clerk."],["Reading.","Every register, plan and instrument is read. What matters to a surveyor is kept, mortgages and deleted items are skipped, and newly referenced documents go back on the list."],["Prior surveys.","Your archive is searched and the PSRI search terms are written for you."],["Records requests.","Requests to other firms are drafted with follow-up reminders. Your staff send them."],["Brief and review.","One screen per job shows the property and each neighbour side by side. The surveyor reviews only what is flagged or uncertain."],["Research package.","On sign-off: the brief as a PDF, an organized document folder, an easements schedule, a field search list by boundary, and the registry fees to bill."]]]],
    steps:[
      {t:"Inquiry", b:"Retyped from email or phone notes into a job file.", a:"Fills in the client, address, job type, purpose and deadline, and suggests follow-up questions for anything missing."},
      {t:"Repeat check", b:"Depends on someone remembering the firm worked nearby.", a:"If the firm has surveyed this property or a neighbour before, the old job shows up immediately."},
      {t:"Quote", h:1, keep:1, who:"surveyor approves", b:"Research hours spent before the job is even won.", a:"The clerk buys only the subject register. The system reads it, raises flags, and drafts the fee and proposal in your template for the surveyor to approve."},
      {t:"Pull list", h:1, keep:1, who:"clerk buys", b:"Deciding what to buy in Teraview, job by job.", a:"One daily list of exactly what to buy for all accepted jobs, minus anything already on file. The clerk buys and saves; the system never logs into Teraview."},
      {t:"Reading", b:"Long registers read line by line, mortgages and discharges included.", a:"Reads every register, plan and instrument, keeps what matters, skips mortgages and deleted items, and adds newly referenced documents to the list."},
      {t:"Records", b:"Archive digging, PSRI searches and emails to other firms.", a:"Searches your archive, writes the PSRI search terms, and drafts records requests with follow-up reminders. Staff send them."},
      {t:"Brief", h:1, keep:1, who:"surveyor reviews", b:"Research written up by hand.", a:"The property and each neighbour side by side, every line linked to its source page. The surveyor reviews what is flagged, then exports the research package."}],
    stepsNote:"Dark blocks are done by the system. Light blocks stay with your clerk and your surveyor.",
    checksH:"Built for professional liability", checksP:"The software assembles evidence. Licensed surveyors make every determination.",
    checks:[["It never determines boundaries","It gathers and organizes evidence. The licensed surveyor decides."],["Every line shows its source","One click opens the document page it came from."],["Nothing is sent automatically","Proposals and records requests are drafts that a person approves and sends."],["Gaps are visible","“No prior survey found” is shown as clearly as what was found."],["The registry is used by people","The system never scripts Teraview or OnLand. Your clerk does the buying."],["Private to your firm","Your own instance and data, hosted in Canada, never used to train models. Export any time, deleted when you leave."]],
    build:["Inquiry intake and the repeat-job check","Reading registers, plans and instruments, with flags","Daily Teraview pull lists","Archive search and PSRI search terms","Records request drafts and follow-up reminders","The research brief, proposal draft and research package"],
    stay:["Every boundary determination","Buying documents in Teraview and OnLand","Approving proposals","Sending proposals and records requests","Field work"],
    proof:{type:"pilot", h:"How a pilot runs", p:"You see it work on your own jobs before anything goes live, and the time saved is measured against your own numbers.",
      steps:[["Backtest on your completed jobs","We run 20 to 30 of your finished jobs through the system. For each one, we check how many of the documents your surveyor actually used it found."],["Baseline from day one","Whoever does research logs office hours per job, so the savings are measured, not estimated."],["Shadow mode","On new inquiries, the system runs alongside your usual process and you compare the results."],["Go live when it earns it","Only once it is finding what your surveyors use and research hours are down against your baseline."]]},
    fit:"Boundary surveys, reference plans or real property reports are a steady part of your work, and research is a daily load on the office.",
    notfit:"Most of your work is construction layout or topographic surveys with little title research.",
    faq:[["Does the software decide where the boundary is?","No. It gathers and organizes evidence, with every line linked to its source. The licensed surveyor weighs the evidence and makes every determination."],
         ["Does it log into Teraview or OnLand for us?","No. The system never scripts Teraview or OnLand. It writes a pull list and your clerk does the buying, usually 5 to 10 minutes per job."],
         ["Where does our data live?","Your firm gets its own instance and data, hosted in a Canadian region. Your data is not used to train models, you can export it any time, and it is deleted when you leave."],
         ["Will it find our old surveys?","Your archive is indexed and searchable by PIN, address, township, lot and concession, and plan number. That powers the repeat-job check and the prior-survey search."],
         ["How do we know it works on our jobs?","Before anything goes live, we backtest it on 20 to 30 of your completed jobs and measure how many of the documents your surveyor actually used it found."]]},

  "distributors":{
    form:"Distribution or wholesale", crumb:"Distributors", eyebrow:"For distributors",
    h1:"AI order entry for plumbing, HVAC and industrial distributors",
    lede:"Emailed POs and phone photos of handwritten contractor lists, read, matched to your exact SKUs, and drafted as sales orders in your accounting software for one-click approval.",
    chips:["Emailed PDF POs","Handwritten order photos","Contractor shorthand","SKU matching","Sales order drafts","One-click approval"],
    wf:{title:"new purchase order", src:"New order", tools:["Email and photos","Item catalog","Accounting","Your approval"],
      feed:[["Read a photographed order list","0","Done"],["Matched “3/4 copper 90s x 20” to a SKU","1","Matched"],["Matched the remaining lines","1","Done"],["Sales order drafted in NetSuite","2","Drafted"],["Waiting for one-click approval","3","Needs you"]]},
    stats:[["8 min → ~1 min","to enter each purchase order"],["28 h a week","of order entry saved"],["85% faster","per order"]],
    painH:"Where the hours go at the order desk",
    pains:[["Hours a day lost to typing","At around 8 minutes per PO, a desk taking 50 orders a day spends about 6.7 hours just keying data."],["Every order typed by hand","Emailed PDFs and phone photos of handwritten lists are keyed into the accounting system line by line."],["Shorthand has to be translated","Trade shorthand has to be mapped to exact SKUs by hand before the sales order is complete."]],
    steps:"dist", stepsNote:"Dark blocks are done by the system. The light block is a person's approval.",
    checksH:"What the system handles", checksP:"It works the way contractors actually order.",
    checks:[["Emailed PDF purchase orders","Read automatically as they arrive."],["Photos of handwritten lists","Smartphone photos of contractor order lists are read too."],["Contractor shorthand","Trade shorthand such as “3/4 copper 90s x 20” is mapped to exact SKUs in your catalog."],["Complete sales orders","Built inside your accounting software, ready for review and one-click approval."],["Runs on what you have","Our case study runs on NetSuite."],["Yours to own","Full client ownership and zero per-order fees."]],
    build:["Reading emailed PDFs and order photos","Mapping shorthand to exact SKUs","Drafting complete sales orders in your accounting software","Connecting to your existing inventory setup"],
    stay:["Approving every order","Pricing and customer terms","Customer relationships","Picking and delivery"],
    proof:{type:"case", key:"dist", link:"case-distributor", h:"RJ Industrial Supply cut PO entry from 8 minutes to about a minute"},
    fit:"You enter dozens of orders a day by hand from emails, PDFs and paper.",
    notfit:"Most of your orders already arrive through EDI or a customer portal.",
    faq:[["Do we have to change our accounting or inventory software?","No. The system builds on what you already run. At the distributor in our case study, that was NetSuite."],
         ["Are there per-order fees?","No. You own the system, and there are zero per-order fees."],
         ["What about messy handwriting and contractor shorthand?","The system reads phone photos of handwritten lists and maps trade shorthand to your exact SKUs. A person reviews and approves every order."],
         ["How long does it take?","The distributor in our case study was live in about 5 weeks."]]}
};
function caseBy(k){ for (var i=0;i<cases.length;i++) if (cases[i].key===k) return cases[i]; }
var CASEKEY = {dist:"distributor"};
function indSteps(d){ return typeof d.steps==="string" ? caseBy(CASEKEY[d.steps]).steps : d.steps; }
function buildIndustries(){
  var keys = Object.keys(inds);
  $("ind-pages").innerHTML = keys.map(function(k,ki){
    var d = inds[k], px = "im"+ki, h = "";
    h += "<section class='ind-hero'><div class='wrap'><div class='grid2'><div class='stack' style='gap:22px'><a class='crumb' href='/industries/'>Industries / "+esc(d.crumb)+"</a><h1>"+esc(d.h1)+"</h1><p class='lede'>"+esc(d.lede)+"</p>"+
      "<div class='chips'>"+d.chips.map(function(c){return "<span>"+esc(c)+"</span>";}).join("")+"</div>"+
      "<div class='actions'><a class='btn' href='/contact/'>Book a workflow review</a>"+(d.proof.type==="case"?"<a class='btn ghost' href='"+pageHref(d.proof.link)+"'>Read the case study</a>":"<a class='btn ghost' href='/readiness/'>Take the readiness check</a>")+"</div></div>"+(HERO[k] ? HERO[k]() : wfHTML(d.wf))+"</div>"+
      "<div class='stats'>"+d.stats.map(function(s){return "<div><b>"+esc(s[0])+"</b><span>"+esc(s[1])+"</span></div>";}).join("")+"</div></div></section>";
    h += "<section><div class='wrap stack' style='gap:36px'><div class='head'><span class='eyebrow'>The problem</span><h2>"+esc(d.painH)+"</h2></div><div class='grid3'>"+
      d.pains.map(function(p,i){return "<div class='card pain'><span class='n'>0"+(i+1)+"</span><h3>"+esc(p[0])+"</h3><p class='dim'>"+esc(p[1])+"</p></div>";}).join("")+"</div></div></section>";
    if (d.stages) h += "<section><div class='wrap stack' style='gap:36px'><div class='head'><span class='eyebrow'>How it works</span><h2>Research effort only goes into jobs you have won.</h2></div><div class='stagecols'>"+
      d.stages.map(function(s){return "<div class='card stagecol'><span class='mono'>"+esc(s[1])+"</span><h3 style='font-size:1.5rem;letter-spacing:-.03em'>"+esc(s[0])+"</h3><ol>"+s[2].map(function(x){return "<li><strong>"+esc(x[0])+"</strong> "+esc(x[1])+"</li>";}).join("")+"</ol></div>";}).join("")+"</div></div></section>";
    h += "<section><div class='wrap stack' style='gap:28px'><div class='head'><span class='eyebrow'>Inside the system</span><h2>Take it apart, step by step.</h2><p class='dim'>"+esc(d.stepsNote)+"</p></div>"+
      "<div class='seg' role='group' aria-label='Before or after' style='align-self:flex-start'><button type='button' id='"+px+"-before' aria-pressed='false'>Before</button><button type='button' id='"+px+"-after' aria-pressed='true'>With the system</button></div>"+
      "<div class='split'><div class='card fig'><svg id='"+px+"-svg' viewBox='0 0 540 300' role='group' aria-label='System steps'></svg></div><div class='stack' style='gap:16px'><div class='card list' id='"+px+"-list' role='group' aria-label='Steps'></div><div class='card panel' id='"+px+"-panel' aria-live='polite'></div></div></div></div></section>";
    h += "<section><div class='wrap stack' style='gap:36px'><div class='head'><span class='eyebrow'>Details</span><h2>"+esc(d.checksH)+"</h2><p class='dim'>"+esc(d.checksP)+"</p></div><div class='card checks'>"+
      d.checks.map(function(c){return "<div><h3>"+esc(c[0])+"</h3><p class='dim'>"+esc(c[1])+"</p></div>";}).join("")+"</div>"+
      (d.shot?"<div class='card shots'><figure><img src='"+d.shot[0]+"' alt='The quoting agent' width='1320' height='860' loading='lazy'><figcaption class='mono' style='margin-top:10px'>"+esc(d.shot[1])+"</figcaption></figure></div>":"")+"</div></section>";
    h += "<section><div class='wrap stack' style='gap:36px'><div class='head'><span class='eyebrow'>Division of work</span><h2>What we build, and what stays with your team.</h2></div><div class='split2'>"+
      "<div class='card side mine'><span class='mono' style='color:var(--accent)'>We build</span><ul>"+li(d.build)+"</ul></div><div class='card side'><span class='mono'>Stays with your team</span><ul>"+li(d.stay)+"</ul></div></div></div></section>";
    if (d.proof.type==="case"){
      var c = caseBy(CASEKEY[d.proof.key]);
      h += "<section><div class='wrap stack' style='gap:28px'><div class='head'><span class='eyebrow'>Case study: "+esc(c.name)+"</span><h2>"+esc(d.proof.h)+"</h2><p class='dim'>"+esc(c.summary)+"</p></div>"+tableHTML(c)+"<div class='actions'><a class='btn ghost' href='"+pageHref(d.proof.link)+"'>Read the full case study</a></div></div></section>";
    } else {
      h += "<section><div class='wrap stack' style='gap:28px'><div class='head'><span class='eyebrow'>Pilot</span><h2>"+esc(d.proof.h)+"</h2><p class='dim'>"+esc(d.proof.p)+"</p></div><div class='card stagecol'><ol>"+
        d.proof.steps.map(function(x){return "<li><strong>"+esc(x[0])+".</strong> "+esc(x[1])+"</li>";}).join("")+"</ol></div></div></section>";
    }
    h += "<section><div class='wrap grid2' style='align-items:start'><div class='stack' style='gap:20px'><span class='eyebrow'>Fit</span><h2>Is it right for your "+(k==="land-surveyors"?"firm":k==="distributors"?"business":"lab")+"?</h2>"+
      "<div class='fitgrid'><div class='card'><span class='mono' style='color:var(--accent)'>A good fit when</span><p>"+esc(d.fit)+"</p></div><div class='card'><span class='mono'>Not a fit when</span><p class='dim'>"+esc(d.notfit)+"</p></div></div>"+
      "<p class='dim'>Not sure? The <a class='link' href='/readiness/'>readiness check</a> gives a first answer in two minutes, and the <a class='link' href='/#roi'>ROI calculator</a> shows what the hours are worth.</p></div>"+
      "<div class='faq'>"+d.faq.map(function(q,i){return "<details"+(i===0?" open":"")+"><summary>"+esc(q[0])+"</summary><p>"+esc(q[1])+"</p></details>";}).join("")+"</div></div></section>";
    h += "<section><div class='wrap stack' style='gap:22px'><h2>Show us one job that ties up your team.</h2><p class='lede'>We will tell you whether a system fits, and what the first step should be.</p>"+
      "<div class='actions'><a class='btn' href='/contact/'>Book a workflow review</a><a class='btn ghost' href='/readiness/'>Take the readiness check</a></div></div></section>";
    return "<div class='page' data-page='"+k+"'>"+h+"</div>";
  }).join("");
  keys.forEach(function(k,ki){ makeModel("im"+ki, {steps:indSteps(inds[k]), view: k==="land-surveyors" ? "lanes" : k==="distributors" ? "flow" : "iso"}); });
}


/* ---------- scroll-in figures and counting stats ---------- */
function setupSeen(){
  if (!("IntersectionObserver" in window)) return;
  var still = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var io = new IntersectionObserver(function(es){ es.forEach(function(e){ if (e.isIntersecting){ e.target.classList.add("seen"); io.unobserve(e.target); } }); }, {threshold:.45});
  document.querySelectorAll(".icard").forEach(function(c){ io.observe(c); });
  if (still) return;
  var so = new IntersectionObserver(function(es){ es.forEach(function(e){ if (!e.isIntersecting) return; so.unobserve(e.target); countUp(e.target); }); }, {threshold:.6});
  document.querySelectorAll(".stats b").forEach(function(b){ if (/\d/.test(b.textContent)) so.observe(b); });
}
function countUp(b){
  var txt = b.textContent, parts = txt.split(/(\d+(?:\.\d+)?)/), t0 = null, dur = 1100;
  function f(ts){ if (!t0) t0 = ts; var p = Math.min(1,(ts-t0)/dur), e = 1-Math.pow(1-p,3);
    b.textContent = parts.map(function(s,i){ if (i%2===0) return s; var v = parseFloat(s)*e, dp = (s.split(".")[1]||"").length; return v.toFixed(dp); }).join("");
    if (p<1) requestAnimationFrame(f); else b.textContent = txt; }
  requestAnimationFrame(f);
}


/* ---------- motion ---------- */
var GLYPH = "01/\\<>_-+=#:";
function scramble(el, delay){
  var full = el.dataset.full || el.textContent; el.dataset.full = full; el.setAttribute("aria-label", full);
  var n = full.length, t0 = null, dur = 650 + n*14;
  function f(ts){ if (!t0) t0 = ts; var p = (ts - t0) / dur, s = "";
    for (var i=0;i<n;i++){ var c = full[i], at = i/n*0.75; s += (c===" " || p >= at + .25) ? c : (p < at ? "" : GLYPH[(Math.random()*GLYPH.length)|0]); }
    el.textContent = s; if (p < 1) requestAnimationFrame(f); else el.textContent = full; }
  el.textContent = ""; setTimeout(function(){ requestAnimationFrame(f); }, delay||0);
}
function splitWords(h){
  if (h.dataset.split || h.children.length) return; h.dataset.split = 1;
  var words = h.textContent.trim().split(/\s+/);
  h.innerHTML = words.map(function(w,i){ return "<span class='sw'><span style='--w:"+i+"'>"+esc(w)+"</span></span>"; }).join(" ");
  h.classList.add("wsplit");
}
function drawDims(animate){
  var h1 = document.querySelector(".hero h1"), col = h1 && h1.parentNode; if (!h1) return;
  var old = col.querySelector(".dims"); if (old) old.remove();
  if (window.innerWidth < 1100) return;
  var cr = col.getBoundingClientRect(), r = document.createRange(); r.selectNodeContents(h1);
  var rs = r.getClientRects(), L = 1e9, R = -1e9, T = 1e9, B = -1e9;
  Array.prototype.forEach.call(rs, function(q){ if (!q.width) return; L = Math.min(L,q.left); R = Math.max(R,q.right); T = Math.min(T,q.top); B = Math.max(B,q.bottom); });
  var hb = h1.getBoundingClientRect(); T = hb.top; B = hb.bottom;
  L -= cr.left; R -= cr.left; T -= cr.top; B -= cr.top;
  var yD = T - 12, xD = L - 30, ns = "http://www.w3.org/2000/svg";
  var svg = document.createElementNS(ns,"svg"); svg.setAttribute("class","dims"+(animate?" go":"")); svg.setAttribute("aria-hidden","true");
  function path(d, cls, dl){ var e = document.createElementNS(ns,"path"); e.setAttribute("d",d); e.setAttribute("pathLength","1"); if (cls) e.setAttribute("class",cls); e.style.setProperty("--d", dl+"s"); svg.appendChild(e); }
  function text(x,y,s,dl,rot){ var e = document.createElementNS(ns,"text"); e.setAttribute("x",x); e.setAttribute("y",y); e.setAttribute("text-anchor","middle"); if (rot) e.setAttribute("transform","rotate(-90 "+x+" "+y+")"); e.textContent = s; e.style.setProperty("--d", dl+"s"); svg.appendChild(e); }
  var mx = (L+R)/2, my = (T+B)/2, gw = 34;
  path("M"+L+" "+(yD-6)+"V"+(T+4)+"M"+R+" "+(yD-6)+"V"+(T+4), "", .9);
  path("M"+L+" "+yD+"H"+(mx-gw)+"M"+(mx+gw)+" "+yD+"H"+R, "", 1.05);
  path("M"+(L-4)+" "+(yD+4)+"L"+(L+4)+" "+(yD-4)+"M"+(R-4)+" "+(yD+4)+"L"+(R+4)+" "+(yD-4), "tk", 1.5);
  text(mx, yD+3.5, Math.round(R-L)+" px", 1.6);
  path("M"+(xD-6)+" "+T+"H"+(L-6)+"M"+(xD-6)+" "+B+"H"+(L-6), "", 1.2);
  path("M"+xD+" "+T+"V"+(my-gw)+"M"+xD+" "+(my+gw)+"V"+B, "", 1.35);
  path("M"+(xD-4)+" "+(T+4)+"L"+(xD+4)+" "+(T-4)+"M"+(xD-4)+" "+(B+4)+"L"+(xD+4)+" "+(B-4), "tk", 1.75);
  text(xD, my+3.5, Math.round(B-T)+" px", 1.85);
  col.appendChild(svg);
}
function setupMotion(){
  var still = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fine = window.matchMedia && matchMedia("(hover:hover) and (pointer:fine)").matches;
  var de = document.documentElement, hdr = document.querySelector("header");

  /* section rail on the home page */
  var RAIL = [["top","Intro"],["sec-industries","Industries"],["sec-work","Case studies"],["sec-what-we-build","What we build"],["sec-how-it-works","How it works"],["sec-roi","ROI"],["sec-engage","Engagement"],["sec-faq","FAQ"]];
  var rail = document.createElement("nav"); rail.className = "rail"; rail.setAttribute("aria-label","Sections on this page");
  rail.innerHTML = RAIL.map(function(r){ return "<a href='#"+(r[0]==="top"?"home":r[0])+"' data-s='"+r[0]+"'><span>"+r[1]+"</span><i></i></a>"; }).join("");
  document.body.appendChild(rail);
  var railSecs = RAIL.map(function(r){ return r[0]==="top" ? document.querySelector('.page[data-page="home"] .hero') : $(r[0]); });

  var hero = document.querySelector('.page[data-page="home"] .hero'), heroText = hero.querySelector(".grid2 > .stack"), heroCard = $("wf");
  var stackSvg = $("stack-svg"), track = document.querySelector(".track"), mAnim = null, rate = 1, lastY = window.scrollY, lastT = performance.now();
  if (!still) stackSvg.style.setProperty("--ex", 0);
  var ticking = false, mx = -999, my = -999;
  function frame(){
    ticking = false;
    var y = window.scrollY, vh = window.innerHeight, max = de.scrollHeight - de.clientHeight, now = performance.now();
    var home = curPage === "home";
    rail.classList.toggle("on", home);
    if (home){
      var cur = 0; railSecs.forEach(function(s,i){ if (s && s.getBoundingClientRect().top < vh*0.45) cur = i; });
      Array.prototype.forEach.call(rail.children, function(a,i){ if (i===cur) a.setAttribute("aria-current","true"); else a.removeAttribute("aria-current"); });
    }
    if (still) return;
    if (home && y < vh*1.2){
      var k = Math.min(y, vh) ;
      heroText.style.translate = "0 " + (k*0.22).toFixed(1) + "px"; heroText.style.opacity = Math.max(0, 1 - k/(vh*0.75)).toFixed(3);
      heroCard.style.translate = "0 " + (k*0.08).toFixed(1) + "px"; heroCard.style.rotate = "x " + Math.min(k*0.025, 14).toFixed(2) + "deg";
    }
    if (home){
      var sr = stackSvg.getBoundingClientRect();
      if (sr.bottom > 0 && sr.top < vh){ var pp = Math.max(0, Math.min(1, (vh - sr.top) / (vh*0.75))); stackSvg.style.setProperty("--ex", (1 - Math.pow(1-pp, 3)).toFixed(3)); }
      var dt = Math.max(16, now - lastT), v = Math.abs(y - lastY) / dt;
      rate = Math.max(rate, 1 + Math.min(v*2.2, 5));
      if (!mAnim && track && track.getAnimations) mAnim = track.getAnimations()[0];
    }
    lastY = y; lastT = now;
  }
  function req(){ if (!ticking){ ticking = true; requestAnimationFrame(frame); } }
  window.addEventListener("scroll", req, {passive:true}); window.addEventListener("resize", function(){ req(); drawDims(false); });
  window.__motionRoute = function(h){ req(); if (h==="home") requestAnimationFrame(function(){ drawDims(false); }); };
  (function decay(){ if (mAnim){ rate += (1 - rate) * 0.06; mAnim.playbackRate = rate; } requestAnimationFrame(decay); })();
  req();

  if (fine){
    var xh = document.createElement("div"); xh.className = "xh"; xh.setAttribute("aria-hidden","true"); xh.innerHTML = "<i class='xv'></i><i class='xz'></i><b></b>";
    hero.insertBefore(xh, hero.firstChild);
    var xb = xh.querySelector("b"), hx = 0, hy = 0, tx = 0, ty = 0, xr = null;
    function xloop(){ hx += (tx - hx) * 0.22; hy += (ty - hy) * 0.22; xh.style.setProperty("--x", hx.toFixed(1)+"px"); xh.style.setProperty("--y", hy.toFixed(1)+"px");
      xb.textContent = "x " + String(Math.round(hx)).padStart(4,"0") + "  y " + String(Math.round(hy)).padStart(4,"0");
      if (Math.abs(tx-hx) > .3 || Math.abs(ty-hy) > .3) xr = requestAnimationFrame(xloop); else xr = null; }
    hero.addEventListener("pointermove", function(e){ var r = hero.getBoundingClientRect(); tx = e.clientX - r.left; ty = e.clientY - r.top;
      if (!xh.classList.contains("on")){ hx = tx; hy = ty; xh.classList.add("on"); } if (!xr) xr = requestAnimationFrame(xloop); });
    hero.addEventListener("pointerleave", function(){ xh.classList.remove("on"); });
    document.addEventListener("pointermove", function(e){
      var c = e.target.closest && e.target.closest(".ccard,.icard,.step,.pain,.card.side,.tier");
      if (c){ var r = c.getBoundingClientRect(), px = (e.clientX - r.left)/r.width, py = (e.clientY - r.top)/r.height;
        c.style.setProperty("--cx", (e.clientX - r.left) + "px"); c.style.setProperty("--cy", (e.clientY - r.top) + "px");
        if (!still && (c.classList.contains("ccard") || c.classList.contains("icard")))
          c.style.transform = "perspective(1000px) rotateX(" + ((0.5-py)*5).toFixed(2) + "deg) rotateY(" + ((px-0.5)*6).toFixed(2) + "deg) translateY(-3px)"; }
      var b = !still && e.target.closest && e.target.closest(".btn");
      if (b){ var br = b.getBoundingClientRect(); b.style.transform = "translate(" + (((e.clientX - br.left)/br.width - .5)*10).toFixed(1) + "px," + (((e.clientY - br.top)/br.height - .5)*8).toFixed(1) + "px)"; }
    }, {passive:true});
    document.addEventListener("pointerout", function(e){
      var c = e.target.closest && e.target.closest(".ccard,.icard"); if (c && !c.contains(e.relatedTarget)) c.style.transform = "";
      var b = e.target.closest && e.target.closest(".btn"); if (b && !b.contains(e.relatedTarget)) b.style.transform = "";
    });
  }

  if (still || !("IntersectionObserver" in window)){ if (document.fonts) document.fonts.ready.then(function(){ drawDims(false); }); else drawDims(false); return; }
  de.classList.add("rvon");
  /* hero intro */
  var heb = hero.querySelector(".eyebrow"); scramble(heb, 150);
  var h1 = hero.querySelector("h1"); splitWords(h1); requestAnimationFrame(function(){ requestAnimationFrame(function(){ h1.classList.add("in"); }); });
  [[".lede",.55],[".actions",.7],[".hero-tools",.82],[".stats",.95]].forEach(function(q){ var e = hero.querySelector(q[0]); if (e){ e.classList.add("hin"); e.style.setProperty("--d", q[1]+"s"); } });
  if (document.fonts) document.fonts.ready.then(function(){ drawDims(curPage==="home"); }); else drawDims(true);

  var io = new IntersectionObserver(function(es){ es.forEach(function(e){
    if (!e.isIntersecting) return; var el = e.target; io.unobserve(el); el.classList.add("in");
    if (el.classList.contains("head")){ var hh = el.querySelector("h1,h2"); if (hh) hh.classList.add("in"); var eb = el.querySelector(".eyebrow"); if (eb) scramble(eb, 0); }
    if (el.classList.contains("ind-h1")) el.classList.add("in");
  }); }, {threshold:.18, rootMargin:"0px 0px -8% 0px"});
  document.querySelectorAll(".page section").forEach(function(s){ io.observe(s); });
  document.querySelectorAll(".page .head").forEach(function(h){ h.classList.add("rv"); var hh = h.querySelector("h1,h2"); if (hh) splitWords(hh); io.observe(h); });
  document.querySelectorAll(".page .ind-hero h1, .page .art-hero h1").forEach(function(h){ splitWords(h); h.classList.add("ind-h1"); io.observe(h); });
  document.querySelectorAll(".page .grid3:not(.anim), .page section:not(.hero) .stats, .page .faq, .page .split2, .page .fitgrid, .page .checks").forEach(function(g){
    g.classList.add("kids","rv"); Array.prototype.forEach.call(g.children, function(c,i){ c.style.setProperty("--i", Math.min(i,8)); }); io.observe(g); });
}

/* ---------- free tools: figures and the readiness nudge ---------- */
function setupTools(){
  var still = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (still) document.querySelectorAll(".tool animateMotion").forEach(function(a){ a.remove(); });
  if ("IntersectionObserver" in window){
    var io = new IntersectionObserver(function(es){ es.forEach(function(e){ if (e.isIntersecting){ e.target.classList.add("seen"); io.unobserve(e.target); } }); }, {threshold:.4});
    document.querySelectorAll(".tool").forEach(function(c){ io.observe(c); });
  } else document.querySelectorAll(".tool").forEach(function(c){ c.classList.add("seen"); });
  var gone = false; try { gone = sessionStorage.getItem("altyNudge") === "x"; } catch(e){}
  if (gone) return;
  var n = document.createElement("div"); n.className = "tnudge"; n.setAttribute("role","complementary"); n.setAttribute("aria-label","Readiness check");
  n.innerHTML = "<div><b>Is your business AI ready?</b><span>8 questions, about 2 minutes.</span></div><a class='btn small' href='/readiness/'>Take the check</a><button class='x' type='button' aria-label='Dismiss'>×</button>";
  document.body.appendChild(n);
  function close(){ gone = true; n.classList.remove("show"); try { sessionStorage.setItem("altyNudge","x"); } catch(e){} }
  n.querySelector(".x").addEventListener("click", close);
  n.querySelector("a").addEventListener("click", close);
  function upd(){ if (gone) return; var pg = curPage || "home"; n.classList.toggle("show", window.scrollY > 900 && pg !== "readiness" && pg !== "contact"); }
  window.addEventListener("scroll", upd, {passive:true}); window.addEventListener("hashchange", function(){ setTimeout(upd, 600); }); window.addEventListener("popstate", function(){ setTimeout(upd, 200); }); document.addEventListener("alty:route", function(){ setTimeout(upd, 200); }); upd();
}

/* ---------- routing ---------- */
var anchors = {"what-we-build":1,"roi":1,"how-it-works":1,"work":1,"faq":1,"engage":1};
var curPage = null;
function isHomeAnchor(h){
  return !!(h && (anchors[h] || h === "home" || (h.indexOf("sec-")===0 && document.getElementById(h))));
}
function route(opts){
  opts = opts || {};
  var rawHash = (location.hash||"").replace(/^#/,"");
  var path = normPath(location.pathname);
  if (PAGE_HREF[rawHash] && (path === "/" || !pageFromPath(location.pathname))){
    history.replaceState({scrollY:0, page:true}, "", PAGE_HREF[rawHash]);
    path = normPath(PAGE_HREF[rawHash]);
    rawHash = "";
  }
  var h = pageFromPath(path) || "home";
  var anchor = null;
  if (isHomeAnchor(rawHash)){
    anchor = anchors[rawHash] ? rawHash : (rawHash === "home" ? null : rawHash.replace(/^sec-/, ""));
    h = "home";
  }
  if (!document.querySelector('.page[data-page="'+h+'"]')) h = "home";
  doRoute(h, anchor, opts);
  setMeta(h);
}
function doRoute(h, anchor, opts){
  opts = opts || {};
  var samePage = curPage === h; curPage = h;
  document.querySelectorAll(".page").forEach(function(p){ p.classList.toggle("on", p.getAttribute("data-page")===h); });
  var navKey = anchor || (h.indexOf("case-")===0 ? "case-studies" : (h==="industries" || (typeof inds!=="undefined" && inds[h]) ? "industries" : h));
  if (typeof inds!=="undefined" && inds[h] && $("f-ind")) $("f-ind").value = inds[h].form;
  document.querySelectorAll("nav a").forEach(function(a){ if(a.getAttribute("data-nav")===navKey) a.setAttribute("aria-current","page"); else a.removeAttribute("aria-current"); });
  var de = document.documentElement; if (!samePage) de.style.scrollBehavior = "auto";
  var y = 0;
  if (opts.fromPop && opts.state && typeof opts.state.scrollY === "number") y = opts.state.scrollY;
  else if (anchor && $("sec-"+anchor)) {
    $("sec-"+anchor).scrollIntoView();
    y = -1;
  }
  if (y >= 0) window.scrollTo(0, y);
  if (!samePage) requestAnimationFrame(function(){ de.style.scrollBehavior = ""; });
  if (window.__motionRoute) window.__motionRoute(h);
  try { document.dispatchEvent(new Event("alty:route")); } catch(err){}
}
function rememberScroll(){
  var st = history.state || {};
  st.scrollY = window.scrollY;
  st.page = true;
  try { history.replaceState(st, "", location.pathname + location.search + location.hash); } catch(err){}
}
function navigate(url, replace){
  var u = new URL(url, location.origin);
  var destPath = u.pathname, destHash = u.hash, hashKey = (u.hash||"").replace(/^#/,"");
  if (PAGE_HREF[hashKey] && (normPath(destPath)==="/" || destPath==="" || !pageFromPath(destPath))){
    destPath = PAGE_HREF[hashKey]; destHash = "";
  } else if (isHomeAnchor(hashKey)){
    destPath = "/"; destHash = "#"+hashKey;
  } else if (pageFromPath(destPath)){
    destPath = normPath(destPath);
  }
  var next = destPath + u.search + destHash;
  var cur = location.pathname + location.search + location.hash;
  if (!replace) rememberScroll();
  if (replace || next !== cur){
    history[replace ? "replaceState" : "pushState"]({scrollY:0, page:true}, "", next);
  }
  route({fromNav: !replace});
}
function shouldIntercept(a){
  if (!a || (a.target && a.target !== "" && a.target !== "_self")) return false;
  if (a.hasAttribute("download")) return false;
  var href = a.getAttribute("href"); if (!href) return false;
  if (/^(mailto|tel|javascript):/i.test(href)) return false;
  var u; try { u = new URL(href, location.href); } catch(err){ return false; }
  if (u.origin !== location.origin) return false;
  if (/\.(css|js|png|jpe?g|gif|svg|ico|webp|xml|txt|woff2?|map|json)$/i.test(u.pathname)) return false;
  if (u.pathname.indexOf("/demo/") === 0) return false;
  var path = normPath(u.pathname);
  var hashKey = (u.hash||"").replace(/^#/,"");
  if (PATH_TO_PAGE[path] || PAGE_HREF[hashKey] || isHomeAnchor(hashKey) || path === "/") return true;
  return false;
}
document.addEventListener("click", function(e){
  if (e.defaultPrevented) return;
  if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  var a = e.target && e.target.closest ? e.target.closest("a") : null;
  if (!shouldIntercept(a)) return;
  e.preventDefault();
  navigate(a.getAttribute("href"));
});
window.addEventListener("popstate", function(e){ route({fromPop:true, state:e.state || {}}); });

buildCases(); buildIndustries(); buildStack(); drawStack(); buildProcess(); drawProcess(); buildReady(); drawReady(); drawField(); calc();
drawStepBuild(); route(); setupAnims(); setupHeroFigs(); setupSeen(); setupMotion(); setupTools();
})();
