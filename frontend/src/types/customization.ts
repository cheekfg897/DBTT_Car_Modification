export type FinishType = 'gloss' | 'matte' | 'satin' | 'chrome' | 'carbon';

export interface FinishPreset {
  name: string;
  type: FinishType;
  roughness: number;
  metalness: number;
  price: number;
}

export interface ColorPreset {
  name: string;
  hex: string;
  category: 'classic' | 'sport' | 'exotic' | 'neutral';
}

export interface ModOption {
  id: string;
  category: ModCategory;
  name: string;
  description: string;
  price: number;
  image?: string;
}

export type ModCategory = 'spoiler' | 'exhaust' | 'bodykit' | 'hood' | 'sideskirt';

export interface CarCustomization {
  bodyColor: string;
  finishType: FinishType;
  windowTint: number; // 0 = clear, 1 = limo
  rimColor: string;
  caliperColor: string;
  selectedMods: string[]; // mod IDs
}

export const DEFAULT_CUSTOMIZATION: CarCustomization = {
  bodyColor: '#c0392b',
  finishType: 'gloss',
  windowTint: 0.3,
  rimColor: '#808080',
  caliperColor: '#ff0000',
  selectedMods: [],
};
