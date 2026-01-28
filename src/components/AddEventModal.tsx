'use client';

export default function AddEventModal({
  onClose,
}: {
  onClose: () => void;
  onAdd: (data: any) => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-[460px] rounded-xl p-6 space-y-4">
        <h3 className="text-lg font-semibold">Add New Event</h3>

        <input className="w-full border px-4 py-2 rounded-lg" placeholder="Event title" />
        <input type="date" className="w-full border px-4 py-2 rounded-lg" />

        <div className="flex gap-2">
          <input type="time" className="w-1/2 border px-4 py-2 rounded-lg" />
          <input type="time" className="w-1/2 border px-4 py-2 rounded-lg" />
        </div>

        <textarea
          placeholder="Description"
          className="w-full border px-4 py-2 rounded-lg"
        />

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 border rounded-lg">
            Cancel
          </button>
          <button className="px-4 py-2 bg-pink-500 text-white rounded-lg">
            Add Event
          </button>
        </div>
      </div>
    </div>
  );
}
