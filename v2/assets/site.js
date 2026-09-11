'use strict';
const header = document.querySelector('.site-header');
const menuButton = document.getElementById('menu-toggle');
const navigation = document.getElementById('navigation');
function closeMenu(){ navigation?.classList.remove('open'); menuButton?.setAttribute('aria-expanded','false'); menuButton?.setAttribute('aria-label','Open menu'); }
menuButton?.addEventListener('click',()=>{const open=menuButton.getAttribute('aria-expanded')!=='true'; menuButton.setAttribute('aria-expanded',String(open)); menuButton.setAttribute('aria-label',open?'Close menu':'Open menu'); navigation.classList.toggle('open',open);});
navigation?.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeMenu();}});
let scheduled=false;
window.addEventListener('scroll',()=>{if(scheduled)return; scheduled=true; requestAnimationFrame(()=>{header?.classList.toggle('scrolled',window.scrollY>12);scheduled=false;});},{passive:true});
const tabs=[...document.querySelectorAll('[role="tab"]')];
function selectTab(tab,focus=false){
 for(const item of tabs){const active=item===tab;item.setAttribute('aria-selected',String(active));item.tabIndex=active?0:-1;item.classList.toggle('active',active);const panel=document.getElementById(item.getAttribute('aria-controls'));if(panel)panel.hidden=!active;}
 if(focus)tab.focus();
}
for(const tab of tabs){tab.addEventListener('click',()=>selectTab(tab));tab.addEventListener('keydown',event=>{const index=tabs.indexOf(tab);let next;if(event.key==='ArrowDown'||event.key==='ArrowRight')next=(index+1)%tabs.length;if(event.key==='ArrowUp'||event.key==='ArrowLeft')next=(index+tabs.length-1)%tabs.length;if(event.key==='Home')next=0;if(event.key==='End')next=tabs.length-1;if(next!==undefined){event.preventDefault();selectTab(tabs[next],true);}});}
// The concern chooser does not collect, persist, track, or transmit information.
const concerns=[...document.querySelectorAll('.concern')];
for(const choice of concerns)choice.addEventListener('click',()=>{for(const c of concerns)c.setAttribute('aria-pressed',String(c===choice));const message=document.getElementById('concern-message');if(message)message.textContent=`Ask us about ${choice.dataset.concern}.`;});
// Only enhance motion when supported; content remains visible with JS disabled.
if('IntersectionObserver' in window&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches){
 document.documentElement.classList.add('js-motion');
 const observer=new IntersectionObserver(entries=>{for(const entry of entries){if(entry.isIntersecting){entry.target.classList.add('in-view');observer.unobserve(entry.target);}}},{threshold:.08,rootMargin:'0px 0px 40px 0px'});
 document.querySelectorAll('.reveal').forEach(element=>observer.observe(element));
}
