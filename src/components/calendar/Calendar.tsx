/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState, useEffect } from "react";
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isToday, isSameMonth, subMonths, addMonths } from "date-fns";
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

// List of constant holidays (fixed dates)
const constantHolidays = [
  { month: 1, day: 1, name: "New Year's Day" },   // January 1st
  { month: 5, day: 1, name: "Labour Day" },       // May 1st
  { month: 6, day: 1, name: "Madaraka Day" },     // June 1st
  { month: 10, day: 20, name: "Mashujaa Day" },   // October 20th
  { month: 12, day: 12, name: "Jamhuri Day" },    // December 12th
  { month: 12, day: 25, name: "Christmas Day" },  // December 25th
  { month: 12, day: 26, name: "Boxing Day" },     // December 26th
];

// Helper function to get Easter-related holidays (Good Friday and Easter Monday)
const getEasterHolidays = (year: number) => {
  const easterDate = getEasterDate(year);
  const goodFriday = addDays(easterDate, -2);
  const easterMonday = addDays(easterDate, 1);

  return [
    { date: format(goodFriday, "yyyy-MM-dd"), name: "Good Friday" },
    { date: format(easterMonday, "yyyy-MM-dd"), name: "Easter Monday" },
  ];
};

// Function to calculate Easter Sunday (using the "Computus" algorithm)
const getEasterDate = (year: number) => {
  const f = Math.floor,
    a = year % 19,
    b = f(year / 100),
    c = year % 100,
    d = f(b / 4),
    e = b % 4,
    g = f((8 * b + 13) / 25),
    h = f(19 * a + b - d - g + 15) % 30,
    j = f(c / 4),
    k = c % 4,
    m = f((a + 11 * h) / 319),
    p = f((2 * e + 2 * j - k - h + m + 32) / 7),
    q = (h - m + p + 90) % 31;

  const easterDate = new Date(year, 3, q + 1); // April is month 3 (0-indexed)
  return easterDate;
};

interface Event {
  date: string;
  title: string;
}

interface Task {
  date: string;
  task: string;
  reminder?: boolean;
}

interface GeneralCalendarProps {
  theme: string; // Theme prop
}

