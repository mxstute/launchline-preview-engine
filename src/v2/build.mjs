import fs from 'node:fs';
import path from 'node:path';
import {ROOT,validate,renderPool,esc} from './render.mjs';
import {assetUrl,assetFile} from './assets.mjs';
const out=path.join(ROOT,'dist');
const input=path.join(ROOT,'data/curated');
const records=fs.readdirSync(input).filter(f=>f.endsWith('.json')).sort().map(f=>JSON.parse(fs.readFileSync(path.join(input,f),'utf8'))).filter(d=>d.publish===true);
if(!records.length)throw new Error('No curated records selected for publication');
records.forEach(validate);
const slugs=new Set();for(const d of records){if(slugs.has(d.slug))throw new Error('Duplicate slug');slugs.add(d.slug);}
// Rebuild only this known generated folder so withdrawn previews cannot persist.
if(path.dirname(out)!==ROOT||path.basename(out)!=='dist')throw new Error('Unsafe output path');
fs.rmSync(out,{recursive:true,force:true});
fs.mkdirSync(path.join(out,'assets'),{recursive:true});
for(const name of ['pool.css','pool.js'])fs.copyFileSync(path.join(ROOT,'templates/v2',name),path.join(out,'assets',name));
fs.appendFileSync(path.join(out,'assets/pool.css'),'\n'+fs.readFileSync(path.join(ROOT,'templates/v2/controls.css'),'utf8'));
fs.writeFileSync(path.join(out,'assets/pool-mark.svg'),'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><rect width="48" height="48" rx="12" fill="#133c3c"/><g stroke="#c3e3cf" fill="none" stroke-width="2"><path d="M8 17c6-10 10 10 16 0s10 10 16 0M8 25c6-10 10 10 16 0s10 10 16 0M8 33c6-10 10 10 16 0s10 10 16 0"/></g></svg>');
async function download(d,a){
 const destination=assetFile(out,d,a);fs.mkdirSync(path.dirname(destination),{recursive:true});
 for(let attempt=0;attempt<3;attempt++){
  try{
   const r=await fetch(a.url,{signal:AbortSignal.timeout(20000),redirect:'error'});
   if(!r.ok||!r.headers.get('content-type')?.startsWith('image/'))throw new Error(`Media HTTP ${r.status}`);
   const bytes=Buffer.from(await r.arrayBuffer());
   if(bytes.length<1000||bytes.length>4_000_000)throw new Error('Unexpected media size');
   fs.writeFileSync(destination,bytes);return;
  }catch(e){if(attempt===2)throw new Error(`Could not verify/download ${d.slug}/${a.file}: ${e.message}`);await new Promise(resolve=>setTimeout(resolve,500*(attempt+1)));}
 }
}
for(const d of records){
 for(const a of d.assets)await download(d,a);
 const dir=path.join(out,d.slug);fs.mkdirSync(dir,{recursive:true});
 let html=renderPool(d);
 for(const a of d.assets)html=html.replaceAll(`/assets/${a.file}`,assetUrl(d,a));
 fs.writeFileSync(path.join(dir,'index.html'),html);
 console.log(`Built v2: ${d.businessName}`);
}
const root=`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>Launchline · Design studies</title><style>body{margin:0;background:#f6f5f0;color:#133c3c;font:16px/1.6 system-ui}main{max-width:1000px;margin:7vh auto;padding:30px}small{letter-spacing:.17em}h1{font:60px/1.1 Georgia}a{color:inherit}article{display:grid;grid-template-columns:1fr 1fr;background:#fff;margin:30px 0;border:1px solid #d8dfd8}img{width:100%;height:300px;object-fit:cover}section{padding:35px}h2{font:34px Georgia}p{color:#617371}@media(max-width:640px){article{grid-template-columns:1fr}h1{font-size:44px}}</style></head><body><main><small>LAUNCHLINE DESIGN</small><h1>Made for a<br>better first impression.</h1><p>Independent website concepts. Only individually curated designs appear here.</p>${records.map(d=>`<article><a href="/${d.slug}/"><img src="${assetUrl(d,d.assets[0])}" alt="${esc(d.assets[0].alt)}"></a><section><small>${esc(d.city)}</small><h2>${esc(d.businessName)}</h2><p>${esc(d.specialty)}. Editorial design direction.</p><a href="/${d.slug}/">Explore the concept →</a></section></article>`).join('')}<p>Concepts are not the businesses’ official websites.</p></main></body></html>`;
fs.writeFileSync(path.join(out,'index.html'),root);
fs.writeFileSync(path.join(out,'404.html'),'<!doctype html><meta name="viewport" content="width=device-width"><meta name="robots" content="noindex,nofollow"><title>Design in progress · Launchline</title><style>body{font:18px/1.7 system-ui;background:#f6f5f0;color:#133c3c;max-width:580px;margin:15vh auto;padding:30px}a{color:inherit}</style><h1>This design is being updated.</h1><p>We are refining our website concepts individually. This link is not ready to share yet.</p><a href="/">View available concepts →</a>');
fs.writeFileSync(path.join(out,'robots.txt'),'User-agent: *\nDisallow: /\n');
fs.mkdirSync(path.join(ROOT,'.reports'),{recursive:true});
fs.writeFileSync(path.join(ROOT,'.reports/manifest-v2.json'),JSON.stringify(records.map(d=>({business:d.businessName,path:`/${d.slug}/`,outreachApproved:d.outreachApproved===true,sourceRecord:`data/curated/${d.slug}.json`})),null,2));
console.log(`${records.length} curated design(s); legacy output excluded; media checked and stored per business.`);
