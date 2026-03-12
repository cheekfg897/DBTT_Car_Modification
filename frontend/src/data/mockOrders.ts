import type { Order } from '../types/booking';

const cars = ['Toyota Supra MK5', 'Nissan GTR R35', 'BMW M4', 'Porsche 911 GT3', 'Mercedes AMG GT'];
const names = [
  'Alex Chen', 'Jordan Lee', 'Sam Rodriguez', 'Casey Kim', 'Morgan Tan',
  'Riley Patel', 'Avery Singh', 'Drew Williams', 'Jamie Park', 'Quinn Davis',
  'Taylor Wong', 'Skyler Nakamura', 'Reese Thompson', 'Blake Ishida', 'Parker Liu',
  'Hayden Okonkwo', 'Cameron Reyes', 'Dakota Chu', 'Emery Gupta', 'Finley Ng',
];

const colorDistribution = [
  { hex: '#8c8c8c', weight: 15 }, // Nardo Grey
  { hex: '#1a1a1a', weight: 12 }, // Midnight Black
  { hex: '#f5f5f5', weight: 10 }, // Arctic White
  { hex: '#c0392b', weight: 10 }, // Racing Red
  { hex: '#0066ff', weight: 8 },  // Electric Blue
  { hex: '#f97316', weight: 8 },  // Sunset Orange
  { hex: '#00b4d8', weight: 7 },  // Miami Blue
  { hex: '#1a3a8a', weight: 6 },  // Royal Blue
  { hex: '#7ed321', weight: 5 },  // Acid Green
  { hex: '#4a1a6b', weight: 4 },  // Deep Purple
  { hex: '#d40000', weight: 4 },  // Rosso Corsa
  { hex: '#f5c500', weight: 3 },  // Velocity Yellow
  { hex: '#4cbb17', weight: 3 },  // Verde Mantis
  { hex: '#e91e8c', weight: 3 },  // Hot Pink
  { hex: '#6b1a2a', weight: 2 },  // Burgundy
];

const finishDistribution = [
  { type: 'gloss', weight: 35 },
  { type: 'matte', weight: 30 },
  { type: 'satin', weight: 20 },
  { type: 'chrome', weight: 8 },
  { type: 'carbon', weight: 7 },
];

const modDistribution = [
  { id: 'exhaust-catback', weight: 25 },
  { id: 'spoiler-ducktail', weight: 20 },
  { id: 'bodykit-street', weight: 15 },
  { id: 'sideskirt-sport', weight: 15 },
  { id: 'hood-vented', weight: 12 },
  { id: 'exhaust-titanium', weight: 10 },
  { id: 'spoiler-gt', weight: 10 },
  { id: 'bodykit-widebody', weight: 8 },
  { id: 'hood-carbon', weight: 8 },
  { id: 'spoiler-swan', weight: 6 },
  { id: 'exhaust-valved', weight: 5 },
  { id: 'bodykit-carbon', weight: 4 },
  { id: 'sideskirt-carbon', weight: 7 },
];

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return s / 2147483647;
  };
}

function weightedPick<T extends { weight: number }>(items: T[], rand: () => number): T {
  const total = items.reduce((sum, item) => sum + item.weight, 0);
  let r = rand() * total;
  for (const item of items) {
    r -= item.weight;
    if (r <= 0) return item;
  }
  return items[items.length - 1];
}

function generateOrders(): Order[] {
  const rand = seededRandom(42);
  const orders: Order[] = [];

  for (let i = 0; i < 60; i++) {
    const color = weightedPick(colorDistribution, rand);
    const finish = weightedPick(finishDistribution, rand);

    // Pick 1-4 mods, with co-purchase patterns
    const numMods = Math.floor(rand() * 4) + 1;
    const mods: string[] = [];
    for (let j = 0; j < numMods; j++) {
      const mod = weightedPick(modDistribution, rand);
      if (!mods.includes(mod.id)) mods.push(mod.id);
    }

    // Co-purchase boost: if matte finish, likely add tint (simulated by always including tint price factor)
    const tint = finish.type === 'matte' ? 0.6 + rand() * 0.3 : rand() * 0.7;

    const month = Math.floor(rand() * 6);
    const day = Math.floor(rand() * 28) + 1;
    const date = `2026-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

    const basePrice = 150 + (finish.type === 'chrome' ? 800 : finish.type === 'carbon' ? 1200 : finish.type === 'matte' ? 350 : finish.type === 'satin' ? 300 : 200);
    const modPrices: Record<string, number> = {
      'spoiler-ducktail': 450, 'spoiler-gt': 1200, 'spoiler-swan': 1800,
      'exhaust-catback': 800, 'exhaust-titanium': 2200, 'exhaust-valved': 3000,
      'bodykit-street': 2500, 'bodykit-widebody': 5000, 'bodykit-carbon': 8000,
      'hood-vented': 900, 'hood-carbon': 2000,
      'sideskirt-sport': 600, 'sideskirt-carbon': 1200,
    };
    const totalPrice = basePrice + 100 + 200 + 100 + mods.reduce((sum, m) => sum + (modPrices[m] || 0), 0);

    orders.push({
      id: `ORD-${String(i + 1).padStart(3, '0')}`,
      customerName: names[Math.floor(rand() * names.length)],
      car: cars[Math.floor(rand() * cars.length)],
      bodyColor: color.hex,
      finishType: finish.type,
      windowTint: Math.round(tint * 100) / 100,
      rimColor: rand() > 0.5 ? '#1a1a1a' : '#808080',
      caliperColor: rand() > 0.6 ? '#ff0000' : rand() > 0.3 ? '#f97316' : '#ffff00',
      mods,
      totalPrice,
      date,
    });
  }

  return orders;
}

export const MOCK_ORDERS = generateOrders();
