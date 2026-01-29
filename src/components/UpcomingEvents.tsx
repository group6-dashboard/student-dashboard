import { Event } from '@/app/(dashboard)/schedule/page';
import Image from 'next/image';

interface UpcomingEventsProps {
  events: Event[];
}

export default function UpcomingEvents({ events }: UpcomingEventsProps) {
  const upcomingEvents = [
    {
      id: '1',
      title: 'Product Discussion',
      date: '23',
      time: '09:30AM',
      status: 'InterScheduled',
      attendees: 5
    },
    {
      id: '2',
      title: 'Event Scheduled',
      date: '24',
      time: '10:00AM',
      attendees: 6
    }
  ];

  return (
    <div className="space-y-4">
      <div className="relative h-40 rounded-2xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
          <div className="bg-gray-500/30 backdrop-blur-sm px-8 py-3 rounded-lg">
            <span className="text-white font-bold text-lg tracking-wider">MEETING</span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {upcomingEvents.map((event) => (
          <div
            key={event.id}
            className="bg-cyan-50 rounded-xl p-4 border border-cyan-100"
          >
            <div className="flex items-start gap-3">
              <div className="bg-cyan-400 text-white rounded-lg w-10 h-10 flex items-center justify-center font-bold flex-shrink-0">
                {event.date}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-900 mb-1">
                  {event.title}
                </h4>
                <div className="flex items-center gap-2 mb-2">
                  <p className="text-sm text-gray-600">{event.time}</p>
                  {event.status && (
                    <span className="text-xs text-orange-500 font-medium">
                      {event.status}
                    </span>
                  )}
                </div>
                <div className="flex -space-x-2">
                  {Array.from({ length: event.attendees }).map((_, index) => (
                    <div
                      key={index}
                      className="w-7 h-7 rounded-full border-2 border-white flex items-center justify-center text-xs font-medium text-white"
                      style={{
                        backgroundColor: ['#EF4444', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899'][index % 6]
                      }}
                    >
                      {String.fromCharCode(65 + index)}
                    </div>
                  ))}
                </div>
                {!event.status && (
                  <p className="text-xs text-gray-500 mt-2">
                    Lorem Ipsum is simply dummy text Of the printing and typesetting
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}