"use client";

import {
  PlusCircle,
  Bell,
  Flame,
  BarChart3,
  CheckCircle,
} from "lucide-react";

type Props = {
  onNew: () => void;
  totalWithAlarm: number;
  highPriorityCount: number;
};

export default function QuickActionBar({
  onNew,
  totalWithAlarm,
  highPriorityCount,
}: Props) {
  return (
    <div className="sticky bottom-4 z-40 mx-auto max-w-[1100px] px-4">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border bg-white/90 p-4 shadow-lg backdrop-blur">
        
        {/* ➕ New Task */}
        <button
          onClick={onNew}
          className="flex items-center gap-2 rounded-xl bg-pink-500 px-4 py-2 text-sm font-medium text-white hover:bg-pink-600 transition"
        >
          <PlusCircle size={18} />
          New Task
        </button>

        {/* ⏰ With Alarm */}
        <div className="flex items-center gap-2 rounded-xl bg-pink-50 px-4 py-2 text-sm text-pink-600">
          <Bell size={16} />
          {totalWithAlarm} Alarms
        </div>

        {/* 🔥 High Priority */}
        <div className="flex items-center gap-2 rounded-xl bg-red-50 px-4 py-2 text-sm text-red-600">
          <Flame size={16} />
          {highPriorityCount} High Priority
        </div>

        {/* 📊 Report */}
        <div className="flex items-center gap-2 rounded-xl bg-purple-50 px-4 py-2 text-sm text-purple-600">
          <BarChart3 size={16} />
          Weekly Report
        </div>

        {/* ✅ Status */}
        <div className="flex items-center gap-2 rounded-xl bg-green-50 px-4 py-2 text-sm text-green-600">
          <CheckCircle size={16} />
          System Active
        </div>
      </div>
    </div>
  );
}