const GeneralCalendar: React.FC<GeneralCalendarProps> = ({ theme }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [newEvent, setNewEvent] = useState("");
  const [newTask, setNewTask] = useState("");
  const [setReminder, setSetReminder] = useState(false);
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear()); // Default year set to current year

  const startMonth = startOfMonth(currentMonth);
  const endMonth = endOfMonth(currentMonth);
  const startWeek = startOfWeek(startMonth);
  const endWeek = endOfWeek(endMonth);
  const days = [];

  let day = startWeek;
  while (day <= endWeek) {
    days.push(day);
    day = addDays(day, 1);
  }

  // Get constant holidays for the current year
  const constantHolidaysThisYear = constantHolidays.map((holiday) => ({
    ...holiday,
    date: `${selectedYear}-${String(holiday.month).padStart(2, "0")}-${String(holiday.day).padStart(2, "0")}`,
  }));

  // Get Easter-related holidays (Good Friday, Easter Monday)
  const easterHolidays = getEasterHolidays(selectedYear);

  // Combine both constant and dynamic holidays
  const allHolidays = [...constantHolidaysThisYear, ...easterHolidays];

  const handleAddEvent = () => {
    if (selectedDate && newEvent) {
      setEvents([...events, { date: selectedDate, title: newEvent }]);
      setNewEvent("");
    }
  };

  const handleAddTask = () => {
    if (selectedDate && newTask) {
      setTasks([...tasks, { date: selectedDate, task: newTask, reminder: setReminder }]);
      setNewTask("");
    }
  };

  const handleMonthChange = (action: "prev" | "next") => {
    if (action === "prev") {
      const newMonth = subMonths(currentMonth, 1);
      setCurrentMonth(newMonth);
      if (newMonth.getFullYear() !== selectedYear) {
        setSelectedYear(newMonth.getFullYear());
      }
    } else {
      const newMonth = addMonths(currentMonth, 1);
      setCurrentMonth(newMonth);
      if (newMonth.getFullYear() !== selectedYear) {
        setSelectedYear(newMonth.getFullYear());
      }
    }
  };

  const handleYearChange = (year: number) => {
    setSelectedYear(year);
    setCurrentMonth(new Date(year, currentMonth.getMonth(), 1));
  };

  const years = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - 50 + i);

  return (
    <div className={`max-w-4xl mx-auto p-6 ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"} shadow-lg rounded-lg`}>
      
      <div className="flex justify-between items-center mb-4">
        <select
          value={selectedYear}
          onChange={(e) => handleYearChange(Number(e.target.value))}
          className={`px-3 py-1 rounded ${theme === "dark" ? "bg-gray-700 text-white" : "bg-gray-300 text-black"}`}
        >
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>
      
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => handleMonthChange("prev")}
          className={`px-3 py-1 rounded ${theme === "dark" ? "bg-gray-700 text-white" : "bg-gray-300 text-black"}`}
        >
          <FaChevronLeft /> 
        </button>
        <h2 className="text-xl font-bold">{format(currentMonth, "MMMM yyyy")}</h2>
        <button
          onClick={() => handleMonthChange("next")}
          className={`px-3 py-1 rounded ${theme === "dark" ? "bg-gray-700 text-white" : "bg-gray-300 text-black"}`}
        >
          <FaChevronRight />
        </button>
      </div>

      

      <div className="grid grid-cols-7 gap-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="text-center font-bold">{day}</div>
        ))}

        {days.map((day, index) => {
          const dateString = format(day, "yyyy-MM-dd");
          const isHoliday = allHolidays.find((holiday) => holiday.date === dateString);
          const eventList = events.filter((event) => event.date === dateString);
          const taskList = tasks.filter((task) => task.date === dateString);

          return (
            <div
              key={index}
              className={`p-4 border rounded cursor-pointer ${
                isToday(day) ? "bg-blue-500 text-white" : theme === "dark" ? "bg-gray-700 text-white" : "bg-gray-100"
              } ${isSameMonth(day, currentMonth) ? "" : "opacity-50"} ${isHoliday ? "bg-red-500 text-white" : ""}`}
              onClick={() => setSelectedDate(dateString)}
            >
              <div>{format(day, "d")}</div>
              {isHoliday && <div className="text-xs">{isHoliday.name}</div>}
              {eventList.map((event, i) => (
                <div key={i} className="text-xs bg-green-200 p-1 rounded">{event.title}</div>
              ))}
              {taskList.map((task, i) => (
                <div key={i} className={`text-xs p-1 rounded ${task.reminder ? "bg-yellow-200" : "bg-gray-300"}`}>
                  {task.task}
                </div>
              ))}
            </div>
          );
        })}
      </div>

      {selectedDate && (
        <div className={`mt-4 p-4 border rounded ${theme === "dark" ? "bg-gray-700 text-white" : "bg-gray-50 text-black"}`}>
          <h3 className="font-bold text-lg">Manage {selectedDate}</h3>

          <div className="mt-2">
            <input
              type="text"
              placeholder="Add Event"
              className={`border p-2 w-full ${theme === "dark" ? "bg-gray-600 text-white" : "bg-white text-black"}`}
              value={newEvent}
              onChange={(e) => setNewEvent(e.target.value)}
            />
            <button onClick={handleAddEvent} className="mt-2 bg-blue-500 text-white px-3 py-1 rounded">
              Add Event
            </button>
          </div>

          <div className="mt-2">
            <input
              type="text"
              placeholder="Add Task"
              className={`border p-2 w-full ${theme === "dark" ? "bg-gray-600 text-white" : "bg-white text-black"}`}
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
            />
            <label className="ml-2">
              <input type="checkbox" checked={setReminder} onChange={() => setSetReminder(!setReminder)} /> Set Reminder
            </label>
            <button onClick={handleAddTask} className="mt-2 bg-green-500 text-white px-3 py-1 rounded">
              Add Task
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GeneralCalendar;