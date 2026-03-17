import { useState, useEffect } from 'react';
import { Users, TrendingUp, BarChart2, Zap } from 'lucide-react';

interface UpliftKPIData {
  totalCustomerUplift: number;
  totalRevenueUplift:  number;
  avgAnnualUplift:     number;
  topBundle:           string;
  topService:          string;
  topCrossSell:        string;
}

export function UpliftKPIs() {
  const [data, setData] = useState<UpliftKPIData | null>(null);

  useEffect(() => {
    fetch('http://localhost:8000/api/uplift-kpis')
      .then((r) => r.json())
      .then(setData);
  }, []);

  if (!data) {
    return (
      <div className="space-y-2">
        <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
          Digital Transformation Impact (2025–2029 Projections)
        </p>
        <div className="grid grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-zinc-900 rounded-xl border border-zinc-800 p-5 animate-pulse h-24" />
          ))}
        </div>
      </div>
    );
  }

  const cards = [
    {
      label: 'Customer Uplift 2025–2029',
      value: `+${data.totalCustomerUplift.toLocaleString()}`,
      sub:   'vs baseline scenario',
      icon:  Users,
      color: 'text-blue-400',
    },
    {
      label: 'Revenue Uplift 2025–2029',
      value: `SGD ${data.totalRevenueUplift.toLocaleString()}`,
      sub:   'cumulative over 5 years',
      icon:  TrendingUp,
      color: 'text-green-400',
    },
    {
      label: 'Avg Annual Revenue Uplift',
      value: `SGD ${data.avgAnnualUplift.toLocaleString()}`,
      sub:   'per year incremental gain',
      icon:  BarChart2,
      color: 'text-purple-400',
    },
    {
      label: 'Strongest Cross-sell Rule',
      value: data.topCrossSell,
      sub:   'highest confidence pattern',
      icon:  Zap,
      color: 'text-orange-accent',
    },
  ];

  return (
    <div className="space-y-2">
      <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
        Digital Transformation Impact (2025–2029 Projections)
      </p>
      <div className="grid grid-cols-4 gap-4">
        {cards.map(({ label, value, sub, icon: Icon, color }) => (
          <div key={label} className="bg-zinc-900 rounded-xl border border-zinc-800 p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider leading-tight">
                {label}
              </span>
              <Icon className={`w-5 h-5 shrink-0 ml-2 ${color}`} />
            </div>
            <p className="text-xl font-bold text-white leading-tight break-words">{value}</p>
            <p className="text-xs text-zinc-500 mt-1">{sub}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
