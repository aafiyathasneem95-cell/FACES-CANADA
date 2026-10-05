export type TryOnZone = 'lips' | 'cheeks' | 'eyes' | 'complexion';

export type FinishType = 'Velvet Matte' | 'Satin Crème' | 'High-Shine Gloss' | 'HD Dewy';

export type UndertoneType = 'Warm' | 'Neutral' | 'Cool';

export interface ProductShade {
  id: string;
  sku: string;
  name: string;
  code: string;
  hex: string;
  undertone: UndertoneType;
  finishOverride?: FinishType;
  description: string;
}

export interface Product {
  id: string;
  name: string;
  collection: string;
  category: 'Lips' | 'Face' | 'Eyes';
  tryOnZone: TryOnZone;
  defaultFinish: FinishType;
  priceInr: number;
  mrpInr: number;
  netWeight: string;
  wearTime: string;
  image: string;
  tagline: string;
  description: string;
  keyActives: string[];
  applicationRitual: string;
  statusTag?: string;
  shades: ProductShade[];
}

export interface EditorialLook {
  id: string;
  title: string;
  subtitle: string;
  occasion: string;
  lipProductId: string;
  lipShadeId: string;
  cheekProductId: string;
  cheekShadeId: string;
  eyeProductId: string;
  eyeShadeId: string;
  complexionProductId: string;
  complexionShadeId: string;
}

export const HERO_CAMPAIGN_IMAGE = '/src/assets/images/hero_faces_campaign_1791195112891.jpg';
export const TRYON_MODEL_PORTRAIT = '/src/assets/images/tryon_model_portrait_1791195159158.jpg';

