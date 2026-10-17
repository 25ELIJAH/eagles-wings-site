/**
 * All site content lives here. Edit this file, not the page markup.
 * Facts (names, numbers, places, contact details) come from the owner.
 * The testimonials and founder quote are the owner's own words and are kept verbatim.
 */
export const site = {
  name: "Eagle's Wings Community Group",
  short: "Eagle's Wings",
  founded: 2026,
  location: 'Kenya, East Africa',
  /** Your registration line, shown in the footer, Terms, Privacy and FAQ. e.g. 'Registered Community Based Organisation No. CBO/1234/2026'. Leave '' to show a placeholder. */
  registration: '',
  phone: '+254 721 706 755',
  phoneTel: '+254721706755',
  whatsapp: 'https://wa.me/254721706755',
  email: 'info@eagleswingscommunity.org',
  builtBy: { name: 'ELIJAH JAMES', href: 'https://wa.me/254740840018' },
  /**
   * Optional: paste a Formspree / Getform / Web3Forms endpoint URL so forms submit
   * in the background. Leave '' to open the visitor's email app instead.
   */
  /** Optional https address of a newsletter sign-up service (MailerLite, Mailchimp, ...). The sign-up box is hidden until it is set. */
  newsletterEndpoint: (import.meta.env.PUBLIC_NEWSLETTER_ENDPOINT as string | undefined)?.trim() ?? '',
  formEndpoint: (import.meta.env.PUBLIC_FORM_ENDPOINT as string | undefined)?.trim() ?? '',
};

export const nav = [
  { href: '/', label: 'Home' },
  { href: '/about/', label: 'About' },
  { href: '/programs/', label: 'Programs' },
  { href: '/community/', label: 'Community' },
  { href: '/photos/', label: 'Photos' },
  { href: '/contact/', label: 'Contact' },
];

export const hero = {
  badge: 'Kenya · Since 2026',
  plain: 'Caring for',
  italic: 'families across Kenya.',
  text: "Eagle's Wings is a Kenyan non-profit that feeds children, mentors young people and runs free medical camps.",
  primary: { label: 'Give', href: '/give/' },
  secondary: { label: 'Volunteer or partner', href: '/contact/' },
  caption: 'Kenya, East Africa',
};

export const about = {
  no: '01',
  label: 'Who we are',
  title: 'Built to do ordinary, necessary things well.',
  text: "Eagle's Wings Community Group exists to bring lasting change to underserved communities, through service, care and practical support.",
  pillars: [
    { title: 'Vision', text: 'To reach out to every person with love and hope.' },
    { title: 'Mission', text: 'We can make it happen.' },
    { title: 'Values', text: 'Compassion, integrity, teamwork and excellence.' },
  ],
};

export const founder = {
  label: 'From our founder',
  quote:
    "I believe every child deserves opportunity, every family deserves hope, and every community deserves support. Eagle's Wings exists to bridge that gap. Together, we can build a future filled with dignity, purpose, and endless possibilities.",
  sign: 'Martin W.',
  name: 'Martin Wanjohi',
  role: 'Founder & Executive Director',
};

export const programs = {
  no: '02',
  label: 'Programs',
  title: 'Three things we do, every day.',
  items: [
    { id: 'feeding', title: 'Feeding', text: 'Nutritious meals for vulnerable children and families, so that no one in our community goes hungry.' },
    { id: 'mentorship', title: 'Youth mentorship', text: 'Education, life-skills training and leadership programs that help young people find their footing.' },
    { id: 'medical', title: 'Medical outreach', text: 'Free healthcare at medical camps we organise in communities that have little access to it.' },
  ],
};

export const testimonials = {
  no: '04',
  label: 'In their words',
  title: 'People we have worked with',
  items: [
    { quote: 'The feeding program helped my family during difficult times. My children can now go to school with full stomachs and a bright future.', name: 'Mary W.', role: 'Parent · Nairobi' },
    { quote: 'The mentorship program changed my life. I learned leadership skills and now I am confident about my future.', name: 'Brian A.', role: 'Youth participant' },
    { quote: 'The medical camp provided the treatment my father needed. We are so grateful for the care and support.', name: 'Grace N.', role: 'Community member' },
  ],
};

export const gallery = {
  no: '05',
  label: 'Photos',
  title: "Life at Eagle's Wings",
  text: 'Moments from our feeding days, medical camps and mentoring sessions.',
  items: [
    { caption: 'Feeding program', tag: 'Meals' },
    { caption: 'Community event', tag: 'Gathering' },
    { caption: 'Medical camp', tag: 'Health' },
    { caption: 'Youth mentorship', tag: 'Mentoring' },
    { caption: 'Community children', tag: 'Families' },
    { caption: 'Youth program', tag: 'Mentoring' },
    { caption: 'Medical outreach', tag: 'Health' },
    { caption: 'Community gathering', tag: 'Gathering' },
  ],
};

