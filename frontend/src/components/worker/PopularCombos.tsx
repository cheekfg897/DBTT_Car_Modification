import { getPopularCombos } from '../../engine/analyticsEngine';
import { Zap } from 'lucide-react';

export function PopularCombos() {
  const combos = getPopularCombos();

  return (
    <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-5">
      <div className="flex items-center gap-2 mb-4">
        <Zap className="w-5 h-5 text-orange-accent" />
        <h2 className="text-lg font-bold text-white">Popular Combos</h2>
      </div>
      {combos.length === 0 ? (
        <p className="text-sm text-zinc-500">No combo data available</p>
      ) : (
        <div className="space-y-2">
          {combos.map((combo, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-3 bg-zinc-800/50 rounded-lg border border-zinc-700"
            >
              <div className="w-8 h-8 rounded-lg bg-orange-accent/10 flex items-center justify-center text-orange-accent text-sm font-bold shrink-0">
                {combo.frequency}%
              </div>
              <div>
                <p className="text-sm text-zinc-300">
                  <span className="font-medium text-white">{combo.modA}</span>
                  {' + '}
                  <span className="font-medium text-white">{combo.modB}</span>
                </p>
                <p className="text-xs text-zinc-500">booked together</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
