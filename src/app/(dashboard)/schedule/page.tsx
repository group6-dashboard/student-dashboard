'use client';

import { useState, useEffect } from 'react';
import { Download, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import EventCard from '@/components/EventCard';
import MiniCalendar from '@/components/MiniCalendar';
import UpcomingEvents from '@/components/UpcomingEvents';
import LiveClock from '@/components/LiveClock';
import CalendarTitle from '@/components/CalendarTitle';
import EventFilters from '@/components/EventFilters';
import NewScheduleButton from '@/components/NewScheduleButton';
import AddEventModal from '@/components/AddEventModal';


export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  endTime?: string;
  color: string;
  type: string;
  attendees?: string[];
}

const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Meeting',
    date: '2022-05-23',
    time: '9:00AM',
    endTime: '10:00AM',
    color: 'bg-orange-100 border-orange-200',
    type: 'InterScheduled',
    attendees: ['user1', 'user2']
  },
  {
    id: '2',
    title: 'Product Live',
    date: '2022-05-23',
    time: '11:00',
    endTime: '8:30AM',
    color: 'bg-purple-100 border-purple-200',
    type: 'Event',
    attendees: ['user1', 'user2']
  },
  {
    id: '3',
    title: 'Event',
    date: '2022-05-24',
    time: '10:00AM',
    color: 'bg-green-100 border-green-200',
    type: 'Event'
  },
  {
    id: '4',
    title: 'Client Visit',
    date: '2022-05-25',
    time: '9:30AM',
    color: 'bg-pink-100 border-pink-200',
    type: 'Event'
  },
  {
    id: '5',
    title: 'New Product Demo',
    date: '2022-05-26',
    time: '9:30',
    endTime: '9:30AM',
    color: 'bg-cyan-100 border-cyan-200',
    type: 'InterScheduled',
    attendees: ['user1', 'user2', 'user3', 'user4']
  },
  {
    id: '6',
    title: 'Employee Event',
    date: '2022-05-28',
    time: '10:00',
    endTime: '10:30AM',
    color: 'bg-yellow-100 border-yellow-200',
    type: 'InterScheduled',
    attendees: ['user1', 'user2']
  },
  {
    id: '7',
    title: 'Client Visit',
    date: '2022-05-28',
    time: '9:30AM',
    color: 'bg-pink-100 border-pink-200',
    type: 'Event'
  },
  {
    id: '8',
    title: 'Installation',
    date: '2022-05-29',
    time: '9:30AM',
    color: 'bg-gray-100 border-gray-200',
    type: 'Event'
  }
];

export default function CalendarPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date(2022, 4, 1));
  const [viewMode, setViewMode] = useState<'Daily' | 'Weekly' | 'Monthly' | 'Yearly'>('Weekly');
  const [selectedCategory, setSelectedCategory] = useState('Category');
  const [showModal, setShowModal] = useState(false);
  const [type, setType] = useState('All');
  const [priority, setPriority] = useState('All');

  useEffect(() => {
    const savedEvents = localStorage.getItem('calendar-events');
    if (savedEvents) {
      setEvents(JSON.parse(savedEvents));
    } else {
      setEvents(mockEvents);
      localStorage.setItem('calendar-events', JSON.stringify(mockEvents));
    }
  }, []);

  const weekDays = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
  const currentWeekDates = [23, 24, 25, 26, 27, 28, 29];

  const getEventsForDate = (day: number) => {
    const dateStr = `2022-05-${day.toString().padStart(2, '0')}`;
    return events.filter(event => event.date === dateStr);
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(events, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'calendar-events.json';
    link.click();
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const importedEvents = JSON.parse(event.target?.result as string);
          setEvents(importedEvents);
          localStorage.setItem('calendar-events', JSON.stringify(importedEvents));
        } catch (error) {
          console.error('Error importing events:', error);
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Main Calendar Area */}
        <div className="flex-1 p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>Home</span>
              <span>/</span>
              <span>Events</span>
              <span>/</span>
              <span className="text-gray-900 font-medium">Calendar</span>
            </div>
            <div className="flex items-center gap-2">
              <label htmlFor="import-file">
                <Button variant="outline" className="flex items-center gap-2" asChild>
                  <span className="cursor-pointer">
                    <Upload className="w-4 h-4" />
                    Import
                  </span>
                </Button>
              </label>
              <input
                id="import-file"
                type="file"
                accept=".json"
                className="hidden"
                onChange={handleImport}
              />
              <Button
                variant="default"
                className="flex items-center gap-2 bg-pink-500 hover:bg-pink-600"
                onClick={handleExport}
              >
                <Download className="w-4 h-4" />
                Export
              </Button>
              <select
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option>Category</option>
                <option>Work</option>
                <option>Personal</option>
                <option>Meeting</option>
              </select>
            </div>
          </div>
           
          {/* Calendar Header */}
          <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-purple-600 rounded-t-2xl p-6 text-white">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <h1 className="text-2xl font-bold">Januery 2026</h1>
                <span className="px-4 py-1 bg-white/20 rounded-full text-sm">
                  New Schedule
                </span>
                <LiveClock />
                {/* <CalendarTitle date={currentDate} /> */}

              <EventFilters
                value={type}
                onChange={setType}
              />

              <NewScheduleButton onClick={() => setShowModal(true)} />

              {showModal && (
                <AddEventModal
                  onClose={() => setShowModal(false)}
                  onAdd={(data) => console.log(data)}
               />
             )}

              </div>
              <div className="flex items-center gap-2 bg-white/10 rounded-lg p-1">
                {(['Daily', 'Weekly', 'Monthly', 'Yearly'] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode)}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      viewMode === mode
                        ? 'bg-white text-purple-600'
                        : 'text-white hover:bg-white/10'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            {/* Week Days Header */}
            <div className="grid grid-cols-7 gap-4">
              {weekDays.map((day, index) => (
                <div key={day} className="text-center">
                  <div className="w-12 h-12 mx-auto rounded-full bg-white/20 flex items-center justify-center mb-2 font-bold">
                    {currentWeekDates[index]}
                  </div>
                  <div className="text-xs font-medium">{day}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="bg-white rounded-b-2xl shadow-sm">
            <div className="grid grid-cols-7 gap-px bg-gray-200">
              {currentWeekDates.map((day) => {
                const dayEvents = getEventsForDate(day);
                return (
                  <div
                    key={day}
                    className="bg-white p-3 min-h-[400px]"
                  >
                    {dayEvents.map((event) => (
                      <EventCard key={event.id} event={event} />
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
         {/* Right Sidebar */}
        { <div className="w-80 bg-white border-l border-gray-200 p-6 space-y-6">
          <MiniCalendar currentDate={currentDate} />
          <UpcomingEvents events={events} />
        </div>}
      </div>
    </div>
  );
}
