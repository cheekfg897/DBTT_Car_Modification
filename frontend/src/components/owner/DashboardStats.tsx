import { useState, useEffect } from 'react';
import { DollarSign, ShoppingCart, TrendingUp, Award } from 'lucide-react';

interface KPIStats {
  totalRevenue:    number;
  ordersThisMonth: number;
  avgOrderValue:   number;
  topService:      string;
}

export function DashboardStats() {
  const [stats, setStats] = useState<KPIStats | null>(null);

  useEffect(() => {
    fetch('http://localhost:8000/api/kpis')
      .then((r) => r.json())
      .then(setStats);
  }, []);

  if (!stats) {
    return (
      <div className="grid grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-zinc-900 rounded-xl border border-zinc-800 p-5 animate-pulse h-24" />
        ))}
      </div>
    );
  }

  const cards = [
    { label: 'Projected Revenue (2025)',  value: `SGD ${stats.totalRevenue.toLocaleString()}`,    icon: DollarSign,  color: 'text-green-400' },
    { label: 'Orders This Month',     value: stats.ordersThisMonth.toString(),                 icon: ShoppingCart, color: 'text-blue-400' },
    { label: 'Avg Order Value',       value: `SGD ${stats.avgOrderValue.toLocaleString()}`,    icon: TrendingUp,  color: 'text-purple-400' },
    { label: 'Top Service',           value: stats.topService,                                 icon: Award,       color: 'text-orange-accent' },
  ];

  return (
    <div className="grid grid-cols-4 gap-4">
      {cards.map(({ label, value, icon: Icon, color }) => (
        <div key={label} className="bg-zinc-900 rounded-xl border border-zinc-800 p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">{label}</span>
            <Icon className={`w-5 h-5 ${color}`} />
          </div>
          <p className="text-2xl font-bold text-white">{value}</p>
        </div>
      ))}
    </div>
  );
}
