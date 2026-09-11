import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.dirname(here);
const out=path.join(root,'dist-v2');
execFileSync(process.execPath,[path.join(here,'build.mjs')],{cwd:root,stdio:'pipe'});
const html=fs.readFileSync(path.join(out,'blue-magic-pools/index.html'),'utf8');
const manifest=JSON.parse(fs.readFileSync(path.join(out,'manifest.json'),'utf8'));
const checks=[];
function check(name,fn){fn();checks.push(name);console.log(`PASS ${name}`);}
check('Only the selected first business is published',()=>assert.equal(manifest.length,1));
check('Not marked approved for outreach',()=>assert.equal(manifest[0].outreach_approved,false));
check('Customer-facing hero, not agency sales copy',()=>assert.match(html,/Keep the magic\./));
check('Three real image elements have dimensions',()=>assert.equal((html.match(/<img /g)||[]).length,3));
check('No generated fallback testimonials or internal observations',()=>assert.doesNotMatch(html,/strongest service-business fit|Preview strategy note|Conversion note|hero media \/|Rating not yet|663 reviews|Customer Support/));
check('No unresolved template tokens',()=>assert.doesNotMatch(html,/\{\{[A-Z_]+\}\}/));
check('One accessible h1',()=>assert.equal((html.match(/<h1\b/g)||[]).length,1));
check('Correct business phone on every telephone action',()=>{const links=[...html.matchAll(/href="tel:([^"]+)"/g)].map(m=>m[1]);assert.ok(links.length>=4);assert.ok(links.every(x=>x==='+17862512470'));});
check('No forms silently collecting prospect/customer data',()=>assert.doesNotMatch(html,/<form\b|<input\b|<iframe\b/));
check('Has mobile navigation and accessible service tabs',()=>{assert.match(html,/aria-controls="navigation"/);assert.equal((html.match(/role="tab"/g)||[]).length,3);assert.equal((html.match(/role="tabpanel"/g)||[]).length,3);});
check('No unverified star count or aggregate rating',()=>assert.doesNotMatch(html,/aggregateRating|663|665|618 reviews/));
check('Explicit concept and image provenance',()=>{assert.match(html,/Not the business's official website/);assert.match(html,/illustrative stock, not company projects/);});
check('Source-linked public review excerpts',()=>{assert.match(html,/nextdoor\.com/);assert.match(html,/local\.yahoo\.com/);assert.match(html,/yellowpages\.com/);});
check('Crawler directives and assets exist',()=>{assert.match(html,/noindex,nofollow/);for(const file of ['assets/pool.css','assets/site.js','assets/wave.svg','robots.txt','404.html'])assert.ok(fs.existsSync(path.join(out,file)));});
const data=JSON.parse(fs.readFileSync(path.join(here,'data/blue-magic-pools.json'),'utf8'));
const temp=fs.mkdtempSync(path.join(os.tmpdir(),'launchline-v2-test-'));
function rejection(name,edit){const candidate=structuredClone(data);edit(candidate);const filename=path.join(temp,'lead.json');fs.writeFileSync(filename,JSON.stringify(candidate));let rejected=false;try{execFileSync(process.execPath,[path.join(here,'build.mjs'),'--input',filename],{cwd:root,stdio:'pipe'});}catch{rejected=true;}check(name,()=>assert.ok(rejected));}
try{
 rejection('Reject missing source review',l=>{l.qa.sourceReviewComplete=false;});
 rejection('Reject unsafe media URL',l=>{l.media.hero.url='javascript:alert(1)';});
 rejection('Reject approval without visual/operator review',l=>{l.outreachApproved=true;});
 rejection('Reject unsupported niche instead of a generic fallback',l=>{l.template='barber';});
 rejection('Reject unsupported aggregate rating',l=>{l.rating=5;});
 rejection('Reject missing phone',l=>{l.phone='';});
 rejection('Reject long single-source review copying',l=>{l.reviews[0].text=Array(30).fill('word').join(' ');});
}finally{fs.rmSync(temp,{recursive:true,force:true});}
console.log(`\n${checks.length} v2 checks passed. Browser/device checks are separate.`);
