import { useState, useEffect } from 'react';
import { Zap } from 'lucide-react';

interface ServiceBundle {
  bundle: string;
  count:  number;
}

export function PopularCombos() {
  const [combos, setCombos] = useState<ServiceBundle[]>([]);

  useEffect(() => {
    fetch('http://localhost:8000/api/service-bundles')
      .then((r) => r.json())
      .then((d) => setCombos(d.slice(0, 5)));
  }, []);

  return (
    <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-5">
      <div className="flex items-center gap-2 mb-4">
        <Zap className="w-5 h-5 text-orange-accent" />
        <h2 className="text-lg font-bold text-white">Popular Service Bundles</h2>
      </div>
      {combos.length === 0 ? (
        <p className="text-sm text-zinc-500">Loading...</p>
      ) : (
        <div className="space-y-2">
          {combos.map((combo, i) => {
            const parts = combo.bundle.split(' + ');
            const serviceA = parts[0];
            const serviceB = parts[1] ?? '';
            return (
              <div
                key={i}
                className="flex items-center gap-3 p-3 bg-zinc-800/50 rounded-lg border border-zinc-700"
              >
                <div className="w-8 h-8 rounded-lg bg-orange-accent/10 flex items-center justify-center text-orange-accent text-sm font-bold shrink-0">
                  {combo.count}
                </div>
                <div>
                  <p className="text-sm text-zinc-300">
                    <span className="font-medium text-white">{serviceA}</span>
                    {' + '}
                    <span className="font-medium text-white">{serviceB}</span>
                  </p>
                  <p className="text-xs text-zinc-500">booked together</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
