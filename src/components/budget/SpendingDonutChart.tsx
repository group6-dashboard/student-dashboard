'use client';

import React from 'react';
import { PieChart, Pie,  ResponsiveContainer, Tooltip } from 'recharts';


export type DonutDatum = {
  name: string;
  value: number;
  fill?: string;
};

const DEFAULT_COLORS = [
  '#ec4899', // pink-500
  '#a855f7', // purple-500
  '#f472b6', // pink-400
  '#c084fc', // purple-400
  '#fb7185', // rose-400
];

function formatEuro(value: number) {
  return new Intl.NumberFormat('en-FI', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(value);
}

export default function SpendingDonutChart({ data }: { data: DonutDatum[] }) {
  const enriched = data.map((d, idx) => ({
    ...d,
    fill: d.fill ?? DEFAULT_COLORS[idx % DEFAULT_COLORS.length],
  }));

  const total = enriched.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="grid gap-3 lg:grid-cols-[260px_1fr] lg:items-center">
      {/* Chart */}
      <div className="h-60 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip formatter={(value) => formatEuro(Number(value))} />
            <Pie
              data={enriched}
              dataKey="value"
              nameKey="name"
              innerRadius={70}
              outerRadius={95}
              paddingAngle={2}
              stroke="rgba(255,255,255,0.6)"
              strokeWidth={2}
            >
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Summary */}
      <div className="rounded-xl border border-border/60 bg-muted/20 p-4">
        <div className="text-sm text-muted-foreground">Total spent</div>
        <div className="mt-1 text-2xl font-semibold tracking-tight">
          {formatEuro(total)}
        </div>

        <div className="mt-4 space-y-2">
          {enriched.map((d) => (
            <div key={d.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className="inline-block h-2.5 w-2.5 rounded-full"
                  style={{
                    backgroundColor: d.fill
                  }}
                />
                <span className="text-sm">{d.name}</span>
              </div>
              <span className="text-sm text-muted-foreground">
                {formatEuro(d.value)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
