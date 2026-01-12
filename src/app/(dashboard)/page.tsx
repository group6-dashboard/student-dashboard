import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";

export default function Page() {
  return (
    <div className="space-y-6">
      {/* <div>
        <h2 className="text-2xl font-semibold tracking-tight">Overview</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Quick snapshot of your week, priorities, and progress.
        </p>
      </div> */}

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Upcoming classes</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">—</CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Assignments</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">—</CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Budget status</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">—</CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Wellbeing</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">—</CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Focus for today</CardTitle>
            <CardDescription>
              Add your key tasks, study blocks, and reminders here.
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Next deadline</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            No upcoming deadlines.
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
