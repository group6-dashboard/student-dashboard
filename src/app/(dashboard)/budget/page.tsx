import SpendingDonutChart from '@/components/budget/SpendingDonutChart';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/Card';

import { Badge } from '@/components/ui/primitives';

export default function BudgetPage() {
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
            {/* TODO (Draft demo): Donut / Pie chart with mock data */}
            <SpendingDonutChart />
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
            {/* TODO (Draft demo): Static progress / gauge indicator */}
            <Placeholder>
              Progress indicator placeholder — example: €350 / €500 used (static
              value for draft demo).
            </Placeholder>
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
              Grouped bar chart placeholder — monthly income vs expenses (mock
              data).
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
            {/*
              TODO (Later):
              - Simple table / form
              - Fields: category, amount, month
              - No full CRUD logic (visualization-driven)
            */}
            <Placeholder>
              Input table placeholder — will allow adding expense / income
              entries for visualization.
            </Placeholder>
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
