

import React from 'react';

type BudgetProgressProps = {
  budget?: number; // monthly budget
  spent?: number; // total spent this month
};

function formatEuro(value: number) {
  return new Intl.NumberFormat('en-FI', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(value);
}

export default function BudgetProgress({
  budget = 500,
  spent = 350,
}: BudgetProgressProps) {
  const safeBudget = budget > 0 ? budget : 0;
  const safeSpent = Math.max(0, spent);

  const remaining = Math.max(0, safeBudget - safeSpent);
  const ratio = safeBudget === 0 ? 0 : safeSpent / safeBudget;

  const percent = Math.min(100, Math.round(ratio * 100));
  const isWarning = ratio >= 0.8;

  // Pink / purple baseline, warning shifts toward rose.
  const barClass = isWarning ? 'bg-rose-500' : 'bg-fuchsia-500';
  const badgeClass = isWarning
    ? 'bg-rose-100 text-rose-700'
    : 'bg-purple-100 text-purple-700';

  return (
    <div className="space-y-3">
      {/* Top line: numbers */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">
            {formatEuro(safeSpent)}
          </span>{' '}
          / {formatEuro(safeBudget)} used
        </div>

        <span
          className={[
            'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
            badgeClass,
          ].join(' ')}
        >
          {percent}% used
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-3 w-full overflow-hidden rounded-full bg-muted/40 ring-1 ring-border/50">
        <div
          className={['h-full rounded-full transition-[width]', barClass].join(
            ' ',
          )}
          style={{ width: `${percent}%` }}
          aria-label="Budget usage progress"
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
          role="progressbar"
        />
      </div>

      {/* Remaining */}
      <div className="text-sm text-muted-foreground">
        <span className="font-medium text-foreground">
          {formatEuro(remaining)}
        </span>{' '}
        remaining
        {isWarning ? (
          <span className="ml-2 text-rose-600">(close to the limit)</span>
        ) : null}
      </div>
    </div>
  );
}
