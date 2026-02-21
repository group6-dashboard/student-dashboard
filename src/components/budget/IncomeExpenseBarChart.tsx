'use client';

import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
} from 'recharts';

export type IncomeExpenseDatum = {
  month: string;
  income: number;
  expense: number;
};

function formatEuro(value: number) {
  return new Intl.NumberFormat('en-FI', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(value);
}

type IncomeExpenseBarChartProps = {
  data: IncomeExpenseDatum[];
};

export default function IncomeExpenseBarChart({
  data,
}: IncomeExpenseBarChartProps) {
  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 8, right: 12, left: 0, bottom: 0 }}
          barGap={6}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(148, 163, 184, 0.3)"
          />
          <XAxis dataKey="month" tickLine={false} axisLine={false} />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickFormatter={(value: number) => formatEuro(value)}
            width={68}
          />
          <Tooltip
            formatter={(value) => formatEuro(Number(value ?? 0))}
            contentStyle={{
              borderRadius: 12,
              border: '1px solid rgba(148, 163, 184, 0.35)',
              background: 'rgba(255, 255, 255, 0.98)',
            }}
          />
          <Legend />
          <Bar
            dataKey="income"
            name="Income"
            fill="#a855f7"
            radius={[8, 8, 0, 0]}
            maxBarSize={36}
          />
          <Bar
            dataKey="expense"
            name="Expense"
            fill="#ec4899"
            radius={[8, 8, 0, 0]}
            maxBarSize={36}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
