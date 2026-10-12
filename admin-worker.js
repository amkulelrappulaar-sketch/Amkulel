// AMKULEL — Worker Cloudflare
// Rôle : servir le site avec ses contenus modifiables, les aperçus de partage (Facebook, WhatsApp),
// la newsletter et l'espace d'administration (/admin).
// Réglages attendus : espace KV « NEWSLETTER », fichiers statiques « ASSETS », secret « ADMIN_PASSWORD ».

const ADMIN_HTML = "<!doctype html>\n<html lang=\"fr\">\n<head>\n<meta charset=\"utf-8\">\n<meta name=\"viewport\" content=\"width=device-width,initial-scale=1\">\n<meta name=\"robots\" content=\"noindex,nofollow\">\n<title>Administration AMKULEL</title>\n<style>\n:root{--bg:#0d0d0d;--card:#181818;--line:#2c2c2c;--tx:#f4efe4;--mu:#9a9588;--gold:#d4a73a;--grn:#2e8b57;--red:#c0392b}\n*{box-sizing:border-box;-webkit-tap-highlight-color:transparent}\nhtml,body{margin:0;background:var(--bg);color:var(--tx);font:16px/1.45 system-ui,-apple-system,Segoe UI,Roboto,sans-serif}\nbody{padding-bottom:90px}\nh1,h2,h3{margin:0}\nbutton,input,select,textarea{font:inherit;color:inherit}\n.wrap{max-width:640px;margin:0 auto;padding:0 14px}\n.top{position:sticky;top:0;z-index:5;background:#000;border-bottom:1px solid var(--line)}\n.top .bar{display:flex;align-items:center;justify-content:space-between;padding:10px 14px;max-width:640px;margin:0 auto}\n.top b{color:var(--gold);letter-spacing:.12em}\n.top a,.link{color:var(--mu);font-size:14px;background:none;border:0;text-decoration:underline;cursor:pointer;padding:6px}\n.tabs{display:flex;overflow-x:auto;gap:4px;padding:0 10px 8px;max-width:640px;margin:0 auto;scrollbar-width:none}\n.tabs::-webkit-scrollbar{display:none}\n.tab{flex:0 0 auto;border:1px solid var(--line);background:var(--card);padding:8px 13px;border-radius:999px;font-size:14px;cursor:pointer}\n.tab.on{background:var(--gold);color:#000;border-color:var(--gold);font-weight:700}\n.btn{display:inline-block;border:0;border-radius:10px;padding:12px 16px;font-weight:700;cursor:pointer;background:var(--gold);color:#000;min-height:44px}\n.btn.sec{background:#262626;color:var(--tx);font-weight:600}\n.btn.red{background:var(--red);color:#fff}\n.btn.sm{padding:8px 12px;min-height:38px;font-size:14px}\n.btn[disabled]{opacity:.5}\n.btn.full{width:100%}\n.item{display:flex;gap:12px;background:var(--card);border:1px solid var(--line);border-radius:12px;padding:10px;margin:10px 0}\n.th{flex:0 0 64px;height:64px;border-radius:8px;background:#222 center/cover no-repeat}\n.it{flex:1;min-width:0}\n.it h3{font-size:16px;overflow-wrap:anywhere}\n.it p{margin:2px 0 8px;color:var(--mu);font-size:13px;overflow-wrap:anywhere}\n.acts{display:flex;flex-wrap:wrap;gap:6px}\n.badge{display:inline-block;font-size:11px;padding:1px 7px;border-radius:99px;background:#2a2a2a;color:var(--gold);margin-left:4px}\n.empty{color:var(--mu);text-align:center;padding:40px 10px}\n.add{position:fixed;left:0;right:0;bottom:0;padding:12px 14px calc(12px + env(safe-area-inset-bottom));background:linear-gradient(transparent,#000 40%);z-index:4}\n.add .btn{max-width:640px;margin:0 auto;display:block;width:100%}\n.card{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:18px;margin:18px 0}\nlabel{display:block;font-weight:600;margin:16px 0 5px;font-size:14px}\n.hint{color:var(--mu);font-size:12.5px;margin:3px 0 0}\ninput[type=text],input[type=password],input[type=date],input[type=url],select,textarea{width:100%;background:#0f0f0f;border:1px solid #3a3a3a;border-radius:10px;padding:11px 12px;font-size:16px}\ntextarea{min-height:110px;resize:vertical}\ninput:focus,select:focus,textarea:focus{outline:2px solid var(--gold);border-color:transparent}\n.chk{display:flex;gap:10px;align-items:flex-start;font-weight:500;margin:14px 0}\n.chk input{width:22px;height:22px;margin:0;accent-color:var(--gold);flex:0 0 auto}\n.pic{display:flex;gap:12px;align-items:center}\n.pic .pv{width:96px;height:96px;border-radius:10px;background:#222 center/cover no-repeat;flex:0 0 auto;border:1px dashed #444}\n.pic .pb{display:flex;flex-direction:column;gap:8px}\n.form{position:fixed;inset:0;background:var(--bg);z-index:20;overflow-y:auto;-webkit-overflow-scrolling:touch}\n.form .head{position:sticky;top:0;background:#000;border-bottom:1px solid var(--line);display:flex;align-items:center;justify-content:space-between;padding:10px 14px;z-index:2}\n.form .head h2{font-size:17px}\n.form .body{max-width:640px;margin:0 auto;padding:4px 14px 120px}\n.form .foot{position:fixed;left:0;right:0;bottom:0;background:#000;border-top:1px solid var(--line);padding:10px 14px calc(10px + env(safe-area-inset-bottom));display:flex;gap:10px;z-index:3}\n.form .foot .btn{flex:1}\n.err{color:#ff8f80;font-size:14px;margin-top:10px;white-space:pre-line}\n#toast{position:fixed;left:50%;bottom:90px;transform:translateX(-50%);background:#fff;color:#000;padding:11px 16px;border-radius:10px;font-weight:600;z-index:60;max-width:92%;display:none;text-align:center;box-shadow:0 6px 20px #000a}\n#toast.bad{background:var(--red);color:#fff}\n.modal{position:fixed;inset:0;background:#000c;z-index:50;display:flex;align-items:center;justify-content:center;padding:20px}\n.modal .box{background:var(--card);border:1px solid var(--line);border-radius:14px;padding:20px;max-width:420px;width:100%}\n.modal p{margin:0 0 16px}\n.modal .acts{justify-content:flex-end}\n.sub{display:flex;justify-content:space-between;gap:8px;align-items:center;border-bottom:1px solid var(--line);padding:9px 0;font-size:14px}\n.sub span{overflow-wrap:anywhere}\n.sub small{color:var(--mu);display:block}\n.hide{display:none!important}\n.mu{color:var(--mu)}\n.ok{color:#7fd6a0}\n</style>\n</head>\n<body>\n\n<div id=\"boot\" class=\"wrap\"><p class=\"empty\">Chargement…</p></div>\n\n<div id=\"setup\" class=\"wrap hide\">\n  <div class=\"card\">\n    <h2 style=\"color:var(--gold)\">Administration AMKULEL</h2>\n    <p>Le mot de passe de l'administration n'est pas encore configuré.</p>\n    <p class=\"mu\">Dans Cloudflare : Workers → amkulel → Settings → Variables and Secrets → Add → type <b>Secret</b>, nom <b>ADMIN_PASSWORD</b>, valeur = une longue phrase de passe (12 caractères ou plus). Puis recharge cette page.</p>\n    <button class=\"btn full\" onclick=\"location.reload()\">Recharger</button>\n  </div>\n</div>\n\n<div id=\"config\" class=\"wrap hide\">\n  <div class=\"card\"><h2 style=\"color:var(--gold)\">Configuration manquante</h2>\n  <p>Le stockage (KV) n'est pas relié au site. Vérifie le fichier wrangler.jsonc (kv_namespaces).</p></div>\n</div>\n\n<div id=\"login\" class=\"wrap hide\">\n  <div class=\"card\">\n    <h2 style=\"color:var(--gold);letter-spacing:.08em\">AMKULEL · Administration</h2>\n    <form id=\"lf\" autocomplete=\"on\">\n      <label for=\"pw\">Mot de passe</label>\n      <input id=\"pw\" type=\"password\" autocomplete=\"current-password\" required>\n      <div id=\"lerr\" class=\"err\"></div>\n      <button class=\"btn full\" style=\"margin-top:16px\" id=\"lgo\">Se connecter</button>\n    </form>\n  </div>\n</div>\n\n<div id=\"app\" class=\"hide\">\n  <div class=\"top\">\n    <div class=\"bar\"><b>AMKULEL</b><span><a href=\"/\" target=\"_blank\" rel=\"noopener\">Voir le site</a> <button class=\"link\" id=\"out\">Déconnexion</button></span></div>\n    <div class=\"tabs\" id=\"tabs\"></div>\n  </div>\n  <div class=\"wrap\" id=\"main\"></div>\n  <div class=\"add\" id=\"addbar\"><button class=\"btn\" id=\"addbtn\">+ Ajouter</button></div>\n</div>\n\n<div id=\"formbox\"></div>\n<div id=\"toast\"></div>\n\n<script>\n'use strict';\nvar $=function(s){return document.querySelector(s)};\nvar S={raw:null,base:0,tab:'art',busy:false};\nvar PAYS=['Sénégal','Mauritanie','Diaspora'],SORTIES=['Album','EP','Mixtape','Single','Clip'],PC=['Sénégal','Mauritanie','International'],\nCATS=['News','Rap Sénégal','Rap Mauritanie','Rap Pulaar','Artistes','Labels','Événements','Culture'];\n\n/* ---------- utilitaires ---------- */\nfunction esc(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\"/g,'&quot;')}\nfunction un(s){return String(s==null?'':s).replace(/<br\\s*\\/?>/g,'\\n').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'\"').replace(/&#39;/g,\"'\").replace(/&amp;/g,'&')}\nfunction deepU(v){if(typeof v==='string')return un(v);if(Array.isArray(v))return v.map(deepU);if(v&&typeof v==='object'){var o={};for(var k in v)o[k]=deepU(v[k]);return o}return v}\nfunction sl(t){return String(t).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')}\nfunction today(){var d=new Date(),m=d.getMonth()+1,j=d.getDate();return d.getFullYear()+'-'+(m<10?'0':'')+m+'-'+(j<10?'0':'')+j}\nfunction fdate(d){if(!/^\\d{4}-\\d{2}-\\d{2}$/.test(d||''))return d||'';var a=d.split('-');return a[2]+'/'+a[1]+'/'+a[0]}\nvar tt;function toast(m,bad){var t=$('#toast');t.textContent=m;t.className=bad?'bad':'';t.style.display='block';clearTimeout(tt);tt=setTimeout(function(){t.style.display='none'},bad?5000:2600)}\nfunction show(id){['boot','setup','config','login','app'].forEach(function(x){$('#'+x).classList.toggle('hide',x!==id)})}\nfunction ask(msg,okLabel,danger){return new Promise(function(res){var m=document.createElement('div');m.className='modal';m.innerHTML='<div class=\"box\"><p>'+esc(msg)+'</p><div class=\"acts\"><button class=\"btn sec\" data-r=\"0\">Annuler</button><button class=\"btn '+(danger?'red':'')+'\" data-r=\"1\">'+esc(okLabel||'OK')+'</button></div></div>';m.onclick=function(e){var r=e.target.getAttribute&&e.target.getAttribute('data-r');if(r!==null&&r!==undefined){m.remove();res(r==='1')}};document.body.appendChild(m)})}\n\nasync function api(path,method,body){\n  var o={method:method||'GET',credentials:'same-origin',headers:{}};\n  if(body!==undefined){o.body=JSON.stringify(body);o.headers['content-type']='application/json'}\n  var r;try{r=await fetch('/api/admin/'+path,o)}catch(e){throw {net:true}}\n  var j=null;try{j=await r.json()}catch(e){}\n  if(r.status===401&&path!=='login'){show('login');throw {auth:true}}\n  if(r.status===503&&j){show(j.error==='config'?'config':'setup');throw {cfg:true}}\n  if(!r.ok)throw {status:r.status,j:j||{}};\n  return j;\n}\n\n/* ---------- schéma des contenus ---------- */\nvar SCH={\nart:{lab:'Artistes',one:'artiste',pre:'artiste',title:'t',sub:function(o){return [o.z,o.c].filter(Boolean).join(' · ')},badge:function(o){return (o.tal?'Nouveau talent':'')+(o.moment?'|Artiste du moment':'')},\n fields:[\n {k:'t',l:'Nom de l\\'artiste',t:'text',req:1},\n {k:'z',l:'Pays',t:'sel',o:PAYS,req:1},\n {k:'c',l:'Ville',t:'text',req:1,ph:'Nouakchott'},\n {k:'img',l:'Photo',t:'img'},\n {k:'p',l:'Crédit photo (facultatif)',t:'text',ph:'Nom du photographe'},\n {k:'d',l:'Phrase d\\'accroche',t:'text',h:'Une phrase courte affichée sur la carte.'},\n {k:'b',l:'Biographie',t:'area',h:'Sépare les paragraphes par une ligne vide.'},\n {k:'lk',l:'Liens (réseaux, YouTube…)',t:'links'},\n {k:'tal',l:'C\\'est un nouveau talent',t:'chk'},\n {k:'moment',l:'Mettre en « Artiste du moment » (un seul à la fois)',t:'chk'}]},\nso:{lab:'Sorties',one:'sortie',pre:'sortie',title:'t',sub:function(o){return [o.z,o.c,fdate(o.dt)].filter(Boolean).join(' · ')},\n fields:[\n {k:'t',l:'Titre',t:'text',req:1},\n {k:'z',l:'Type',t:'sel',o:SORTIES,req:1},\n {k:'c',l:'Artiste(s)',t:'text',req:1},\n {k:'dt',l:'Date de sortie',t:'date',req:1},\n {k:'d',l:'Phrase d\\'accroche',t:'text'},\n {k:'img',l:'Pochette / image',t:'img',h:'Facultatif si tu mets un lien YouTube : la miniature sera utilisée.'},\n {k:'yt',l:'Lien YouTube (extrait vidéo)',t:'yt',ph:'https://youtu.be/…'},\n {k:'se',l:'Extrait : début et fin',t:'se',h:'Au format minutes:secondes, par exemple 0:10 et 0:40. Les deux sont nécessaires.'},\n {k:'u',l:'Lien pour écouter / regarder',t:'url',ph:'https://…'},\n {k:'l',l:'Liste des titres',t:'lines',h:'Un titre par ligne.'},\n {k:'p',l:'Texte de présentation',t:'area'}]},\nco:{lab:'Concerts',one:'concert',pre:'concert',title:'t',sub:function(o){return [fdate(o.d),o.c].filter(Boolean).join(' · ')},\n fields:[\n {k:'t',l:'Nom du concert',t:'text',req:1},\n {k:'d',l:'Date',t:'date',req:1},\n {k:'h',l:'Heure (facultatif)',t:'text',ph:'20h00'},\n {k:'a',l:'Artiste(s)',t:'text'},\n {k:'l',l:'Lieu',t:'text',req:1},\n {k:'c',l:'Ville',t:'text',req:1},\n {k:'z',l:'Pays',t:'sel',o:PC,req:1},\n {k:'o',l:'Organisateur',t:'text'},\n {k:'img',l:'Affiche',t:'img'},\n {k:'p',l:'Prix / infos pratiques',t:'lines',h:'Une ligne par info, par exemple : Prévente : 200 MRU · Jour J : 300 MRU'},\n {k:'tel',l:'Contacts / réservations',t:'tel',h:'Un par ligne : « Nom | numéro ». Exemple : Réservations | 48 76 47 64. Le code du pays est ajouté automatiquement (Mauritanie +222, Sénégal +221) ; pour un autre pays, écris le numéro complet avec +.'},\n {k:'tk',l:'Lien billetterie',t:'url',ph:'https://…'}]},\nnews:{lab:'Actualités',one:'article',pre:'article',title:'t',sub:function(o){return [o.c,fdate(o.dt)].filter(Boolean).join(' · ')},\n fields:[\n {k:'t',l:'Titre',t:'text',req:1},\n {k:'c',l:'Catégorie',t:'sel',o:CATS,req:1},\n {k:'dt',l:'Date',t:'date',req:1},\n {k:'a',l:'Auteur',t:'text',ph:'La rédaction Amkulel'},\n {k:'img',l:'Image principale',t:'img'},\n {k:'ex',l:'Résumé (facultatif)',t:'text',h:'Affiché sur la carte et dans les aperçus de partage. Sinon, le début du texte est utilisé.'},\n {k:'p',l:'Texte de l\\'article',t:'area',req:1,h:'Sépare les paragraphes par une ligne vide.'},\n {k:'ar',l:'Artistes concernés',t:'lines',h:'Un nom par ligne (facultatif).'},\n {k:'lk',l:'Liens',t:'links'}]},\nchr:{lab:'Chroniques',one:'chronique',pre:'chronique',title:'t',sub:function(o){return fdate(o.dt)},\n fields:[\n {k:'t',l:'Titre',t:'text',req:1},\n {k:'dt',l:'Date',t:'date',req:1},\n {k:'a',l:'Auteur',t:'text',ph:'La rédaction Amkulel'},\n {k:'img',l:'Image (facultatif)',t:'img'},\n {k:'ex',l:'Résumé (facultatif)',t:'text'},\n {k:'p',l:'Texte de la chronique',t:'area',req:1,h:'Sépare les paragraphes par une ligne vide.'}]}\n};\nvar ORDER=['art','so','co','news','chr'];\n\n/* ---------- conversions valeur <-> champ ---------- */\nfunction ytId(v){v=String(v||'').trim();if(!v)return '';if(/^[\\w-]{11}$/.test(v))return v;var m=v.match(/(?:youtu\\.be\\/|[?&]v=|\\/embed\\/|\\/shorts\\/|\\/live\\/|\\/v\\/)([\\w-]{11})/);return m?m[1]:null}\nfunction fromSec(n){if(typeof n!=='number')return '';return Math.floor(n/60)+':'+('0'+(n%60)).slice(-2)}\nfunction toSec(v){v=String(v||'').trim();if(!v)return null;var m=v.match(/^(\\d+):([0-5]?\\d)$/);if(m)return +m[1]*60+ +m[2];if(/^\\d+$/.test(v))return +v;return NaN}\nfunction telE164(num,z){var d=String(num).trim();var plus=/^\\+/.test(d)||/^00/.test(d);var digits=d.replace(/\\D/g,'');if(/^00/.test(d))digits=digits.slice(2);\n  if(plus||/^00/.test(d)){return '+'+digits}\n  if(z==='Mauritanie')return '+222'+digits;if(z==='Sénégal')return '+221'+digits;return null}\n\n/* ---------- liste ---------- */\nfunction render(){\n  var tabs='';ORDER.forEach(function(k){tabs+='<button class=\"tab'+(S.tab===k?' on':'')+'\" data-t=\"'+k+'\">'+SCH[k].lab+(S.raw[k]?' ('+S.raw[k].length+')':'')+'</button>'});\n  tabs+='<button class=\"tab'+(S.tab==='nl'?' on':'')+'\" data-t=\"nl\">Newsletter</button>';\n  $('#tabs').innerHTML=tabs;\n  $('#addbar').classList.toggle('hide',S.tab==='nl');\n  if(S.tab==='nl'){return renderNL()}\n  var sc=SCH[S.tab],arr=S.raw[S.tab]||[],h='';\n  $('#addbtn').textContent='+ Ajouter '+({art:'un artiste',so:'une sortie',co:'un concert',news:'un article',chr:'une chronique'}[S.tab]);\n  if(!arr.length)h='<p class=\"empty\">Rien ici pour l\\'instant.<br>Appuie sur « Ajouter » pour commencer.</p>';\n  arr.forEach(function(o,i){\n    var th=o.img?' style=\"background-image:url(\\''+esc(o.img)+'\\')\"':'';\n    var b=sc.badge?sc.badge(o).split('|').filter(Boolean).map(function(x){return '<span class=\"badge\">'+esc(x)+'</span>'}).join(''):'';\n    h+='<div class=\"item\"><div class=\"th\"'+th+'></div><div class=\"it\"><h3>'+esc(o[sc.title])+b+'</h3><p>'+esc(sc.sub(o))+'</p><div class=\"acts\"><button class=\"btn sm\" data-e=\"'+i+'\">Modifier</button><button class=\"btn sm sec\" data-l=\"'+i+'\">Lien</button><button class=\"btn sm sec\" data-d=\"'+i+'\">Supprimer</button></div></div></div>';\n  });\n  $('#main').innerHTML='<div style=\"height:12px\"></div>'+h;\n}\n$('#tabs').addEventListener('click',function(e){var t=e.target.getAttribute('data-t');if(t){S.tab=t;render();window.scrollTo(0,0)}});\n$('#addbtn').onclick=function(){openForm(-1)};\n$('#main').addEventListener('click',async function(e){\n  var b=e.target.closest('button');if(!b)return;\n  var a=b.getAttribute('data-e'),l=b.getAttribute('data-l'),d=b.getAttribute('data-d');\n  if(a!==null)openForm(+a);\n  if(l!==null){var o=S.raw[S.tab][+l],u=location.origin+'/p/'+SCH[S.tab].pre+'-'+sl(esc(o.t));\n    try{await navigator.clipboard.writeText(u);toast('Lien copié')}catch(x){prompt('Copie ce lien :',u)}}\n  if(d!==null){var o2=S.raw[S.tab][+d];\n    if(await ask('Supprimer « '+o2[SCH[S.tab].title]+' » ? Cette action est définitive.','Supprimer',true)){\n      var copy=JSON.parse(JSON.stringify(S.raw));copy[S.tab].splice(+d,1);await save(copy,'Supprimé')}}\n});\n\n/* ---------- enregistrement ---------- */\nasync function save(next,msg){\n  if(S.busy)return false;S.busy=true;\n  try{\n    var r=await api('content','PUT',{base:S.base,content:next});\n    S.base=r.content.v||0;S.raw=deepU(r.content);toast(msg||'Enregistré');render();return true;\n  }catch(e){\n    if(e.status===409){toast('Le contenu a été modifié ailleurs. Rechargement…',true);await load()}\n    else if(e.status===400&&e.j&&e.j.detail){toast(e.j.detail.join(' '),true)}\n    else if(e.net)toast('Pas de connexion. Réessaie.',true);\n    else if(!e.auth&&!e.cfg)toast('Erreur ('+(e.status||'?')+'). Réessaie.',true);\n    return false;\n  }finally{S.busy=false}\n}\n\n/* ---------- formulaire ---------- */\nvar F=null;\nfunction fieldHTML(f,v,idx){\n  var id='f_'+f.k,h='';\n  var lab=function(){return '<label for=\"'+id+'\">'+esc(f.l)+(f.req?' *':'')+'</label>'};\n  var hint=f.h?'<p class=\"hint\">'+esc(f.h)+'</p>':'';\n  switch(f.t){\n  case 'text':return lab()+'<input type=\"text\" id=\"'+id+'\" value=\"'+esc(v)+'\" placeholder=\"'+esc(f.ph||'')+'\" autocomplete=\"off\">'+hint;\n  case 'url':return lab()+'<input type=\"url\" id=\"'+id+'\" value=\"'+esc(v)+'\" placeholder=\"'+esc(f.ph||'')+'\" autocapitalize=\"off\" autocomplete=\"off\">'+hint;\n  case 'yt':return lab()+'<input type=\"url\" id=\"'+id+'\" value=\"'+esc(v?'https://youtu.be/'+v:'')+'\" placeholder=\"'+esc(f.ph||'')+'\" autocapitalize=\"off\" autocomplete=\"off\">'+hint;\n  case 'date':return lab()+'<input type=\"date\" id=\"'+id+'\" value=\"'+esc(v)+'\">'+hint;\n  case 'sel':return lab()+'<select id=\"'+id+'\">'+(v?'':'<option value=\"\">— Choisir —</option>')+f.o.map(function(x){return '<option'+(x===v?' selected':'')+'>'+esc(x)+'</option>'}).join('')+'</select>'+hint;\n  case 'area':return lab()+'<textarea id=\"'+id+'\" style=\"min-height:'+(f.k==='b'||f.k==='p'?'220px':'110px')+'\">'+esc((v||[]).join('\\n\\n'))+'</textarea>'+hint;\n  case 'lines':return lab()+'<textarea id=\"'+id+'\">'+esc((v||[]).join('\\n'))+'</textarea>'+hint;\n  case 'links':return lab()+'<textarea id=\"'+id+'\" placeholder=\"Instagram | https://instagram.com/…\">'+esc((v||[]).map(function(l){return l[0]+' | '+l[1]}).join('\\n'))+'</textarea><p class=\"hint\">Un lien par ligne : « Texte du bouton | https://… »</p>';\n  case 'tel':return lab()+'<textarea id=\"'+id+'\" placeholder=\"Réservations | 48 76 47 64\">'+esc((v||[]).map(function(l){return l[0]+' | '+l[1]}).join('\\n'))+'</textarea>'+hint;\n  case 'se':return '<label>'+esc(f.l)+'</label><div style=\"display:flex;gap:10px\"><input type=\"text\" id=\"f_s\" value=\"'+esc(fromSec(F.o.s))+'\" placeholder=\"0:10\" inputmode=\"numeric\" autocomplete=\"off\"><input type=\"text\" id=\"f_e\" value=\"'+esc(fromSec(F.o.e))+'\" placeholder=\"0:40\" inputmode=\"numeric\" autocomplete=\"off\"></div>'+hint;\n  case 'chk':return '<label class=\"chk\"><input type=\"checkbox\" id=\"'+id+'\"'+(v?' checked':'')+'><span>'+esc(f.l)+'</span></label>';\n  case 'img':return lab()+'<div class=\"pic\"><div class=\"pv\" id=\"pv_'+f.k+'\"'+(v?' style=\"background-image:url(\\''+esc(v)+'\\')\"':'')+'></div><div class=\"pb\"><label class=\"btn sm sec\" style=\"margin:0;text-align:center\">Choisir une photo<input type=\"file\" accept=\"image/*\" id=\"file_'+f.k+'\" class=\"hide\"></label><button type=\"button\" class=\"btn sm sec\" data-rm=\"'+f.k+'\">Retirer</button></div></div><div class=\"hint\" id=\"ps_'+f.k+'\">'+hint.replace(/<\\/?p[^>]*>/g,'')+'</div>';\n  }\n  return '';\n}\nfunction openForm(i){\n  var sc=SCH[S.tab],isNew=i<0;\n  var o=isNew?{}:JSON.parse(JSON.stringify(S.raw[S.tab][i]));\n  if(isNew){if(S.tab==='so'||S.tab==='news'||S.tab==='chr'||S.tab==='co')o[S.tab==='co'?'d':'dt']=today();if(S.tab==='news'||S.tab==='chr')o.a='La rédaction Amkulel'}\n  if(S.tab==='so'&&/^https:\\/\\/i\\.ytimg\\.com\\//.test(o.img||''))o.img='';\n  F={tab:S.tab,i:i,o:o,dirty:false};\n  var h='<div class=\"form\"><div class=\"head\"><button class=\"link\" id=\"fx\">Fermer</button><h2>'+(isNew?'Nouveau':'Modifier')+' — '+esc(sc.one)+'</h2><span style=\"width:60px\"></span></div><div class=\"body\">';\n  sc.fields.forEach(function(f){h+=fieldHTML(f,f.k==='se'?null:o[f.k],i)});\n  h+='<div class=\"err\" id=\"ferr\"></div></div><div class=\"foot\"><button class=\"btn sec\" id=\"fc\">Annuler</button><button class=\"btn\" id=\"fs\">Enregistrer</button></div></div>';\n  $('#formbox').innerHTML=h;document.body.style.overflow='hidden';\n  var box=$('#formbox');\n  box.addEventListener('input',function(){F.dirty=true});box.addEventListener('change',function(){F.dirty=true});\n  sc.fields.forEach(function(f){if(f.t==='img'){var inp=$('#file_'+f.k);inp.addEventListener('change',function(){if(inp.files&&inp.files[0])pickImg(f.k,inp.files[0]);inp.value=''})}});\n  box.onclick=function(e){var r=e.target.getAttribute&&e.target.getAttribute('data-rm');if(r){F.o[r]='';$('#pv_'+r).style.backgroundImage='';F.dirty=true}};\n  $('#fx').onclick=$('#fc').onclick=closeForm;$('#fs').onclick=submitForm;\n  setTimeout(function(){$('.form').scrollTop=0},0);\n}\nasync function closeForm(force){\n  if(force!==true&&F&&F.dirty&&!(await ask('Quitter sans enregistrer ? Les modifications seront perdues.','Quitter',true)))return;\n  $('#formbox').innerHTML='';document.body.style.overflow='';F=null;\n}\nfunction loadBitmap(file){\n  return new Promise(function(res,rej){\n    var url=URL.createObjectURL(file),im=new Image();\n    im.onload=function(){res({w:im.naturalWidth,h:im.naturalHeight,draw:function(c,w,h){c.drawImage(im,0,0,w,h)},done:function(){URL.revokeObjectURL(url)}})};\n    im.onerror=function(){URL.revokeObjectURL(url);rej(new Error('img'))};im.src=url;\n  });\n}\nasync function pickImg(k,file){\n  var st=$('#ps_'+k),old=st.innerHTML;\n  st.textContent='Envoi de la photo…';\n  try{\n    var b=await loadBitmap(file),max=1400,sc=Math.min(1,max/Math.max(b.w,b.h)),w=Math.max(1,Math.round(b.w*sc)),h=Math.max(1,Math.round(b.h*sc));\n    var cv=document.createElement('canvas');cv.width=w;cv.height=h;var cx=cv.getContext('2d');cx.fillStyle='#fff';cx.fillRect(0,0,w,h);b.draw(cx,w,h);b.done();\n    var blob=await new Promise(function(r){cv.toBlob(r,'image/jpeg',0.82)});\n    if(!blob)throw new Error('blob');\n    var r=await fetch('/api/admin/upload',{method:'POST',credentials:'same-origin',headers:{'content-type':'image/jpeg'},body:blob});\n    if(r.status===401){show('login');throw {auth:1}}\n    var j=await r.json().catch(function(){return {}});\n    if(!r.ok||!j.url)throw new Error('up');\n    F.o[k]=j.url;F.dirty=true;$('#pv_'+k).style.backgroundImage='url(\\''+j.url+'\\')';st.innerHTML=old;toast('Photo ajoutée');\n  }catch(e){st.innerHTML=old;toast('Impossible d\\'envoyer cette photo. Essaie une autre image.',true)}\n}\nfunction val(id){var e=$('#'+id);return e?e.value.trim():''}\nfunction splitLines(v){return v.split('\\n').map(function(x){return x.trim()}).filter(Boolean)}\nfunction collect(){\n  var sc=SCH[F.tab],o=F.o,errs=[],r={};\n  sc.fields.forEach(function(f){\n    var k=f.k,v;\n    switch(f.t){\n    case 'text':case 'url':case 'date':case 'sel':v=val('f_'+k);r[k]=v;\n      if(f.t==='url'&&v&&!/^https?:\\/\\/\\S+$/i.test(v))errs.push(f.l+' : le lien doit commencer par http:// ou https://');break;\n    case 'yt':v=val('f_'+k);var id=ytId(v);if(id===null)errs.push('Lien YouTube non reconnu.');else r.yt=id;break;\n    case 'se':var s=toSec(val('f_s')),e=toSec(val('f_e'));\n      if(Number.isNaN(s)||Number.isNaN(e))errs.push('Extrait : utilise le format 0:10.');\n      else if((s===null)!==(e===null))errs.push('Extrait : remplis le début ET la fin (ou aucun des deux).');\n      else if(s!==null&&e<=s)errs.push('Extrait : la fin doit être après le début.');\n      else{r.s=s;r.e=e}break;\n    case 'area':r[k]=val('f_'+k).split(/\\n\\s*\\n/).map(function(x){return x.trim()}).filter(Boolean);break;\n    case 'lines':r[k]=splitLines(val('f_'+k));break;\n    case 'links':r[k]=[];splitLines(val('f_'+k)).forEach(function(ln){\n      var p=ln.split('|'),t,u;if(p.length>=2){t=p.shift().trim();u=p.join('|').trim()}else{u=ln;t=''}\n      if(!/^https?:\\/\\/\\S+$/i.test(u)){errs.push('Lien invalide : « '+ln.slice(0,50)+' ». Format : Texte | https://…');return}\n      if(!t){try{t=new URL(u).hostname.replace(/^www\\./,'')}catch(x){t='Lien'}}r[k].push([t,u])});break;\n    case 'tel':r[k]=[];var z=val('f_z')||'';splitLines(val('f_'+k)).forEach(function(ln){\n      var p=ln.split('|'),t,n;if(p.length>=2){t=p.shift().trim();n=p.join('|').trim()}else{n=ln;t=ln}\n      var e=telE164(n,z);if(!e||!/^\\+\\d{6,15}$/.test(e)){errs.push('Numéro invalide : « '+ln.slice(0,40)+' » (pays du concert : '+(z||'non choisi')+').');return}\n      r[k].push([t||n,e])});break;\n    case 'chk':r[k]=$('#f_'+k).checked?1:0;break;\n    case 'img':r[k]=o[k]||'';break;\n    }\n  });\n  sc.fields.forEach(function(f){if(f.req&&f.t!=='chk'){var v=r[f.k];if(v===undefined||v===''||(Array.isArray(v)&&!v.length))errs.push('« '+f.l+' » est obligatoire.')}});\n  return {r:r,errs:errs};\n}\nasync function submitForm(){\n  var c=collect(),err=$('#ferr');\n  if(c.errs.length){err.textContent=c.errs.join('\\n');err.scrollIntoView({block:'center'});return}\n  err.textContent='';\n  var tab=F.tab,i=F.i,sc=SCH[tab],r=c.r,next=JSON.parse(JSON.stringify(S.raw));\n  var base=i<0?{}:next[tab][i];\n  var item=Object.assign({},base,r);\n  if(tab==='art'){if(!r.tal)delete item.tal;if(!r.moment)delete item.moment}\n  if(tab==='so'){if(!r.yt){delete item.yt;delete item.v;delete item.s;delete item.e}else if(r.s===null||r.s===undefined){delete item.s;delete item.e}}\n  /* doublon de titre : le lien de partage serait identique */\n  var slug=sl(esc(item[sc.title]));\n  var dup=next[tab].some(function(x,j){return j!==i&&sl(esc(x[sc.title]))===slug});\n  if(!slug){err.textContent='Le titre doit contenir des lettres ou des chiffres.';return}\n  if(dup){err.textContent='Un élément porte déjà ce titre : change-le un peu pour que chaque lien de partage reste unique.';return}\n  if(i<0){if(tab==='art')next[tab].push(item);else next[tab].unshift(item)}else next[tab][i]=item;\n  if(tab==='art'&&item.moment)next.art.forEach(function(a){if(a!==item&&!(i>=0&&a===next.art[i]))a.moment=0});\n  if(tab==='art'&&item.moment){next.art.forEach(function(a,j){if(a.t!==item.t)delete a.moment})}\n  var btn=$('#fs');btn.disabled=true;btn.textContent='Enregistrement…';\n  var ok=await save(next,i<0?'Ajouté ✓':'Modifié ✓');\n  if(ok)closeForm(true);else if($('#fs')){btn.disabled=false;btn.textContent='Enregistrer'}\n}\n\n/* ---------- newsletter ---------- */\nasync function renderNL(){\n  $('#main').innerHTML='<p class=\"empty\">Chargement…</p>';\n  try{\n    var r=await api('subscribers'),a=r.subscribers.slice().sort(function(x,y){return String(y.d).localeCompare(String(x.d))});\n    S.subs=a;\n    var h='<div class=\"card\"><h3>'+a.length+' abonné'+(a.length>1?'s':'')+'</h3>';\n    if(a.length)h+='<div class=\"acts\" style=\"margin:12px 0\"><button class=\"btn sm\" id=\"cp\">Copier les e-mails</button><button class=\"btn sm sec\" id=\"csv\">Télécharger (CSV)</button></div>';\n    a.forEach(function(s,i){h+='<div class=\"sub\"><span>'+esc(s.email)+(s.d?'<small>'+esc(String(s.d).slice(0,10))+'</small>':'')+'</span><button class=\"btn sm sec\" data-x=\"'+i+'\">Retirer</button></div>'});\n    if(!a.length)h+='<p class=\"mu\">Personne ne s\\'est encore inscrit.</p>';\n    $('#main').innerHTML=h+'</div>';\n  }catch(e){if(!e.auth&&!e.cfg)$('#main').innerHTML='<p class=\"empty\">Impossible de charger la liste.</p>'}\n}\n$('#main').addEventListener('click',async function(e){\n  var b=e.target.closest('button');if(!b||S.tab!=='nl')return;\n  if(b.id==='cp'){var t=S.subs.map(function(s){return s.email}).join(', ');try{await navigator.clipboard.writeText(t);toast('E-mails copiés')}catch(x){prompt('Copie :',t)}}\n  if(b.id==='csv'){var csv='email,date\\n'+S.subs.map(function(s){return s.email+','+(s.d||'')}).join('\\n');var u=URL.createObjectURL(new Blob([csv],{type:'text/csv'})),a=document.createElement('a');a.href=u;a.download='abonnes-amkulel.csv';document.body.appendChild(a);a.click();a.remove();setTimeout(function(){URL.revokeObjectURL(u)},3000)}\n  var x=b.getAttribute('data-x');\n  if(x!==null){var s=S.subs[+x];if(await ask('Retirer '+s.email+' de la liste ?','Retirer',true)){try{await api('subscribers','DELETE',{email:s.email});toast('Retiré');renderNL()}catch(er){toast('Échec',true)}}}\n});\n\n/* ---------- connexion ---------- */\nasync function load(){\n  var r=await api('content');\n  if(!r.content){r=await api('import','POST',{})}\n  S.base=r.content.v||0;S.raw=deepU(r.content);\n  ORDER.forEach(function(k){if(!S.raw[k])S.raw[k]=[]});\n  show('app');render();\n}\n$('#lf').addEventListener('submit',async function(e){\n  e.preventDefault();var b=$('#lgo'),er=$('#lerr');er.textContent='';b.disabled=true;\n  try{await api('login','POST',{password:$('#pw').value});$('#pw').value='';show('boot');await load()}\n  catch(x){if(x.status===429)er.textContent='Trop d\\'essais. Réessaie dans un quart d\\'heure.';else if(x.status===401)er.textContent='Mot de passe incorrect.';else if(!x.cfg&&!x.auth)er.textContent='Connexion impossible. Réessaie.';if(!x.cfg)show('login')}\n  b.disabled=false;\n});\n$('#out').onclick=async function(){try{await api('logout','POST',{})}catch(e){}S.raw=null;show('login')};\nwindow.addEventListener('beforeunload',function(e){if(F&&F.dirty){e.preventDefault();e.returnValue=''}});\n(async function(){\n  try{await api('me');await load()}\n  catch(e){if(e.auth)show('login');else if(!e.cfg){show('boot');$('#boot').innerHTML='<p class=\"empty\">Impossible de joindre le site. Vérifie ta connexion.</p>'}}\n})();\n</script>\n</body>\n</html>\n";

