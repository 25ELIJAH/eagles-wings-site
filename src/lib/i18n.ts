// Kiswahili (Swahili) copy and the page map between the English and Swahili versions of the site.
// The Swahili text was written to match the English wording; have a Swahili speaker from the organisation review it before promoting it widely.
export type Lang = 'en' | 'sw';

/** English path -> Swahili path */
export const swPaths: Record<string, string> = {
  '/': '/sw/',
  '/about/': '/sw/kuhusu/',
  '/programs/': '/sw/programu/',
  '/give/': '/sw/toa/',
  '/contact/': '/sw/wasiliana/',
  '/get-involved/': '/sw/shirikiana/',
};
const enPaths: Record<string, string> = Object.fromEntries(Object.entries(swPaths).map(([en, sw]) => [sw, en]));

/** The matching page in the other language, or null if there is none. */
export function altFor(pathname: string, lang: Lang): { href: string; lang: Lang; label: string } | null {
  if (lang === 'en') return swPaths[pathname] ? { href: swPaths[pathname], lang: 'sw', label: 'Kiswahili' } : null;
  return enPaths[pathname] ? { href: enPaths[pathname], lang: 'en', label: 'English' } : null;
}

export const sw = {
  nav: [
    { href: '/sw/', label: 'Nyumbani' },
    { href: '/sw/kuhusu/', label: 'Kuhusu sisi' },
    { href: '/sw/programu/', label: 'Programu' },
    { href: '/sw/shirikiana/', label: 'Shirikiana' },
    { href: '/sw/wasiliana/', label: 'Wasiliana nasi' },
  ],
  give: 'Toa',
  menu: 'Menyu',
  skip: 'Ruka hadi maudhui',
  whatsappLabel: 'Tuandikie kwenye WhatsApp (inafunguka kwenye kichupo kipya)',
  cookie: {
    label: 'Taarifa kuhusu vidakuzi',
    text: 'Kwa ufupi: hatutumii vidakuzi vya kufuatilia wala vya matangazo. Tunakumbuka tu kwamba umeona ujumbe huu.',
    ok: 'Nimeelewa',
    policy: 'Sera ya Vidakuzi (Kiingereza)',
  },
  footer: {
    blurb: 'Kikundi cha jamii kinachohudumia familia nchini Kenya kwa chakula, ushauri na huduma za afya.',
    whatsapp: 'Tuandikie WhatsApp',
    explore: 'Gundua',
    more: 'Zaidi',
    policies: 'Sera',
    quick: [
      { href: '/sw/', label: 'Nyumbani' },
      { href: '/sw/kuhusu/', label: 'Kuhusu sisi' },
      { href: '/sw/programu/', label: 'Programu' },
      { href: '/sw/toa/', label: 'Jinsi ya kutoa' },
      { href: '/sw/wasiliana/', label: 'Wasiliana nasi' },
    ],
    moreLinks: [
      { href: '/sw/shirikiana/', label: 'Shirikiana nasi' },
      { href: '/team/', label: 'Timu yetu (Kiingereza)' },
      { href: '/photos/', label: 'Picha' },
      { href: '/faq/', label: 'Maswali (Kiingereza)' },
    ],
    policyLinks: [
      { href: '/privacy/', label: 'Sera ya Faragha (Kiingereza)' },
      { href: '/terms/', label: 'Masharti ya Huduma (Kiingereza)' },
      { href: '/child-protection/', label: 'Ulinzi wa Watoto (Kiingereza)' },
      { href: '/cookies/', label: 'Sera ya Vidakuzi (Kiingereza)' },
    ],
    copyright: "© 2026 Eagle's Wings Community Group (EWC). Haki zote zimehifadhiwa.",
    tagline: 'Tunaweza kulifanikisha.',
    builtBy: 'Imejengwa na',
    registration: 'Usajili',
  },
  hero: {
    plain: 'Tunajali',
    words: ['familia', 'watoto', 'vijana', 'jamii'],
    tail: 'kote nchini Kenya.',
    text: "Eagle's Wings ni shirika lisilo la faida nchini Kenya linalolisha watoto, kuwashauri vijana na kuendesha kambi za matibabu bila malipo.",
    primary: { label: 'Toa', href: '/sw/toa/' },
    secondary: { label: 'Jitolee au shirikiana nasi', href: '/sw/shirikiana/' },
    explore: 'Gundua',
    mapLabel: 'Ramani ya Kenya iliyojaa picha za watoto na walezi',
    flagLabel: 'Bendera ya Kenya',
  },
  values: [
    { title: 'Huruma', text: 'Tunamtendea kila mtu kwa heshima, bila kujali hali yake.' },
    { title: 'Uadilifu', text: 'Tunasema tulichofanya, na tunaonyesha mahali michango ilipoenda.' },
    { title: 'Kazi ya pamoja', text: 'Tunafanya kazi pamoja na wenyeji, zahanati na makanisa, si juu yao.' },
    { title: 'Ubora', text: 'Tunafanya mambo ya kawaida na ya lazima kwa ubora, kila wakati.' },
  ],
  about: {
    label: 'Sisi ni nani',
    title: 'Tumejengwa kufanya mambo ya kawaida na ya lazima kwa ubora.',
    text: "Eagle's Wings Community Group ipo kuleta mabadiliko ya kudumu kwa jamii zisizo na huduma za kutosha, kupitia huduma, utunzaji na msaada wa vitendo.",
    pillars: [
      { title: 'Dira', text: 'Kumfikia kila mtu kwa upendo na matumaini.' },
      { title: 'Dhamira', text: 'Tunaweza kulifanikisha.' },
      { title: 'Maadili', text: 'Huruma, uadilifu, kazi ya pamoja na ubora.' },
    ],
    pageTitle: 'Kuhusu sisi',
    pageSubtitle: 'Tunaleta mabadiliko ya kudumu kwa jamii zisizo na huduma za kutosha.',
    timeline: "2016: Eagle's Wings Community Group inaanzishwa nchini Kenya na Rev. Benard Kariuki Karanja. 2026: miaka kumi ya kulisha watoto, kuwashauri vijana na kuendesha kambi za matibabu.",
  },
  programs: {
    label: 'Programu',
    title: 'Mambo matatu tunayofanya kila siku.',
    pageTitle: 'Programu zetu',
    pageSubtitle: 'Chakula, ushauri kwa vijana na huduma za afya.',
    items: [
      { title: 'Chakula', text: 'Milo yenye lishe kwa watoto na familia zilizo hatarini, ili hakuna mtu katika jamii yetu anayelala njaa.' },
      { title: 'Ushauri kwa vijana', text: 'Elimu, mafunzo ya stadi za maisha na programu za uongozi zinazowasaidia vijana kusimama imara.' },
      { title: 'Huduma za afya', text: 'Huduma ya afya bila malipo katika kambi za matibabu tunazoandaa kwenye jamii zenye fursa chache za kuipata.' },
    ],
  },
  stats: [
    { n: 500, label: 'Familia zilizofikiwa' },
    { n: 100, label: 'Vijana' },
    { n: 20, label: 'Kambi za matibabu' },
    { n: 50, label: 'Wajitolea' },
  ],
  founder: {
    label: 'Kutoka kwa mwanzilishi wetu',
    quote: "Naamini kila mtoto anastahili fursa, kila familia inastahili matumaini, na kila jamii inastahili msaada. Eagle's Wings ipo kuziba pengo hilo. Pamoja, tunaweza kujenga mustakabali uliojaa utu, kusudi, na uwezekano usio na kikomo.",
    note: 'Tafsiri ya Kiswahili ya ujumbe wake wa asili wa Kiingereza.',
    role: 'Mwanzilishi na Mkurugenzi Mtendaji',
  },
  banner: {
    title: 'Mchango wako una maana kubwa kwa familia tunazohudumia.',
    text: 'Kila tendo lina maana. Kila mchango ni muhimu. Kila maisha yaliyobadilika ni ushindi tunaoushiriki nawe.',
    button: 'Toa sasa',
  },
  giveSection: {
    title: 'Jinsi ya kutoa',
    pageSubtitle: 'Kila mchango unaenda kulisha familia, kuwashauri vijana na kuendesha kambi za matibabu.',
    withMethods: 'Chagua njia inayokufaa. Kisha tutumie ujumbe ili tukushukuru na kukutumia risiti.',
    noMethods: 'Tutumie ujumbe au tupigie simu nasi tutakupa maelezo na kukutumia risiti.',
    goes: 'Kila mchango unaenda kulisha familia, kuwashauri vijana na kuendesha kambi za matibabu.',
    paybill: 'M-Pesa Paybill',
    till: 'M-Pesa Buy Goods (Till)',
    bank: 'Uhamisho wa benki',
    business: 'Namba ya biashara',
    account: 'Jina la akaunti',
    tillNumber: 'Namba ya till',
    bankName: 'Benki',
    accountNumber: 'Namba ya akaunti',
    branch: 'Tawi',
    copy: 'Nakili',
    copied: 'Imenakiliwa',
    whatsapp: 'Tuandikie WhatsApp',
    call: 'Piga simu',
    quickTitle: 'Unataka kutoa au kusaidia?',
    quickText: 'Acha maelezo yako nasi tutakujibu.',
    send: 'Tuma',
  },
  contact: {
    title: 'Wasiliana nasi',
    subtitle: 'Maswali kuhusu programu, ziara au ushirikiano? Tuandikie.',
    heading: 'Tuko hapa kukusikiliza',
    where: 'Tunapofanya kazi',
    email: 'Barua pepe',
    call: 'Piga simu au WhatsApp',
    formTitle: 'Tutumie ujumbe',
    formText: 'Tutakujibu haraka iwezekanavyo.',
  },
  involve: {
    title: 'Shirikiana nasi',
    subtitle: 'Kuna nafasi kwa kila anayetaka kusaidia.',
    ways: [
      { title: 'Jitolee', text: 'Saidia kuandaa milo, kuwashauri vijana au kusaidia kambi ya matibabu. Tuambie ni lini unapatikana nasi tutakuunganisha na hitaji.' },
      { title: 'Shirikiana nasi', text: 'Makanisa, shule, biashara na zahanati wanaweza kufanya kazi nasi katika siku za kulisha, ushauri na huduma za afya.' },
      { title: 'Changia vitu', text: 'Chakula, nguo, vitabu na vifaa vinakaribishwa. Tutumie ujumbe kwanza ili tupange jinsi ya kuvipokea.' },
      { title: 'Toa ujuzi wako', text: 'Kufundisha, ushauri nasaha, uuguzi, uhasibu, ubunifu: saa chache za ujuzi zinaweza kubadilisha mengi.' },
    ],
    formTitle: 'Tuambie ungependa kusaidiaje',
    formText: 'Tunasoma kila ujumbe na kujibu ndani ya siku chache. Unapendelea kuzungumza? Piga simu au WhatsApp',
    child: 'Kila anayefanya kazi na watoto kupitia Eagle\'s Wings hufuata',
    childLink: 'sera yetu ya ulinzi wa watoto (Kiingereza)',
  },
  form: {
    name: 'Jina', phone: 'Simu', email: 'Barua pepe', subject: 'Mada', message: 'Ujumbe',
    yourName: 'Jina lako', phoneOrEmail: 'Simu au barua pepe', required: '(inahitajika)', send: 'Tuma',
    iWould: 'Ningependa',
    options: ['Kujitolea muda wangu', "Kushirikiana na Eagle's Wings", 'Kuchangia vitu (chakula, nguo, vifaa)', 'Kutoa ujuzi au huduma', 'Jambo lingine'],
  },
};

