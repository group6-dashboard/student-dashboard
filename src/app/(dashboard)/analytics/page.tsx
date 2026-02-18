"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

export default function AnalyticsPage() {
  const [semesterData, setSemesterData] = useState<SemesterData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/data/semester-data.json")
      .then((res) => res.json())
      .then((data) => {
        setSemesterData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to load semester data:", error);
        setLoading(false);
      });
  }, []);

  // Calculate statistics from semester data
  const statistics = useMemo(() => {
    const completedSemesters = semesterData.filter(s => s.actual !== null && s.gpa !== null);
    
    // Total credits earned (latest cumulative actual value)
    const totalCreditsEarned = completedSemesters.length > 0 
      ? completedSemesters[completedSemesters.length - 1].actual || 0
      : 0;
    
    // Total target credits (last planned value)
    const totalTargetCredits = semesterData.length > 0
      ? semesterData[semesterData.length - 1].planned
      : 124;
    
    // Progress percentage
    const progressPercentage = (totalCreditsEarned / totalTargetCredits) * 100;
    
    // Calculate cumulative GPA (weighted average)
    let cumulativeGPA = 0;
    if (completedSemesters.length > 0) {
      const totalCredits = completedSemesters.reduce((sum, s) => sum + (s.credits || 0), 0);
      const totalGradePoints = completedSemesters.reduce((sum, s) => sum + (s.credits || 0) * (s.gpa || 0), 0);
      cumulativeGPA = totalCredits > 0 ? totalGradePoints / totalCredits : 0;
    }
    
    // Last semester GPA
    const lastSemesterGPA = completedSemesters.length > 0
      ? completedSemesters[completedSemesters.length - 1].gpa || 0
      : 0;
    
    // Calculate previous cumulative GPA (without last semester)
    let previousCumulativeGPA = 0;
    if (completedSemesters.length > 1) {
      const previousSemesters = completedSemesters.slice(0, -1);
      const totalCredits = previousSemesters.reduce((sum, s) => sum + (s.credits || 0), 0);
      const totalGradePoints = previousSemesters.reduce((sum, s) => sum + (s.credits || 0) * (s.gpa || 0), 0);
      previousCumulativeGPA = totalCredits > 0 ? totalGradePoints / totalCredits : 0;
    }
    
    // GPA change
    const gpaChange = cumulativeGPA - previousCumulativeGPA;
    
    // Last semester name
    const lastSemesterName = completedSemesters.length > 0
      ? completedSemesters[completedSemesters.length - 1].name
      : "N/A";

    return {
      totalCreditsEarned,
      totalTargetCredits,
      progressPercentage,
      cumulativeGPA,
      lastSemesterGPA,
      gpaChange,
      lastSemesterName
    };
  }, [semesterData]);

  if (loading) {
    return (
      <div className="p-6 max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Academic Analytics</h1>
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Academic Analytics</h1>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview & Progress</TabsTrigger>
          <TabsTrigger value="courses">Course List</TabsTrigger>
        </TabsList>

        {/* --- Tab 1: Overview & Progress --- */}
        <TabsContent value="overview" className="space-y-4">
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
        </TabsContent>

        {/* --- Tab 2: Course List (Placeholder) --- */}
        <TabsContent value="courses">
          <Card>
            <CardContent className="py-10 text-center text-muted-foreground">
              Search and filter functionality for courses will be implemented here.
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
    );
}