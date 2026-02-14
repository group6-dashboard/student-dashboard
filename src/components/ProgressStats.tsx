"use client";

type Props = {
  total: number;
  completed: number;
  alarms: number;
};

export default function ProgressStats({
  total,
  completed,
  alarms,
}: Props) {
  const percent =
    total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <div className="space-y-3">
      <div className="flex justify-between text-sm">
        <span>Today progress</span>
        <span className="font-semibold">{percent}%</span>
      </div>

      <div className="h-2 rounded-full bg-white/20 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-pink-500 to-purple-500 transition-all duration-700"
          style={{ width: `${percent}%` }}
        />
      </div>

      <div className="flex justify-between text-xs text-white/80 pt-1">
        <span>{completed} completed</span>
        <span>{alarms} alarms active</span>
      </div>
    </div>
  );
}
