import { getTrendInsights } from '../../engine/analyticsEngine';
import { TrendingUp, TrendingDown, Lightbulb } from 'lucide-react';

export function TrendInsights() {
  const insights = getTrendInsights();

  return (
    <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-5">
      <div className="flex items-center gap-2 mb-4">
        <Lightbulb className="w-5 h-5 text-orange-accent" />
        <h2 className="text-lg font-bold text-white">Trend Insights</h2>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {insights.map((insight, i) => {
          const Icon = insight.type === 'up' ? TrendingUp : TrendingDown;
          return (
            <div
              key={i}
              className="p-3 bg-zinc-800/50 rounded-lg border border-zinc-700"
            >
              <div className="flex items-center gap-2 mb-1">
                <Icon className={`w-4 h-4 ${insight.type === 'up' ? 'text-green-400' : 'text-red-400'}`} />
                <span className="text-sm font-semibold text-white">{insight.title}</span>
              </div>
              <p className="text-xs text-zinc-400">{insight.description}</p>
              <span className={`text-xs font-bold mt-1 inline-block ${
                insight.type === 'up' ? 'text-green-400' : 'text-red-400'
              }`}>
                {insight.type === 'up' ? '+' : ''}{insight.change}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
