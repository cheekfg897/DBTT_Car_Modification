import { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';

interface CrossSellRule {
  ifBuys:           string;
  recommendNext:    string;
  confidence:       number;
  supportCustomers: number;
}

export function CrossSellPanel() {
  const [rules, setRules] = useState<CrossSellRule[]>([]);

  useEffect(() => {
    fetch('http://localhost:8000/api/recommendations')
      .then((r) => r.json())
      .then(setRules);
  }, []);

  return (
    <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-5">
      <h2 className="text-lg font-bold text-white mb-1">Cross-sell Recommendation Rules</h2>
      <p className="text-xs text-zinc-500 mb-4">
        If a customer books service A, recommend service B based on co-purchase patterns
      </p>
      <div className="space-y-2">
        {rules.map((rule, i) => (
          <div
            key={i}
            className="flex items-center gap-3 p-3 bg-zinc-800/50 rounded-lg border border-zinc-700"
          >
            <div className="flex-1 flex items-center gap-2 min-w-0">
              <span className="text-sm font-medium text-white truncate">{rule.ifBuys}</span>
              <ArrowRight className="w-4 h-4 text-zinc-500 shrink-0" />
              <span className="text-sm font-medium text-orange-accent truncate">{rule.recommendNext}</span>
            </div>
            <div className="text-right shrink-0">
              <p className="text-sm font-bold text-green-400">{rule.confidence}%</p>
              <p className="text-xs text-zinc-500">{rule.supportCustomers} customers</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
