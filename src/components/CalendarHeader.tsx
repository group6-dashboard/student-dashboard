"use client";

const DAYS = [
  { key: "Monday", label: "MON", num: 12 },
  { key: "Tuesday", label: "TUE", num: 13 },
  { key: "Wednesday", label: "WED", num: 14 },
  { key: "Thursday", label: "THU", num: 15 },
  { key: "Friday", label: "FRI", num: 16 },
  { key: "Saturday", label: "SAT", num: 17 },
  { key: "Sunday", label: "SUN", num: 18 },
];

export default function CalendarHeader({
  onNew,
}: {
  onNew: () => void;
}) {
  return (
    <div className="rounded-2xl bg-gradient-to-r from-pink-500 to-purple-500 p-6 text-white space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">
          JANUARY 2026
        </h2>

        <button
          onClick={onNew}
          className="rounded-lg bg-white/20 px-4 py-2 text-sm"
        >
          + New Schedule
        </button>

        <div className="flex bg-white/20 rounded-lg overflow-hidden text-sm">
          <button className="px-4 py-2">Daily</button>
          <button className="px-4 py-2 bg-white text-purple-600">
            Weekly
          </button>
          <button className="px-4 py-2">Monthly</button>
          <button className="px-4 py-2">Agenda</button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-4 text-center">
        {DAYS.map((d) => (
          <div key={d.key} className="space-y-2">
            <div
              className={`mx-auto h-10 w-10 flex items-center justify-center rounded-full
                ${
                  d.label === "SUN"
                    ? "border-2 border-yellow-400"
                    : "bg-white/20"
                }`}
            >
              {d.num}
            </div>
            <div className="text-xs opacity-80">
              {d.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
