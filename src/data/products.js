export const FOOTWEAR_CATEGORIES = [
  {
    id: 'casual-sneakers',
    name: 'Sneakers (Casual & Everyday)',
    category: 'Everyday & Skate',
    tagline: 'Low & Mid-top Canvas & Leather Sneakers',
    eyelets: 6,
    recommendedLength: '54"',
    lengthCm: 137,
    looseLength: '45"',
    width: '8mm Flat Waxed or 10mm Chunky Rope',
    image: '/images/lookbook.jpg',
    description: 'Everyday canvas, skate, and leather low-tops. 54" delivers a balanced drape and clean aesthetic over the tongue.'
  },
  {
    id: 'sport-shoes',
    name: 'Sport & Running Shoes',
    category: 'Athletic & Performance',
    tagline: 'Trainers, Gym & Running Shoes',
    eyelets: 6,
    recommendedLength: '45"',
    lengthCm: 114,
    looseLength: '36"',
    width: '8mm Performance Flat or 3M Reflective Weave',
    image: '/images/product-reflective.jpg',
    description: 'High-movement athletic trainers requiring secure knot grip, reflective night safety, and anti-slip tension.'
  },
  {
    id: 'office-shoes',
    name: 'Office & Dress Shoes',
    category: 'Formal & Business',
    tagline: 'Oxfords, Derbies, Brogues & Formal Footwear',
    eyelets: 5,
    recommendedLength: '36"',
    lengthCm: 91,
    looseLength: '30"',
    width: '3mm Thin Round Waxed or Italian Glazed Leather',
    image: '/images/product-leather.jpg',
    description: 'Bespoke formal dress shoes requiring ultra-refined, low-profile waxed laces with discreet solid brass or gunmetal tips.'
  },
  {
    id: 'chelsea-boots',
    name: 'Chelsea & Leather Boots',
    category: 'Boots & High-Ankle',
    tagline: 'Chelsea Lace-Ups, Chukkas & Heavy Boots',
    eyelets: 8,
    recommendedLength: '63"',
    lengthCm: 160,
    looseLength: '54"',
    width: '8mm Heavy Waxed Canvas or Rawhide Leather',
    image: '/images/product-waxed.jpg',
    description: 'Sturdy high-collar leather boots and chukkas needing resilient high-tensile waxed lace to withstand outdoor elements.'
  },
  {
    id: 'retro-court',
    name: 'Retro Court & Minimalist Shoes',
    category: 'Tennis & Terrace',
    tagline: 'Low-Profile Court & Clean Terrace Shoes',
    eyelets: 7,
    recommendedLength: '45"',
    lengthCm: 114,
    looseLength: '36"',
    width: '6mm Slim Flat Waxed or Vintage Sail Cotton',
    image: '/images/product-vintage.jpg',
    description: 'Low-profile classic tennis kicks and clean terrace shoes look sharpest with snug 45" laces keeping the silhouette trim.'
  },
  {
    id: 'high-top-sneakers',
    name: 'High-Top & Designer Sneakers',
    category: 'High-Tops & Streetwear',
    tagline: 'Ankle-Height Sneakers & Fashion Kicks',
    eyelets: 8,
    recommendedLength: '72"',
    lengthCm: 182,
    looseLength: '63"',
    width: '8.5mm Vintage Flat or 10mm Architectural Rope',
    image: '/images/hero.jpg',
    description: 'High ankle collars demand extended thread length to achieve either a majestic loose streetwear hang or high-knot tie.'
  }
];

export const SNEAKER_SILHOUETTES = FOOTWEAR_CATEGORIES;

