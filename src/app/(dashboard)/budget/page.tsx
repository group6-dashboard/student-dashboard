'use client';

import React, { useEffect, startTransition,useMemo, useState } from 'react';
import SpendingDonutChart, {DonutDatum} from '@/components/budget/SpendingDonutChart';
import BudgetProgress from '@/components/budget/BudgetProgress';
import BudgetEntryForm from '@/components/budget/BudgetEntryForm';
import { mockBudgetData } from '@/data/budget';
import type { BudgetEntry } from '@/lib/budget/budgetStorage';
import { loadBudgetEntries, saveBudgetEntries } from '@/lib/budget/budgetStorage';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/Card';

import { Badge } from '@/components/ui/primitives';

export default function BudgetPage() {
const [entries, setEntries] = useState<BudgetEntry[]>([]);
const [hydrated, setHydrated] = useState(false);

// ✅ Load once after hydration (client only)
useEffect(() => {
  startTransition(() => {
    setEntries(loadBudgetEntries());
    setHydrated(true);
  });
}, []);

// ✅ Persist after we have hydrated (avoid overwriting storage with [])
useEffect(() => {
  if (!hydrated) return;
  saveBudgetEntries(entries);
}, [entries, hydrated]);

   const baselineSpent = useMemo(
     () => mockBudgetData.categoryExpenses.reduce((s, x) => s + x.amount, 0),
     [],
   );

   const entriesSpent = useMemo(
     () => entries.reduce((s, e) => s + e.amount, 0),
     [entries],
   );

   const totalSpent = baselineSpent + entriesSpent;
   const budget = mockBudgetData.monthlyBudget;

   const donutData: DonutDatum[] = useMemo(() => {
     // Start from baseline
     const map = new Map<string, number>();
     for (const x of mockBudgetData.categoryExpenses) {
       map.set(x.category, (map.get(x.category) ?? 0) + x.amount);
     }
     // Add entries (use raw category text; later you can switch to a dropdown)
     for (const e of entries) {
       const key = e.category.trim() || 'Other';
       map.set(key, (map.get(key) ?? 0) + e.amount);
     }

     return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
   }, [entries]);

   function handleAddEntry(entry: BudgetEntry) {
     setEntries((prev) => [entry, ...prev]);
   }


  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Student Budget Overview
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Visual overview of your monthly budget, spending patterns, and
          cashflow.
        </p>
      </div>

      {/* Charts grid */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* 1. Spending breakdown */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>
                  <span className="text-lg font-semibold">
                    Spending breakdown
                  </span>
                </CardTitle>
                <CardDescription>
                  Where your money goes this month.
                </CardDescription>
              </div>
              <Badge className="bg-pink-100 text-pink-700">Draft</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <SpendingDonutChart data={donutData} />
          </CardContent>
        </Card>

        {/* 2. Budget usage */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>
                  <span className="text-lg font-semibold">Budget usage</span>
                </CardTitle>
                <CardDescription>
                  How much of your monthly budget is already used.
                </CardDescription>
              </div>
              <Badge className="bg-purple-100 text-purple-700">Draft</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <BudgetProgress budget={budget} spent={totalSpent} />
          </CardContent>
        </Card>

        {/* 3. Income vs expense trend */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>
              <span className="text-lg font-semibold">
                Income vs expense trend
              </span>
            </CardTitle>
            <CardDescription>
              Monthly comparison of income and expenses.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/*
              TODO (Later):
              - Grouped bar chart
              - Mock data for last 3–6 months
              - Income vs expense comparison
            */}
            <Placeholder>
              <div className="space-y-2">
                <p>
                  This section will visualize how income and expenses change
                  over time.
                </p>

                <ul className="list-disc pl-4">
                  <li>
                    Grouped bar chart comparing income vs expense per month
                  </li>
                  <li>Based on mock monthly cashflow data</li>
                  <li>Showing the last 3–6 months for trend analysis</li>
                </ul>

                <p className="text-xs">
                  The goal is to highlight spending patterns and budget
                  stability over time, rather than individual transactions.
                </p>
              </div>
            </Placeholder>
          </CardContent>
        </Card>

        {/* 4. User input table */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>
              <span className="text-lg font-semibold">Add entries</span>
            </CardTitle>
            <CardDescription>
              Select a category and enter your spending to keep track of your
              monthly budget.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <BudgetEntryForm entries={entries} onAddEntry={handleAddEntry} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

/* ---------------------------------------
   Helper: placeholder block (draft demo)
---------------------------------------- */

function Placeholder({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-dashed border-border/60 bg-muted/20 p-4 text-sm text-muted-foreground">
      {children}
    </div>
  );
}
