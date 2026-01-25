'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MiniCalendarProps {
  currentDate: Date;
}

export default function MiniCalendar({ currentDate }: MiniCalendarProps) {
  const [selectedDate, setSelectedDate] = useState(new Date(2022, 4, 23));
  const [calendarView, setCalendarView] = useState<'Week' | 'Month' | 'Year'>('Month');

  const daysInMonth = new Date(2022, 5, 0).getDate();
  const firstDayOfMonth = new Date(2022, 4, 1).getDay();
  const adjustedFirstDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

  const monthDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: adjustedFirstDay }, (_, i) => i);

  const isToday = (day: number) => {
    return day === 23;
  };

  const isInRange = (day: number) => {
    return day >= 23 && day <= 29;
  };

  return (
    <div className="bg-gradient-to-br from-indigo-900 to-indigo-700 rounded-2xl p-6 text-white">
      <div className="flex items-center justify-between mb-4">
        <Button
          className="text-white hover:bg-white/10 h-8 w-8"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <h3 className="text-lg font-bold">MAY 2022</h3>
        <Button
          className="text-white hover:bg-white/10 h-8 w-8"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-4">
        {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map((day) => (
          <div key={day} className="text-center text-xs font-medium opacity-70">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 mb-4">
        {emptyDays.map((i) => (
          <div key={`empty-${i}`} className="aspect-square" />
        ))}
        {monthDays.map((day) => (
          <button
            key={day}
            onClick={() => setSelectedDate(new Date(2022, 4, day))}
            className={`aspect-square rounded-lg flex items-center justify-center text-sm font-medium transition-colors ${
              isToday(day)
                ? 'bg-cyan-400 text-white'
                : isInRange(day)
                ? 'bg-white/20 text-white'
                : 'text-white/60 hover:bg-white/10'
            }`}
          >
            {day}
          </button>
        ))}
      </div>

      <div className="border-t border-white/20 pt-4">
        <div className="flex gap-2">
          {(['Week', 'Month', 'Year'] as const).map((view) => (
            <button
              key={view}
              onClick={() => setCalendarView(view)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                calendarView === view
                  ? 'bg-pink-500 text-white'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              {view}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

