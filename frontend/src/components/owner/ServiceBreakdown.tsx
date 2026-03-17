import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface CategoryBreakdown {
  name:  string;
  value: number;
}

const COLORS = ['#f97316', '#3b82f6', '#8b5cf6', '#10b981', '#f43f5e', '#eab308'];

export function ServiceBreakdown() {
  const [data, setData] = useState<CategoryBreakdown[]>([]);

  useEffect(() => {
    fetch('http://localhost:8000/api/service-breakdown')
      .then((r) => r.json())
      .then(setData);
  }, []);

  return (
    <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-5">
      <h2 className="text-lg font-bold text-white mb-4">Service Category Breakdown</h2>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={90}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ background: '#18181b', border: '1px solid #3f3f46', borderRadius: '8px' }}
              formatter={(value) => [`SGD ${Number(value).toLocaleString()}`, 'Revenue']}
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
