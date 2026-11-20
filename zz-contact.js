(function(){
"use strict";
function $(id){ return document.getElementById(id); }
var CONTACT_EMAIL = "hello@altylabs.com";
var FORM_ENDPOINT = "https://formsubmit.co/ajax/hello@altylabs.com";
var form = $("brief");
if (!form) return;
if ($("email-line") && $("email-link")){
  $("email-line").hidden = false;
  $("email-link").textContent = CONTACT_EMAIL;
  $("email-link").href = "mailto:"+CONTACT_EMAIL;
}
form.addEventListener("submit", function(e){
  e.preventDefault();
  var name=$("f-name").value.trim(), biz=$("f-biz").value.trim(), email=$("f-email").value.trim();
  if(!name||!biz){$("f-err").textContent="Add your name and business name.";return;}
  if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)){$("f-err").textContent="Enter an email address we can reply to.";return;}
  $("f-err").textContent="";
  var text="Workflow review request\n\nName: "+name+"\nBusiness: "+biz+"\nEmail: "+email+"\nIndustry: "+$("f-ind").value+"\nTeam size: "+$("f-size").value+
    "\nWhere the time goes: "+$("f-area").value+"\n\nThe work:\n"+($("f-msg").value.trim()||"(not described yet)");
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
      industry:$("f-ind").value, team_size:$("f-size").value, time_goes:$("f-area").value, message:$("f-msg").value.trim()||"(not described yet)"})})
  .then(function(r){ return r.json().catch(function(){ return {}; }).then(function(j){ return {ok:r.ok, j:j}; }); })
  .then(function(res){ clearTimeout(to);
    if (res.ok && String(res.j.success) === "true"){
      form.hidden = true; $("sent-line").textContent = "We'll reply to "+email+". If it's urgent, email hello@altylabs.com directly.";
      $("sent-ok").hidden = false; $("sent-ok").focus(); $("sent-ok").scrollIntoView({block:"nearest"});
    } else fail();
  }).catch(function(){ clearTimeout(to); fail(); });
});
if ($("copy-brief")) $("copy-brief").addEventListener("click", function(){
  var done=function(ok){$("copy-state").textContent= ok ? "Copied." : "Copy did not work here. Select the text above and copy it by hand.";};
  try{ navigator.clipboard.writeText($("brief-text").textContent).then(function(){done(true);},function(){done(false);}); }catch(err){done(false);}
});
})();
