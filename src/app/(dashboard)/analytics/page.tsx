"use client";

import React, { useState, useEffect } from "react";
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

export default function AnalyticsPage() {
  const [semesterData, setSemesterData] = useState([]);
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
                <div className="text-2xl font-bold">3.42</div>
                <p className="text-xs text-muted-foreground">+0.12 (vs previous semester)</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Last Semester GPA</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3.65</div>
                <p className="text-xs text-green-600">
                  Last Term: Spring 2025
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Credits Earned</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">62 / 124</div>
                <div className="w-full bg-secondary h-2 mt-2 rounded-full overflow-hidden">
                  <div className="bg-blue-600 h-full" style={{ width: '50%' }}></div>
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