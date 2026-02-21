"use client";

import { useEffect, useState } from "react";
import {
  BarChart3,
  Bell,
  CheckCircle2,
  Flame,
  ListTodo,
} from "lucide-react";
import { ScheduleItem } from "@/components/EventList";

type Props = {
  events: ScheduleItem[];
};

export default function ScheduleFooter({ events }: Props) {
  const [stats, setStats] = useState({
    total: 0,
    high: 0,
    medium: 0,
    low: 0,
    withAlarm: 0,
  });

  // Compute and load stats from localStorage
  useEffect(() => {
    const total = events.length;
    const high = events.filter((e) => e.priority === "High").length;
    const medium = events.filter((e) => e.priority === "Medium").length;
    const low = events.filter((e) => e.priority === "Low").length;
    const withAlarm = events.filter((e) => e.alarmMinutes).length;

    const newStats = { total, high, medium, low, withAlarm };
    setStats(newStats);

    if (typeof window !== "undefined") {
      localStorage.setItem("scheduleFooterStats", JSON.stringify(newStats));
    }
  }, [events]);

  const percent = (n: number) =>
    stats.total === 0 ? 0 : Math.round((n / stats.total) * 100);

  return (
    <footer className="mt-16 border-t bg-gradient-to-b from-white to-gray-50 py-10">
      <div className="mx-auto max-w-[1440px] px-6 space-y-8">
        {/* ===== Header ===== */}
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-pink-500/10 p-2 text-pink-600">
            <BarChart3 />
          </div>
          <div>
            <h3 className="text-lg font-semibold">
              Weekly Progress Overview
            </h3>
            <p className="text-sm text-gray-500">
              Visual summary of your scheduled tasks
            </p>
          </div>
        </div>

        {/* ===== Progress Bars ===== */}
        <div className="space-y-4">
          {[
            { label: "High Priority", value: stats.high, color: "bg-red-500" },
            { label: "Medium Priority", value: stats.medium, color: "bg-yellow-400" },
            { label: "Low Priority", value: stats.low, color: "bg-green-500" },
          ].map((item) => (
            <div key={item.label}>
              <div className="mb-1 flex justify-between text-xs font-medium">
                <span>{item.label}</span>
                <span>{percent(item.value)}%</span>
              </div>
              <div className="h-2 rounded-full bg-gray-200 overflow-hidden">
                <div
                  className={`h-full ${item.color} transition-all duration-700`}
                  style={{ width: `${percent(item.value)}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* ===== Stats Cards ===== */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard icon={<ListTodo />} label="Total Tasks" value={stats.total} />
          <StatCard icon={<Flame />} label="High Priority" value={stats.high} color="text-red-500" />
          <StatCard icon={<Bell />} label="With Alarm" value={stats.withAlarm} color="text-pink-500" />
          <StatCard icon={<CheckCircle2 />} label="Status" value="Active" color="text-green-600" />
        </div>
      </div>
    </footer>
  );
}

/* ===== Small Component ===== */
function StatCard({
  icon,
  label,
  value,
  color = "text-gray-800",
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  color?: string;
}) {
  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm transition hover:shadow-md">
      <div className={`mb-2 ${color}`}>{icon}</div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-lg font-semibold">{value}</p>
    </div>
  );
}