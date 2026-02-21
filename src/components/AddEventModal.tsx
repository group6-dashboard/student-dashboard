"use client";

import { useState } from "react";

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
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [priority, setPriority] = useState("High");

  if (!open) return null;

  const handleAdd = () => {
    if (!title || !date || !time) {
      alert("Please fill all fields");
      return;
    }

    const newEvent = { title, date, time, priority };

    // Call parent onAdd
    onAdd(newEvent);

    // Save to localStorage
    const saved = localStorage.getItem("events");
    const currentEvents = saved ? JSON.parse(saved) : [];
    localStorage.setItem("events", JSON.stringify([...currentEvents, newEvent]));

    // Clear form
    setTitle("");
    setDate("");
    setTime("");
    setPriority("High");

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-xl bg-white p-6 space-y-4">
        <h2 className="text-lg font-semibold">New Schedule</h2>

        <input
          aria-label="Schedule title"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-lg border px-3 py-2 text-sm"
        />

        <input
          aria-label="Schedule date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full rounded-lg border px-3 py-2 text-sm"
        />

        <input
          aria-label="Schedule time"
          placeholder="09:00 - 10:00"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="w-full rounded-lg border px-3 py-2 text-sm"
        />

        <select
          aria-label="Schedule priority"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="w-full rounded-lg border px-3 py-2 text-sm"
        >
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>

        <div className="flex justify-end gap-2 pt-2">
          <button
            onClick={() => {
              setTitle("");
              setDate("");
              setTime("");
              setPriority("High");
              onClose();
            }}
            className="rounded-lg border px-4 py-2 text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleAdd}
            className="rounded-lg bg-pink-500 px-4 py-2 text-sm text-white"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}