import { Pencil, Trash2, Bell } from "lucide-react";
import { useState } from "react";

type Props = {
  title: string;
  time: string;
  type: string;
  priority: string;

  /* 🔔 NEW – alarm */
  alarmMinutes?: number | null;
  onAlarmChange?: (minutes: number | null) => void;

  onEdit: () => void;
  onDelete: () => void;
};

export default function EventCard({
  title,
  time,
  type,
  priority,
  alarmMinutes = null,
  onAlarmChange,
  onEdit,
  onDelete,
}: Props) {
  const [showAlarmMenu, setShowAlarmMenu] = useState(false);

  return (
    <div className="relative rounded-xl border bg-white p-3 space-y-2 shadow-sm">
      {/* ✏️ Edit */}
      <button
        aria-label="Edit schedule"
        onClick={onEdit}
        className="absolute top-2 right-2 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-black"
      >
        <Pencil size={14} />
      </button>

      {/* 🗑 Delete */}
      <button
        aria-label="Delete schedule"
        onClick={onDelete}
        className="flex items-center gap-2 text-xs text-gray-400 hover:text-red-500"
      >
        <Trash2 size={14} />
      </button>

      {/* 📌 Title */}
      <h4 className="text-sm font-semibold break-words leading-snug">
        {title}
      </h4>

      {/* ⏰ Time */}
      <p className="text-xs text-gray-500">{time}</p>

      {/* 🏷 Tags */}
      <div className="flex flex-wrap gap-2 text-xs">
        <span className="rounded bg-gray-100 px-2 py-0.5">
          {type}
        </span>

        <span
          className={`rounded px-2 py-0.5
            ${
              priority === "High"
                ? "bg-red-100 text-red-600"
                : priority === "Medium"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-green-100 text-green-600"
            }
          `}
        >
          {priority}
        </span>
      </div>

      {/* 🔔 Alarm */}
      <div className="relative pt-2">
        <button
          onClick={() => setShowAlarmMenu(!showAlarmMenu)}
          className={`flex items-center gap-1 text-xs
            ${
              alarmMinutes
                ? "text-pink-600"
                : "text-gray-400 hover:text-black"
            }
          `}
        >
          <Bell size={14} />
          {alarmMinutes
            ? `Alert ${alarmMinutes} min before`
            : "Add alert"}
        </button>

        {/* ⏱ Alarm menu */}
        {showAlarmMenu && (
          <div className="absolute z-10 mt-2 w-44 rounded-lg border bg-white p-2 shadow">
            {[5, 10, 15, 30, 60].map((m) => (
              <button
                key={m}
                onClick={() => {
                  onAlarmChange?.(m);
                  setShowAlarmMenu(false);
                }}
                className="block w-full rounded px-2 py-1 text-left text-xs hover:bg-gray-100"
              >
                {m} minutes before
              </button>
            ))}

            {alarmMinutes && (
              <button
                onClick={() => {
                  onAlarmChange?.(null);
                  setShowAlarmMenu(false);
                }}
                className="mt-1 block w-full rounded px-2 py-1 text-left text-xs text-red-500 hover:bg-red-50"
              >
                Disable alert
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
