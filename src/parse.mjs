import fs from 'node:fs';

function parseCsvLine(line){
  const out=[]; let cur=''; let q=false;
  for(let i=0;i<line.length;i++){
    const ch=line[i];
    if(ch==='"'){
      if(q && line[i+1]==='"'){cur+='"';i++;}
      else q=!q;
    } else if(ch===',' && !q){out.push(cur);cur='';}
    else cur+=ch;
  }
  out.push(cur); return out;
}

export function loadLeads(path){
  const raw=fs.readFileSync(path,'utf8');
  if(path.toLowerCase().endsWith('.json')){
    const data=JSON.parse(raw); return Array.isArray(data)?data:data.leads||[];
  }
  if(path.toLowerCase().endsWith('.csv')){
    const lines=raw.split(/\r?\n/).filter(Boolean);
    const headers=parseCsvLine(lines.shift()).map(h=>h.trim());
    return lines.map(line=>Object.fromEntries(parseCsvLine(line).map((v,i)=>[headers[i],v])));
  }
  throw new Error('Supported input types: .json, .csv');
}
