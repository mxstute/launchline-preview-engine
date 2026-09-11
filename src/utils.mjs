export function esc(v='') {
  return String(v).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
export function slugify(v='business') {
  return String(v).toLowerCase().trim().replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'') || 'business';
}
export function cleanPhone(v='') { return String(v).trim(); }
export function first(arr, n=3) { return Array.isArray(arr) ? arr.filter(Boolean).slice(0,n) : []; }
export function currency(v){ return v==null?'':new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(v); }
