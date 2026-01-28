// 'use client';

// interface Props {
//   type: string;
//   priority: string;
//   onTypeChange: (v: string) => void;
//   onPriorityChange: (v: string) => void;
// }

// export default function EventFilters({
//   type,
//   priority,
//   onTypeChange,
//   onPriorityChange,
// }: Props) {
//   return (
//     <div className="flex gap-2">
//       <select
//         value={type}
//         onChange={(e) => onTypeChange(e.target.value)}
//         className="px-3 py-2 border rounded-lg text-sm"
//       >
//         <option value="All">All Types</option>
//         <option value="Meeting">Meeting</option>
//         <option value="Event">Event</option>
//         <option value="Personal">Personal</option>
//         <option value="Deadline">Deadline</option>
//       </select>

//       <select
//         value={priority}
//         onChange={(e) => onPriorityChange(e.target.value)}
//         className="px-3 py-2 border rounded-lg text-sm"
//       >
//         <option value="All">All Priorities</option>
//         <option value="High">High</option>
//         <option value="Medium">Medium</option>
//         <option value="Low">Low</option>
//       </select>
//     </div>
//   );
// }

'use client';

const TYPES = ['All', 'Meeting', 'Event', 'Personal', 'Deadline'];

export default function EventFilters({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="px-4 py-2 rounded-lg border text-sm"
    >
      {TYPES.map((t) => (
        <option key={t} value={t}>
          {t}
        </option>
      ))}
    </select>
  );
}
