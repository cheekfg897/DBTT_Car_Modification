import { useState, useEffect } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer, ReferenceLine,
} from 'recharts';

interface HistoricalPoint { year: number; customers: number; revenue: number; aov: number; serviceMix: string }
interface ProjectionPoint { year: number; customers: number; revenue: number }
interface ProjectionData {
  historical: HistoricalPoint[];
  baseline:   ProjectionPoint[];
  digital:    ProjectionPoint[];
}

export function ProjectionChart() {
  const [data, setData] = useState<ProjectionData | null>(null);

  useEffect(() => {
    fetch('http://localhost:8000/api/projections')
      .then((r) => r.json())
      .then(setData);
  }, []);

  if (!data) {
    return <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-5 animate-pulse h-80" />;
  }

  // Merge historical + projection years into one flat chart dataset
  const chartData = [
    ...data.historical.map((h) => ({
      year:       h.year,
      historical: h.revenue,
      baseline:   null as number | null,
      digital:    null as number | null,
    })),
    ...data.baseline.map((b, i) => ({
      year:       b.year,
      historical: null as number | null,
      baseline:   b.revenue,
      digital:    data.digital[i].revenue,
    })),
  ];

  return (
    <div className="bg-zinc-900 rounded-xl border border-zinc-800 p-5">
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-lg font-bold text-white">Revenue Projection: Baseline vs Digital Platform (2020–2029)</h2>
      </div>
      <p className="text-xs text-zinc-500 mb-4">
        Synthetic projections — dashed line marks where projection begins
      </p>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
            <XAxis dataKey="year" stroke="#71717a" fontSize={12} />
            <YAxis
              stroke="#71717a"
              fontSize={12}
              tickFormatter={(v) => `SGD ${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip
              contentStyle={{ background: '#18181b', border: '1px solid #3f3f46', borderRadius: '8px' }}
              labelStyle={{ color: '#fff' }}
              formatter={(value: number) => [`SGD ${value.toLocaleString()}`, '']}
            />
            <Legend
              formatter={(value) => (
                <span style={{ color: '#a1a1aa', fontSize: '12px' }}>{value}</span>
              )}
            />
            <ReferenceLine
              x={2025}
              stroke="#52525b"
              strokeDasharray="4 4"
              label={{ value: 'Projection →', fill: '#71717a', fontSize: 11, position: 'insideTopRight' }}
            />
            <Line
              type="monotone"
              dataKey="historical"
              stroke="#71717a"
              strokeWidth={2}
              dot={{ r: 3, fill: '#71717a' }}
              name="Historical"
              connectNulls={false}
            />
            <Line
              type="monotone"
              dataKey="baseline"
              stroke="#3b82f6"
              strokeWidth={2}
              strokeDasharray="5 3"
              dot={{ r: 3, fill: '#3b82f6' }}
              name="Baseline (6% growth)"
              connectNulls={false}
            />
            <Line
              type="monotone"
              dataKey="digital"
              stroke="#f97316"
              strokeWidth={2}
              dot={{ r: 3, fill: '#f97316' }}
              name="Digital Platform"
              connectNulls={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
