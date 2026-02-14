"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { Bell } from "lucide-react";
import ScheduleHeader, {
  FilterPriority,
  FilterType,
} from "@/components/ScheduleHeader";
import ScheduleTabs from "@/components/ScheduleTabs";
import EventList, { ScheduleItem } from "@/components/EventList";
import MiniCalendar from "@/components/MiniCalendar";
import NewScheduleModal from "@/components/NewScheduleModal";
import ScheduleFooter from "@/components/ScheduleFooter";
import QuickActionBar from "@/components/QuickActionBar";


export default function SchedulePage() {
  const [events, setEvents] = useState<ScheduleItem[]>([]);
  const [open, setOpen] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const [viewMode, setViewMode] = useState<
    "Daily" | "Weekly" | "Monthly" | "Agenda"
  >("Weekly");

  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [filterType, setFilterType] =
    useState<FilterType>("All");
  const [filterPriority, setFilterPriority] =
    useState<FilterPriority>("All");

  const firedAlarms = useRef<Set<string>>(new Set());
  const [alarmMessage, setAlarmMessage] =
    useState<string | null>(null);

  /* ===================== ALARM ENGINE ===================== */
  useEffect(() => {
    if (!("Notification" in window)) return;

    if (Notification.permission === "default") {
      Notification.requestPermission();
    }

    const interval = setInterval(() => {
      const now = new Date();

      events.forEach((event) => {
        if (!event.startTime || !event.alarmMinutes) return;

        const eventDate = new Date(
          `${event.date}T${event.startTime}:00`
        );

        if (isNaN(eventDate.getTime())) return;

        const diff = eventDate.getTime() - now.getTime();
        const alarmWindow = event.alarmMinutes * 60 * 1000;

        const key = `${event.title}-${event.date}-${event.startTime}`;

        if (
          diff > 0 &&
          diff <= alarmWindow &&
          !firedAlarms.current.has(key)
        ) {
          firedAlarms.current.add(key);

          if (Notification.permission === "granted") {
            new Notification("⏰ Upcoming Event", {
              body: `"${event.title}" starts in ${event.alarmMinutes} minutes`,
            });
          }

          setAlarmMessage(
            `⏰ "${event.title}" starts in ${event.alarmMinutes} minutes`
          );

          setTimeout(() => setAlarmMessage(null), 6000);
        }
      });
    }, 30000);

    return () => clearInterval(interval);
  }, [events]);

  /* ===================== FILTER LOGIC ===================== */
  const visibleEvents = useMemo(() => {
    let list = [...events];

    if (search.trim()) {
      list = list.filter((e) =>
        e.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (filterType !== "All") {
      list = list.filter((e) => e.type === filterType);
    }

    if (filterPriority !== "All") {
      list = list.filter(
        (e) => e.priority === filterPriority
      );
    }

    if (
      selectedDate &&
      (viewMode === "Daily" || viewMode === "Agenda")
    ) {
      list = list.filter((e) => e.date === selectedDate);
    }

    if (viewMode === "Agenda") {
      list.sort((a, b) => a.date.localeCompare(b.date));
    }

    return list;
  }, [
    events,
    search,
    filterType,
    filterPriority,
    selectedDate,
    viewMode,
  ]);

  return (
    <section className="relative w-full">
      {alarmMessage && (
        <div className="fixed top-4 left-1/2 z-50 -translate-x-1/2 animate-bounce rounded-xl bg-pink-500 px-6 py-3 text-sm text-white shadow-lg flex items-center gap-2">
          <Bell size={16} />
          {alarmMessage}
        </div>
      )}
<QuickActionBar
  onNew={() => {
    setEditIndex(null);
    setOpen(true);
  }}
  totalWithAlarm={events.filter(e => e.alarmMinutes).length}
  highPriorityCount={
    events.filter(e => e.priority === "High").length
  }
/>

      <div className="mx-auto max-w-[1440px] px-6 py-6 space-y-6">
        <ScheduleHeader
          onNewSchedule={() => {
            setEditIndex(null);
            setOpen(true);
          }}
          search={search}
          filterType={filterType}
          filterPriority={filterPriority}
          onSearchChange={setSearch}
          onFilterTypeChange={setFilterType}
          onFilterPriorityChange={setFilterPriority}
        />

        {/* <ScheduleTabs
          value={viewMode}
          onChange={setViewMode}
        /> */}

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 xl:col-span-9">
            <EventList
              events={visibleEvents}
              onDelete={(i) =>
                setEvents(events.filter((_, idx) => idx !== i))
              }
              onEdit={(i) => {
                setEditIndex(i);
                setOpen(true);
              }}
              onMove={(from, toDay) => {
                const updated = [...events];
                updated[from] = {
                  ...updated[from],
                  weekday: toDay,
                };
                setEvents(updated);
              }}
            />
          </div>

          <aside className="col-span-12 xl:col-span-3">
            <MiniCalendar
              events={events}
              onSelectDate={setSelectedDate}
            />
          </aside>
        </div>
      </div>

      <ScheduleFooter events={events} />

      <NewScheduleModal
        open={open}
        initialData={
          editIndex !== null ? events[editIndex] : null
        }
        onClose={() => {
          setOpen(false);
          setEditIndex(null);
        }}
        onSubmit={(data) => {
          const weekday = new Date(data.date).toLocaleDateString(
            "en-US",
            { weekday: "long" }
          );

          const item: ScheduleItem = {
            ...data,
            time: `${data.startTime} - ${data.endTime}`,
            weekday,
          };

          if (editIndex !== null) {
            const updated = [...events];
            updated[editIndex] = item;
            setEvents(updated);
          } else {
            setEvents([...events, item]);
          }

          setOpen(false);
          setEditIndex(null);
        }}
      />
      
    </section>
  );
}
