'use client';

import MiniCalendar from './MiniCalendar';

export default function MiniCalendarWrapper({
  date,
}: {
  date: Date;
}) {
  return <MiniCalendar currentDate={date} />;
}
