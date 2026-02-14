"use client";

import { useState } from "react";

const TABS = ["Daily", "Weekly", "Monthly", "Agenda"] as const;

export default function ScheduleTabs() {
  const [active, setActive] = useState("Weekly");

  return (
    <div className="flex gap-2 rounded-xl bg-pink-100 p-2 w-fit">
      {TABS.map((tab) => (
        <button
          key={tab}
          onClick={() => setActive(tab)}
          className={`px-4 py-1.5 rounded-lg text-sm font-medium transition
            ${
              active === tab
                ? "bg-pink-500 text-white shadow"
                : "text-pink-700 hover:bg-pink-200"
            }
          `}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
