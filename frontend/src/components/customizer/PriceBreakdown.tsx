import { useStore } from '../../store/useStore';
import { FINISH_PRESETS, MOD_OPTIONS, RESPRAY_BASE_PRICE, TINT_BASE_PRICE, RIM_COLOR_PRICE, CALIPER_COLOR_PRICE } from '../../data/modCatalog';

export function PriceBreakdown() {
  const customization = useStore((s) => s.customization);

  const finish = FINISH_PRESETS.find((f) => f.type === customization.finishType) || FINISH_PRESETS[0];

  const lineItems: { label: string; price: number }[] = [
    { label: 'Respray', price: RESPRAY_BASE_PRICE },
    { label: `${finish.name} Finish`, price: finish.price },
    { label: 'Window Tint', price: TINT_BASE_PRICE },
    { label: 'Rim Color', price: RIM_COLOR_PRICE },
    { label: 'Caliper Color', price: CALIPER_COLOR_PRICE },
  ];

  for (const modId of customization.selectedMods) {
    const mod = MOD_OPTIONS.find((m) => m.id === modId);
    if (mod) lineItems.push({ label: mod.name, price: mod.price });
  }

  const total = lineItems.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700">
      <h3 className="text-sm font-semibold text-white mb-3">Price Breakdown</h3>
      <div className="space-y-1.5">
        {lineItems.map((item, i) => (
          <div key={i} className="flex justify-between text-sm">
            <span className="text-zinc-400">{item.label}</span>
            <span className="text-zinc-300">${item.price.toLocaleString()}</span>
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
