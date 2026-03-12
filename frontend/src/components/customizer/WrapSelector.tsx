import { FINISH_PRESETS } from '../../data/modCatalog';
import { useStore } from '../../store/useStore';
import type { FinishType } from '../../types/customization';

export function WrapSelector() {
  const finishType = useStore((s) => s.customization.finishType);
  const setFinishType = useStore((s) => s.setFinishType);

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-zinc-300">Wrap & Finish</label>
      <div className="grid grid-cols-1 gap-2">
        {FINISH_PRESETS.map((preset) => (
          <button
            key={preset.type}
            onClick={() => setFinishType(preset.type as FinishType)}
            className={`flex items-center justify-between p-3 rounded-lg border transition-all cursor-pointer ${
              finishType === preset.type
                ? 'border-orange-accent bg-orange-accent/10'
                : 'border-zinc-700 bg-zinc-800/50 hover:border-zinc-600'
            }`}
          >
            <div className="text-left">
              <p className="text-sm font-medium text-white">{preset.name}</p>
              <p className="text-xs text-zinc-500">
                Roughness: {preset.roughness} | Metalness: {preset.metalness}
              </p>
            </div>
            <span className="text-sm font-semibold text-orange-accent">${preset.price}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