export const PRODUCTS = [
  {
    id: 'design-lab-4pack-capsule',
    title: 'ALCE Design Lab — S\'25 Collector Box (4-Pack)',
    subtitle: 'Limited Seasonal Capsule with Leopard, Baroque Crimson, Olive Damier & Plum',
    category: 'design-lab',
    categoryName: 'Design Lab S\'25',
    price: 1999,
    compareAtPrice: 2899,
    badge: 'Collector Vault',
    rating: 5.0,
    reviewsCount: 64,
    inStock: true,
    stockLeft: 3,
    isPopular: true,
    primaryImage: '/images/design-lab-collection.jpg',
    hoverImage: '/images/product-paisley.jpg',
    description: 'The definitive seasonal drop from the laceyaan India Design Lab. A curated 4-piece collector box showcasing our most ambitious Jacquard textile weaves: the Safari Leopard flat lace with matte black aglets, the Crimson Baroque Tapestry with white ceramic tips, the Tonal Olive Damier Camo, and the Imperial Plum Waffle weave. Presented in an embossed textured matte black collector chest.',
    features: [
      'Complete set of all 4 exclusive Design Lab S\'25 laces',
      'Individual custom-coated aglets (Matte Black, Pure White, Olive Drab, Plum)',
      'High-definition Jacquard loom tapestry weaving (never surface-printed)',
      'Includes numbered edition card in embossed presentation box'
    ],
    availableLengths: ['45"', '54"', '63"'],
    defaultLength: '54"',
    swatches: [
      { name: 'S\'25 4-Pack Vault', hex: '#8B1E28', inStock: true }
    ],
    agletFinishes: [
      { id: 'custom-lab', name: 'Original Lab Coated Tips', color: '#1B1B1B' },
      { id: 'brass-gold', name: 'Solid Brass Gold Tips', color: '#D4AF37' }
    ]
  },
  {
    id: 'baroque-tapestry-crimson',
    title: 'Baroque Bandana Tapestry Laces — Crimson Red',
    subtitle: 'Intricate Floral & Ornamental Jacquard with Pure White Ceramic Tips',
    category: 'design-lab',
    categoryName: 'Design Lab S\'25',
    price: 949,
    compareAtPrice: 1449,
    badge: 'Staff Pick',
    rating: 5.0,
    reviewsCount: 88,
    inStock: true,
    stockLeft: 6,
    isPopular: true,
    primaryImage: '/images/product-paisley.jpg',
    hoverImage: '/images/design-lab-collection.jpg',
    description: 'Inspired by archival paisley bandana motifs and royal tapestries. Each thread is Jacquard-woven from combed mercerized cotton, creating a sharp three-dimensional contrast between the deep crimson wine base and bone-white embroidery. Finished with a clean, high-gloss white ceramic coated brass aglet.',
    features: [
      'High-thread-count double-faced Jacquard tapestry weave',
      'Ultra-clean pure white ceramic coated solid metal aglets',
      'Engineered 8.5mm width for sneakers, lifestyle kicks, and designer high-tops',
      'Fade-proof vat dyed yarns that retain vibrancy indefinitely'
    ],
    availableLengths: ['45"', '54"', '63"', '72"'],
    defaultLength: '54"',
    swatches: [
      { name: 'Baroque Crimson', hex: '#8B1E28', inStock: true },
      { name: 'Imperial Navy', hex: '#1C2E4A', inStock: true },
      { name: 'Monochrome Noir', hex: '#1C1C1E', inStock: true }
    ],
    agletFinishes: [
      { id: 'white-ceramic', name: 'Pure White Ceramic Tips', color: '#F4F4F4' },
      { id: 'brass-gold', name: '24K Gold Aglets', color: '#D4AF37' }
    ]
  },
  {
    id: 'wildcat-leopard-jacquard',
    title: 'Wildcat Leopard Jacquard Laces — Safari Ochre',
    subtitle: 'High-Density Woven Animal Print with Matte Black Anodized Aglets',
    category: 'design-lab',
    categoryName: 'Design Lab S\'25',
    price: 899,
    compareAtPrice: 1399,
    badge: 'Trending',
    rating: 4.9,
    reviewsCount: 104,
    inStock: true,
    stockLeft: 8,
    isPopular: true,
    primaryImage: '/images/product-leopard.jpg',
    hoverImage: '/images/design-lab-collection.jpg',
    description: 'A bold, tactile streetwear essential. Rather than cheap printed fabric that peels, our leopard spots are woven directly into the structural grain using dual-tone ochre and espresso threads. Sealed with heavy matte black dipped aglets for a stealth architectural finish.',
    features: [
      'True woven Jacquard leopard pattern with textured depth',
      'Stealth matte black anodized metal aglets that resist chipping',
      'Optimal drape on casual sneakers, retro court low-tops, and lifestyle footwear',
      'Treated with beeswax for maximum knot retention'
    ],
    availableLengths: ['45"', '54"', '63"'],
    defaultLength: '54"',
    swatches: [
      { name: 'Safari Ochre', hex: '#C29352', inStock: true },
      { name: 'Snow Leopard', hex: '#9E9E9E', inStock: true }
    ],
    agletFinishes: [
      { id: 'matte-black', name: 'Stealth Matte Black', color: '#1B1B1B' },
      { id: 'brass-gold', name: 'Solid Brass Gold', color: '#D4AF37' }
    ]
  },
  {
    id: 'tonal-olive-damier-camo',
    title: 'Tonal Damier Camo Laces — Olive Tactical',
    subtitle: 'Subtle Geometric Damier Weave with Tonal Olive Metal Tips',
    category: 'design-lab',
    categoryName: 'Design Lab S\'25',
    price: 899,
    compareAtPrice: 1349,
    badge: 'Design Lab S\'25',
    rating: 4.9,
    reviewsCount: 73,
    inStock: true,
    stockLeft: 11,
    isPopular: false,
    primaryImage: '/images/product-olive.jpg',
    hoverImage: '/images/design-lab-collection.jpg',
    description: 'Understated military luxury. Features an intricate micro-geometric damier weave that reveals tonal depth under varying angles of light. Paired with custom powder-coated olive green metal aglets designed to seamlessly complement earth-toned sneakers, Travis Scott collaborations, and New Balance runners.',
    features: [
      'Dimensional tonal micro-damier weave with organic hand-feel',
      'Matching matte olive green powder-coated brass aglets',
      'Universal 3.8mm aglet diameter glides smoothly through all eyelets',
      'Durable, abrasion-tested shuttle weave'
    ],
    availableLengths: ['45"', '54"', '63"', '72"'],
    defaultLength: '54"',
    swatches: [
      { name: 'Olive Tactical', hex: '#5A6348', inStock: true },
      { name: 'Desert Sand', hex: '#C4B598', inStock: true }
    ],
    agletFinishes: [
      { id: 'tonal-olive', name: 'Tonal Matte Olive', color: '#5A6348' },
      { id: 'matte-black', name: 'Matte Black', color: '#1B1B1B' }
    ]
  },
  {
    id: 'imperial-plum-waffle-weave',
    title: 'Imperial Plum Waffle Laces — Deep Violet',
    subtitle: 'Dimensional Herringbone Waffle Texture with Tonal Purple Aglets',
    category: 'design-lab',
    categoryName: 'Design Lab S\'25',
    price: 849,
    compareAtPrice: 1299,
    badge: 'New Drop',
    rating: 4.8,
    reviewsCount: 52,
    inStock: true,
    stockLeft: 9,
    isPopular: false,
    primaryImage: '/images/product-plum.jpg',
    hoverImage: '/images/design-lab-collection.jpg',
    description: 'An opulent waffle texture rendered in deep royal plum. The three-dimensional waffle weave delivers substantial spring and knot security, while the matching purple enamel aglet provides an unbroken, monochromatic silhouette for collectors seeking sophisticated contrast.',
    features: [
      '3D waffle knit structure with natural elasticity and knot grip',
      'Monochromatic tonal plum coated solid alloy aglet tips',
      'Deep, lightfast vat dye resistant to water and ultraviolet fade',
      'Stunning pairing with black, white, cream, and grey uppers'
    ],
    availableLengths: ['45"', '54"', '63"'],
    defaultLength: '54"',
    swatches: [
      { name: 'Imperial Plum', hex: '#632B59', inStock: true },
      { name: 'Midnight Berry', hex: '#411C3A', inStock: true }
    ],
    agletFinishes: [
      { id: 'tonal-plum', name: 'Tonal Plum Aglets', color: '#632B59' },
      { id: 'brushed-silver', name: 'Brushed Silver', color: '#C0C0C0' }
    ]
  },
  {
    id: 'heritage-waxed-flat-sail',
    title: 'Heritage Waxed Flat Laces — Vintage Sail',
    subtitle: '100% Japanese Shuttle Weave Cotton with Solid Brass Aglets',
    category: 'waxed-flat',
    categoryName: 'Waxed Flat',
    price: 699,
    compareAtPrice: 999,
    badge: 'Bestseller',
    rating: 4.9,
    reviewsCount: 184,
    inStock: true,
    stockLeft: 9,
    isPopular: true,
    primaryImage: '/images/product-waxed.jpg',
    hoverImage: '/images/hero.jpg',
    description: 'Our flagship flat lace woven on vintage Japanese shuttle looms. Coated in a natural micro-beeswax blend that resists dirt, maintains a crisp structural drape, and never slips undone. Hand-finished with threaded solid brass aglets laser-engraved with the laceyaan monogram.',
    features: [
      '8mm width engineered precisely for casual sneakers, court shoes & retro silhouettes',
      'Dual-dip organic beeswax infusion for water repellency and tactile feel',
      'Solid CNC-milled brass aglets (will never peel or crack like plastic tips)',
      'Shrink and fade resistant weave tested up to 20,000 tension cycles'
    ],
    availableLengths: ['36"', '45"', '54"', '63"', '72"'],
    defaultLength: '54"',
    swatches: [
      { name: 'Vintage Sail', hex: '#EBE6DC', inStock: true },
      { name: 'Chalk White', hex: '#F7F6F2', inStock: true },
      { name: 'Mocha Brown', hex: '#4A3728', inStock: true },
      { name: 'Obsidian Black', hex: '#18181A', inStock: true },
      { name: 'Forest Evergreen', hex: '#243E36', inStock: false },
      { name: 'University Burgundy', hex: '#5C1D24', inStock: true }
    ],
    agletFinishes: [
      { id: 'brass-gold', name: 'Polished Brass Gold', color: '#D4AF37' },
      { id: 'brushed-silver', name: 'Brushed Silver', color: '#C0C0C0' },
      { id: 'matte-black', name: 'Matte Gunmetal', color: '#2B2B2B' },
      { id: 'antique-bronze', name: 'Antique Bronze', color: '#7E5E38' }
    ]
  },
  {
    id: 'pure-white-waxed-flat',
    title: 'Heritage Waxed Flat Laces — Pure Crisp White',
    subtitle: '100% Mercerized Cotton in Ultra-Clean Bleached White with Polished Aglets',
    category: 'waxed-flat',
    categoryName: 'Waxed Flat',
    price: 699,
    compareAtPrice: 999,
    badge: 'Essential Solid',
    rating: 5.0,
    reviewsCount: 168,
    inStock: true,
    stockLeft: 14,
    isPopular: true,
    primaryImage: '/images/product-pure-white.jpg',
    hoverImage: '/images/after.jpg',
    description: 'The definitive pure stark white shoelace. Woven on vintage shuttle looms from 100% double-combed mercerized cotton, treated with bleached natural beeswax for dirt resistance and an immaculate snow-white finish that never turns dull or yellow. Finished with laser-engraved solid brass or polished silver aglets.',
    features: [
      'Stark pure optical white hue engineered to match triple-white sneakers',
      'Infused with purified beeswax to repel street grime, mud, and water',
      'Solid CNC-machined metal aglets that will never crack or fray',
      'Universal 8mm flat width fits casual sneakers, court shoes, and sport trainers'
    ],
    availableLengths: ['36"', '45"', '54"', '63"', '72"'],
    defaultLength: '54"',
    swatches: [
      { name: 'Pure Stark White', hex: '#FFFFFF', inStock: true },
      { name: 'Chalk White', hex: '#F5F5F0', inStock: true }
    ],
    agletFinishes: [
      { id: 'brushed-silver', name: 'Polished Mirror Silver', color: '#E0E0E0' },
      { id: 'brass-gold', name: 'Solid Brass Gold', color: '#D4AF37' },
      { id: 'white-ceramic', name: 'Pure White Ceramic', color: '#FFFFFF' }
    ]
  },
  {
    id: 'pure-black-waxed-flat',
    title: 'Heritage Waxed Flat Laces — Pitch Obsidian Black',
    subtitle: 'Deep Jet-Black Vat-Dyed Weave with Stealth Matte Gunmetal Tips',
    category: 'waxed-flat',
    categoryName: 'Waxed Flat',
    price: 699,
    compareAtPrice: 999,
    badge: 'Essential Solid',
    rating: 5.0,
    reviewsCount: 195,
    inStock: true,
    stockLeft: 12,
    isPopular: true,
    primaryImage: '/images/product-pure-black.jpg',
    hoverImage: '/images/lookbook.jpg',
    description: 'An unapologetically deep obsidian jet-black flat lace. Double vat-dyed using fade-proof pigments that preserve absolute pitch-black saturation even after thousands of miles of wear. Infused with micro-beeswax for a subtle luxury sheen and locked knot grip.',
    features: [
      'True deep pitch obsidian black with zero grey or blue undertones',
      'Double-dip beeswax infusion creates rich tactile drape and water resistance',
      'Stealth matte gunmetal or 24K gold CNC metal aglets with micro lock screws',
      'The essential upgrade for monochrome kicks, black leather sneakers, and sport shoes'
    ],
    availableLengths: ['36"', '45"', '54"', '63"', '72"'],
    defaultLength: '54"',
    swatches: [
      { name: 'Pitch Obsidian Black', hex: '#111112', inStock: true },
      { name: 'Matte Charcoal', hex: '#2B2B2B', inStock: true }
    ],
    agletFinishes: [
      { id: 'matte-black', name: 'Stealth Matte Gunmetal', color: '#1F1F1F' },
      { id: 'brass-gold', name: '24K Polished Gold', color: '#D4AF37' },
      { id: 'brushed-silver', name: 'Brushed Silver', color: '#C0C0C0' }
    ]
  },
  {
    id: 'chunky-rope-natural-ecru',
    title: 'Chunky Braided Rope Laces — Natural Ecru',
    subtitle: '10mm Heavy Density Cotton with Solid Gunmetal & Gold Tips',
    category: 'chunky-rope',
    categoryName: 'Chunky Rope',
    price: 899,
    compareAtPrice: 1299,
    badge: 'Trending',
    rating: 5.0,
    reviewsCount: 142,
    inStock: true,
    stockLeft: 5,
    isPopular: true,
    primaryImage: '/images/product-rope.jpg',
    hoverImage: '/images/after.jpg',
    description: 'A bold, heavyweight architectural statement. 10mm triple-braided luxury rope laces engineered for footwear enthusiasts who appreciate volume, drape, and runway-inspired custom aesthetics. Instantly modernizes chunky sneakers, retro court kicks, and modern sport footwear.',
    features: [
      '10mm triple-core woven rope construction with substantial hand-feel',
      'Solid screw-on metal hardware preventing accidental unspooling',
      'Pre-washed combed cotton for an ultra-soft vintage touch',
      'Includes mini installation aglet key in premium collector presentation box'
    ],
    availableLengths: ['45"', '54"', '63"'],
    defaultLength: '54"',
    swatches: [
      { name: 'Natural Ecru', hex: '#E8E1D5', inStock: true },
      { name: 'Stealth Black', hex: '#1C1C1E', inStock: true },
      { name: 'Stone Heather', hex: '#A8A6A1', inStock: true },
      { name: 'Sage Moss', hex: '#7A8471', inStock: true },
      { name: 'Terracotta Dune', hex: '#A86548', inStock: true }
    ],
    agletFinishes: [
      { id: 'brass-gold', name: 'Polished Brass Gold', color: '#D4AF37' },
      { id: 'matte-black', name: 'Matte Gunmetal', color: '#2B2B2B' },
      { id: 'brushed-silver', name: 'Brushed Silver', color: '#C0C0C0' }
    ]
  },
  {
    id: 'reflective-3m-diamond-stealth',
    title: '3M™ Nocturnal Reflective Laces — Diamond Grid',
    subtitle: 'Interwoven Scotchlite™ Micro-Prism Glass Bead Fibers',
    category: 'reflective',
    categoryName: '3M Reflective',
    price: 949,
    compareAtPrice: 1399,
    badge: 'High Visibility',
    rating: 4.8,
    reviewsCount: 96,
    inStock: true,
    stockLeft: 12,
    isPopular: false,
    primaryImage: '/images/product-reflective.jpg',
    hoverImage: '/images/lookbook.jpg',
    description: 'Engineered for night owls and street photographers. Blending high-tensile polyester with authentic 3M™ Scotchlite™ reflective micro-bead filament that bursts into brilliant retro-reflective illumination whenever hit by direct flash, headlights, or camera lenses.',
    features: [
      '360° retro-reflective yarn woven seamlessly into both faces of the lace',
      'Solid alloy aglets with matte vapor deposition coating',
      'Ultra-durable weather-sealed construction against rain, mud, and friction',
      'Perfect match for technical streetwear, Air Max silhouettes, and night running'
    ],
    availableLengths: ['45"', '54"', '63"'],
    defaultLength: '54"',
    swatches: [
      { name: 'Stealth Black 3M', hex: '#202022', inStock: true },
      { name: 'Static Silver 3M', hex: '#DCDFE2', inStock: true },
      { name: 'Solar Orange 3M', hex: '#D65324', inStock: true },
      { name: 'Electric Volt 3M', hex: '#B8D832', inStock: true }
    ],
    agletFinishes: [
      { id: 'matte-black', name: 'Matte Gunmetal', color: '#2B2B2B' },
      { id: 'brushed-silver', name: 'Brushed Silver', color: '#C0C0C0' }
    ]
  },
  {
    id: 'solid-metal-aglet-custom-kit',
    title: 'Solid Metal Aglet Hardware Set (Pack of 4)',
    subtitle: 'Solid Milled Brass with Micro-Screws & Precision Tool',
    category: 'hardware',
    categoryName: 'Hardware & Kits',
    price: 799,
    compareAtPrice: 1199,
    badge: 'Essential Tool',
    rating: 4.9,
    reviewsCount: 231,
    inStock: true,
    stockLeft: 19,
    isPopular: true,
    primaryImage: '/images/product-aglets.jpg',
    hoverImage: '/images/hero.jpg',
    description: 'Upgrade any pair of laces in your collection. CNC-machined from solid naval brass and finished with electroplated coatings that will never tarnish or corrode. Includes 4 precision aglets, 8 micro set-screws, a custom knurled steel screwdriver, and high-bond tip sealant.',
    features: [
      'Internal threading with micro locking set-screws for zero slippage',
      'Universal diameter (3.8mm) accommodates standard flat, oval, and round laces',
      'Available in 4 artisanal finishes: 24K Gold, Brushed Titanium, Gunmetal, Antique Brass',
      'Comes packaged in a foam-cushioned magnetic presentation gift box'
    ],
    availableLengths: ['Universal Fit (Pack of 4)'],
    defaultLength: 'Universal Fit (Pack of 4)',
    swatches: [
      { name: '24K Mirror Gold', hex: '#E5C158', inStock: true },
      { name: 'Brushed Titanium Silver', hex: '#C7C9CC', inStock: true },
      { name: 'Matte Gunmetal', hex: '#262626', inStock: true },
      { name: 'Antique Patina Brass', hex: '#8C6E43', inStock: true }
    ],
    agletFinishes: [
      { id: 'brass-gold', name: '24K Gold Set', color: '#D4AF37' },
      { id: 'brushed-silver', name: 'Brushed Silver Set', color: '#C0C0C0' },
      { id: 'matte-black', name: 'Matte Gunmetal Set', color: '#2B2B2B' },
      { id: 'antique-bronze', name: 'Antique Brass Set', color: '#7E5E38' }
    ]
  },
  {
    id: 'vintage-aged-cotton-flat',
    title: 'Vintage Sun-Faded Flat Laces — Butter Cream',
    subtitle: 'Enzyme-Washed Japanese Cotton with Distressed Patina',
    category: 'vintage',
    categoryName: 'Vintage & Aged',
    price: 799,
    compareAtPrice: 1149,
    badge: 'Collector Choice',
    rating: 4.9,
    reviewsCount: 118,
    inStock: true,
    stockLeft: 7,
    isPopular: false,
    primaryImage: '/images/product-vintage.jpg',
    hoverImage: '/images/after.jpg',
    description: 'Give brand new sneakers an authentic 1985 archival warmth. Each pair undergoes an organic enzyme stone wash and gentle sun treatment to produce subtle tonal variations that look naturally aged rather than artificially dyed. Completed with antique bronze distressed aglets.',
    features: [
      'Archival 1980s herringbone weave texture with soft tactile drape',
      'Enzyme stone-washed for authentic vintage shoe customization',
      'Burnished antique bronze metal aglets with subtle hand-patina',
      'Ideal for vintage sneakers, retro court shoes, casual low-tops, and minimalist kicks'
    ],
    availableLengths: ['45"', '54"', '63"', '72"'],
    defaultLength: '54"',
    swatches: [
      { name: 'Butter Cream', hex: '#E8DFCA', inStock: true },
      { name: 'Aged Pistachio', hex: '#C2C8B5', inStock: true },
      { name: 'Faded Terracotta', hex: '#B87A65', inStock: true },
      { name: 'Washed Ash Charcoal', hex: '#4A4A48', inStock: true }
    ],
    agletFinishes: [
      { id: 'antique-bronze', name: 'Antique Bronze', color: '#7E5E38' },
      { id: 'brass-gold', name: 'Aged Gold', color: '#D4AF37' }
    ]
  },
  {
    id: 'artisan-calfskin-leather-cognac',
    title: 'Artisan Calfskin Leather Laces — Cognac Tan',
    subtitle: 'Hand-Cut Full-Grain Italian Leather with Screw-On Aglets',
    category: 'luxury-leather',
    categoryName: 'Luxury Leather',
    price: 1299,
    compareAtPrice: 1899,
    badge: 'Limited Edition',
    rating: 5.0,
    reviewsCount: 77,
    inStock: true,
    stockLeft: 4,
    isPopular: false,
    primaryImage: '/images/product-leather.jpg',
    hoverImage: '/images/hero.jpg',
    description: 'The pinnacle of luxury shoelace craftsmanship. Beveled and burnished by hand from premium full-grain Italian calfskin, impregnated with natural waxes for suppleness and durability. Anchored with dual-screw 24K gold plated brass tips.',
    features: [
      '100% full-grain European calfskin leather with hand-burnished edges',
      'Naturally water-resistant and develops a gorgeous deep patina over years',
      'Solid 24K gold-plated screw aglets with precision lock threads',
      'Transforms boots, designer leather sneakers, and luxury minimal footwear'
    ],
    availableLengths: ['45"', '54"', '63"', '72"'],
    defaultLength: '54"',
    swatches: [
      { name: 'Cognac Tan', hex: '#8B4513', inStock: true },
      { name: 'Rich Espresso', hex: '#3B2219', inStock: true },
      { name: 'Pitch Black', hex: '#141414', inStock: true },
      { name: 'Bone White', hex: '#EAE6DF', inStock: true }
    ],
    agletFinishes: [
      { id: 'brass-gold', name: '24K Gold Aglets', color: '#D4AF37' },
      { id: 'brushed-silver', name: 'Polished Silver Aglets', color: '#C0C0C0' }
    ]
  }
,
  {
    id: 'midnight-velvet-chenille',
    title: 'Midnight Velvet Silk Chenille Laces — Royal Sapphire Navy',
    subtitle: 'Ultra-Plush Woven Silk-Velvet with Mirror-Polished 24K Gold Aglets',
    category: 'velvet-couture',
    categoryName: 'Velvet Couture',
    price: 999,
    compareAtPrice: 1499,
    badge: 'Couture Drop',
    rating: 5.0,
    reviewsCount: 48,
    inStock: true,
    stockLeft: 7,
    isPopular: true,
    primaryImage: '/images/product-velvet.jpg',
    hoverImage: '/images/lookbook.jpg',
    description: 'A sumptuous high-fashion statement. Crafted from double-faced silk-blend velvet chenille that catches ambient lighting with deep sapphire iridescence. Engineered with solid 24K gold mirror-polished screw aglets to elevate luxury designer sneakers, Chelsea dress boots, and evening formal footwear.',
    features: [
      'Double-faced plush silk-velvet with weighted architectural drape',
      'Solid 24K mirror-polished gold brass aglets laser-engraved with monogram',
      'Reinforced core prevents stretching under high walking tension',
      'Engineered width fits all sneaker, designer boot, and dress eyelets effortlessly'
    ],
    availableLengths: ['45"', '54"', '63"'],
    defaultLength: '54"',
    swatches: [
      { name: 'Royal Sapphire Navy', hex: '#1B2845', inStock: true },
      { name: 'Onyx Black Velvet', hex: '#0B0C10', inStock: true },
      { name: 'Bordeaux Wine', hex: '#4A0E17', inStock: true }
    ],
    agletFinishes: [
      { id: 'brass-gold', name: '24K Mirror Gold', color: '#D4AF37' },
      { id: 'brushed-silver', name: 'Polished Silver', color: '#C0C0C0' }
    ]
  },
  {
    id: 'ballistic-carbon-kevlar',
    title: 'Ballistic Carbon Aramid Laces — Stealth Matrix Weave',
    subtitle: 'Aerospace Aramid Fibers with Titanium Gunmetal Screw Aglets',
    category: 'reflective',
    categoryName: 'Technical & Carbon',
    price: 1199,
    compareAtPrice: 1699,
    badge: 'Indestructible',
    rating: 4.9,
    reviewsCount: 62,
    inStock: true,
    stockLeft: 9,
    isPopular: true,
    primaryImage: '/images/product-carbon.jpg',
    hoverImage: '/images/hero.jpg',
    description: 'Built with the structural integrity of aerospace composites. Interweaving high-tensile aramid fibers and carbon thread matrices, this lace is mathematically 500% stronger than standard commercial cotton. Finished with solid CNC titanium-finish gunmetal tips.',
    features: [
      'High-tensile aramid and carbon filament braided for zero fraying or snap',
      'Solid CNC titanium-toned gunmetal locking screw hardware',
      'Tested to withstand 50,000 continuous abrasion friction cycles',
      'Engineered for tactical boots, technical runners, and extreme durability'
    ],
    availableLengths: ['45"', '54"', '63"', '72"'],
    defaultLength: '54"',
    swatches: [
      { name: 'Stealth Matrix Black', hex: '#1A1A1A', inStock: true },
      { name: 'Carbon Graphite', hex: '#3E3E3E', inStock: true }
    ],
    agletFinishes: [
      { id: 'matte-black', name: 'Titanium Gunmetal', color: '#2B2B2B' },
      { id: 'brass-gold', name: '24K Gold Accent', color: '#D4AF37' }
    ]
  },
  {
    id: 'split-duo-tone-monochrome',
    title: 'Split Duo-Tone Flat Waxed Laces — Eclipse (Sail & Obsidian)',
    subtitle: 'Half Cream Sail, Half Pitch Black Double-Braided Japanese Cotton',
    category: 'waxed-flat',
    categoryName: 'Waxed Flat',
    price: 899,
    compareAtPrice: 1299,
    badge: 'Two-Tone Weave',
    rating: 5.0,
    reviewsCount: 91,
    inStock: true,
    stockLeft: 11,
    isPopular: true,
    primaryImage: '/images/product-duotone.jpg',
    hoverImage: '/images/after.jpg',
    description: 'A striking optical split for collectors seeking asymmetrical elegance. Seamlessly transitioning down the exact center axis from Vintage Sail to Obsidian Black using interlocking shuttle loom threads. Infused with natural beeswax and capped with dual-finish split metal aglets.',
    features: [
      'Seamless split double-woven dual colorway across the entire lace span',
      'Double-dipped organic beeswax treatment for tactile hold and knot security',
      'One end capped in 24K Gold, opposite end capped in Stealth Gunmetal',
      'Creates instant runway contrast on monochrome or neutral silhouettes'
    ],
    availableLengths: ['45"', '54"', '63"', '72"'],
    defaultLength: '54"',
    swatches: [
      { name: 'Eclipse (Sail / Obsidian)', hex: '#2A2927', inStock: true },
      { name: 'Dawn (White / Cream)', hex: '#EFECE6', inStock: true }
    ],
    agletFinishes: [
      { id: 'split-aglets', name: 'Duo Gold & Gunmetal Set', color: '#D4AF37' },
      { id: 'brass-gold', name: 'Dual 24K Gold Set', color: '#D4AF37' }
    ]
  },
  {
    id: 'ombre-sunset-gradient',
    title: 'Sunset Horizon Ombré Laces — Tuscan Amber Dip-Dye',
    subtitle: 'Artisan Kettle Dip-Dyed Cotton with Brushed Rose Gold Aglets',
    category: 'vintage',
    categoryName: 'Vintage & Aged',
    price: 1099,
    compareAtPrice: 1599,
    badge: 'Artisan Dip-Dye',
    rating: 4.9,
    reviewsCount: 53,
    inStock: true,
    stockLeft: 6,
    isPopular: false,
    primaryImage: '/images/product-ombre.jpg',
    hoverImage: '/images/product-vintage.jpg',
    description: 'Each lace is individually dip-dyed in small copper kettles by textile artisans. The warm amber ochre gradually flows into deep twilight charcoal, creating an unrepeatable artisanal gradient across the eyelets. Finished with bespoke brushed rose gold brass tips.',
    features: [
      'Hand-dipped artisan gradient: no two pairs are strictly identical',
      '100% long-staple combed cotton with subtle vintage wash',
      'Solid brushed rose gold metal aglets with engraved monogram',
      'Transforms earth-toned, suede, and vintage court sneakers into bespoke works of art'
    ],
    availableLengths: ['45"', '54"', '63"'],
    defaultLength: '54"',
    swatches: [
      { name: 'Tuscan Amber Sunset', hex: '#C27D38', inStock: true },
      { name: 'Nordic Indigo Dawn', hex: '#3B4D61', inStock: true }
    ],
    agletFinishes: [
      { id: 'rose-gold', name: 'Brushed Rose Gold', color: '#B76E79' },
      { id: 'antique-bronze', name: 'Antique Bronze', color: '#7E5E38' }
    ]
  },
  {
    id: 'atelier-grand-master-vault',
    title: 'The Grand Master Archive Vault — 8-Piece Ultimate Collector Case',
    subtitle: '8 Archival Weaves, Full Solid Brass Hardware Kit & Handcrafted Box',
    category: 'design-lab',
    categoryName: 'Collector Vault',
    price: 2899,
    compareAtPrice: 4499,
    badge: 'Master Archive',
    rating: 5.0,
    reviewsCount: 39,
    inStock: true,
    stockLeft: 2,
    isPopular: true,
    primaryImage: '/images/product-master-box.jpg',
    hoverImage: '/images/design-lab-collection.jpg',
    description: 'The crowning achievement of the laceyaan atelier. The Grand Master Archive Vault unites our 8 most celebrated weaves: Vintage Sail Waxed Flat, Pure White, Pure Black, 10mm Ecru Chunky Rope, 3M Nocturnal Reflective, Crimson Baroque Tapestry, Midnight Velvet, and Italian Calfskin Leather. Includes full interchangeable 16-piece solid brass aglet kit in a collector display chest.',
    features: [
      'Includes 8 full pairs of our highest-tier artisanal shoelaces',
      '16 interchangeable CNC solid metal aglet tips (Gold, Silver, Gunmetal, Ceramic)',
      'Precision steel threading key and 80g organic beeswax conditioning puck',
      'Individually serialized brass certificate plaque inside magnetic collector chest'
    ],
    availableLengths: ['54" (Universal Standard)', '63" (High-Top & Boots)'],
    defaultLength: '54" (Universal Standard)',
    swatches: [
      { name: 'Grand Master Vault (8 Pairs)', hex: '#D4AF37', inStock: true }
    ],
    agletFinishes: [
      { id: 'master-complete-kit', name: 'Complete 16-Piece Hardware Kit', color: '#D4AF37' }
    ]
  }
];

