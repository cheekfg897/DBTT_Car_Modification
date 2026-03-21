export interface Service {
  id: string;
  name: string;
  desc: string;
  duration: string;
  price: string;
  minPrice: number;
}

export const SERVICES: Service[] = [
  { id: 'car-wrap',       name: 'Car Wraps',              desc: 'Full or partial vinyl wrap in any finish',          duration: '1–2 days',  price: 'From $800',   minPrice: 800  },
  { id: 'spray-paint',    name: 'Spray Paint',             desc: 'Full respray or panel painting',                    duration: '2–3 days',  price: 'From $600',   minPrice: 600  },
  { id: 'solar-tint',     name: 'Solar Film Tinting',      desc: 'UV & heat rejection window film',                   duration: 'Same day',  price: 'From $250',   minPrice: 250  },
  { id: 'bodykit',        name: 'Bodykit Installation',    desc: 'Front/rear bumper & side skirt kits',               duration: '1–2 days',  price: 'From $1,200', minPrice: 1200 },
  { id: 'ppf',            name: 'Paint Protection Film',   desc: 'Self-healing transparent film',                     duration: '1–2 days',  price: 'From $1,500', minPrice: 1500 },
  { id: 'graphic-design', name: 'Graphic Design',          desc: 'Custom livery & decal design',                      duration: '1–2 days',  price: 'From $400',   minPrice: 400  },
  { id: 'exhaust',        name: 'Exhaust System',          desc: 'Cat-back, valved & titanium systems',               duration: 'Same day',  price: 'From $800',   minPrice: 800  },
  { id: 'spoiler',        name: 'Spoiler',                 desc: 'Ducktail, GT-wing & swan-neck options',             duration: 'Same day',  price: 'From $350',   minPrice: 350  },
  { id: 'hood',           name: 'Hood Modification',       desc: 'Carbon fibre & vented hood upgrades',               duration: 'Same day',  price: 'From $600',   minPrice: 600  },
  { id: 'sideskirt',      name: 'Side Skirts',             desc: 'Sport & carbon side skirt fitment',                 duration: 'Same day',  price: 'From $450',   minPrice: 450  },
];

export function getServiceName(id: string): string {
  return SERVICES.find((s) => s.id === id)?.name ?? id;
}
