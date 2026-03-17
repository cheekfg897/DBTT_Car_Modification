import { useStore } from '../../store/useStore';
import { MOD_OPTIONS } from '../../data/modCatalog';
import type { ModCategory } from '../../types/customization';
import { Check } from 'lucide-react';

const CATEGORY_LABELS: Record<ModCategory, string> = {
  spoiler: 'Spoilers',
  exhaust: 'Exhaust Systems',
  bodykit: 'Body Kits',
  hood: 'Hoods',
  sideskirt: 'Side Skirts',
};

interface ModCategoryCardProps {
  category: ModCategory;
}

export function ModCategoryCard({ category }: ModCategoryCardProps) {
  const selectedMods = useStore((s) => s.customization.selectedMods);
  const toggleMod = useStore((s) => s.toggleMod);
  const mods = MOD_OPTIONS.filter((m) => m.category === category);

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-zinc-300">{CATEGORY_LABELS[category]}</h3>
      <div className="space-y-1.5">
        {mods.map((mod) => {
          const isSelected = selectedMods.includes(mod.id);
          return (
            <button
              key={mod.id}
              onClick={() => toggleMod(mod.id)}
              className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all cursor-pointer text-left ${
                isSelected
                  ? 'border-orange-accent bg-orange-accent/10'
                  : 'border-zinc-700 bg-zinc-800/50 hover:border-zinc-600'
              }`}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-white">{mod.name}</p>
                  {isSelected && (
                    <span className="px-1.5 py-0.5 bg-orange-accent text-white text-[10px] font-bold rounded uppercase">
                      Equipped
                    </span>
                  )}
                </div>
                <p className="text-xs text-zinc-500 mt-0.5">{mod.description}</p>
              </div>
              <div className="flex items-center gap-2 ml-3">
                <span className="text-sm font-semibold text-orange-accent">SGD {mod.price.toLocaleString()}</span>
                {isSelected && <Check className="w-4 h-4 text-orange-accent" />}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