export const PRESS_QUOTES = [
  {
    quote: "laceyaan completely transforms any stock sneaker into a bespoke, high-fashion statement with flawless attention to hardware.",
    source: "HYPEBEAST",
    author: "Footwear & Design Editorial"
  },
  {
    quote: "The Japanese shuttle-weave cotton and solid brass aglets rival the craftsmanship of four-figure luxury sneakers.",
    source: "HIGHSNOBIETY",
    author: "Sneaker Culture Review"
  },
  {
    quote: "If you are still rocking cheap factory nylon laces on your grails, you are missing 50% of the silhouette's potential.",
    source: "COMPLEX SNEAKERS",
    author: "Staff Pick: Upgrades"
  },
  {
    quote: "The interactive length finder and before/after difference is staggering. laceyaan is the definitive standard in laces.",
    source: "KICKSONFIRE",
    author: "Accessory Spotlight"
  }
];

export const CUSTOMER_REVIEWS = [
  {
    id: 1,
    name: 'Marcus T.',
    location: 'Los Angeles, CA',
    sneaker: 'High-Top Leather Sneakers',
    rating: 5,
    date: '2 days ago',
    title: 'Elevated my high-tops to another stratosphere',
    comment: 'The 72" Vintage Sail flat waxed laces with solid brass tips took my high-top leather sneakers from off-the-shelf to looking like an archival bespoke pair. The drape is thick, substantial, and stays tied all day without slipping.',
    verified: true,
    laceUsed: 'Heritage Waxed Flat (Vintage Sail, 72")'
  },
  {
    id: 2,
    name: 'Chloe V.',
    location: 'London, UK',
    sneaker: 'Retro Court Low-Tops',
    rating: 5,
    date: '1 week ago',
    title: 'The chunky ecru rope is unreal on low-top sneakers',
    comment: 'Swapped out the thin standard laces for the 10mm chunky rope with gunmetal aglets on my casual court kicks. The compliments I get on the street are non-stop. Quality of the cotton is so soft yet holds its shape!',
    verified: true,
    laceUsed: 'Chunky Rope (Natural Ecru, 45")'
  },
  {
    id: 3,
    name: 'Julian K.',
    location: 'New Delhi, India',
    sneaker: 'Sport Running Trainers',
    rating: 5,
    date: '2 weeks ago',
    title: '3M reflective pops like crazy on evening runs',
    comment: 'Took flash photos at night and the micro-glass reflections look insane. Hardware is heavy solid metal with micro screws. Fast delivery across India too. Ordered 3 more sets immediately.',
    verified: true,
    laceUsed: '3M Nocturnal Reflective (Diamond Grid, 45")'
  }
];

