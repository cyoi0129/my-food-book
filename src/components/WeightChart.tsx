'use client';

import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import siteData from '@/lib/text';
import { float2Int } from '@/lib/nutrition';
import type { ChartProps } from '@/types';

// ラベル(YYYY-MM-DD) を M/D に短縮して x 軸に使う。
const shortDate = (iso: string): string => {
  const [, m, d] = iso.split('-');
  return m && d ? `${Number(m)}/${Number(d)}` : iso;
};

export default function WeightChart({ label, data }: ChartProps) {
  const chartData = label.map((iso, i) => ({
    date: shortDate(iso),
    weight: float2Int(data[i]?.weight),
    calorie: float2Int(data[i]?.calorie),
  }));

  return (
    <ResponsiveContainer width="100%" height={260}>
      <ComposedChart data={chartData} margin={{ top: 8, right: 8, bottom: 0, left: -18 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
        <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }} />
        <YAxis tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }} />
        <Tooltip
          contentStyle={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            borderRadius: 8,
            fontSize: 12,
          }}
        />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Bar dataKey="calorie" name={siteData.calorie} fill="var(--color-calorie)" radius={[4, 4, 0, 0]} maxBarSize={28} />
        <Line
          type="monotone"
          dataKey="weight"
          name={siteData.weight}
          stroke="var(--color-weight)"
          strokeWidth={2}
          dot={{ r: 3 }}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
