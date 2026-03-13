import { X } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { FINISH_PRESETS, RESPRAY_BASE_PRICE, TINT_BASE_PRICE, RIM_COLOR_PRICE, CALIPER_COLOR_PRICE } from '../../data/modCatalog';
import { getMod, getFinish } from '../../utils/dataLookup';

export function PriceBreakdown() {
  const customization = useStore((s) => s.customization);
  const toggleMod = useStore((s) => s.toggleMod);

  const finish = getFinish(customization.finishType) || FINISH_PRESETS[0];

  const baseItems: { label: string; price: number }[] = [
    { label: 'Respray', price: RESPRAY_BASE_PRICE },
    { label: `${finish.name} Finish`, price: finish.price },
    { label: 'Window Tint', price: TINT_BASE_PRICE },
    { label: 'Rim Color', price: RIM_COLOR_PRICE },
    { label: 'Caliper Color', price: CALIPER_COLOR_PRICE },
  ];

  const selectedMods = customization.selectedMods
    .map((id) => getMod(id))
    .filter(Boolean) as typeof MOD_OPTIONS;

  const total =
    baseItems.reduce((sum, item) => sum + item.price, 0) +
    selectedMods.reduce((sum, mod) => sum + mod.price, 0);

  return (
    <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700">
      <div className="space-y-1.5">
        {baseItems.map((item, i) => (
          <div key={i} className="flex justify-between text-sm">
            <span className="text-zinc-400">{item.label}</span>
            <span className="text-zinc-300">${item.price.toLocaleString()}</span>
          </div>
        ))}
        {selectedMods.map((mod) => (
          <div key={mod.id} className="flex justify-between text-sm items-center group">
            <div className="flex items-center gap-1">
              <button
                onClick={() => toggleMod(mod.id)}
                className="text-zinc-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                title="Remove"
              >
                <X size={12} />
              </button>
              <span className="text-zinc-400">{mod.name}</span>
            </div>
            <span className="text-zinc-300">${mod.price.toLocaleString()}</span>
          </div>
        ))}
      </div>
      <div className="border-t border-zinc-700 mt-3 pt-3 flex justify-between">
        <span className="text-sm font-bold text-white">Total</span>
        <span className="text-lg font-bold text-orange-accent">${total.toLocaleString()}</span>
      </div>
    </div>
  );
}
