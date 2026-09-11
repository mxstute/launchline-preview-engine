import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
export const ROOT=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
export const esc=(x='')=>String(x).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const svg=(p,cls='')=>`<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;
const icons={
 ARROW:svg('<path d="M4 12h15M13 6l6 6-6 6"/>'),
 DOWN_ARROW:svg('<path d="M12 4v15M6 13l6 6 6-6"/>'),
 PHONE_ICON:svg('<path d="M5 3h4l2 5-3 2a16 16 0 0 0 6 6l2-3 5 2v4c0 1.1-.9 2-2 2C10.2 21 3 13.8 3 5c0-1.1.9-2 2-2Z"/>'),
 DROP_ICON:svg('<path d="M12 2S5 10 5 15a7 7 0 0 0 14 0c0-5-7-13-7-13Z"/><path d="M8 15a4 4 0 0 0 4 4"/>'),
 TOOL_ICON:svg('<path d="m14 6 4 4M4 20l8-8M10 5l3-3 9 9-3 3-9-9ZM3 21l-1-1 9-9 2 2-10 8Z"/>'),
 PIN_ICON:svg('<path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 0 1 14 0Z"/><circle cx="12" cy="9" r="2.2"/>'),
 BRAND_ICON:svg('<path d="M2 8c4-7 7 7 11 0s7 7 9 0M2 14c4-7 7 7 11 0s7 7 9 0M2 20c4-7 7 7 11 0s7 7 9 0"/>','brand-icon')
};
const bad=/\b(lorem ipsum|customer support|core service|rating not yet enriched|strongest service-business fit|hero media area|placeholder)\b/i;
export function validate(d){
 const fail=m=>{throw new Error(`${d?.slug||'record'}: ${m}`)};
 for(const k of ['slug','businessName','city','phone','phoneDisplay','template','heroDescription','heroLine1','heroLine2'])if(!d[k])fail(`Missing ${k}`);
 if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(d.slug))fail('Invalid slug');
 if(d.template!=='pool-editorial')fail('Template is not implemented; do not fall back to a generic shell');
 if(!/^\+1\d{10}$/.test(d.phone))fail('A verified US contact phone is required');
 if(!d.sources?.length||d.sources.some(s=>!s.url?.startsWith('https://')||!s.supports))fail('Source evidence is required');
 if(!d.services?.length||d.services.some(s=>!s.title||!s.text||!Number.isInteger(s.sourceIndex)||!d.sources[s.sourceIndex]))fail('Every service needs copy and a source reference');
 for(const a of d.assets||[]){if(a.type!=='stock'&&a.type!=='owner-provided')fail('Unknown media provenance');if(!a.license||!a.alt||!/^[a-z0-9-]+\.webp$/.test(a.file))fail('Missing media metadata');const u=new URL(a.url);if(u.protocol!=='https:'||!['images.unsplash.com'].includes(u.hostname))fail('Media host not allowlisted');}
 if(!['hero','water','lifestyle'].every(k=>d.assets?.some(a=>a.key===k)))fail('Three curated, sourced images required');
 for(const r of d.reviews||[]){if(!r.text||!r.author||!r.url?.startsWith('https://')||!r.date||!r.platform)fail('Unattributed review');}
 if(!d.concerns?.length||!d.faqs?.length)fail('Missing curated customer content');
 for(const field of [d.heroDescription,...d.services.map(s=>s.text)])if(bad.test(field))fail('Non-customer-facing filler detected');
 return true;
}
export function renderPool(d){
 validate(d);
 const asset=k=>d.assets.find(a=>a.key===k);
 const assetPath=k=>`/assets/${asset(k).file}`;
 const slots={...icons,BUSINESS:esc(d.businessName),BRAND_LINE:esc(d.brandLine),BRAND_DESCRIPTOR:esc(d.brandDescriptor),CITY:esc(d.city),PHONE:esc(d.phone),PHONE_DISPLAY:esc(d.phoneDisplay),SPECIALTY:esc(d.specialty),HERO_LINE_1:esc(d.heroLine1),HERO_LINE_2:esc(d.heroLine2),HERO_DESCRIPTION:esc(d.heroDescription),HERO_SRC:assetPath('hero'),HERO_ORIGINAL:esc(asset('hero').url),HERO_ALT:esc(asset('hero').alt),LIFESTYLE_SRC:assetPath('lifestyle'),LIFESTYLE_ALT:esc(asset('lifestyle').alt),CONCERN_TITLE:esc(d.concerns[0].title),CONCERN_TEXT:esc(d.concerns[0].text),CONCERN_JSON:JSON.stringify(d.concerns).replace(/</g,'\\u003c')};
 slots.SERVICE_CARDS=d.services.map((s,i)=>`<article class="service-card reveal"><a href="#contact"><div class="service-photo"><img src="${assetPath(s.asset)}" width="700" height="560" alt="${esc(asset(s.asset).alt)}" loading="lazy"><span class="service-num">0${i+1}</span></div><div class="service-info"><h3>${esc(s.title)}${icons.ARROW}</h3><p>${esc(s.text)}</p></div></a></article>`).join('');
 slots.REVIEW_CARDS=(d.reviews||[]).map(r=>`<article class="review-card reveal"><div class="quote-symbol" aria-hidden="true">“</div><blockquote>${esc(r.text)}</blockquote><div class="review-source"><div class="review-person"><span class="avatar" aria-hidden="true">${esc(r.author.slice(0,1))}</span><div><strong>${esc(r.author)}</strong><small>${esc(r.platform)} · ${esc(r.dateLabel)}</small></div></div><a href="${esc(r.url)}" target="_blank" rel="noopener noreferrer">Read original ↗</a></div></article>`).join('');
 slots.FAQ_ITEMS=d.faqs.map(q=>`<details><summary>${esc(q.question)}</summary><p>${esc(q.answer)}</p></details>`).join('');
 slots.CONCERN_BUTTONS=d.concerns.map((c,i)=>`<button type="button" data-concern="${i}" aria-pressed="${i===0}">${esc(c.label)}</button>`).join('');
 const template=fs.readFileSync(path.join(ROOT,'templates/v2/pool.html'),'utf8');
 const html=template.replace(/\{\{([A-Z_0-9]+)\}\}/g,(_,key)=>{if(!(key in slots))throw new Error(`Missing template slot ${key}`);return slots[key]});
 if(/\{\{[A-Z_]+\}\}/.test(html)||bad.test(html.replace(/<script[^>]*>[\s\S]*?<\/script>/g,'')))throw new Error('Unresolved/filler content');
 return html;
}
