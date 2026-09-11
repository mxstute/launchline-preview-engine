import fs from 'node:fs';
import path from 'node:path';
import {loadLeads} from './parse.mjs';
import {slugify} from './utils.mjs';
import {renderLead} from './render.mjs';

const args=process.argv.slice(2);
const get=(k,d='')=>{const i=args.indexOf(`--${k}`);return i>=0?args[i+1]:d};
const input=get('input','examples/leads.json');
const out=get('out','output');
const limit=Number(get('limit','9999'));
const offset=Number(get('offset','0'));
const baseUrl=get('base-url','');
const leads=loadLeads(input).slice(offset,offset+limit);
fs.mkdirSync(out,{recursive:true});
const manifest=[];
for(const lead of leads){
  const name=lead.business_name || lead.Business || lead.business;
  if(!name) continue;
  const slug=slugify(name);
  const dir=path.join(out,slug); fs.mkdirSync(dir,{recursive:true});
  fs.writeFileSync(path.join(dir,'index.html'),renderLead(lead));
  manifest.push({business_name:name,slug,preview_url:baseUrl?`${baseUrl.replace(/\/$/,'')}/${slug}/`:`/${slug}/`,phone:lead.phone||lead.Phone||'',email:lead.email||lead.Email||'',vertical:lead.preview_template||lead.Template||lead.vertical||lead.Vertical||''});
  console.log(`generated ${slug}`);
}
fs.writeFileSync(path.join(out,'manifest.json'),JSON.stringify(manifest,null,2));
fs.writeFileSync(path.join(out,'index.html'),`<!doctype html><meta charset="utf-8"><title>Preview Index</title><style>body{font-family:system-ui;padding:40px;background:#111;color:#fff}a{color:#9ddcff}li{margin:10px}</style><h1>Launchline Preview Index</h1><ul>${manifest.map(m=>`<li><a href=".${m.preview_url}">${m.business_name}</a></li>`).join('')}</ul>`);
console.log(`\n${manifest.length} previews written to ${out}`);
