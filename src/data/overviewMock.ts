export type OverviewMock = {
  upcomingClasses: Array<{
    name: string;
    time: string;
    location: string;
  }>;
  assignments: Array<{
    title: string;
    course: string;
    dueDate: string;
  }>;
  credits: {
    earned: number;
    total: number;
  };
  budget: {
    spent: number;
    total: number;
  };
  focusTasks: Array<{
    id: string;
    title: string;
    done: boolean;
  }>;
  activityTrend7: Array<{
    label: string;
    value: number;
  }>;
  activityTrend30: Array<{
    label: string;
    value: number;
  }>;
};

export const overviewMock: OverviewMock = {
  upcomingClasses: [
    { name: "UX Design", time: "Mon 09:00", location: "Room B204" },
    { name: "Web Dev Lab", time: "Wed 13:15", location: "Lab 3.1" },
    { name: "Data Ethics", time: "Fri 10:45", location: "Room A112" },
  ],
  assignments: [
    {
      title: "Dashboard wireframe",
      course: "UX Design",
      dueDate: "2026-01-18",
    },
    {
      title: "API integration notes",
      course: "Web Dev",
      dueDate: "2026-01-20",
    },
    {
      title: "Budget reflection",
      course: "Personal Finance",
      dueDate: "2026-01-24",
    },
  ],
  credits: {
    earned: 178,
    total: 240,
  },
  budget: {
    spent: 245,
    total: 400,
  },
  focusTasks: [
    { id: "task-1", title: "Finish dashboard layout", done: true },
    { id: "task-2", title: "Review analytics requirements", done: false },
    { id: "task-3", title: "Prepare schedule for next week", done: false },
  ],
  activityTrend7: [
    { label: "Mon", value: 24 },
    { label: "Tue", value: 36 },
    { label: "Wed", value: 18 },
    { label: "Thu", value: 42 },
    { label: "Fri", value: 30 },
    { label: "Sat", value: 12 },
    { label: "Sun", value: 28 },
  ],
  activityTrend30: [
    { label: "W1", value: 140 },
    { label: "W2", value: 182 },
    { label: "W3", value: 165 },
    { label: "W4", value: 196 },
  ],
};
