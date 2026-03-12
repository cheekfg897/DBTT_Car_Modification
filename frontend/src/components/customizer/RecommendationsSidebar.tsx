import { useStore } from '../../store/useStore';
import { getRecommendations } from '../../engine/recommendationEngine';
import { Sparkles, TrendingUp, Palette, Plus } from 'lucide-react';

const typeIcons = {
  'co-purchase': Plus,
  'trending': TrendingUp,
  'color-pairing': Palette,
};

const typeLabels = {
  'co-purchase': 'Customers Also Chose',
  'trending': 'Trending',
  'color-pairing': 'Color Pairing',
};

export function RecommendationsSidebar() {
  const customization = useStore((s) => s.customization);
  const toggleMod = useStore((s) => s.toggleMod);
  const recommendations = getRecommendations(customization);

  if (recommendations.length === 0) return null;

  return (
    <div className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-4 h-4 text-orange-accent" />
        <h3 className="text-sm font-semibold text-white">AI Recommendations</h3>
      </div>
      <div className="space-y-2">
        {recommendations.map((rec, i) => {
          const Icon = typeIcons[rec.type];
          return (
            <div
              key={i}
              className={`p-2.5 rounded-lg border border-zinc-700 bg-zinc-900/50 ${rec.modId ? 'cursor-pointer hover:border-orange-accent/50' : ''}`}
              onClick={() => rec.modId && toggleMod(rec.modId)}
            >
              <div className="flex items-start gap-2">
                <Icon className="w-3.5 h-3.5 text-orange-accent mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-medium text-zinc-300">{rec.title}</p>
                  <p className="text-[11px] text-zinc-500 mt-0.5">{rec.description}</p>
                  <span className="text-[10px] text-zinc-600 mt-1 inline-block">
                    {typeLabels[rec.type]} | {rec.confidence}% confidence
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
