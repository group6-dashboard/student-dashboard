"use client";

import React from "react";

export default function SchedulePage() {
  return (
    <div className="flex flex-col md:flex-row justify-center items-start p-6 gap-6 bg-gray-50 min-h-screen">
      {/* Main Content */}
      <div className="w-full max-w-6xl bg-white rounded-xl shadow-lg p-6">
        {/* Top Bar */}
        <div className="flex flex-wrap items-center justify-between mb-6 gap-3">
          

          <div className="flex items-center gap-3">
            <div className="text-sm font-semibold text-gray-700">
              08:50:19 PM
            </div>
            <input
              type="text"
              placeholder="Search events..."
              className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
            <select className="border border-gray-300 rounded-lg px-2 py-1 text-sm">
              <option>All Types</option>
            </select>
            <select className="border border-gray-300 rounded-lg px-2 py-1 text-sm">
              <option>All Priorities</option>
            </select>
            <button className="bg-gray-200 text-gray-700 px-3 py-1 rounded-lg text-sm hover:bg-gray-300">
              Import
            </button>
            <button className="bg-pink-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-pink-600">
              Export
            </button>
          </div>
        </div>

        {/* Header Month */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">JANUARY 2026</h2>
          <button className="bg-white border border-gray-300 px-4 py-2 rounded-lg shadow-sm hover:bg-gray-50 text-sm font-semibold">
            + New Schedule
          </button>
        </div>

        {/* Tabs */}
        <div className="flex bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg p-3 mb-4 items-center justify-between">
          <div className="flex gap-4">
            <button className="bg-white text-purple-600 font-semibold px-3 py-1 rounded">
              Daily
            </button>
            <button className="bg-purple-700 text-white px-3 py-1 rounded font-semibold">
              Weekly
            </button>
            <button className="bg-white text-purple-600 px-3 py-1 rounded font-semibold">
              Monthly
            </button>
            <button className="bg-white text-purple-600 px-3 py-1 rounded font-semibold">
              Agenda
            </button>
          </div>
          <div className="flex gap-3">
            {["12", "13", "14", "15", "16", "17", "18"].map((d, i) => (
              <div
                key={i}
                className={`w-10 h-10 flex items-center justify-center rounded-full font-semibold ${d === "18"
                    ? "bg-yellow-300 text-purple-800"
                    : "bg-purple-400 text-white"
                  }`}
              >
                {d}
              </div>
            ))}
          </div>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
          {[
            { title: "Meeting", date: "23 May", color: "bg-yellow-100" },
            { title: "Event", date: "24 May", color: "bg-green-100" },
            { title: "Client Visit", date: "25 May", color: "bg-pink-100" },
            { title: "Product Demo", date: "26 May", color: "bg-blue-100" },
            { title: "Employee Event", date: "28 May", color: "bg-yellow-100" },
            { title: "Installation", date: "29 May", color: "bg-gray-100" },
            { title: "Product Discussion", date: "30 May", color: "bg-purple-100" },
          ].map((event, i) => (
            <div
              key={i}
              className={`${event.color} p-3 rounded-lg shadow-sm border border-gray-200`}
            >
              <h4 className="font-semibold text-gray-800">{event.title}</h4>
              <p className="text-xs text-gray-500">{event.date} 2026</p>
              <p className="text-xs mt-1 text-gray-700">9:00 AM - 10:00 AM</p>
              <div className="flex mt-2 gap-1">
                <div className="w-4 h-4 bg-pink-400 rounded-full"></div>
                <div className="w-4 h-4 bg-blue-400 rounded-full"></div>
                <div className="w-4 h-4 bg-yellow-400 rounded-full"></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sidebar Calendar */}
      <div className="w-full md:w-72 bg-white rounded-xl shadow p-5 h-fit">
        <div className="bg-gradient-to-r from-pink-500 to-purple-500 text-white p-4 rounded-lg mb-4">
          <h3 className="text-center text-lg font-semibold mb-3">
            January 2026
          </h3>
          <div className="grid grid-cols-7 text-center text-sm gap-1">
            {["S", "M", "T", "W", "T", "F", "S"].map((d) => (
              <span key={d} className="font-bold">
                {d}
              </span>
            ))}
            {[...Array(31)].map((_, i) => (
              <div
                key={i}
                className={`py-1 rounded-full ${i + 1 === 18
                    ? "bg-yellow-300 text-purple-700 font-bold"
                    : "hover:bg-white/30"
                  }`}
              >
                {i + 1}
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-2 mt-3">
            <button className="bg-white text-purple-600 px-2 py-1 rounded text-xs font-semibold">
              Day
            </button>
            <button className="bg-white text-purple-600 px-2 py-1 rounded text-xs font-semibold">
              Month
            </button>
            <button className="bg-white text-purple-600 px-2 py-1 rounded text-xs font-semibold">
              Year
            </button>
          </div>
        </div>

        <div className="bg-gray-100 rounded-lg p-4 text-center font-semibold text-gray-700">
          MEETING
        </div>
      </div>
    </div>
  );
}
