'use client';

import React, { startTransition, useEffect, useMemo, useState } from 'react';
import SpendingDonutChart, {
  DonutDatum,
} from '@/components/budget/SpendingDonutChart';
import BudgetProgress from '@/components/budget/BudgetProgress';
import BudgetEntryForm from '@/components/budget/BudgetEntryForm';
import IncomeExpenseBarChart, {
  IncomeExpenseDatum,
} from '@/components/budget/IncomeExpenseBarChart';
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

  useEffect(() => {
    startTransition(() => {
      setEntries(loadBudgetEntries());
      setHydrated(true);
    });
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    saveBudgetEntries(entries);
  }, [entries, hydrated]);

  const baselineSpent = useMemo(
    () => mockBudgetData.categoryExpenses.reduce((sum, item) => sum + item.amount, 0),
    [],
  );

  const entriesSpent = useMemo(
    () => entries.reduce((sum, entry) => sum + entry.amount, 0),
    [entries],
  );

  const totalSpent = baselineSpent + entriesSpent;
  const budget = mockBudgetData.monthlyBudget;

  const donutData: DonutDatum[] = useMemo(() => {
    const categoryMap = new Map<string, number>();

    for (const item of mockBudgetData.categoryExpenses) {
      categoryMap.set(item.category, (categoryMap.get(item.category) ?? 0) + item.amount);
    }

    for (const entry of entries) {
      const key = entry.category.trim() || 'Other';
      categoryMap.set(key, (categoryMap.get(key) ?? 0) + entry.amount);
    }

    return Array.from(categoryMap.entries()).map(([name, value]) => ({ name, value }));
  }, [entries]);

  const incomeExpenseData: IncomeExpenseDatum[] = useMemo(() => {
    const normalizeMonthKey = (month: string) => month.trim().slice(0, 3).toLowerCase();
    const toMonthLabel = (month: string) => {
      const key = normalizeMonthKey(month);
      if (!key) return 'N/A';
      return key[0].toUpperCase() + key.slice(1);
    };

    const monthMap = new Map<string, IncomeExpenseDatum>();

    for (const item of mockBudgetData.monthlyCashflow) {
      const key = normalizeMonthKey(item.month);
      if (!key) continue;

      monthMap.set(key, {
        month: toMonthLabel(item.month),
        income: item.income,
        expense: item.expense,
      });
    }

    for (const entry of entries) {
      const key = normalizeMonthKey(entry.month);
      if (!key) continue;

      const existing = monthMap.get(key);
      if (existing) {
        existing.expense += entry.amount;
      } else {
        monthMap.set(key, {
          month: toMonthLabel(entry.month),
          income: 0,
          expense: entry.amount,
        });
      }
    }

    return Array.from(monthMap.values());
  }, [entries]);

  function handleAddEntry(entry: BudgetEntry) {
    setEntries((prev) => [entry, ...prev]);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Student Budget Overview
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Visual overview of your monthly budget, spending patterns, and
          cashflow.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
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
            <IncomeExpenseBarChart data={incomeExpenseData} />
          </CardContent>
        </Card>

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
