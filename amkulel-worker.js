const sl=t=>t.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const esc=t=>String(t).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;');
const fd=d=>new Date(d+'T12:00:00Z').toLocaleDateString('fr-FR',{day:'numeric',month:'long',year:'numeric',timeZone:'UTC'});
let cache;
async function load(env,origin){
  if(cache)return cache;
  const r=await env.ASSETS.fetch(new Request(origin+'/'));
  const html=await r.text();
  const m=html.match(/<script type="application\/json" id="data">([\s\S]*?)<\/script>/);
  const D=m?JSON.parse(m[1]):{art:[],news:[],so:[],co:[]};
  const items={};
  const add=(p,arr,f)=>arr.forEach(o=>{items[p+'-'+sl(o.t)]={t:o.t,img:o.img,d:f(o)}});
  add('artiste',D.art,o=>o.d);
  add('sortie',D.so,o=>o.c+' · '+o.d);
  add('concert',D.co,o=>fd(o.d)+' · '+o.l+', '+o.c);
  add('article',D.news,o=>o.ex);
  return(cache={html,items});
}
const EMAIL=/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const json=(o,st=200)=>new Response(JSON.stringify(o),{status:st,headers:{'content-type':'application/json','cache-control':'no-store'}});
async function newsletter(req,env,u){
  if(req.method!=='POST')return json({ok:false},405);
  const o=req.headers.get('origin');
  if(o&&o!==u.origin)return json({ok:false},403);
  if(!env.NEWSLETTER)return json({ok:false,error:'config'},503);
  let b;try{b=await req.json()}catch(_){return json({ok:false},400)}
  if(b.website||typeof b.t!=='number'||b.t<1500)return json({ok:true});
  const email=String(b.email||'').trim().toLowerCase();
  if(email.length>254||!EMAIL.test(email))return json({ok:false,error:'email'},400);
  if(!(await env.NEWSLETTER.get(email)))await env.NEWSLETTER.put(email,JSON.stringify({d:new Date().toISOString()}));
  return json({ok:true});
}
export default{
  async fetch(req,env){
    const u=new URL(req.url);
    if(u.pathname==='/api/newsletter')return newsletter(req,env,u);
    const {html,items}=await load(env,u.origin);
    if(u.pathname.startsWith('/og/')){
      const id=decodeURIComponent(u.pathname.slice(4)).replace(/\.jpg$/,'');
      const it=items[id];
      if(!it||!it.img||!it.img.startsWith('data:'))return new Response('Not found',{status:404});
      const bin=Uint8Array.from(atob(it.img.split(',')[1]),c=>c.charCodeAt(0));
      return new Response(bin,{headers:{'content-type':'image/jpeg','cache-control':'public, max-age=86400'}});
    }
    if(u.pathname.startsWith('/p/')){
      const id=decodeURIComponent(u.pathname.slice(3)).replace(/\/$/,'');
      const it=items[id];
      let out=html;
      if(it){
        const title=esc(it.t+' — AMKULEL'),desc=esc(it.d||''),url=esc(u.origin+'/p/'+id);
        const img=it.img&&it.img.startsWith('http')?it.img:u.origin+'/og/'+id+'.jpg';
        out=out
          .replace(/<title>[^<]*<\/title>/,()=>'<title>'+title+'</title>')
          .replace(/<meta name="description" content="[^"]*">/,()=>'<meta name="description" content="'+desc+'">')
          .replace(/<meta property="og:title" content="[^"]*">/,()=>'<meta property="og:title" content="'+title+'">')
          .replace(/<meta property="og:description" content="[^"]*">/,()=>'<meta property="og:description" content="'+desc+'">')
          .replace('</head>',()=>'<meta property="og:image" content="'+esc(img)+'">\n<meta property="og:url" content="'+url+'">\n<meta name="twitter:card" content="summary_large_image">\n</head>');
      }
      return new Response(out,{headers:{'content-type':'text/html; charset=utf-8','cache-control':'public, max-age=300'}});
    }
    return env.ASSETS.fetch(req);
  }
};