/** Form messages shown to Swahili visitors. Keys are the English messages used in code. */
export const swMessages: Record<string, string> = {
  'Please tell us your name.': 'Tafadhali tuambie jina lako.',
  'Your name looks too short.': 'Jina lako linaonekana fupi mno.',
  'Please add your email address.': 'Tafadhali weka barua pepe yako.',
  'That email address does not look right.': 'Barua pepe hii haionekani sahihi.',
  'Please add a phone number or email so we can reply.': 'Tafadhali weka namba ya simu au barua pepe ili tukujibu.',
  'That does not look like a phone number or email address.': 'Hii haionekani kama namba ya simu au barua pepe.',
  'That phone number does not look right.': 'Namba hii ya simu haionekani sahihi.',
  'Please write a short message.': 'Tafadhali andika ujumbe mfupi.',
  'Please fix the field marked below.': 'Tafadhali sahihisha sehemu iliyotiwa alama hapa chini.',
  'Please check your details, then press Send again to confirm.': 'Tafadhali hakiki maelezo yako, kisha bonyeza Tuma tena kuthibitisha.',
  'Thank you. We will be in touch soon.': 'Asante. Tutawasiliana nawe hivi karibuni.',
  'Thank you. We have received your message and will reply soon.': 'Asante. Tumepokea ujumbe wako na tutakujibu hivi karibuni.',
  'Try again': 'Jaribu tena',
  'Sending…': 'Inatuma…',
};
export function translateMessage(msg: string): string {
  if (swMessages[msg]) return swMessages[msg];
  let m = msg.match(/^Please fix the (\d+) fields marked below\.$/);
  if (m) return `Tafadhali sahihisha sehemu ${m[1]} zilizotiwa alama hapa chini.`;
  m = msg.match(/^Please keep your (name|message|subject) under (\d+) characters\.$/);
  if (m) return `Tafadhali usizidishe herufi ${m[2]}.`;
  m = msg.match(/^Your email app should open with your message ready to send\. If nothing opens, please email us at (.+)\.$/);
  if (m) return `Programu yako ya barua pepe inapaswa kufunguka na ujumbe wako tayari kutumwa. Isipofunguka, tuandikie kwa ${m[1]}.`;
  m = msg.match(/^We could not send your message just now\. Please try again, or email us at (.+)\.$/);
  if (m) return `Hatukuweza kutuma ujumbe wako sasa hivi. Tafadhali jaribu tena, au tuandikie kwa ${m[1]}.`;
  return msg;
}
