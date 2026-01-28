'use client';

export default function NewScheduleButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="bg-white px-4 py-2 rounded-lg shadow text-sm font-semibold hover:bg-gray-50"
    >
      + New Schedule
    </button>
  );
}
