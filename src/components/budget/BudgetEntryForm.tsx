'use client';

import React, { useMemo, useState } from 'react';
import { Badge, Button, Input, Select, Textarea } from '@/components/ui/primitives';
import { mockBudgetData, type BudgetCategory } from '@/data/budget';
import type { BudgetEntry } from '@/lib/budget/budgetStorage';

type Errors = Partial<Record<'category' | 'amount' | 'month', string>>;

const CATEGORY_OPTIONS: BudgetCategory[] = mockBudgetData.categoryExpenses.map(
  (item) => item.category,
);

const MONTH_OPTIONS: string[] = Array.from(
  new Set(mockBudgetData.monthlyCashflow.map((item) => item.month.trim())),
);

function formatEuro(value: number) {
  return new Intl.NumberFormat('en-FI', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(value);
}

export default function BudgetEntryForm({
  entries,
  onAddEntry,
}: {
  entries: BudgetEntry[];
  onAddEntry: (entry: BudgetEntry) => void;
}) {
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState<string>('');
  const [month, setMonth] = useState('');
  const [note, setNote] = useState('');

  const [errors, setErrors] = useState<Errors>({});
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const parsedAmount = useMemo(() => Number(amount), [amount]);

  function validate(): Errors {
    const next: Errors = {};
    if (!category.trim()) next.category = 'Please select a category.';
    if (!month.trim()) next.month = 'Please select a month.';

    if (amount.trim().length === 0) next.amount = 'Please enter an amount.';
    else if (Number.isNaN(parsedAmount))
      next.amount = 'Amount must be a number.';
    else if (parsedAmount <= 0) next.amount = 'Amount must be greater than 0.';

    return next;
  }

  function clearForm() {
    setCategory('');
    setAmount('');
    setMonth('');
    setNote('');
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitAttempted(true);

    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const entry: BudgetEntry = {
      id: crypto.randomUUID(),
      category: category.trim(),
      amount: parsedAmount,
      month: month.trim(),
      note: note.trim() ? note.trim() : undefined,
    };

    onAddEntry(entry);

    clearForm();
    setSubmitAttempted(false);
    setErrors({});
  }

  const showError = (field: keyof Errors) => submitAttempted && errors[field];

  return (
    <div className="space-y-4">
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div>
            <label className="mb-1 block text-sm font-medium">Category</label>
            <Select
              value={category}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setCategory(e.target.value)
              }
              aria-invalid={Boolean(showError('category'))}
            >
              <option value="">Select category</option>
              {CATEGORY_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </Select>
            {showError('category') ? (
              <p className="mt-1 text-xs text-rose-600">{errors.category}</p>
            ) : null}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Amount (EUR)</label>
            <Input
              type="number"
              inputMode="decimal"
              value={amount}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setAmount(e.target.value)
              }
              placeholder="e.g. 25"
              aria-invalid={Boolean(showError('amount'))}
            />
            {showError('amount') ? (
              <p className="mt-1 text-xs text-rose-600">{errors.amount}</p>
            ) : null}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Month</label>
            <Select
              value={month}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setMonth(e.target.value)
              }
              aria-invalid={Boolean(showError('month'))}
            >
              <option value="">Select month</option>
              {MONTH_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </Select>
            {showError('month') ? (
              <p className="mt-1 text-xs text-rose-600">{errors.month}</p>
            ) : null}
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            Note <span className="text-muted-foreground">(optional)</span>
          </label>
          <Textarea
            value={note}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setNote(e.target.value)
            }
            placeholder="Optional note for this entry"
          />
        </div>

        <div className="flex items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            Entries are saved locally in your browser (localStorage).
          </p>
          <Button type="submit">Add entry</Button>
        </div>
      </form>

      <div className="rounded-xl border border-border/60 bg-muted/10 p-4">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold">Preview</div>
            <div className="text-xs text-muted-foreground">
              Recently added entries
            </div>
          </div>
          <Badge className="bg-purple-100 text-purple-700">Local</Badge>
        </div>

        {entries.length === 0 ? (
          <p className="text-sm text-muted-foreground">No entries added yet.</p>
        ) : (
          <ul className="space-y-2">
            {entries.slice(0, 5).map((entry) => (
              <li
                key={entry.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border/50 bg-background/60 p-3"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{entry.category}</span>
                  <span className="text-xs text-muted-foreground">-</span>
                  <span className="text-xs text-muted-foreground">
                    {entry.month}
                  </span>
                  {entry.note ? (
                    <>
                      <span className="text-xs text-muted-foreground">-</span>
                      <span className="text-xs text-muted-foreground">
                        {entry.note}
                      </span>
                    </>
                  ) : null}
                </div>
                <span className="text-sm font-semibold">
                  {formatEuro(entry.amount)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
