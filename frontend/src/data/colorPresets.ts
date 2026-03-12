import type { ColorPreset } from '../types/customization';

export const COLOR_PRESETS: ColorPreset[] = [
  // Neutral
  { name: 'Arctic White', hex: '#f5f5f5', category: 'neutral' },
  { name: 'Midnight Black', hex: '#1a1a1a', category: 'neutral' },
  { name: 'Nardo Grey', hex: '#8c8c8c', category: 'neutral' },
  { name: 'Cement Grey', hex: '#a0a0a0', category: 'neutral' },
  { name: 'Gunmetal', hex: '#4a4a4a', category: 'neutral' },

  // Classic
  { name: 'Racing Red', hex: '#c0392b', category: 'classic' },
  { name: 'British Racing Green', hex: '#1a5632', category: 'classic' },
  { name: 'Royal Blue', hex: '#1a3a8a', category: 'classic' },
  { name: 'Deep Purple', hex: '#4a1a6b', category: 'classic' },
  { name: 'Burgundy', hex: '#6b1a2a', category: 'classic' },

  // Sport
  { name: 'Acid Green', hex: '#7ed321', category: 'sport' },
  { name: 'Electric Blue', hex: '#0066ff', category: 'sport' },
  { name: 'Sunset Orange', hex: '#f97316', category: 'sport' },
  { name: 'Velocity Yellow', hex: '#f5c500', category: 'sport' },
  { name: 'Hot Pink', hex: '#e91e8c', category: 'sport' },

  // Exotic
  { name: 'Miami Blue', hex: '#00b4d8', category: 'exotic' },
  { name: 'Grigio Telesto', hex: '#7a7a7a', category: 'exotic' },
  { name: 'Rosso Corsa', hex: '#d40000', category: 'exotic' },
  { name: 'Blu Cepheus', hex: '#2a4b8a', category: 'exotic' },
  { name: 'Verde Mantis', hex: '#4cbb17', category: 'exotic' },
];
