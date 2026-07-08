/**
 * Jupyter Labs — centralized content & curated editorial imagery.
 * Images are high-end Unsplash editorial photographs (wellness, botanical,
 * skincare, lab). Every <Img> degrades to an on-brand gradient if a source
 * is ever unavailable, so the experience never shows a broken asset.
 */

const U = (id: string, w = 1400, q = 80) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=${q}`

export const IMG = {
  heroProduct: U('1620916566398-39f1143ab7be', 1100),
  heroAtmosphere: U('1556228720-195a672e8a03', 1600),
  difference: U('1556228578-8c89e6adf883', 1200),
  lifestyle1: U('1540555700478-4be289fbecef', 1400),
  lifestyle2: U('1591343395082-e120087004b4', 1200),
  lifestyle3: U('1545205597-3d9d02c29597', 1000),
  science: U('1532187863486-abf9dbad1b69', 1400),
  scienceLab: U('1581093588401-fbb62a02f120', 1200),
  about: U('1517960413843-0aee8e2b3285', 1400),
  sustainability: U('1542601906990-b4d3fb778b09', 1400),
  ingredientAdaptogen: U('1515823064-d6e0c04616a7', 900),
  ingredientCollagen: U('1559827260-dc66d52bef19', 900),
  ingredientOmega: U('1559181567-c3190ca9959b', 900),
  ingredientGreens: U('1416879595882-3373a0480b5b', 900),
} as const

export const PRODUCTS = [
  {
    id: 'bpc-157',
    slug: 'bpc-157-tb-500',
    name: 'BPC-157 & TB-500',
    tagline: 'Recovery · Joint · Tissue',
    category: 'Tissue Repair',
    desc: 'A research-grade peptide studied for tissue repair, joint recovery and connective-tissue support in pre-clinical models.',
    longDesc:
      'Pre-filled BPC-157 + TB-500 in an Alluvi research pen, formulated for stability-grade laboratory study of soft-tissue and joint recovery pathways.',
    price: 130,
    currency: 'GBP',
    accent: '#0f766e',
    tint: '#E6F1EF',
    image: '/images/products/bpc-front.jpg',
    gallery: [
      '/images/products/bpc-front.jpg',
      '/images/products/bpc-open.jpg',
      '/images/products/bpc-pen.jpg',
      '/images/products/bpc-uv.jpg',
    ],
    stat: '99.2% HPLC purity',
    specs: [
      { k: 'Purity', v: '99.2%+ HPLC verified' },
      { k: 'Testing', v: 'Janoshik independent COA' },
      { k: 'Format', v: 'Pre-filled research pen' },
      { k: 'Shipping', v: 'Cold chain · Tracked UK' },
    ],
  },
  {
    id: 'retatrutide',
    slug: 'retatrutide-40mg',
    name: 'Retatrutide 40mg',
    tagline: 'Metabolic · Glucose · Energy',
    category: 'Triple Agonist',
    desc: 'A triple-agonist research peptide studied for its effects on metabolic regulation and body composition outcomes.',
    longDesc:
      'Retatrutide 40mg pre-filled into an Alluvi research pen. Independently Janoshik-verified across a 56-day stability window for metabolic-pathway R&D.',
    price: 180,
    currency: 'GBP',
    accent: '#6B7F78',
    tint: '#E7EDE9',
    image: '/images/products/retatrutide-front.jpg',
    gallery: [
      '/images/products/retatrutide-front.jpg',
      '/images/products/retatrutide-open.jpg',
      '/images/products/retatrutide-pen.jpg',
      '/images/products/retatrutide-uv.jpg',
    ],
    stat: '99.4% HPLC purity',
    specs: [
      { k: 'Purity', v: '99.4%+ HPLC verified' },
      { k: 'Testing', v: 'Janoshik 56-day stability' },
      { k: 'Format', v: 'Pre-filled research pen' },
      { k: 'Shipping', v: 'Cold chain · Tracked UK' },
    ],
  },
  {
    id: 'tirzepatide',
    slug: 'tirzepatide-40mg',
    name: 'Tirzepatide 40mg',
    tagline: 'GLP-1 · GIP · Glucose',
    category: 'GLP-1 / GIP',
    desc: 'A dual GIP/GLP-1 receptor agonist studied for glucose response and appetite regulation in research settings.',
    longDesc:
      'Dual agonist of GLP-1 and GIP receptors, pre-filled into an Alluvi research pen. For controlled laboratory study only.',
    price: 100,
    currency: 'GBP',
    accent: '#7E8FA6',
    tint: '#E6EAF0',
    image: '/images/products/tirzepatide-front.jpg',
    gallery: [
      '/images/products/tirzepatide-front.jpg',
      '/images/products/tirzepatide-open.jpg',
      '/images/products/tirzepatide-pen.jpg',
      '/images/products/tirzepatide-uv.jpg',
    ],
    stat: '99.1% HPLC purity',
    specs: [
      { k: 'Purity', v: '99.1%+ HPLC verified' },
      { k: 'Testing', v: 'Janoshik independent COA' },
      { k: 'Format', v: 'Pre-filled research pen' },
      { k: 'Shipping', v: 'Cold chain · Tracked UK' },
    ],
  },
  {
    id: 'glow',
    slug: 'glow-70mg',
    name: 'Glow 70mg (GHK-Cu)',
    tagline: 'Skin · Radiance · Repair',
    category: 'Copper Peptide',
    desc: 'A copper-peptide studied in dermal research for collagen support, skin elasticity and visible radiance.',
    longDesc:
      'Glow 70mg GHK-Cu pre-filled into an Alluvi research pen — for dermal-research evaluation of collagen support and skin-barrier pathways.',
    price: 100,
    currency: 'GBP',
    accent: '#B9A37E',
    tint: '#F3EEE2',
    image: '/images/products/glow-front.jpg',
    gallery: [
      '/images/products/glow-front.jpg',
      '/images/products/glow-open.jpg',
      '/images/products/glow-pen.jpg',
      '/images/products/glow-uv.jpg',
    ],
    stat: '99.5% HPLC purity',
    specs: [
      { k: 'Purity', v: '99.5%+ HPLC verified' },
      { k: 'Testing', v: 'Janoshik independent COA' },
      { k: 'Format', v: 'Pre-filled research pen' },
      { k: 'Shipping', v: 'Cold chain · Tracked UK' },
    ],
  },
] as const

export const INGREDIENTS = [
  {
    name: 'Marine Collagen',
    latin: 'Hydrolyzed Type I',
    note: 'Peptide-perfect for elasticity, bounce and visible glow.',
    image: IMG.ingredientCollagen,
  },
  {
    name: 'Ashwagandha',
    latin: 'KSM-66®',
    note: 'A clinically-studied adaptogen that calms cortisol and steadies energy.',
    image: IMG.ingredientAdaptogen,
  },
  {
    name: 'Omega-3 DHA',
    latin: 'Algae-derived',
    note: 'Plant-sourced essential fats for brain, heart and cellular health.',
    image: IMG.ingredientOmega,
  },
  {
    name: 'Organic Greens',
    latin: 'Spirulina · Chlorella',
    note: 'Cold-processed phytonutrients delivering whole-food micronutrition.',
    image: IMG.ingredientGreens,
  },
] as const

export const STATS = [
  { value: 47, suffix: '+', label: 'Peer-reviewed studies referenced' },
  { value: 100, suffix: '%', label: 'Traceable, third-party tested actives' },
  { value: 92, suffix: '%', label: 'Reported better energy in 8 weeks' },
  { value: 0, prefix: '', suffix: '', label: 'Fillers, dyes & synthetic additives', display: 'Zero' },
] as const

export const BENEFITS = [
  { k: '01', t: 'Visible Radiance', d: 'Skin that looks lit from within — elasticity, hydration and even tone.', image: '/images/jupyter-labs/visible-radiance-benefit.webp' },
  { k: '02', t: 'Sustained Energy', d: 'Clean vitality without the spike-and-crash of stimulants.', image: '/images/jupyter-labs/sustained-energy-benefit.webp' },
  { k: '03', t: 'Deep Recovery', d: 'Calmer nights and sharper mornings through restorative sleep.', image: '/images/jupyter-labs/deep-recovery-benefit.webp' },
  { k: '04', t: 'Resilient Immunity', d: 'A fortified daily baseline so you stay your strongest self.', image: '/images/jupyter-labs/resilient-immunity-benefit.webp' },
] as const

export const TESTIMONIALS = [
  {
    name: 'Amara N.',
    role: 'Creative Director',
    quote: 'Jupyter Labs replaced a shelf of supplements with two elegant rituals. My skin and focus have never been better.',
    image: '/images/jupyter-labs/customer-stories/customer-testimonial-amara-creative-director.webp',
  },
  {
    name: 'Julien M.',
    role: 'Endurance Athlete',
    quote: 'The transparency is unreal — every active is dosed to the studies. I feel the difference by week three.',
    image: '/images/jupyter-labs/customer-stories/customer-testimonial-julien-endurance-athlete.webp',
  },
  {
    name: 'Sofia R.',
    role: 'Founder',
    quote: 'It feels less like taking vitamins and more like a daily moment of luxury. Obsessed.',
    image: '/images/jupyter-labs/customer-stories/customer-testimonial-sofia-founder.webp',
  },
  {
    name: 'Daniel K.',
    role: 'Physician',
    quote: 'Finally a brand I can recommend. Clinically-relevant doses, clean sourcing, zero marketing fluff.',
    image: '/images/jupyter-labs/customer-stories/customer-testimonial-daniel-physician.webp',
  },
  {
    name: 'Lina P.',
    role: 'Yoga Teacher',
    quote: 'Calm changed my sleep within a week. I wake up genuinely rested for the first time in years.',
    image: '/images/jupyter-labs/customer-stories/customer-testimonial-lina-yoga-teacher.webp',
  },
  {
    name: 'Marcus T.',
    role: 'Investor',
    quote: 'Performance you can feel and chemistry you can verify. Jupyter Labs is the new standard.',
    image: '/images/jupyter-labs/customer-stories/customer-testimonial-marcus-investor.webp',
  },
] as const

export const TRUST = [
  'Third-Party Tested',
  'cGMP Certified',
  'Vegan & Non-GMO',
  'Climate Neutral',
  'No Fillers',
  'Clinically Dosed',
] as const

export const TIMELINE = [
  { year: '2019', t: 'The Question', d: 'Two scientists ask why wellness has to choose between efficacy and elegance.' },
  { year: '2021', t: 'The Formulas', d: 'Three years of research distilled into clinically-dosed, traceable rituals.' },
  { year: '2023', t: 'The Launch', d: 'Jupyter Labs debuts to a waitlist of 40,000 — sold out in nineteen hours.' },
  { year: 'Today', t: 'The Standard', d: 'A new benchmark for what science-backed luxury wellness can be.' },
] as const

export const NAV = [
  { label: 'Home', href: '#top' },
  { label: 'About', href: '#about' },
  { label: 'Products', href: '#products' },
  { label: 'Why Us', href: '#why' },
  { label: 'Testimonials', href: '#testimonials' },
  { label: 'Contact', href: '#contact' },
] as const
