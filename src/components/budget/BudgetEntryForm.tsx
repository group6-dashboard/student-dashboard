'use client';

import React, { useMemo, useState } from 'react';
import { Badge, Button, Input, Textarea } from '@/components/ui/primitives';

type BudgetEntry = {
  id: string;
  category: string;
  amount: number;
  month: string;
  note?: string;
};

type Errors = Partial<Record<keyof Omit<BudgetEntry, 'id'>, string>>;

function formatEuro(value: number) {
  return new Intl.NumberFormat('en-FI', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(value);
}

export default function BudgetEntryForm() {
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState<string>('');
  const [month, setMonth] = useState('');
  const [note, setNote] = useState('');

  const [entries, setEntries] = useState<BudgetEntry[]>([]);
  const [errors, setErrors] = useState<Errors>({});
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const parsedAmount = useMemo(() => Number(amount), [amount]);

  function validate(): Errors {
    const next: Errors = {};

    if (!category.trim()) next.category = 'Please enter a category.';
    if (!month.trim()) next.month = 'Please enter a month (e.g., Jan).';

    if (amount.trim().length === 0) {
      next.amount = 'Please enter an amount.';
    } else if (Number.isNaN(parsedAmount)) {
      next.amount = 'Amount must be a number.';
    } else if (parsedAmount <= 0) {
      next.amount = 'Amount must be greater than 0.';
    }

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

    // Step 1: store in memory only
    setEntries((prev) => [entry, ...prev]);

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
            <Input
              value={category}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setCategory(e.target.value)
              }
              placeholder="e.g. Groceries"
              aria-invalid={Boolean(showError('category'))}
            />
            {showError('category') ? (
              <p className="mt-1 text-xs text-rose-600">{errors.category}</p>
            ) : null}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Amount (€)</label>
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
            <Input
              value={month}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setMonth(e.target.value)
              }
              placeholder="e.g. Jan"
              aria-invalid={Boolean(showError('month'))}
            />
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
            Prototype step: entries are stored in memory only.
          </p>
          <Button type="submit">Add entry</Button>
        </div>
      </form>

      {/* Preview list (memory-only) */}
      <div className="rounded-xl border border-border/60 bg-muted/10 p-4">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold">Preview</div>
            <div className="text-xs text-muted-foreground">
              Recently added entries (not saved yet)
            </div>
          </div>
          <Badge className="bg-purple-100 text-purple-700">In-memory</Badge>
        </div>

        {entries.length === 0 ? (
          <p className="text-sm text-muted-foreground">No entries added yet.</p>
        ) : (
          <ul className="space-y-2">
            {entries.slice(0, 5).map((e) => (
              <li
                key={e.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border/50 bg-background/60 p-3"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">{e.category}</span>
                  <span className="text-xs text-muted-foreground">•</span>
                  <span className="text-xs text-muted-foreground">
                    {e.month}
                  </span>
                  {e.note ? (
                    <>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground">
                        {e.note}
                      </span>
                    </>
                  ) : null}
                </div>
                <span className="text-sm font-semibold">
                  {formatEuro(e.amount)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