export const contact = {
  eyebrow: 'Contact',
  title: 'Talk to us',
  text: 'Questions about the programs, a visit, or a partnership? Reach out.',
  formTitle: 'Send a message',
  formText: "We'll reply as soon as we can.",
  thanks: 'Message sent.',
};

export const footer = {
  blurb: "A community group serving families in Kenya through meals, mentoring and medical care.",
  quick: [
    { href: '/', label: 'Home' },
    { href: '/about/', label: 'About' },
    { href: '/programs/', label: 'Programs' },
    { href: '/community/', label: 'Community' },
    { href: '/photos/', label: 'Photos' },
    { href: '/contact/', label: 'Contact' },
  ],
  more: [
    { href: '/team/', label: 'Our team' },
    { href: '/news/', label: 'News' },
    { href: '/events/', label: 'Events' },
    { href: '/reports/', label: 'Reports' },
    { href: '/faq/', label: 'FAQ' },
    { href: '/give/', label: 'How to give' },
  ],
  policies: [
    { href: '/privacy/', label: 'Privacy Policy' },
    { href: '/terms/', label: 'Terms of Service' },
    { href: '/child-protection/', label: 'Child Protection' },
    { href: '/cookies/', label: 'Cookie Policy' },
    { href: '/accessibility/', label: 'Accessibility' },
  ],
  copyright: "© 2026 Eagle's Wings Community Group (EWC). All rights reserved.",
  tagline: 'We can make it happen.',
};

/** Background-photo band: short text over a slideshow of community photos. */
export const community = {
  kicker: 'Our community',
  title: 'Families, young people and volunteers, together.',
  text: "Eagle's Wings Community Group brings meals, mentoring and medical care to families across Kenya. Founded in 2026 by Martin Wanjohi, we are growing through the work of volunteers and the people we serve.",
  line: ['500+ families', '100+ young people', '20+ medical camps'],
};

/**
 * Stand-in photos (free Unsplash images, stored locally in assets/stock and converted to WebP at build time).
 * A photo of your own with the matching name in assets/photos/ replaces the stand-in automatically.
 * Each value is the file name (without extension) inside assets/stock/.
 */
const AFR = 'african-children'; // African children, smiling girl at centre
const NBI = 'nairobi-school';   // Nairobi school children (Blake Cheek)
const HANDS = 'hands';
const LIB = 'library';
const STETH = 'stethoscope';
const VOL = 'volunteer';
export const fallbackPhotos: Record<string, string> = {
  'kenya-portrait': AFR,
  hero: NBI,
  'collage-1': AFR,
  'collage-2': NBI,
  feeding: NBI,
  mentorship: LIB,
  medical: STETH,
  'bg-1': AFR,
  'bg-2': NBI,
  'bg-3': HANDS,
  'bg-4': VOL,
  'gallery-1': NBI,
  'gallery-2': AFR,
  'gallery-3': STETH,
  'gallery-4': LIB,
  'gallery-5': HANDS,
  'gallery-6': VOL,
  'gallery-7': AFR,
  'gallery-8': NBI,
  'cap-1': HANDS,
  'cap-2': AFR,
  'cap-3': NBI,
  'founder-2': NBI,
  'founder-3': AFR,
  story: AFR,
  'cta-1': AFR,
  'cta-2': NBI,
  'page-about': NBI,
  'page-programs': AFR,
  'page-community': AFR,
  'page-photos': NBI,
  'page-give': AFR,
  'page-contact': AFR,
  'page-team': NBI,
  'page-news': AFR,
  'page-events': NBI,
  'page-reports': AFR,
  'page-faq': NBI,
};

/** Short values row under the hero. */
export const values = [
  { title: 'Compassion', text: 'We treat every person with dignity, whatever their situation.', icon: 'heart' },
  { title: 'Integrity', text: 'We say what we did, and we show where gifts went.', icon: 'shield' },
  { title: 'Teamwork', text: 'We work with local people, clinics and churches, not over them.', icon: 'people' },
  { title: 'Excellence', text: 'We do ordinary, necessary things well, every time.', icon: 'star' },
];

export const stats = [
  { n: 500, label: 'Families reached' },
  { n: 100, label: 'Young people' },
  { n: 20, label: 'Medical camps' },
  { n: 50, label: 'Volunteers' },
];

export const heroBadge = { n: 500, label: 'Families reached' };

export const banner = {
  title: 'Your gift means a lot to the families we serve.',
  text: 'Every action counts. Every donation matters. Every life changed is a victory we share with you.',
  button: 'Give now',
};
