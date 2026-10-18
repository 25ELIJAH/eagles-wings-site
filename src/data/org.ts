/**
 * Organisation content that grows over time. Everything here is empty or minimal on purpose:
 * add REAL entries only. Sections that need entries show an honest "coming soon" message,
 * or stay hidden (partners, social links, news teaser, newsletter) until there is something real to show.
 */

export const motto = ['Supporting Today', 'Empowering Tomorrow', 'Building Hope'];   // from the logo

/** People. Add board members, advisers and key volunteers (with their agreement). Photo: assets/photos/team-<slug>.jpg */
export interface Person { slug: string; name: string; role: string; bio?: string }
export const team: Person[] = [
  { slug: 'benard', name: 'Rev. Benard Kariuki Karanja', role: 'Founder & Executive Director' },
];

/** Milestones. Add real, dated events as the organisation grows. */
export const timeline: { when: string; text: string }[] = [
  { when: '2016', text: "Eagle's Wings Community Group is founded in Kenya by Rev. Benard Kariuki Karanja." },
  { when: '2026', text: 'Ten years of feeding children, mentoring young people and running medical camps.' },
];

/** Where gifts go. Fill in the real shares (for example "60%") once you have them.*/
export const giftUse: { label: string; text: string; share: string }[] = [
  { label: 'Feeding', text: 'Nutritious meals for vulnerable children and families.', share: '' },
  { label: 'Youth mentorship', text: 'Education, life-skills training and leadership programs.', share: '' },
  { label: 'Medical outreach', text: 'Free healthcare at community medical camps.', share: '' },
  { label: 'Running the organisation', text: 'Transport, supplies and the costs of keeping the work going.', share: '' },
];

/**
 * Ways to give. Fill in only what the organisation really has; each method appears on the Give page once it has details,
 * with a copy button. While everything is empty the page asks people to message or call instead.
 */
export const giving = {
  mpesaPaybill: { number: '', account: '' },   // e.g. { number: '123456', account: 'Your name' }
  mpesaTill: '',                                // Buy Goods till number
  bank: { name: '', accountName: '', accountNumber: '', branch: '' },
  note: '',                                     // e.g. 'We send a receipt for every gift.'
};

/** Reports and documents. Put the PDF in public/documents/ and add an entry, newest first. */
export interface Report { title: string; year: string; file: string; summary?: string }
export const reports: Report[] = [];

/** News. Newest first. Each entry gets its own page at /news/<slug>/. */
export interface Post { slug: string; title: string; date: string; summary: string; body: string[] }
export const news: Post[] = [];

/** Events. `date` as YYYY-MM-DD. Past events are hidden automatically. */
export interface EventItem { title: string; date: string; time?: string; place: string; description: string }
export const events: EventItem[] = [];

/** Supporters and partners. Only with their written permission. Logo file in public/images/partners/. */
export interface Partner { name: string; url?: string; logo?: string }
export const partners: Partner[] = [];

/** Social accounts. Add once they exist, e.g. { name: 'Facebook', url: 'https://facebook.com/...' }. Hidden while empty. */
export const social: { name: 'Facebook' | 'Instagram' | 'YouTube' | 'X' | 'TikTok'; url: string }[] = [];

/** Frequently asked questions. Every answer uses only facts already stated elsewhere on this site. */
export const faq: { q: string; a: string; html?: boolean }[] = [
  { q: "What is Eagle's Wings Community Group?", a: "We are a Kenyan non-profit founded in 2016 by Rev. Benard Kariuki Karanja. We feed vulnerable children and families, mentor young people, and run free medical camps in underserved communities." },
  { q: 'Where do you work?', a: 'We serve underserved communities in Kenya, East Africa.' },
  { q: 'How can I give?', a: 'Message or call us and we will share the details and send you a receipt. The steps are on the <a href="/give/">How to give</a> page.', html: true },
  { q: 'How is my gift used?', a: 'Gifts support our programs (feeding, youth mentorship and medical outreach) and the running of the organisation. If you want a gift used for a particular program, tell us when you give. Our <a href="/give/">How to give</a> page shows where gifts go.', html: true },
  { q: 'Will I get a receipt?', a: 'Yes. Tell us after you give and we will issue a receipt.' },
  { q: 'Will you ever ask for my M-Pesa PIN?', a: 'Never. We will never ask for your M-Pesa PIN, a bank password or a card number. If anyone claiming to be us asks, stop and contact us on the number on our <a href="/contact/">Contact</a> page.', html: true },
  { q: 'Can I volunteer?', a: 'Yes. We welcome cooks and servers, mentors, clinicians, drivers, photographers and people who can organise. Tell us what you can offer on the <a href="/contact/">Contact</a> page. Anyone who works with children follows our <a href="/child-protection/">Child Protection Policy</a> and may be asked for references and a Certificate of Good Conduct.', html: true },
  { q: 'How do you keep children safe?', a: 'Children come first in everything we do. Read our <a href="/child-protection/">Child Protection Policy</a> for how we behave around children, how photographs are handled, and how to raise a concern.', html: true },
  { q: 'What happens to my personal information?', a: 'We keep only what you choose to send us, and we never sell it. See our <a href="/privacy/">Privacy Policy</a>, which follows Kenya\'s Data Protection Act, 2019.', html: true },
  { q: 'Does this website use cookies?', a: 'We do not use tracking or advertising cookies. Details are in our <a href="/cookies/">Cookie Policy</a>.', html: true },
];
