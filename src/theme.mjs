const themes = {
  'home services': {eyebrow:'LOCAL SERVICE • FAST RESPONSE', cta:'Request a Quote', hero:'Dependable local service, without the runaround.'},
  'barber/booking': {eyebrow:'LOCAL BARBERSHOP • EASY BOOKING', cta:'Book an Appointment', hero:'Fresh cuts. Easy booking. Local reputation.'},
  'beauty/booking': {eyebrow:'BEAUTY • APPOINTMENTS', cta:'Book an Appointment', hero:'Your next appointment should be one tap away.'},
  'restaurant': {eyebrow:'LOCAL FAVORITE • MENU • ORDERING', cta:'View Menu / Order', hero:'A local favorite, now easier to discover.'},
  'professional services': {eyebrow:'LOCAL PROFESSIONAL • APPOINTMENTS', cta:'Request an Appointment', hero:'Professional care with a simpler path to book.'},
  'local service': {eyebrow:'LOCAL BUSINESS • EASY CONTACT', cta:'Get Started', hero:'A better way for local customers to find and contact you.'},
  'local business': {eyebrow:'LOCAL BUSINESS', cta:'Contact Us', hero:'A stronger digital front door for the business.'}
};
export function getTheme(vertical='local business', overrideCta=''){
  const key=String(vertical).toLowerCase();
  const base=themes[key] || themes['local business'];
  return {...base, cta: overrideCta || base.cta};
}
