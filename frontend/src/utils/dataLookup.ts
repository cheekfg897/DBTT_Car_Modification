import { MOD_OPTIONS, FINISH_PRESETS } from '../data/modCatalog';
import { COLOR_PRESETS } from '../data/colorPresets';

export const getMod = (id: string) => MOD_OPTIONS.find((m) => m.id === id);
export const getFinish = (type: string) => FINISH_PRESETS.find((f) => f.type === type);
export const getColor = (hex: string) => COLOR_PRESETS.find((c) => c.hex === hex);
