import type { ModOption, FinishPreset } from '../types/customization';

export const FINISH_PRESETS: FinishPreset[] = [
  { name: 'Gloss', type: 'gloss', roughness: 0.11, metalness: 0.8, price: 200 },
  { name: 'Matte', type: 'matte', roughness: 0.9, metalness: 0.0, price: 350 },
  { name: 'Satin', type: 'satin', roughness: 0.4, metalness: 0.5, price: 300 },
  { name: 'Chrome', type: 'chrome', roughness: 0.0, metalness: 1.0, price: 800 },
  { name: 'Carbon Fiber', type: 'carbon', roughness: 0.5, metalness: 0.3, price: 1200 },
];

export const MOD_OPTIONS: ModOption[] = [
  // Spoilers
  { id: 'spoiler-ducktail', category: 'spoiler', name: 'Ducktail Spoiler', description: 'Subtle lip spoiler for a clean look', price: 450 },
  { id: 'spoiler-gt', category: 'spoiler', name: 'GT Wing', description: 'High-downforce racing wing', price: 1200 },
  { id: 'spoiler-swan', category: 'spoiler', name: 'Swan Neck Wing', description: 'Top-mounted racing wing', price: 1800 },

  // Exhausts
  { id: 'exhaust-catback', category: 'exhaust', name: 'Cat-Back Exhaust', description: 'Stainless steel, deeper tone', price: 800 },
  { id: 'exhaust-titanium', category: 'exhaust', name: 'Titanium Exhaust', description: 'Lightweight titanium, aggressive sound', price: 2200 },
  { id: 'exhaust-valved', category: 'exhaust', name: 'Valved Exhaust', description: 'Switchable quiet/loud modes', price: 3000 },

  // Body Kits
  { id: 'bodykit-street', category: 'bodykit', name: 'Street Aero Kit', description: 'Front lip + side skirts + rear diffuser', price: 2500 },
  { id: 'bodykit-widebody', category: 'bodykit', name: 'Widebody Kit', description: 'Flared fenders + aggressive stance', price: 5000 },
  { id: 'bodykit-carbon', category: 'bodykit', name: 'Carbon Aero Package', description: 'Full carbon fiber aero components', price: 8000 },

  // Hoods
  { id: 'hood-vented', category: 'hood', name: 'Vented Hood', description: 'Heat extraction vents', price: 900 },
  { id: 'hood-carbon', category: 'hood', name: 'Carbon Fiber Hood', description: 'Lightweight carbon with clear coat', price: 2000 },

  // Side Skirts
  { id: 'sideskirt-sport', category: 'sideskirt', name: 'Sport Side Skirts', description: 'Aerodynamic side profile', price: 600 },
  { id: 'sideskirt-carbon', category: 'sideskirt', name: 'Carbon Side Skirts', description: 'Carbon fiber side extensions', price: 1200 },
];

export const RESPRAY_BASE_PRICE = 150;
export const TINT_BASE_PRICE = 100;
export const RIM_COLOR_PRICE = 200;
export const CALIPER_COLOR_PRICE = 100;
