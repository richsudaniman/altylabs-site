(function(){
"use strict";
function $(id){ return document.getElementById(id); }
function esc(s){ return String(s).replace(/[&<>"]/g, function(c){ return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]; }); }
function li(a){ return a.map(function(x){ return "<li>"+esc(x)+"</li>"; }).join(""); }
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
    if (!document.getElementById("quiz") || quizDone) return;
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
if ($("quiz") && $("scorecard")){ buildReady(); drawReady(); }
})();
