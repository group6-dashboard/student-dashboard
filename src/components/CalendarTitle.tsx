'use client';

interface CalendarTitleProps {
  date: Date;
}

export default function CalendarTitle({ date }: CalendarTitleProps) {
  const month = date.toLocaleDateString('en-US', { month: 'long' });
  const year = date.getFullYear();

  return (
    <div className="text-2xl font-bold text-white">
      {month} {year}
    </div>
  );
}
