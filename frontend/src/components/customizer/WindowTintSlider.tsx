import { useStore } from '../../store/useStore';

export function WindowTintSlider() {
  const tint = useStore((s) => s.customization.windowTint);
  const setWindowTint = useStore((s) => s.setWindowTint);

  const tintLabel =
    tint < 0.2 ? 'Clear' :
    tint < 0.4 ? 'Light' :
    tint < 0.6 ? 'Medium' :
    tint < 0.8 ? 'Dark' : 'Limo';

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-zinc-300">Window Tint</label>
        <span className="text-sm text-orange-accent font-semibold">{tintLabel} ({Math.round(tint * 100)}%)</span>
      </div>

      <input
        type="range"
        min={0}
        max={1}
        step={0.05}
        value={tint}
        onChange={(e) => setWindowTint(parseFloat(e.target.value))}
        className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-orange-accent"
      />

      <div className="flex justify-between text-xs text-zinc-500">
        <span>Clear</span>
        <span>Limo</span>
      </div>

      <div
        className="h-8 rounded-lg border border-zinc-700"
        style={{
          background: `rgba(0, 0, 0, ${tint})`,
        }}
      />
    </div>
  );
}
