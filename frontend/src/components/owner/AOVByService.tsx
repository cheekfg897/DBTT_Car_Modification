import { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from 'recharts';

interface AOVEntry {
  service:       string;
  avgOrderValue: number;
}

const COLORS = ['#f97316', '#fb923c', '#fdba74', '#fcd34d', '#86efac', '#6ee7b7'];

export function AOVByService() {
  const [data, setData] = useState<AOVEntry[]>([]);

  useEffect(() => {
    fetch('http://localhost:8000/api/service-stats')
      .then((r) => r.json())
      .then((d) => setData(d.aovByService));
  }, []);

  return (
    <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-5">
      <h2 className="text-lg font-bold text-white mb-4">Avg Order Value by Service</h2>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 10, right: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" horizontal={false} />
            <XAxis
              type="number"
              stroke="#71717a"
              fontSize={11}
              tickFormatter={(v) => `SGD ${(v / 1000).toFixed(1)}k`}
            />
            <YAxis
              type="category"
              dataKey="service"
              stroke="#71717a"
              fontSize={11}
              width={120}
            />
            <Tooltip
              contentStyle={{ background: '#18181b', border: '1px solid #3f3f46', borderRadius: '8px' }}
              formatter={(value) => [`SGD ${Number(value ?? 0).toLocaleString()}`, 'Avg Order Value']}
            />
            <Bar dataKey="avgOrderValue" radius={[0, 4, 4, 0]}>
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