const CK = 'site:content';
const CB = 'site:backup';
const SPECIAL = /^(site:|img:|rl:)/;
const DATA_RE = /(<script type="application\/json" id="data">)([\s\S]*?)(<\/script>)/;
const LOGO_RE = /<div class="logo"><img src="data:image\/jpeg;base64,([^"]+)"/;

const E = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const unE = s => String(s ?? '').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&');
const safe = s => E(unE(s));
const sl = t => String(t).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const fd = d => new Date(d + 'T12:00:00Z').toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
const b64bytes = b => Uint8Array.from(atob(b), c => c.charCodeAt(0));
const b64u = buf => btoa(String.fromCharCode(...new Uint8Array(buf))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const json = (o, st = 200, h = {}) => new Response(JSON.stringify(o), { status: st, headers: { 'content-type': 'application/json', 'cache-control': 'no-store', ...h } });

/* ------------------------------------------------------------------ contenus */

async function pageHtml(env, origin) {
  const r = await env.ASSETS.fetch(new Request(origin + '/'));
  return await r.text();
}
function seedOf(html) {
  const m = html.match(DATA_RE);
  try { return m ? JSON.parse(m[2]) : {}; } catch (_) { return {}; }
}
function fill(c) {
  c = c || {};
  return { v: c.v || 0, art: c.art || [], so: c.so || [], co: c.co || [], news: c.news || [], chr: c.chr || [] };
}
async function stored(env) {
  try { return await env.NEWSLETTER.get(CK, { type: 'json' }); } catch (_) { return null; }
}
async function getContent(env, html) {
  return fill((await stored(env)) || seedOf(html));
}
function inject(html, c) {
  const j = JSON.stringify(c).replace(/</g, '\\u003c').replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');
  return html.replace(DATA_RE, (_, a, __, b) => a + j + b);
}

/* ------------------------------------------------------- aperçus de partage */

function items(c) {
  const it = {};
  const add = (p, arr, f) => (arr || []).forEach(o => {
    const id = p + '-' + sl(o.t);
    if (!it[id]) it[id] = { t: o.t, img: o.img || '', d: f(o) };
  });
  add('artiste', c.art, o => o.d || '');
  add('sortie', c.so, o => [o.c, o.d].filter(Boolean).join(' · '));
  add('concert', c.co, o => [fd(o.d) + (o.h ? ' à ' + o.h : ''), [o.l, o.c].filter(Boolean).join(', ')].join(' · '));
  add('article', c.news, o => o.ex || '');
  add('chronique', c.chr, o => o.ex || '');
  it['mentions-legales'] = { t: 'Mentions légales', img: '', d: 'Informations légales du site AMKULEL.' };
  it['politique-de-confidentialite'] = { t: 'Politique de confidentialité', img: '', d: 'Comment AMKULEL utilise vos données.' };
  return it;
}
function ogImage(it, id, origin) {
  const i = it.img || '';
  if (i.startsWith('/img/')) return origin + i;
  if (i.startsWith('https://')) return i;
  if (i.startsWith('data:')) return origin + '/og/' + id + '.jpg';
  return origin + '/og/logo.jpg';
}
function pageFor(html, c, id, origin) {
  const base = inject(html, c);
  const it = items(c)[id];
  if (!it) return base;
  const title = safe(it.t) + ' — AMKULEL';
  const desc = safe(it.d || 'Actualités, artistes, sorties, concerts et chroniques du Rap Pulaar.');
  const url = E(origin + '/p/' + id);
  return base
    .replace(/<title>[^<]*<\/title>/, () => '<title>' + title + '</title>')
    .replace(/<meta name="description" content="[^"]*">/, () => '<meta name="description" content="' + desc + '">')
    .replace(/<meta property="og:title" content="[^"]*">/, () => '<meta property="og:title" content="' + title + '">')
    .replace(/<meta property="og:description" content="[^"]*">/, () => '<meta property="og:description" content="' + desc + '">')
    .replace('</head>', () => '<meta property="og:image" content="' + E(ogImage(it, id, origin)) + '">\n<meta property="og:url" content="' + url + '">\n<meta name="twitter:card" content="summary_large_image">\n</head>');
}

/* ----------------------------------------------------------- newsletter */

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
async function newsletter(req, env, u) {
  if (req.method !== 'POST') return json({ ok: false }, 405);
  const o = req.headers.get('origin');
  if (o && o !== u.origin) return json({ ok: false }, 403);
  if (!env.NEWSLETTER) return json({ ok: false, error: 'config' }, 503);
  let b;
  try { b = await req.json(); } catch (_) { return json({ ok: false }, 400); }
  if (b.website || typeof b.t !== 'number' || b.t < 1500) return json({ ok: true });
  const email = String(b.email || '').trim().toLowerCase();
  if (email.length > 254 || !EMAIL.test(email)) return json({ ok: false, error: 'email' }, 400);
  if (!(await env.NEWSLETTER.get(email))) {
    const d = new Date().toISOString();
    await env.NEWSLETTER.put(email, JSON.stringify({ d }), { metadata: { d } });
  }
  return json({ ok: true });
}

/* ------------------------------------------------------------ images */

async function image(env, p) {
  const m = p.match(/^\/img\/([a-f0-9]{16})\.jpg$/);
  if (!m || !env.NEWSLETTER) return new Response('Not found', { status: 404 });
  const buf = await env.NEWSLETTER.get('img:' + m[1], { type: 'arrayBuffer', cacheTtl: 3600 });
  if (!buf) return new Response('Not found', { status: 404 });
  return new Response(buf, { headers: { 'content-type': 'image/jpeg', 'cache-control': 'public, max-age=31536000, immutable', 'x-content-type-options': 'nosniff' } });
}

/* ------------------------------------------------- vérification des contenus */

const PAYS = ['Sénégal', 'Mauritanie', 'Diaspora'];
const SORTIES = ['Album', 'EP', 'Mixtape', 'Single', 'Clip'];
const PAYS_CONCERT = ['Sénégal', 'Mauritanie', 'International'];
const CATS = ['News', 'Rap Sénégal', 'Rap Mauritanie', 'Rap Pulaar', 'Artistes', 'Labels', 'Événements', 'Culture'];
const IMG_RE = /^(\/img\/[a-f0-9]{16}\.jpg|https:\/\/i\.ytimg\.com\/vi\/[\w-]{11}\/\w+\.jpg)$/;

const clean = (v, max) => String(v ?? '').replace(/\r/g, '').replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, '').trim().slice(0, max);
const T = (v, max = 200) => E(clean(v, max).replace(/\n+/g, ' '));
const paras = (a, max = 8000) => (Array.isArray(a) ? a : []).slice(0, 60).map(x => E(clean(x, max)).replace(/\n/g, '<br>')).filter(Boolean);
const lines = (a, max = 300) => (Array.isArray(a) ? a : []).slice(0, 80).map(x => T(x, max)).filter(Boolean);
const url = v => { v = clean(v, 600); return /^https?:\/\/[^\s"'<>]+$/i.test(v) ? E(v) : ''; };
const links = a => (Array.isArray(a) ? a : []).slice(0, 12).map(l => (Array.isArray(l) ? [T(l[0], 80), url(l[1])] : null)).filter(l => l && l[0] && l[1]);
const tels = a => (Array.isArray(a) ? a : []).slice(0, 6).map(x => (Array.isArray(x) ? [T(x[0], 40), clean(x[1], 20)] : null)).filter(x => x && x[0] && /^\+?\d{6,15}$/.test(x[1]));
const img = v => (IMG_RE.test(String(v || '')) ? String(v) : '');
const dateOk = v => /^\d{4}-\d{2}-\d{2}$/.test(v) && new Date(v + 'T12:00:00Z').toISOString().slice(0, 10) === v;
const sec = v => (Number.isInteger(v) && v >= 0 && v < 86400 ? v : null);

function normalize(raw) {
  const errs = [];
  const c = { art: [], so: [], co: [], news: [], chr: [] };
  const list = k => (Array.isArray(raw && raw[k]) ? raw[k].slice(0, 300) : []);
  let moment = false;

  list('art').forEach((o, n) => {
    const w = 'Artiste n°' + (n + 1);
    const t = T(o.t, 80), z = clean(o.z, 20), ci = T(o.c, 60);
    if (!t) return errs.push(w + ' : le nom est obligatoire.');
    if (!PAYS.includes(z)) return errs.push(w + ' (' + unE(t) + ') : le pays est invalide.');
    if (!ci) return errs.push(w + ' (' + unE(t) + ') : la ville est obligatoire.');
    const it = { t, z, c: ci, img: img(o.img), p: T(o.p, 80), d: T(o.d, 400), b: paras(o.b), lk: links(o.lk), k: 'Artistes' };
    if (o.tal) it.tal = 1;
    if (o.moment && !o.tal && !moment) { it.moment = 1; moment = true; }
    c.art.push(it);
  });

  list('so').forEach((o, n) => {
    const w = 'Sortie n°' + (n + 1);
    const t = T(o.t, 120), z = clean(o.z, 20), ar = T(o.c, 100), dt = clean(o.dt, 10);
    if (!t) return errs.push(w + ' : le titre est obligatoire.');
    if (!SORTIES.includes(z)) return errs.push(w + ' (' + unE(t) + ') : le type est invalide.');
    if (!ar) return errs.push(w + ' (' + unE(t) + ') : l’artiste est obligatoire.');
    if (!dateOk(dt)) return errs.push(w + ' (' + unE(t) + ') : la date est invalide.');
    const it = { t, z, c: ar, d: T(o.d, 400), img: img(o.img), dt, l: lines(o.l, 150), p: paras(o.p), u: url(o.u), n: 1, k: 'Sorties' };
    const yt = clean(o.yt, 20);
    if (/^[\w-]{11}$/.test(yt)) {
      it.yt = yt; it.v = 1;
      if (!it.img) it.img = 'https://i.ytimg.com/vi/' + yt + '/hqdefault.jpg';
      const s = sec(o.s), e = sec(o.e);
      if (s !== null && e !== null && e > s) { it.s = s; it.e = e; }
    }
    c.so.push(it);
  });

  list('co').forEach((o, n) => {
    const w = 'Concert n°' + (n + 1);
    const t = T(o.t, 140), dt = clean(o.d, 10), l = T(o.l, 140), ci = T(o.c, 60), z = clean(o.z, 20);
    if (!t) return errs.push(w + ' : le nom est obligatoire.');
    if (!dateOk(dt)) return errs.push(w + ' (' + unE(t) + ') : la date est invalide.');
    if (!l) return errs.push(w + ' (' + unE(t) + ') : le lieu est obligatoire.');
    if (!ci) return errs.push(w + ' (' + unE(t) + ') : la ville est obligatoire.');
    if (!PAYS_CONCERT.includes(z)) return errs.push(w + ' (' + unE(t) + ') : le pays est invalide.');
    c.co.push({ d: dt, t, a: T(o.a, 100), l, c: ci, z, o: T(o.o, 120), h: T(o.h, 20), p: lines(o.p, 150), tel: tels(o.tel), tk: url(o.tk), img: img(o.img), k: 'Concerts' });
  });

  list('news').forEach((o, n) => {
    const w = 'Article n°' + (n + 1);
    const t = T(o.t, 160), ca = clean(o.c, 30), dt = clean(o.dt, 10);
    if (!t) return errs.push(w + ' : le titre est obligatoire.');
    if (!CATS.includes(ca)) return errs.push(w + ' (' + unE(t) + ') : la catégorie est invalide.');
    if (!dateOk(dt)) return errs.push(w + ' (' + unE(t) + ') : la date est invalide.');
    const p = paras(o.p), ex = T(o.ex, 300) || T((Array.isArray(o.p) && o.p[0]) || '', 200);
    if (!p.length) return errs.push(w + ' (' + unE(t) + ') : le texte est obligatoire.');
    c.news.push({ t, c: ca, dt, a: T(o.a, 80) || 'La rédaction Amkulel', img: img(o.img), ex, p, ar: lines(o.ar, 80), lk: links(o.lk), k: 'Actualités' });
  });

  list('chr').forEach((o, n) => {
    const w = 'Chronique n°' + (n + 1);
    const t = T(o.t, 160), dt = clean(o.dt, 10);
    if (!t) return errs.push(w + ' : le titre est obligatoire.');
    if (!dateOk(dt)) return errs.push(w + ' (' + unE(t) + ') : la date est invalide.');
    const p = paras(o.p), ex = T(o.ex, 300) || T((Array.isArray(o.p) && o.p[0]) || '', 200);
    if (!p.length) return errs.push(w + ' (' + unE(t) + ') : le texte est obligatoire.');
    c.chr.push({ t, dt, a: T(o.a, 80) || 'La rédaction Amkulel', img: img(o.img), ex, p, k: 'Chroniques' });
  });

  for (const k of Object.keys(c)) c[k].forEach((o, i) => { o.i = i; });
  if (JSON.stringify(c).length > 2000000) errs.push('Le contenu est trop volumineux.');
  return { c, errs };
}

async function sha16(bytes) {
  const d = await crypto.subtle.digest('SHA-256', bytes);
  return [...new Uint8Array(d)].slice(0, 8).map(b => b.toString(16).padStart(2, '0')).join('');
}
async function importSeed(env, origin) {
  const html = await pageHtml(env, origin);
  const seed = fill(seedOf(html));
  const cache = new Map();
  const conv = async v => {
    if (typeof v !== 'string' || !v.startsWith('data:image/')) return v;
    const bytes = b64bytes(v.split(',')[1] || '');
    if (bytes[0] !== 0xff || bytes[1] !== 0xd8) return '';
    const h = await sha16(bytes);
    if (!cache.has(h)) { await env.NEWSLETTER.put('img:' + h, bytes); cache.set(h, '/img/' + h + '.jpg'); }
    return cache.get(h);
  };
  for (const k of ['art', 'so', 'co', 'news', 'chr']) for (const o of seed[k]) o.img = await conv(o.img);
  const { c, errs } = normalize(seed);
  if (errs.length) throw new Error('import : ' + errs.join(' | '));
  c.v = 1;
  await env.NEWSLETTER.put(CK, JSON.stringify(c));
  return c;
}

/* ---------------------------------------------------------- administration */

async function hmac(key, data) {
  const k = await crypto.subtle.importKey('raw', new TextEncoder().encode(key), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return b64u(await crypto.subtle.sign('HMAC', k, new TextEncoder().encode(data)));
}
function same(a, b) {
  a = String(a); b = String(b);
  let r = a.length ^ b.length;
  for (let i = 0; i < Math.max(a.length, b.length); i++) r |= (a.charCodeAt(i) || 0) ^ (b.charCodeAt(i) || 0);
  return r === 0;
}
const pwOk = env => typeof env.ADMIN_PASSWORD === 'string' && env.ADMIN_PASSWORD.length >= 8;
async function mintToken(env) {
  const p = 'v1.' + (Date.now() + 30 * 864e5);
  return p + '.' + (await hmac(env.ADMIN_PASSWORD + '|session', p));
}
async function tokenOk(env, tok) {
  const parts = String(tok || '').split('.');
  if (parts.length !== 3 || parts[0] !== 'v1' || !(+parts[1] > Date.now())) return false;
  return same(await hmac(env.ADMIN_PASSWORD + '|session', 'v1.' + parts[1]), parts[2]);
}
function cookieOf(req, name) {
  const m = (req.headers.get('cookie') || '').match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
  return m ? m[1] : '';
}
const cookie = (v, u, age) => 'adm=' + v + '; HttpOnly; SameSite=Strict; Path=/api/admin; Max-Age=' + age + (u.protocol === 'https:' ? '; Secure' : '');

async function login(req, env, u) {
  const rk = 'rl:' + (req.headers.get('cf-connecting-ip') || 'x');
  const n = parseInt((await env.NEWSLETTER.get(rk)) || '0', 10) || 0;
  if (n >= 8) return json({ ok: false, error: 'locked' }, 429);
  let b;
  try { b = await req.json(); } catch (_) { return json({ ok: false }, 400); }
  const good = same(await hmac('amkulel-login', String(b.password || '')), await hmac('amkulel-login', env.ADMIN_PASSWORD));
  if (!good) {
    await env.NEWSLETTER.put(rk, String(n + 1), { expirationTtl: 900 });
    return json({ ok: false, error: 'bad' }, 401);
  }
  if (n) await env.NEWSLETTER.delete(rk);
  return json({ ok: true }, 200, { 'set-cookie': cookie(await mintToken(env), u, 2592000) });
}

async function admin(req, env, u) {
  const p = u.pathname, m = req.method;
  if (!env.NEWSLETTER) return json({ ok: false, error: 'config' }, 503);
  if (!pwOk(env)) return json({ ok: false, error: 'nopassword' }, 503);
  if (m !== 'GET' && m !== 'HEAD') {
    const o = req.headers.get('origin');
    if (!o || o !== u.origin) return json({ ok: false, error: 'origin' }, 403);
  }
  if (p === '/api/admin/login' && m === 'POST') return login(req, env, u);
  if (p === '/api/admin/logout' && m === 'POST') return json({ ok: true }, 200, { 'set-cookie': cookie('', u, 0) });
  if (!(await tokenOk(env, cookieOf(req, 'adm')))) return json({ ok: false, error: 'auth' }, 401);

  if (p === '/api/admin/me') return json({ ok: true });

  if (p === '/api/admin/content' && m === 'GET') return json({ ok: true, content: await stored(env) });

  if (p === '/api/admin/import' && m === 'POST') {
    const cur = await stored(env);
    if (cur) return json({ ok: true, content: cur });
    return json({ ok: true, content: await importSeed(env, u.origin) });
  }

  if (p === '/api/admin/content' && m === 'PUT') {
    let b;
    try { b = await req.json(); } catch (_) { return json({ ok: false, error: 'json' }, 400); }
    const cur = await stored(env);
    const curV = cur ? cur.v || 0 : 0;
    if ((b.base | 0) !== curV) return json({ ok: false, error: 'stale' }, 409);
    const { c, errs } = normalize(b.content);
    if (errs.length) return json({ ok: false, error: 'invalid', detail: errs.slice(0, 8) }, 400);
    c.v = curV + 1;
    if (cur) await env.NEWSLETTER.put(CB, JSON.stringify(cur));
    await env.NEWSLETTER.put(CK, JSON.stringify(c));
    return json({ ok: true, content: c });
  }

  if (p === '/api/admin/upload' && m === 'POST') {
    if (+req.headers.get('content-length') > 4000000) return json({ ok: false, error: 'size' }, 413);
    const buf = new Uint8Array(await req.arrayBuffer());
    if (buf.length < 500 || buf.length > 3600000) return json({ ok: false, error: 'size' }, 413);
    if (buf[0] !== 0xff || buf[1] !== 0xd8 || buf[2] !== 0xff) return json({ ok: false, error: 'type' }, 415);
    const id = [...crypto.getRandomValues(new Uint8Array(8))].map(x => x.toString(16).padStart(2, '0')).join('');
    await env.NEWSLETTER.put('img:' + id, buf);
    return json({ ok: true, url: '/img/' + id + '.jpg' });
  }

  if (p === '/api/admin/subscribers') {
    if (m === 'GET') {
      const out = [];
      let cursor;
      for (let i = 0; i < 5; i++) {
        const r = await env.NEWSLETTER.list({ cursor });
        for (const k of r.keys) if (!SPECIAL.test(k.name) && k.name.includes('@')) out.push({ email: k.name, d: (k.metadata && k.metadata.d) || '' });
        if (r.list_complete) break;
        cursor = r.cursor;
      }
      return json({ ok: true, subscribers: out });
    }
    if (m === 'DELETE') {
      let b = {};
      try { b = await req.json(); } catch (_) { /* vide */ }
      const e = String(b.email || '');
      if (!e.includes('@') || SPECIAL.test(e)) return json({ ok: false }, 400);
      await env.NEWSLETTER.delete(e);
      return json({ ok: true });
    }
  }
  return json({ ok: false, error: 'notfound' }, 404);
}

function adminPage() {
  return new Response(ADMIN_HTML, {
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'no-store',
      'x-robots-tag': 'noindex, nofollow',
      'referrer-policy': 'no-referrer',
      'x-frame-options': 'DENY',
      'x-content-type-options': 'nosniff',
      'content-security-policy': "default-src 'none'; img-src 'self' blob: https://i.ytimg.com; style-src 'unsafe-inline'; script-src 'unsafe-inline'; connect-src 'self'; frame-ancestors 'none'; base-uri 'none'; form-action 'none'",
    },
  });
}

/* ------------------------------------------------------------------ routes */

async function route(req, env) {
  const u = new URL(req.url);
  const p = u.pathname;
  if (p === '/api/newsletter') return newsletter(req, env, u);
  if (p.startsWith('/api/admin/')) return admin(req, env, u);
  if (p === '/admin' || p === '/admin/') return adminPage();
  if (p.startsWith('/img/')) return image(env, p);
  if (p === '/' || p.startsWith('/p/') || p.startsWith('/og/')) {
    const html = await pageHtml(env, u.origin);
    const c = await getContent(env, html);
    if (p.startsWith('/og/')) {
      const id = decodeURIComponent(p.slice(4)).replace(/\.jpg$/, '');
      let bytes = null;
      if (id === 'logo') { const m = html.match(LOGO_RE); if (m) bytes = b64bytes(m[1]); }
      else { const it = items(c)[id]; if (it && it.img.startsWith('data:image/')) bytes = b64bytes(it.img.split(',')[1] || ''); }
      if (!bytes) return new Response('Not found', { status: 404 });
      return new Response(bytes, { headers: { 'content-type': 'image/jpeg', 'cache-control': 'public, max-age=86400' } });
    }
    const body = p === '/' ? inject(html, c) : pageFor(html, c, decodeURIComponent(p.slice(3)).replace(/\/$/, ''), u.origin);
    return new Response(body, { headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'public, max-age=0, must-revalidate' } });
  }
  return env.ASSETS.fetch(req);
}

export default {
  async fetch(req, env) {
    try {
      return await route(req, env);
    } catch (err) {
      console.error(err && err.stack ? err.stack : err);
      return env.ASSETS.fetch(req);
    }
  },
};
