import { useState, useEffect } from 'react';
import { AlertTriangle, XCircle } from 'lucide-react';

interface SupplyAlert {
  itemName:  string;
  stock:     number;
  minStock:  number;
  severity:  'warning' | 'critical';
}

export function SupplyAlerts() {
  const [alerts, setAlerts] = useState<SupplyAlert[]>([]);

  useEffect(() => {
    fetch('http://localhost:8000/api/supply-alerts')
      .then((r) => r.json())
      .then(setAlerts);
  }, []);

  return (
    <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-5">
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle className="w-5 h-5 text-yellow-500" />
        <h2 className="text-lg font-bold text-white">Supply Alerts</h2>
        {alerts.length > 0 && (
          <span className="ml-auto px-2 py-0.5 bg-red-500/10 text-red-400 rounded-full text-xs font-medium">
            {alerts.length} alerts
          </span>
        )}
      </div>
      {alerts.length === 0 ? (
        <p className="text-sm text-zinc-500 text-center py-4">All inventory levels are healthy</p>
      ) : (
        <div className="space-y-2">
          {alerts.map((alert, i) => (
            <div
              key={i}
              className={`flex items-center gap-3 p-3 rounded-lg border ${
                alert.severity === 'critical'
                  ? 'bg-red-500/5 border-red-500/30'
                  : 'bg-yellow-500/5 border-yellow-500/30'
              }`}
            >
              {alert.severity === 'critical' ? (
                <XCircle className="w-4 h-4 text-red-400 shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-yellow-500 shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white">{alert.itemName}</p>
                <p className="text-xs text-zinc-500">
                  Stock:{' '}
                  <span className={alert.severity === 'critical' ? 'text-red-400' : 'text-yellow-500'}>
                    {alert.stock}
                  </span>
                  {' / Min: '}
                  {alert.minStock}
                </p>
              </div>
              <span className={`px-2 py-0.5 rounded text-xs font-medium uppercase ${
                alert.severity === 'critical'
                  ? 'bg-red-500/10 text-red-400'
                  : 'bg-yellow-500/10 text-yellow-500'
              }`}>
                {alert.severity}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
