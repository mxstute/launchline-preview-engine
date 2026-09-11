(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const toggle = document.querySelector('.menu-toggle');
  const menu = document.querySelector('#mobile-nav');
  const closeMenu = () => {menu.hidden = true; toggle.setAttribute('aria-expanded', 'false'); toggle.setAttribute('aria-label', 'Open navigation');};
  toggle.addEventListener('click', () => {const open = menu.hidden; menu.hidden = !open; toggle.setAttribute('aria-expanded', String(open)); toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');});
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  document.addEventListener('keydown', e => {if(e.key === 'Escape'){closeMenu();}});
  const motion = document.querySelector('.motion-control');
  const motionText = motion.querySelector('span');
  const setPaused = paused => {document.body.classList.toggle('is-paused', paused);motion.setAttribute('aria-pressed', String(paused));motionText.textContent = paused ? 'Play motion' : 'Pause motion';};
  setPaused(reduced.matches);
  motion.addEventListener('click', () => {if(reduced.matches) return;setPaused(!document.body.classList.contains('is-paused'));});
  reduced.addEventListener?.('change', () => setPaused(reduced.matches));
  if(reduced.matches) motion.hidden = true;
  if('IntersectionObserver' in window && !reduced.matches){
    document.documentElement.classList.add('js-motion');
    const obs = new IntersectionObserver(entries => entries.forEach(e => {if(e.isIntersecting){e.target.classList.add('is-visible');obs.unobserve(e.target);}}), {threshold:.08});
    document.querySelectorAll('.reveal').forEach(el=>obs.observe(el));
  }
  const mobileCall = document.querySelector('.mobile-call');
  const updateCall = () => mobileCall.classList.toggle('visible', window.scrollY > 440);
  window.addEventListener('scroll',updateCall,{passive:true});updateCall();
  const cases = JSON.parse(document.getElementById('concern-data').textContent);
  document.querySelectorAll('[data-concern]').forEach(btn => btn.addEventListener('click',()=>{
    document.querySelectorAll('[data-concern]').forEach(b=>b.setAttribute('aria-pressed',String(b===btn)));
    const c=cases[btn.dataset.concern];
    document.querySelector('#concern-title').textContent=c.title;
    document.querySelector('#concern-text').textContent=c.text;
  }));
})();
