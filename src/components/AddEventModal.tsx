type Props = {
  open: boolean;
  onClose: () => void;
  onAdd: (event: {
    title: string;
    date: string;
    time: string;
    priority: string;
  }) => void;
};

export default function AddEventModal({ open, onClose, onAdd }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-xl bg-white p-6 space-y-4">
        <h2 className="text-lg font-semibold">New Schedule</h2>

        <input
          aria-label="Schedule title"
          placeholder="Title"
          className="w-full rounded-lg border px-3 py-2 text-sm"
        />

        <input
          aria-label="Schedule date"
          type="date"
          className="w-full rounded-lg border px-3 py-2 text-sm"
        />

        <input
          aria-label="Schedule time"
          placeholder="09:00 - 10:00"
          className="w-full rounded-lg border px-3 py-2 text-sm"
        />

        <select
          aria-label="Schedule priority"
          className="w-full rounded-lg border px-3 py-2 text-sm"
        >
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>

        <div className="flex justify-end gap-2 pt-2">
          <button
            onClick={onClose}
            className="rounded-lg border px-4 py-2 text-sm"
          >
            Cancel
          </button>
          <button
            className="rounded-lg bg-pink-500 px-4 py-2 text-sm text-white"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
