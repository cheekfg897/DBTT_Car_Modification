import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface StylePref {
  style: string;
  count: number;
}

const COLORS = ['#f97316', '#3b82f6', '#8b5cf6', '#10b981'];

const LABELS: Record<string, string> = {
  sporty:     'Sporty',
  premium:    'Premium',
  minimalist: 'Minimalist',
  family:     'Family',
};

export function StylePreferenceChart() {
  const [data, setData] = useState<StylePref[]>([]);

  useEffect(() => {
    fetch('http://localhost:8000/api/service-stats')
      .then((r) => r.json())
      .then((d) => setData(d.stylePreferences));
  }, []);

  const total     = data.reduce((s, d) => s + d.count, 0);
  const chartData = data.map((d) => ({
    name:  LABELS[d.style] || d.style,
    value: d.count,
  }));

  return (
    <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-5">
      <h2 className="text-lg font-bold text-white mb-4">Customer Style Preferences</h2>
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
              formatter={(value: number, name: string) => [
                `${value} customers (${total > 0 ? Math.round((value / total) * 100) : 0}%)`,
                name,
              ]}
            />
            <Legend
              formatter={(value) => (
                <span style={{ color: '#a1a1aa', fontSize: '12px' }}>{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
