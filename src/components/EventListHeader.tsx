export default function EventListHeader() {
  return (
    <div className="rounded-2xl bg-gradient-to-r from-pink-500 to-purple-500 px-6 py-4 mb-4">
      <div className="flex items-center justify-between">
        <h3 className="text-white text-lg font-semibold">
          Weekly Schedule
        </h3>

        <span className="text-sm text-white/80">
          Drag & manage your tasks
        </span>
      </div>
    </div>
  );
}
