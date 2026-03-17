import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface MonthlyRevenue {
  month:   string;
  revenue: number;
}

export function RevenueChart() {
  const [data, setData] = useState<MonthlyRevenue[]>([]);

  useEffect(() => {
    fetch('http://localhost:8000/api/monthly-revenue')
      .then((r) => r.json())
      .then(setData);
  }, []);

  return (
    <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-5">
      <h2 className="text-lg font-bold text-white mb-4">Monthly Revenue (2025)</h2>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
            <XAxis dataKey="month" stroke="#71717a" fontSize={12} />
            <YAxis
              stroke="#71717a"
              fontSize={12}
              tickFormatter={(v) => `SGD ${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip
              contentStyle={{ background: '#18181b', border: '1px solid #3f3f46', borderRadius: '8px' }}
              labelStyle={{ color: '#fff' }}
              formatter={(value) => [`SGD ${Number(value).toLocaleString()}`, 'Revenue']}
            />
            <Bar dataKey="revenue" fill="#f97316" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
