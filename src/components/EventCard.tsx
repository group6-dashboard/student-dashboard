import { Event } from '@/app/(dashboard)/schedule/page';

interface EventCardProps {
  event: Event;
}

export default function EventCard({ event }: EventCardProps) {
  return (
    <div
      className={`${event.color} border rounded-lg p-3 mb-2 cursor-pointer hover:shadow-md transition-shadow`}
    >
      <h3 className="font-semibold text-sm text-gray-900 mb-1">
        {event.title}
      </h3>
      <p className="text-xs text-gray-600 mb-2">
        {new Date(event.date).getDate()} {new Date(event.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
      </p>
      {event.endTime && (
        <p className="text-xs text-gray-500 mb-2">
          {event.type}
        </p>
      )}
      {event.endTime && (
        <p className="text-xs text-gray-600 mb-2">
          {event.time} - {event.endTime}
        </p>
      )}
      {!event.endTime && (
        <p className="text-xs text-gray-600 mb-2">
          {event.time}
        </p>
      )}
      {event.attendees && event.attendees.length > 0 && (
        <div className="flex -space-x-2">
          {event.attendees.map((attendee, index) => (
            <div
              key={index}
              className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-xs font-medium text-white"
              style={{
                backgroundColor: ['#3B82F6', '#EC4899', '#10B981', '#F59E0B', '#8B5CF6'][index % 5]
              }}
            >
              {attendee[0].toUpperCase()}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