export const PRODUCTS: Product[] = [
  {
    id: 'weightless-matte-lipstick',
    name: 'Weightless Matte Finish Lipstick',
    collection: 'Classic Weightless',
    category: 'Lips',
    tryOnZone: 'lips',
    defaultFinish: 'Velvet Matte',
    priceInr: 299,
    mrpInr: 349,
    netWeight: '4.0 g',
    wearTime: '10Hr Plush Comfort',
    image: '/src/assets/images/product_weightless_lipstick_1791195126529.jpg',
    tagline: 'Powder-light pigment infused with sweet almond, jojoba, and vitamin E.',
    description:
      'Engineered in Toronto for tropical humidity and all-day wear, the Weightless Matte bullet glides on in a single stroke without tugging or drying. Micro-spherical powders diffuse light for a soft-focus velvet finish.',
    keyActives: ['Sweet Almond Oil', 'Jojoba Seed Extract', 'Vitamin E Tocopherol'],
    applicationRitual:
      'Define the cupid’s bow with the sculpted bullet tip, then sweep from the center outward. Blot once with tissue for an ultra-diffused editorial stain.',
    statusTag: 'Bestseller',
    shades: [
      {
        id: 'wml-01',
        sku: 'FC-WML-01',
        code: '01',
        name: 'Crimson Silk',
        hex: '#9E1B32',
        undertone: 'Warm',
        description: 'Rich blue-balanced crimson that brightens warm and golden complexions.',
      },
      {
        id: 'wml-05',
        sku: 'FC-WML-05',
        code: '05',
        name: 'Imperial Plum',
        hex: '#5E1D34',
        undertone: 'Cool',
        description: 'Velvety crushed wine berry for high-contrast evening definition.',
      },
      {
        id: 'wml-08',
        sku: 'FC-WML-08',
        code: '08',
        name: 'Subtle Mauve',
        hex: '#B2646E',
        undertone: 'Neutral',
        description: 'Everyday dusty rosewood calibrated for medium-to-deep skin tones.',
      },
      {
        id: 'wml-12',
        sku: 'FC-WML-12',
        code: '12',
        name: 'Royal Fuchsia',
        hex: '#B81D58',
        undertone: 'Cool',
        description: 'Vibrant jewel magenta with high-saturation micro-pigments.',
      },
      {
        id: 'wml-16',
        sku: 'FC-WML-16',
        code: '16',
        name: 'Peach Nectar',
        hex: '#C86D5B',
        undertone: 'Warm',
        description: 'Sun-baked coral terracotta for effortless daytime warmth.',
      },
    ],
  },
  {
    id: 'ultime-pro-hd-matte-crayon',
    name: 'Ultime Pro HD Intense Matte Lips + Primer',
    collection: 'Ultime Pro HD',
    category: 'Lips',
    tryOnZone: 'lips',
    defaultFinish: 'Velvet Matte',
    priceInr: 849,
    mrpInr: 899,
    netWeight: '2.4 g',
    wearTime: '14Hr Non-Feathering',
    image: '/src/assets/images/product_weightless_lipstick_1791195126529.jpg',
    tagline: 'Built-in smoothing primer core with high-definition German pigment technology.',
    description:
      'Our signature dermatologically tested chubby crayon marries a line-filling elastomer primer with full-coverage HD matte pigment. Waterproof, crease-resistant, and sharpenable to a precision lip-liner point.',
    keyActives: ['Ceramide Primer Complex', 'German HD Pigments', 'Chamomile Butter'],
    applicationRitual:
      'Outline the lip perimeter using the tapered tip as a liner, then angle the barrel flat to fill the lips in one seamless pass.',
    statusTag: 'Iconic Formula',
    shades: [
      {
        id: 'upl-14',
        sku: 'FC-UPL-14',
        code: '14',
        name: 'Tease Scarlet',
        hex: '#8C1D2E',
        undertone: 'Warm',
        description: 'Our #1 editorial brick-ruby shade crafted for universal Indian & global undertones.',
      },
      {
        id: 'upl-11',
        sku: 'FC-UPL-11',
        code: '11',
        name: 'Natural Coco',
        hex: '#9A5B4B',
        undertone: 'Warm',
        description: 'Toasted cinnamon mocha nude that never washes out golden or olive skin.',
      },
      {
        id: 'upl-03',
        sku: 'FC-UPL-03',
        code: '03',
        name: 'Crushed Berry',
        hex: '#75233E',
        undertone: 'Neutral',
        description: 'Deep Boysenberry stain with a plush velvet reflection.',
      },
      {
        id: 'upl-09',
        sku: 'FC-UPL-09',
        code: '09',
        name: 'Spiced Latte',
        hex: '#B06A5A',
        undertone: 'Warm',
        description: 'Warm chai rose-brown for polished studio and boardroom wear.',
      },
      {
        id: 'upl-21',
        sku: 'FC-UPL-21',
        code: '21',
        name: 'Magnetic Rouge',
        hex: '#A91B28',
        undertone: 'Neutral',
        description: 'Pure runway red with balanced neutral undertones.',
      },
    ],
  },
  {
    id: 'comfy-matte-pro-liquid',
    name: 'Comfy Matte Pro Liquid Lipstick',
    collection: 'Comfy Matte',
    category: 'Lips',
    tryOnZone: 'lips',
    defaultFinish: 'Satin Crème',
    priceInr: 599,
    mrpInr: 649,
    netWeight: '5.0 ml',
    wearTime: '16Hr Transfer-Proof',
    image: '/src/assets/images/product_weightless_lipstick_1791195126529.jpg',
    tagline: 'Zero-alcohol liquid mousse infused with French rose extract and squalane.',
    description:
      'Unlike conventional liquid lipsticks that crack after two hours, Comfy Matte Pro uses a breathable plant-squalane lattice that locks pigment for 16 hours while keeping lips supple and kiss-proof.',
    keyActives: ['Rosa Damascena Extract', 'Botanical Squalane', 'Zero-Alcohol Base'],
    applicationRitual:
      'Wipe excess pigment from the tear-drop reservoir wand. Apply a thin layer to the bottom lip, press lips together, and allow 25 seconds to set.',
    statusTag: 'Transfer-Proof',
    shades: [
      {
        id: 'cml-02',
        sku: 'FC-CML-02',
        code: '02',
        name: 'Note To Self',
        hex: '#9F4D4F',
        undertone: 'Neutral',
        description: 'Muted rosewood terracotta that adapts to natural lip warmth.',
      },
      {
        id: 'cml-07',
        sku: 'FC-CML-07',
        code: '07',
        name: 'You Go Girl',
        hex: '#7E192C',
        undertone: 'Cool',
        description: 'Saturated oxblood bordeaux for unmistakable evening drama.',
      },
      {
        id: 'cml-04',
        sku: 'FC-CML-04',
        code: '04',
        name: 'Fixed It Rose',
        hex: '#BD5E54',
        undertone: 'Warm',
        description: 'Warm petal-terracotta hybrid with soft satin-matte radiance.',
      },
      {
        id: 'cml-10',
        sku: 'FC-CML-10',
        code: '10',
        name: 'Raisin The Roof',
        hex: '#6D2B3D',
        undertone: 'Neutral',
        description: 'Smoky fig-mulberry shade that flatters medium to rich complexions.',
      },
    ],
  },
  {
    id: 'hydra-matte-3in1-foundation',
    name: '3-in-1 All Day Hydra Matte Foundation',
    collection: 'Complexion Lab',
    category: 'Face',
    tryOnZone: 'complexion',
    defaultFinish: 'HD Dewy',
    priceInr: 549,
    mrpInr: 599,
    netWeight: '25 ml',
    wearTime: '24Hr Sweat-Resistant',
    image: '/src/assets/images/product_ultime_pro_foundation_1791195137331.jpg',
    tagline: 'Foundation + Aloe Vera Day Cream + SPF 30 PA+++ sun shield in a single bottle.',
    description:
      'Calibrated specifically for diverse golden, olive, and neutral undertones without grey cast or oxidation. Micro-kaolin clay controls T-zone shine while aloe and vitamin C keep skin hydrated for 24 hours.',
    keyActives: ['Aloe Barbadensis Leaf', 'Vitamin C Ester', 'Mineral SPF 30 PA+++'],
    applicationRitual:
      'Dispense one pump onto the back of your hand. Dot across forehead, cheeks, and chin, then buff outward with a damp sponge or dense kabuki brush.',
    statusTag: 'SPF 30 PA+++',
    shades: [
      {
        id: 'hmf-01',
        sku: 'FC-HMF-01',
        code: '01',
        name: 'Ivory Fair',
        hex: '#F1D2B8',
        undertone: 'Cool',
        description: 'Light porcelain-ivory with balanced rosy-neutral undertones.',
      },
      {
        id: 'hmf-02',
        sku: 'FC-HMF-02',
        code: '02',
        name: 'Rose Ivory',
        hex: '#E6C0A3',
        undertone: 'Neutral',
        description: 'Light-to-medium neutral beige that neutralizes surface redness.',
      },
      {
        id: 'hmf-03',
        sku: 'FC-HMF-03',
        code: '03',
        name: 'Golden Sand',
        hex: '#D8AC87',
        undertone: 'Warm',
        description: 'Medium warm honey-gold undertone for luminous everyday coverage.',
      },
      {
        id: 'hmf-04',
        sku: 'FC-HMF-04',
        code: '04',
        name: 'Warm Caramel',
        hex: '#C08E66',
        undertone: 'Warm',
        description: 'Medium-deep golden caramel that never oxidizes orange.',
      },
      {
        id: 'hmf-05',
        sku: 'FC-HMF-05',
        code: '05',
        name: 'Rich Espresso',
        hex: '#9D6B49',
        undertone: 'Neutral',
        description: 'Deep warm bronze-espresso with true-to-tone mineral pigments.',
      },
    ],
  },
  {
    id: 'magneteyes-kajal-eyeliner-duo',
    name: 'Magneteyes Kajal + Precision Liner Duo',
    collection: 'Magneteyes',
    category: 'Eyes',
    tryOnZone: 'eyes',
    defaultFinish: 'Velvet Matte',
    priceInr: 399,
    mrpInr: 449,
    netWeight: '0.35 g + 3.5 ml',
    wearTime: '24Hr Waterproof',
    image: '/src/assets/images/product_magneteyes_kajal_1791195148879.jpg',
    tagline: 'Ophthalmologically tested intense carbon-free pigment for waterline and winged artistry.',
    description:
      'Pairs our iconic retractable 24-hour smudge-proof Magneteyes Kajal with a 0.1mm micro-felt liquid liner pen. Enriched with soothing almond oil and antioxidants for sensitive eyes and contact lens wearers.',
    keyActives: ['Cold-Pressed Almond Oil', 'Natural Carnauba Wax', 'Pro-Vitamin B5'],
    applicationRitual:
      'Glide the retractable kajal along the tightline and lower waterline. Follow with the micro-felt pen along the upper lash line, flicking outward toward the tail of the brow.',
    statusTag: '24Hr Waterproof',
    shades: [
      {
        id: 'mek-01',
        sku: 'FC-MEK-01',
        code: '01',
        name: 'Dramatic Jet Black',
        hex: '#171618',
        undertone: 'Neutral',
        description: 'Ultra-matte obsidian black for razor-sharp graphic wings.',
      },
      {
        id: 'mek-02',
        sku: 'FC-MEK-02',
        code: '02',
        name: 'Roast Espresso',
        hex: '#472B22',
        undertone: 'Warm',
        description: 'Rich roasted coffee brown for soft, daytime sultry definition.',
      },
      {
        id: 'mek-03',
        sku: 'FC-MEK-03',
        code: '03',
        name: 'Midnight Cobalt',
        hex: '#1D3363',
        undertone: 'Cool',
        description: 'Electric sapphire navy that makes brown and hazel eyes pop.',
      },
      {
        id: 'mek-04',
        sku: 'FC-MEK-04',
        code: '04',
        name: 'Forest Emerald',
        hex: '#1A4639',
        undertone: 'Warm',
        description: 'Deep jewel emerald with subtle satin dimension.',
      },
    ],
  },
  {
    id: 'berry-blush-baked-cheek-tint',
    name: 'Berry Blush & Glow Baked Cheek Tint',
    collection: 'Ultime Pro HD',
    category: 'Face',
    tryOnZone: 'cheeks',
    defaultFinish: 'Satin Crème',
    priceInr: 499,
    mrpInr: 549,
    netWeight: '4.5 g',
    wearTime: '12Hr Radiant Flush',
    image: '/src/assets/images/product_ultime_pro_foundation_1791195137331.jpg',
    tagline: 'Terracotta-baked micro-silk blush with Nordic raspberry and Moroccan argan oil.',
    description:
      'Baked for 24 hours on Italian terracotta tiles, this weightless cheek tint delivers a second-skin watercolor flush without emphasizing pores or texture.',
    keyActives: ['Nordic Raspberry Seed Oil', 'Moroccan Argan Oil', 'Light-Diffusing Mica'],
    applicationRitual:
      'Swirl an angled blush brush over the baked dome and sweep upward from the apples of the cheeks toward the temples.',
    statusTag: 'New Arrival',
    shades: [
      {
        id: 'bbg-01',
        sku: 'FC-BBG-01',
        code: '01',
        name: 'Berry Flush',
        hex: '#B84A5A',
        undertone: 'Cool',
        description: 'Fresh crushed raspberry rose that mimics a natural post-winter flush.',
      },
      {
        id: 'bbg-02',
        sku: 'FC-BBG-02',
        code: '02',
        name: 'Sunset Terracotta',
        hex: '#C6634B',
        undertone: 'Warm',
        description: 'Sun-drenched terracotta coral ideal for golden and olive skin.',
      },
      {
        id: 'bbg-03',
        sku: 'FC-BBG-03',
        code: '03',
        name: 'Petal Whisper',
        hex: '#CE7A82',
        undertone: 'Neutral',
        description: 'Delicate cashmere pink with a whisper-soft satin sheen.',
      },
      {
        id: 'bbg-04',
        sku: 'FC-BBG-04',
        code: '04',
        name: 'Spiced Apricot',
        hex: '#BF6E50',
        undertone: 'Warm',
        description: 'Warm amber-apricot drape that doubles as a sculpting bronzer-blush.',
      },
    ],
  },
];

