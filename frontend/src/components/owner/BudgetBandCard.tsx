import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface TooltipEntry {
  payload?: { avgOV: number; name: string; shortName: string; value: number };
}

interface BudgetBand {
  band:          string;
  avgOrderValue: number;
  count:         number;
}

const COLORS = ['#10b981', '#f97316', '#8b5cf6'];

export function BudgetBandCard() {
  const [data, setData] = useState<BudgetBand[]>([]);

  useEffect(() => {
    fetch('http://localhost:8000/api/service-stats')
      .then((r) => r.json())
      .then((d) => setData(d.budgetBands));
  }, []);

  const total     = data.reduce((s, d) => s + d.count, 0);
  const chartData = data.map((d) => ({
    name:     d.band,
    value:    d.count,
    avgOV:    d.avgOrderValue,
    shortName: d.band.split(' ')[0],   // "Value" | "Mid" | "Premium"
  }));

  return (
    <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-5">
      <h2 className="text-lg font-bold text-white mb-4">Customer Budget Segments</h2>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={90}
              paddingAngle={2}
              dataKey="value"
            >
              {chartData.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ background: '#18181b', border: '1px solid #3f3f46', borderRadius: '8px' }}
              formatter={(value, _name, props: TooltipEntry) => [
                `${Number(value ?? 0)} orders — Avg SGD ${props.payload?.avgOV.toLocaleString() ?? ''}`,
                props.payload?.name ?? '',
              ]}
            />
            <Legend
              formatter={(_value, entry) => {
                const p = (entry as { payload?: { shortName?: string; value?: number } }).payload;
                return (
                  <span style={{ color: '#a1a1aa', fontSize: '11px' }}>
                    {p?.shortName}{' '}
                    ({total > 0 ? Math.round(((p?.value ?? 0) / total) * 100) : 0}%)
                  </span>
                );
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
