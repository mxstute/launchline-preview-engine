import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.dirname(here);
const out=path.join(root,'dist-v2');
const args=process.argv.slice(2);
const inputIndex=args.indexOf('--input');
const input=inputIndex<0?path.join(here,'data'):path.resolve(args[inputIndex+1]||'');
const esc=(value='')=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const required=(value,name)=>{if(typeof value!=='string'||!value.trim())throw new Error(`Missing ${name}`);return value;};
function https(value,name){required(value,name);const url=new URL(value);if(url.protocol!=='https:')throw new Error(`${name} must use HTTPS`);return value;}
function validate(lead){
 for(const key of ['slug','businessName','city','phone','phoneDisplay','description','template','reviewedOn'])required(lead[key],key);
 if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(lead.slug))throw new Error('Invalid slug');
 if(!/^\+1\d{10}$/.test(lead.phone))throw new Error('Phone must be a verified +1 number');
 if(!/^\d{4}-\d{2}-\d{2}$/.test(lead.reviewedOn))throw new Error('Review date required');
 if(!lead.qa?.contactMatched||!lead.qa?.sourceReviewComplete)throw new Error('Contact/source review gates must pass');
 https(lead.contactSource,'contactSource');
 if(lead.template!=='pool-specialist')throw new Error('Only the pool-specialist master has been implemented. Build and review another master before using it.');
 if(lead.slug!=='blue-magic-pools')throw new Error('This first art-directed master is not yet approved for another business. Add a reviewed template and record first.');
 if(!Array.isArray(lead.services)||lead.services.length!==3)throw new Error('Supply three source-backed specialty cards');
 const seenServices=new Set();for(const service of lead.services){for(const key of ['id','title','label','description','source'])required(service[key],`service.${key}`);https(service.source,'service source');if(!/^[a-z0-9-]+$/.test(service.id)||seenServices.has(service.id))throw new Error('Service IDs must be unique slugs');seenServices.add(service.id);}
 if(!Array.isArray(lead.reviews)||!lead.reviews.length)throw new Error('Supply reviewed customer excerpts or redesign the review section; do not generate testimonials');
 const wordsBySource=new Map();for(const review of lead.reviews){for(const key of ['text','author','platform','context','source'])required(review[key],`review.${key}`);https(review.source,'review source');const words=review.text.trim().split(/\s+/).length;wordsBySource.set(review.source,(wordsBySource.get(review.source)||0)+words);}
 for(const [source,words] of wordsBySource)if(words>25)throw new Error(`Review excerpts exceed 25 words from ${source}`);
 for(const role of ['hero','detail','lifestyle']){const media=lead.media?.[role];if(!media)throw new Error(`Missing ${role} media`);https(media.url,role);https(media.source,`${role} source`);required(media.alt,`${role} alt`);required(media.license,`${role} license`);if(!['stock','client-owned'].includes(media.kind))throw new Error('Label media origin explicitly');}
 if(lead.rating||lead.review_count)throw new Error('Review aggregates are not supported until a current matched source is added');
 if(lead.outreachApproved===true&&(!lead.qa.visualReviewComplete||!lead.qa.ownerApproved))throw new Error('Outreach approval requires visual review and operator approval');
}
const stat=fs.statSync(input);
const files=stat.isDirectory()?fs.readdirSync(input).filter(f=>f.endsWith('.json')).sort().map(f=>path.join(input,f)):[input];
if(!files.length)throw new Error('No reviewed lead records supplied');
if(files.length>10)throw new Error('Quality-first batches are limited to ten. Review one batch before adding another.');
const leads=files.map(f=>JSON.parse(fs.readFileSync(f,'utf8')));
leads.forEach(validate);
if(new Set(leads.map(l=>l.slug)).size!==leads.length)throw new Error('Duplicate business slug');
const rendered=[];
for(const lead of leads){
 const arrow='<svg aria-hidden="true"><use href="#i-arrow"/></svg>';
 const tabs=lead.services.map((s,i)=>`<button class="service-tab${i===0?' active':''}" id="tab-${esc(s.id)}" role="tab" type="button" aria-selected="${i===0}" aria-controls="panel-${esc(s.id)}" tabindex="${i===0?0:-1}"><span class="number">${String(i+1).padStart(2,'0')}</span><span class="tab-label">${esc(s.label)}</span>${arrow}</button>`).join('');
 const panels=lead.services.map((s,i)=>`<div class="service-panel" id="panel-${esc(s.id)}" role="tabpanel" aria-labelledby="tab-${esc(s.id)}" tabindex="0"${i===0?'':' hidden'}><h3>${esc(s.title)}</h3><p>${esc(s.description)}</p><a class="text-link" href="#contact">Talk about ${esc(s.label.toLowerCase())}${arrow}</a></div>`).join('');
 const reviews=lead.reviews.map(r=>`<article class="review-card reveal"><div class="review-mark" aria-hidden="true">“</div><blockquote>${esc(r.text)}</blockquote><div class="review-meta"><span class="avatar" aria-hidden="true">${esc(r.author.split(/\s+/).map(x=>x[0]).slice(0,2).join(''))}</span><div><strong>${esc(r.author)}</strong><small>${esc(r.context)}</small></div></div><a class="review-source" href="${esc(r.source)}" target="_blank" rel="noopener noreferrer">Read on ${esc(r.platform)} ↗</a></article>`).join('');
 const values={NAME:esc(lead.businessName),DESCRIPTION:esc(lead.description),PHONE:esc(lead.phone),PHONE_DISPLAY:esc(lead.phoneDisplay),CONTACT_SOURCE:esc(lead.contactSource),REVIEWED_ON:esc(lead.reviewedOn),HERO_URL:esc(lead.media.hero.url),HERO_MOBILE_URL:esc(lead.media.hero.mobileUrl||lead.media.hero.url),HERO_ALT:esc(lead.media.hero.alt),DETAIL_URL:esc(lead.media.detail.url),DETAIL_ALT:esc(lead.media.detail.alt),LIFESTYLE_URL:esc(lead.media.lifestyle.url),LIFESTYLE_ALT:esc(lead.media.lifestyle.alt),SERVICE_TABS:tabs,SERVICE_PANELS:panels,REVIEWS:reviews};
 let html=fs.readFileSync(path.join(here,'templates',`${lead.template}.html`),'utf8').replace(/\{\{([A-Z_]+)\}\}/g,(_,key)=>{if(!(key in values))throw new Error(`Unknown template field ${key}`);return values[key];});
 if(/\{\{|lorem ipsum|hero media \/|rating not yet enriched|strongest service-business fit|why this preview was built/i.test(html))throw new Error('Unresolved placeholder or internal sales note reached output');
 rendered.push({lead,html});
}
// Only v2's generated directory is recreated. v1/source/CRM data remain untouched.
fs.rmSync(out,{recursive:true,force:true});fs.mkdirSync(out,{recursive:true});
fs.cpSync(path.join(here,'assets'),path.join(out,'assets'),{recursive:true});
const manifest=[];
for(const {lead,html} of rendered){const directory=path.join(out,lead.slug);fs.mkdirSync(directory,{recursive:true});fs.writeFileSync(path.join(directory,'index.html'),html);manifest.push({business_name:lead.businessName,slug:lead.slug,path:`/${lead.slug}/`,version:2,status:lead.outreachApproved?'approved-for-outreach':'design-review',outreach_approved:lead.outreachApproved===true});console.log(`V2 ${lead.slug}: generated (${manifest.at(-1).status})`);}
const links=manifest.map(item=>`<a class="entry" href="${esc(item.path)}"><span>${esc(item.business_name)}<small>${esc(item.status.replaceAll('-',' '))} · Pool-specialist master</small></span><span>View website ↗</span></a>`).join('');
const shell=(title,body)=>`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>${esc(title)}</title><style>body{margin:0;padding:60px 24px;background:#f8f7f1;color:#133c3d;font:16px/1.7 system-ui}main{max-width:900px;margin:auto}h1{font:normal 54px/1.1 Georgia;margin:20px 0}p,small{color:#58706b}a{color:inherit}.entry{display:flex;justify-content:space-between;gap:25px;border-top:1px solid #d8e0d8;padding:28px 0;text-decoration:none}small{display:block;font-size:12px}li{margin:16px 0}code{overflow-wrap:anywhere}@media(max-width:600px){h1{font-size:38px}.entry{display:block}}</style></head><body><main>${body}</main></body></html>`;
fs.writeFileSync(path.join(out,'index.html'),shell('Launchline · Selected website concepts',`<small>LAUNCHLINE DESIGN / PREVIEW ENGINE V2</small><h1>One thoughtful website.<br>Then the next.</h1><p>Selected concepts for design review. The original batch is withheld from this release; it has not passed the new quality standard.</p>${links}<p>No messages are sent by this website. Each concept needs approval before outreach.</p>`));
const mediaLinks=leads.flatMap(lead=>Object.entries(lead.media).map(([role,asset])=>`<li><strong>${esc(lead.businessName)} · ${esc(role)}</strong><br>Illustrative ${esc(asset.kind)} photography. <a href="${esc(asset.url)}" target="_blank" rel="noopener noreferrer">View source image</a> · <a href="https://unsplash.com/license" target="_blank" rel="noopener noreferrer">Unsplash license</a></li>`)).join('');
fs.writeFileSync(path.join(out,'media-credits.html'),shell('Image credits · Launchline',`<a href="/">← Concepts</a><h1>Image credits</h1><p>Images demonstrate art direction only. They do not depict or certify work completed by the named business. Replace with owner-supplied project photography for a production client site.</p><ul>${mediaLinks}</ul>`));
fs.writeFileSync(path.join(out,'robots.txt'),'User-agent: *\nDisallow: /\n');
fs.writeFileSync(path.join(out,'manifest.json'),JSON.stringify(manifest,null,2));
fs.writeFileSync(path.join(out,'404.html'),shell('Concept unavailable',`<h1>This concept isn't available.</h1><p>It may still be under review. Please use the original link you were given or return to the concept index.</p><a href="/">Return to concepts</a>`));
console.log(`Built ${manifest.length} v2 concept(s). No emails, tracking, or CRM writes performed.`);
