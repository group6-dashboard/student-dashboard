'use client';

import LiveClock from './LiveClock';
import CalendarHeaderTitle from './CalendarTitle';
import NewScheduleButton from './NewScheduleButton';
import CalendarTitle from './CalendarTitle';


export default function CalendarHeaderBar({
  onNew,
}: {
  onNew: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 px-6 py-4 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 text-white">
      <CalendarTitle date={new Date()} />

      <div className="flex items-center gap-4">
        <LiveClock />
        <NewScheduleButton onClick={onNew} />
      </div>
    </div>
  );
}
