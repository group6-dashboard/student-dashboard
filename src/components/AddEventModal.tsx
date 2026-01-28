// 'use client';

// import { useState } from 'react';

// export default function AddEventModal({
//   onClose,
//   onAdd,
// }: {
//   onClose: () => void;
//   onAdd: (data: any) => void;
// }) {
//   const [form, setForm] = useState({
//     title: '',
//     date: '',
//     start: '',
//     end: '',
//     type: 'Meeting',
//     priority: 'Medium',
//   });

//   return (
//     <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
//       <div className="bg-white rounded-xl p-6 w-[420px] space-y-4">
//         <h3 className="text-lg font-semibold">Add New Event</h3>

//         <input
//           placeholder="Event title"
//           className="w-full border rounded-lg px-3 py-2"
//           onChange={(e) => setForm({ ...form, title: e.target.value })}
//         />

//         <input
//           type="date"
//           className="w-full border rounded-lg px-3 py-2"
//           onChange={(e) => setForm({ ...form, date: e.target.value })}
//         />

//         <div className="flex gap-2">
//           <input type="time" className="w-1/2 border rounded-lg px-3 py-2" />
//           <input type="time" className="w-1/2 border rounded-lg px-3 py-2" />
//         </div>

//         <div className="flex gap-2">
//           <select className="w-1/2 border rounded-lg px-3 py-2">
//             <option>Meeting</option>
//             <option>Event</option>
//           </select>
//           <select className="w-1/2 border rounded-lg px-3 py-2">
//             <option>Medium</option>
//             <option>High</option>
//             <option>Low</option>
//           </select>
//         </div>

//         <div className="flex justify-end gap-2">
//           <button onClick={onClose} className="px-4 py-2 border rounded-lg">
//             Cancel
//           </button>
//           <button
//             onClick={() => onAdd(form)}
//             className="px-4 py-2 bg-pink-500 text-white rounded-lg"
//           >
//             Add Event
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

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
