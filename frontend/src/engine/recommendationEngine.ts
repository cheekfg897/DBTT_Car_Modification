import { MOCK_ORDERS } from '../data/mockOrders';
import { getMod, getFinish } from '../utils/dataLookup';
import type { CarCustomization } from '../types/customization';

export interface Recommendation {
  type: 'co-purchase' | 'trending' | 'color-pairing';
  title: string;
  description: string;
  modId?: string;
  confidence: number;
}

const COLOR_PAIRINGS: Record<string, { rimColor: string; caliperColor: string; mods: string[]; finish: string }> = {
  '#8c8c8c': { rimColor: '#1a1a1a', caliperColor: '#f97316', mods: ['exhaust-titanium', 'spoiler-ducktail'], finish: 'matte' },
  '#1a1a1a': { rimColor: '#808080', caliperColor: '#ff0000', mods: ['bodykit-street', 'exhaust-catback'], finish: 'gloss' },
  '#f5f5f5': { rimColor: '#1a1a1a', caliperColor: '#ff0000', mods: ['spoiler-gt', 'sideskirt-carbon'], finish: 'gloss' },
  '#c0392b': { rimColor: '#1a1a1a', caliperColor: '#ffff00', mods: ['spoiler-ducktail', 'exhaust-catback'], finish: 'gloss' },
  '#0066ff': { rimColor: '#1a1a1a', caliperColor: '#f97316', mods: ['bodykit-widebody', 'exhaust-titanium'], finish: 'satin' },
  '#f97316': { rimColor: '#1a1a1a', caliperColor: '#1a1a1a', mods: ['spoiler-swan', 'bodykit-carbon'], finish: 'matte' },
};

export function getRecommendations(customization: CarCustomization): Recommendation[] {
  const recs: Recommendation[] = [];

  // 1. Co-purchase recommendations
  if (customization.selectedMods.length > 0) {
    const coOccurrence = new Map<string, number>();
    for (const order of MOCK_ORDERS) {
      const hasSelected = customization.selectedMods.some((m) => order.mods.includes(m));
      if (hasSelected) {
        for (const mod of order.mods) {
          if (!customization.selectedMods.includes(mod)) {
            coOccurrence.set(mod, (coOccurrence.get(mod) || 0) + 1);
          }
        }
      }
    }

    const matchingOrders = MOCK_ORDERS.filter((o) =>
      customization.selectedMods.some((m) => o.mods.includes(m))
    ).length;

    for (const [modId, count] of coOccurrence) {
      const confidence = Math.round((count / matchingOrders) * 100);
      if (confidence >= 25) {
        const mod = getMod(modId);
        if (mod) {
          recs.push({
            type: 'co-purchase',
            title: `Add ${mod.name}`,
            description: `${confidence}% of customers with your mods also chose this`,
            modId: mod.id,
            confidence,
          });
        }
      }
    }
  }

  // 2. Trending recommendations
  const recentOrders = MOCK_ORDERS.filter((o) => parseInt(o.date.split('-')[1]) >= 4);
  const modFreq = new Map<string, number>();
  for (const o of recentOrders) {
    for (const m of o.mods) modFreq.set(m, (modFreq.get(m) || 0) + 1);
  }

  const trendingMods = Array.from(modFreq.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  for (const [modId, count] of trendingMods) {
    if (!customization.selectedMods.includes(modId)) {
      const mod = getMod(modId);
      if (mod) {
        recs.push({
          type: 'trending',
          title: `Trending: ${mod.name}`,
          description: `Popular choice this season (${count} recent orders)`,
          modId: mod.id,
          confidence: Math.min(90, count * 10),
        });
      }
    }
  }

  // 3. Color pairing recommendations
  const pairing = COLOR_PAIRINGS[customization.bodyColor];
  if (pairing) {
    const finish = getFinish(pairing.finish);
    if (finish && customization.finishType !== pairing.finish) {
      recs.push({
        type: 'color-pairing',
        title: `Try ${finish.name} Finish`,
        description: `${finish.name} pairs beautifully with your body color`,
        confidence: 75,
      });
    }

    for (const modId of pairing.mods) {
      if (!customization.selectedMods.includes(modId)) {
        const mod = getMod(modId);
        if (mod) {
          recs.push({
            type: 'color-pairing',
            title: `Pair with ${mod.name}`,
            description: `Recommended combo for your color choice`,
            modId: mod.id,
            confidence: 65,
          });
        }
      }
    }
  }

  // Deduplicate by modId, keep highest confidence
  const seen = new Map<string, Recommendation>();
  for (const rec of recs) {
    const key = rec.modId || rec.title;
    if (!seen.has(key) || seen.get(key)!.confidence < rec.confidence) {
      seen.set(key, rec);
    }
  }

  return Array.from(seen.values())
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 5);
}
