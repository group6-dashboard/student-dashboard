/* -----------------------------
   Types
------------------------------ */

export type BudgetCategory =
  | 'Rent'
  | 'Groceries'
  | 'Transport'
  | 'Leisure'
  | 'Other';

export interface CategoryExpense {
  category: BudgetCategory;
  amount: number;
}

export interface MonthlyCashflow {
  month: string; // e.g. "Jan", "Feb"
  income: number;
  expense: number;
}

export interface BudgetData {
  monthlyBudget: number;
  categoryExpenses: CategoryExpense[];
  monthlyCashflow: MonthlyCashflow[];
}

/* -----------------------------
   Mock data
------------------------------ */

export const mockBudgetData: BudgetData = {
  monthlyBudget: 500,

  categoryExpenses: [
    { category: 'Rent', amount: 220 },
    { category: 'Groceries', amount: 90 },
    { category: 'Transport', amount: 40 },
    { category: 'Leisure', amount: 60 },
    { category: 'Other', amount: 20 },
  ],

  monthlyCashflow: [
    { month: 'Nov', income: 850, expense: 620 },
    { month: 'Dec', income: 900, expense: 700 },
    { month: 'Jan', income: 900, expense: 430 },
  ],
};

/* -----------------------------
   Helpers
------------------------------ */

/**
 * Sum total expenses across all categories
 */
export function getTotalSpent(
  expenses: CategoryExpense[] = mockBudgetData.categoryExpenses,
): number {
  return expenses.reduce((total, item) => total + item.amount, 0);
}

/**
 * Group expenses by category (useful for charts)
 */
export function sumByCategory(
  expenses: CategoryExpense[] = mockBudgetData.categoryExpenses,
): Record<BudgetCategory, number> {
  return expenses.reduce(
    (acc, item) => {
      acc[item.category] += item.amount;
      return acc;
    },
    {
      Rent: 0,
      Groceries: 0,
      Transport: 0,
      Leisure: 0,
      Other: 0,
    },
  );
}
