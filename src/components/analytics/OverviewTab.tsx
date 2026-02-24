import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface SemesterData {
  name: string;
  planned: number;
  actual: number | null;
  credits: number | null;
  gpa: number | null;
}

interface Statistics {
  totalCreditsEarned: number;
  totalTargetCredits: number;
  progressPercentage: number;
  cumulativeGPA: number;
  lastSemesterGPA: number;
  gpaChange: number;
  lastSemesterName: string;
}

interface OverviewTabProps {
  semesterData: SemesterData[];
  statistics: Statistics;
}

export function OverviewTab({ semesterData, statistics }: OverviewTabProps) {
  return (
    <div className="space-y-4">
      {/* Top: Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Cumulative GPA</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.cumulativeGPA.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              {statistics.gpaChange >= 0 ? '+' : ''}{statistics.gpaChange.toFixed(2)} (vs previous semester)
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Last Semester GPA</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.lastSemesterGPA.toFixed(2)}</div>
            <p className="text-xs text-green-600">
              Last Term: {statistics.lastSemesterName}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Credits Earned</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.totalCreditsEarned} / {statistics.totalTargetCredits}</div>
            <div className="w-full bg-secondary h-2 mt-2 rounded-full overflow-hidden">
              <div className="bg-blue-600 h-full" style={{ width: `${statistics.progressPercentage}%` }}></div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom: Line Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Credit Acquisition Trend (Cumulative)</CardTitle>
          <CardDescription>
            Comparison between planned targets and actual progress towards 124 credits.
          </CardDescription>
        </CardHeader>
        <CardContent className="h-[400px] w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={semesterData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12 }} 
                interval={0}
              />
              <YAxis domain={[0, 130]} tick={{ fontSize: 12 }} />
              <Tooltip 
                contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
              />
              <Legend verticalAlign="top" height={36}/>
              {/* Target Line (Dashed) */}
              <Line
                name="Target (Planned)"
                type="monotone"
                dataKey="planned"
                stroke="#94a3b8"
                strokeDasharray="5 5"
                dot={{ r: 4 }}
              />
              {/* Actual Line (Solid) */}
              <Line
                name="Actual Credits Earned"
                type="monotone"
                dataKey="actual"
                stroke="#2563eb"
                strokeWidth={3}
                dot={{ r: 6, fill: "#2563eb" }}
                activeDot={{ r: 8 }}
                connectNulls={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
