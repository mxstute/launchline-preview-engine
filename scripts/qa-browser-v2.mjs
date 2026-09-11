// Development-only browser QA. Requires Playwright installed in the QA environment.
import fs from 'node:fs';
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE || 'playwright');
const url=process.env.QA_URL || 'http://127.0.0.1:8877/blue-magic-pools/';
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
const report=[];
try {
 for(const [width,height] of [[1440,1000],[1024,800],[768,1024],[390,844],[360,800]]) {
  const page=await browser.newPage({viewport:{width,height}});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(url,{waitUntil:'networkidle'});await page.evaluate(()=>document.fonts.ready);
  await page.locator('.motion-control').click();
  const motionWorks=await page.locator('.motion-control').getAttribute('aria-pressed')==='true';
  for(let y=0;y<await page.evaluate(()=>document.body.scrollHeight);y+=650){await page.evaluate(y=>scrollTo({top:y,behavior:'instant'}),y);await page.waitForTimeout(100);}
  const layout=await page.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,imagesLoaded:[...document.images].every(i=>i.complete&&i.naturalWidth>0),brokenAnchors:[...document.querySelectorAll('a[href^="#"]')].filter(a=>!document.getElementById(a.getAttribute('href').slice(1))).length,forms:document.forms.length}));
  await page.locator('[data-concern="1"]').click();const selectorWorks=(await page.locator('#concern-title').textContent()).includes('guesswork');
  await page.locator('.faq summary').first().click();const faqWorks=await page.locator('.faq details').first().evaluate(e=>e.open);
  let menuWorks=true;if(width<=780){await page.evaluate(()=>scrollTo({top:0,behavior:'instant'}));await page.locator('.menu-toggle').click();menuWorks=await page.locator('#mobile-nav').isVisible();await page.keyboard.press('Escape');menuWorks=menuWorks&&!(await page.locator('#mobile-nav').isVisible());}
  await page.evaluate(()=>{document.documentElement.classList.remove('js-motion');document.body.classList.add('is-paused');scrollTo({top:0,behavior:'instant'});});
  if(process.env.QA_SCREENSHOTS && [1440,390].includes(width)){fs.mkdirSync(process.env.QA_SCREENSHOTS,{recursive:true});await page.screenshot({path:`${process.env.QA_SCREENSHOTS}/${width}-full.png`,fullPage:true});await page.screenshot({path:`${process.env.QA_SCREENSHOTS}/${width}-hero.png`});}
  const result={width,errors,motionWorks,selectorWorks,faqWorks,menuWorks,...layout};
  result.pass=!errors.length&&motionWorks&&selectorWorks&&faqWorks&&menuWorks&&layout.imagesLoaded&&!layout.brokenAnchors&&layout.width===layout.scrollWidth&&layout.forms===0;
  report.push(result);await page.close();
 }
 const reduced=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});
 await reduced.goto(url);const reducedPass=(await reduced.locator('.hero-media img').evaluate(e=>getComputedStyle(e).animationName))==='none'&&!(await reduced.locator('.motion-control').isVisible());
 report.push({reducedMotion:true,pass:reducedPass});await reduced.close();
} finally {await browser.close();}
fs.mkdirSync('.reports',{recursive:true});fs.writeFileSync('.reports/browser-qa.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));if(report.some(r=>!r.pass))process.exitCode=1;