export const EDITORIAL_LOOKS: EditorialLook[] = [
  {
    id: 'toronto-after-hours',
    title: 'Toronto After Hours',
    subtitle: 'Velvet Crimson Lips · Obsidian Wing · Berry Draped Cheeks',
    occasion: 'Evening Editorial',
    lipProductId: 'weightless-matte-lipstick',
    lipShadeId: 'wml-01',
    cheekProductId: 'berry-blush-baked-cheek-tint',
    cheekShadeId: 'bbg-01',
    eyeProductId: 'magneteyes-kajal-eyeliner-duo',
    eyeShadeId: 'mek-01',
    complexionProductId: 'hydra-matte-3in1-foundation',
    complexionShadeId: 'hmf-03',
  },
  {
    id: 'golden-hour-minimalist',
    title: 'Golden Hour Minimalist',
    subtitle: 'Natural Coco Crayon · Roast Espresso Kajal · Terracotta Flush',
    occasion: 'Daytime Studio',
    lipProductId: 'ultime-pro-hd-matte-crayon',
    lipShadeId: 'upl-11',
    cheekProductId: 'berry-blush-baked-cheek-tint',
    cheekShadeId: 'bbg-02',
    eyeProductId: 'magneteyes-kajal-eyeliner-duo',
    eyeShadeId: 'mek-02',
    complexionProductId: 'hydra-matte-3in1-foundation',
    complexionShadeId: 'hmf-03',
  },
  {
    id: 'monsoon-jewel-couture',
    title: 'Monsoon Jewel Couture',
    subtitle: 'Note To Self Liquid Lip · Midnight Cobalt Liner · Petal Cheek',
    occasion: 'Festive & Runway',
    lipProductId: 'comfy-matte-pro-liquid',
    lipShadeId: 'cml-02',
    cheekProductId: 'berry-blush-baked-cheek-tint',
    cheekShadeId: 'bbg-03',
    eyeProductId: 'magneteyes-kajal-eyeliner-duo',
    eyeShadeId: 'mek-03',
    complexionProductId: 'hydra-matte-3in1-foundation',
    complexionShadeId: 'hmf-04',
  },
];
