import { useState, useEffect } from 'react';
import { AlertTriangle, XCircle, CheckCircle } from 'lucide-react';

interface InventoryPrediction {
  name:              string;
  category:          string;
  stock:             number;
  minStock:          number;
  unitCost:          number;
  supplier:          string;
  weeklyDemand:      number;
  daysUntilStockout: number;
  urgency:           'critical' | 'warning' | 'healthy';
  reorderQty:        number;
}

export function SupplyAlerts() {
  const [items, setItems] = useState<InventoryPrediction[]>([]);

  useEffect(() => {
    fetch('http://localhost:8000/api/inventory-predictions')
      .then((r) => r.json())
      .then(setItems);
  }, []);

  const critical = items.filter((i) => i.urgency === 'critical');
  const warning  = items.filter((i) => i.urgency === 'warning');
  const alertCount = critical.length + warning.length;

  return (
    <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-5">
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle className="w-5 h-5 text-yellow-500" />
        <h2 className="text-lg font-bold text-white">Supply Alerts</h2>
        {alertCount > 0 && (
          <span className="ml-auto px-2 py-0.5 bg-red-500/10 text-red-400 rounded-full text-xs font-medium">
            {alertCount} alerts
          </span>
        )}
      </div>

      {alertCount === 0 ? (
        <div className="flex items-center gap-2 text-sm text-zinc-500 py-4 justify-center">
          <CheckCircle className="w-4 h-4 text-green-500" />
          All inventory levels are healthy
        </div>
      ) : (
        <div className="space-y-2">
          {[...critical, ...warning].map((item, i) => (
            <div
              key={i}
              className={`flex items-start gap-3 p-3 rounded-lg border ${
                item.urgency === 'critical'
                  ? 'bg-red-500/5 border-red-500/30'
                  : 'bg-yellow-500/5 border-yellow-500/30'
              }`}
            >
              {item.urgency === 'critical' ? (
                <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-yellow-500 shrink-0 mt-0.5" />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white">{item.name}</p>
                <p className="text-xs text-zinc-500">
                  Stock:{' '}
                  <span className={item.urgency === 'critical' ? 'text-red-400' : 'text-yellow-500'}>
                    {item.stock}
                  </span>
                  {' · '}
                  Runs out in{' '}
                  <span className={item.urgency === 'critical' ? 'text-red-400' : 'text-yellow-500'}>
                    {item.daysUntilStockout}d
                  </span>
                  {' · '}
                  Reorder <span className="text-zinc-300">{item.reorderQty} units</span>
                  {' from '}
                  <span className="text-zinc-300">{item.supplier}</span>
                </p>
              </div>
              <span className={`px-2 py-0.5 rounded text-xs font-medium uppercase shrink-0 ${
                item.urgency === 'critical'
                  ? 'bg-red-500/10 text-red-400'
                  : 'bg-yellow-500/10 text-yellow-500'
              }`}>
                {item.urgency}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
