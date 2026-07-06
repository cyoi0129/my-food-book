'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import siteData from '@/lib/text';
import { float2Int } from '@/lib/nutrition';
import type { ChartProps } from '@/types';

const shortDate = (iso: string): string => {
  const [, m, d] = iso.split('-');
  return m && d ? `${Number(m)}/${Number(d)}` : iso;
};

export default function NutrientChart({ label, data }: ChartProps) {
  const chartData = label.map((iso, i) => ({
    date: shortDate(iso),
    protein: float2Int(data[i]?.protein),
    carbohydrate: float2Int(data[i]?.carbohydrate),
    fat: float2Int(data[i]?.fat),
  }));

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={chartData} margin={{ top: 8, right: 8, bottom: 0, left: -18 }}>
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
        <Bar dataKey="protein" name={siteData.protein} fill="var(--color-protein)" radius={[3, 3, 0, 0]} maxBarSize={18} />
        <Bar dataKey="carbohydrate" name={siteData.carbohydrate} fill="var(--color-carbohydrate)" radius={[3, 3, 0, 0]} maxBarSize={18} />
        <Bar dataKey="fat" name={siteData.fat} fill="var(--color-fat)" radius={[3, 3, 0, 0]} maxBarSize={18} />
      </BarChart>
    </ResponsiveContainer>
  );
}
