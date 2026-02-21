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
import LocalStorageDebugger from "@/components/LocalStorageDebbuger";

export default function SchedulePage() {
  // Load events from localStorage if available
  const [events, setEvents] = useState<ScheduleItem[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("events");
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  const [open, setOpen] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [viewMode, setViewMode] =
    useState<"Daily" | "Weekly" | "Monthly" | "Agenda">("Weekly");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<FilterType>("All");
  const [filterPriority, setFilterPriority] = useState<FilterPriority>("All");

  const firedAlarms = useRef<Set<string>>(new Set());
  const [alarmMessage, setAlarmMessage] = useState<string | null>(null);

  /* ===================== LOCAL STORAGE ===================== */
  useEffect(() => {
    localStorage.setItem("events", JSON.stringify(events));
  }, [events]);

  /* ===================== EVENT HANDLERS ===================== */
  const handleEdit = (index: number, updatedEvent: ScheduleItem) => {
    const updated = [...events];
    updated[index] = updatedEvent;
    setEvents(updated);
    localStorage.setItem("events", JSON.stringify(updated));
  };

  const handleDelete = (index: number) => {
    const updated = events.filter((_, i) => i !== index);
    setEvents(updated);
    localStorage.setItem("events", JSON.stringify(updated));
  };

  const handleAlarmChange = (index: number, minutes: number | undefined) => {
    const updated = [...events];
    updated[index].alarmMinutes = minutes;
    setEvents(updated);
    localStorage.setItem("events", JSON.stringify(updated));
  };

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

        const eventDate = new Date(`${event.date}T${event.startTime}:00`);
        if (isNaN(eventDate.getTime())) return;

        const diff = eventDate.getTime() - now.getTime();
        const alarmWindow = event.alarmMinutes * 60 * 1000;
        const key = `${event.title}-${event.date}-${event.startTime}`;

        if (diff > 0 && diff <= alarmWindow && !firedAlarms.current.has(key)) {
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
      list = list.filter((e) => e.priority === filterPriority);
    }

    if (selectedDate && (viewMode === "Daily" || viewMode === "Agenda")) {
      list = list.filter((e) => e.date === selectedDate);
    }

    if (viewMode === "Agenda") {
      list.sort((a, b) => a.date.localeCompare(b.date));
    }

    return list;
  }, [events, search, filterType, filterPriority, selectedDate, viewMode]);

  /* ===================== IMPORT / EXPORT ===================== */
  const handleImport = (data: ScheduleItem[]) => {
    setEvents(data); // also saves to localStorage
    alert("Schedules imported!");
  };

  const handleExport = () => {
    if (!events || events.length === 0) {
      alert("No events to export!");
      return;
    }

    const json = JSON.stringify(events, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "schedules.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

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
        totalWithAlarm={events.filter((e) => e.alarmMinutes).length}
        highPriorityCount={events.filter((e) => e.priority === "High").length}
      />

      <div className="mx-auto max-w-[1440px] px-6 py-6 space-y-6">
        <ScheduleHeader
          onNewSchedule={() => {
            setEditIndex(null);
            setOpen(true);
          }}
          onImport={handleImport}
          onExport={handleExport}
          search={search}
          filterType={filterType}
          filterPriority={filterPriority}
          onSearchChange={setSearch}
          onFilterTypeChange={setFilterType}
          onFilterPriorityChange={setFilterPriority}
        />

        {/* <ScheduleTabs value={viewMode} onChange={setViewMode} /> */}

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 xl:col-span-9">
            <EventList
              events={visibleEvents}
              onDelete={(i) => handleDelete(i)}
              onEdit={(i) => {
                setEditIndex(i);
                setOpen(true);
              }}
              onMove={(from, toDay) => {
                const updated = [...events];
                updated[from] = { ...updated[from], weekday: toDay };
                setEvents(updated);
                localStorage.setItem("events", JSON.stringify(updated));
              }}
            />
          </div>

          <aside className="col-span-12 xl:col-span-3">
            <MiniCalendar events={events} onSelectDate={setSelectedDate} />
          </aside>
        </div>
      </div>

      <ScheduleFooter events={events} />
       <LocalStorageDebugger />
      <NewScheduleModal
        open={open}
        initialData={
          editIndex !== null
            ? {
                ...events[editIndex],
                endTime: events[editIndex].endTime || "",
                description: events[editIndex].description || "",
              }
            : null
        }
        onClose={() => {
          setOpen(false);
          setEditIndex(null);
        }}
        onSubmit={(data) => {
          const weekday = new Date(data.date).toLocaleDateString("en-US", {
            weekday: "long",
          });

          const item: ScheduleItem = {
            ...data,
            time: `${data.startTime} - ${data.endTime}`,
            weekday,
            priority: data.priority as "High" | "Medium" | "Low",
            type: data.type as "Meeting" | "Event" | "Personal" | "Deadline",
          };

          if (editIndex !== null) {
            handleEdit(editIndex, item);
          } else {
            const updated = [...events, item];
            setEvents(updated);
            localStorage.setItem("events", JSON.stringify(updated));
          }

          setOpen(false);
          setEditIndex(null);
        }}
      />
    </section>
  );
}