export const FAQ_ITEMS = [
  {
    question: 'How do I choose the correct shoelace length for my shoes?',
    answer: 'The simplest way is using our interactive Shoelace Length Finder above! As a rule of thumb: 4-5 eyelet formal & low-tops (office dress shoes, retro court) require 36"–45", 6-7 eyelet casual & sport shoes require 45"–54", and 8-9 eyelet high-tops & leather boots require 63"–72". If you prefer an untied, loose-hanging drape, select one size shorter.'
  },
  {
    question: 'Will solid metal aglets fit through standard footwear eyelets?',
    answer: 'Yes! All laceyaan metal aglets are precision CNC-milled to an outer diameter of 3.8mm, which is rigorously tested to glide smoothly through 99.8% of modern sneakers, sport shoes, office dress eyelets, and boot lace holes.'
  },
  {
    question: 'What is the difference between waxed flat cotton and standard laces?',
    answer: 'Standard factory laces are mass-produced from cheap, synthetic polyester that frays, wrinkles, and continually comes untied. laceyaan laces are woven on heritage shuttle looms from 100% long-staple Japanese cotton and infused with natural micro-beeswax. This gives them a rich matte sheen, water resistance, rigid structural drape, and knot retention.'
  },
  {
    question: 'What is your shipping and return policy?',
    answer: 'We offer complimentary standard tracked shipping on all orders over ₹1,499 across India. Orders placed before 2:00 PM IST ship the same business day. We back every pair with our 30-Day Guaranteed Fit Policy: if the length or shade isn\'t 100% perfect for your shoes, exchange them for free!'
  }
];

export const CART_UPSELLS = [
  {
    id: 'screw-aglet-trio',
    title: 'CNC Brass Aglet Screw Set & Tool',
    price: 399,
    image: '/images/product-aglets.jpg',
    tag: 'Collector Set'
  },
  {
    id: 'lace-waterproofing-wax',
    title: 'Organic Beeswax Bar Conditioner (80g)',
    price: 499,
    image: '/images/product-waxed.jpg',
    tag: 'Atelier Formula'
  },
  {
    id: 'microfiber-polishing-cloth',
    title: 'Aglet & Sneaker Microfiber Cloth',
    price: 299,
    image: '/images/product-pure-white.jpg',
    tag: 'Essential Care'
  }
];
