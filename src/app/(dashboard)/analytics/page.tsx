"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OverviewTab } from "@/components/analytics/OverviewTab";
import { CourseListTab } from "@/components/analytics/CourseListTab";
import { calculateStatistics } from "@/lib/analytics/calculateStatistics";

interface SemesterData {
  name: string;
  planned: number;
  actual: number | null;
  credits: number | null;
  gpa: number | null;
}

interface Course {
  id: number;
  name: string;
  category: string;
  credits: number;
  grade: string;
  status: "Completed" | "In Progress";
}

export default function AnalyticsPage() {
  const [semesterData, setSemesterData] = useState<SemesterData[]>([]);
  const [coursesData, setCoursesData] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch data on mount
  useEffect(() => {
    Promise.all([
      fetch("/data/semester-data.json").then((res) => res.json()),
      fetch("/data/courses-data.json").then((res) => res.json())
    ])
      .then(([semesterData, coursesData]) => {
        setSemesterData(semesterData);
        setCoursesData(coursesData);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to load data:", error);
        setLoading(false); 
      });
  }, []);

  // Calculate statistics from semester data
  const statistics = useMemo(() => {
    return calculateStatistics(semesterData);
  }, [semesterData]);

  if (loading) {
    return (
      <div className="p-6 max-w-5xl mx-auto flex h-screen items-center justify-center">
        <p className="text-muted-foreground animate-pulse">Loading academic data...</p>
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

        <TabsContent value="overview">
          <OverviewTab semesterData={semesterData} statistics={statistics} />
        </TabsContent>

        <TabsContent value="courses">
          <CourseListTab coursesData={coursesData} />
        </TabsContent>
      </Tabs>
    </div>
  );
}