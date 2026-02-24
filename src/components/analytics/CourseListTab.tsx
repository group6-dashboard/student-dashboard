import React, { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Input } from "@/components/analytics/input";
import { Badge } from "@/components/analytics/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/analytics/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/analytics/select";

interface Course {
  id: number;
  name: string;
  category: string;
  credits: number;
  grade: string;
  status: "Completed" | "In Progress";
}

interface CourseListTabProps {
  coursesData: Course[];
}

export function CourseListTab({ coursesData }: CourseListTabProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const filteredCourses = useMemo(() => {
    return coursesData.filter((course) => {
      const matchesSearch = course.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === "All" || course.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [coursesData, searchQuery, categoryFilter]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Course Directory</CardTitle>
        <CardDescription>View and search your academic history.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Filters Area */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search courses by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <Select onValueChange={setCategoryFilter} defaultValue="All">
              <SelectTrigger className="w-[280px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Categories</SelectItem>
                <SelectItem value="Basic and Professional Studies">Basic and Professional Studies</SelectItem>
                <SelectItem value="Company-oriented Projects">Company-oriented Projects</SelectItem>
                <SelectItem value="Free-choice Studies">Free-choice Studies</SelectItem>
                <SelectItem value="Practical Training">Practical Training</SelectItem>
                <SelectItem value="Bachelor's Thesis">Bachelor's Thesis</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table Area */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Course Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-center">Credits</TableHead>
                  <TableHead className="text-center">Grade</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCourses.length > 0 ? (
                  filteredCourses.map((course) => (
                    <TableRow key={course.id}>
                      <TableCell className="font-medium">{course.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{course.category}</Badge>
                      </TableCell>
                      <TableCell className="text-center">{course.credits}</TableCell>
                      <TableCell className="text-center font-bold">{course.grade}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={course.status === "Completed" ? "default" : "secondary"}
                          className={course.status === "Completed" ? "bg-green-100 text-green-800 hover:bg-green-100 border-none shadow-none" : ""}
                        >
                          {course.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                      No courses found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
