'use client';

export type ViewType = 'daily' | 'weekly' | 'monthly' | 'agenda';

export default function ViewSwitcher({
  view,
  setView,
}: {
  view: ViewType;
  setView: (v: ViewType) => void;
}) {
  return (
    <div className="flex bg-white rounded-lg overflow-hidden shadow">
      {['daily', 'weekly', 'monthly', 'agenda'].map((v) => (
        <button
          key={v}
          onClick={() => setView(v as ViewType)}
          className={`px-4 py-2 text-sm capitalize ${
            view === v ? 'bg-pink-500 text-white' : 'text-gray-600'
          }`}
        >
          {v}
        </button>
      ))}
    </div>
  );
}
