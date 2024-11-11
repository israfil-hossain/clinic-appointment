import { useState } from "react";
import dayjs from "dayjs";
import { Search, X } from "lucide-react";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import { dayNameMap } from "@/lib/dayNameMap";

dayjs.extend(isSameOrBefore);

const CalendarGrid = ({
  selectedDate,
  setSelectedDate,
  location,
  setLocation,
  dayName,
  setDayName
}: {
  selectedDate: any;
  setSelectedDate: any;
  location:string,
  setLocation : any
  dayName:string,
  setDayName : any
}) => {
  const [currentDate, setCurrentDate] = useState(dayjs());

  // Generate days for the calendar grid (Monday to Saturday only)
  const getCalendarDays = (date: any) => {
    const startOfMonth = date.startOf("month");
    const endOfMonth = date.endOf("month");
  
    // Adjust the start to the closest Monday before or on the start of the month
    let currentDay = startOfMonth;
    while (currentDay.day() !== 1) { // 1 = Monday
      currentDay = currentDay.subtract(1, "day");
    }
  
    const currentMonthDays = [];
  
    // Add days from the adjusted start to the end of the month
    for (let d = currentDay; d.isSameOrBefore(endOfMonth, "day"); d = d.add(1, "day")) {
      if (d.day() !== 0) { // Exclude Sundays
        currentMonthDays.push(d);
      }
    }
  
    // Ensure the calendar ends on a Saturday
    let lastDay = currentMonthDays[currentMonthDays.length - 1];
    while (lastDay.day() !== 6) { // 6 = Saturday
      lastDay = lastDay.add(1, "day");
      if (lastDay.day() !== 0) { // Exclude Sundays
        currentMonthDays.push(lastDay);
      }
    }
  
    return currentMonthDays;
  };
  
  const calendarDays = getCalendarDays(currentDate);

  // Handle month navigation
  const handleMonthChange = (direction:any) => {
    setCurrentDate((prev) => prev.add(direction, "month"));
  };

  // Format date as "DD/MM/YY"
  const formatDate = (date:any) => date.format("DD/MM/YY");

  const handleDateSelect = (date:any) => {
    setSelectedDate(date);
    setDayName(date.format("dddd"));
  };

  return (
    <div className="flex lg:flex-row flex-col p-4 lg:space-x-10 w-full justify-between lg:px-10 px-5">
      <div className="flex lg:flex-col space-y-4 lg:space-x-0 space-x-5 justify-start items-center">
        <div className="border rounded-md px-4 py-2 w-32">
          <label className="cursor-pointer flex">
            <input
              type="radio"
              name="location"
              value="Beiuș"
              checked={location === "Beiuș"}
              onChange={() => setLocation("Beiuș")}
              className="mr-2 cursor-pointer"
            />
            <h3>Beiuș</h3>
          </label>
          <label className="cursor-pointer flex">
            <input
              type="radio"
              name="location"
              value="Oradea"
              checked={location === "Oradea"}
              onChange={() => setLocation("Oradea")}
              className="mr-2 cursor-pointer"
            />
            <h3>Oradea</h3>
          </label>
        </div>
        {/* <div className="flex space-x-2 items-center justify-center">
          <div className="cursor-pointer bg-blue-200 hover:bg-blue-500 hover:text-white px-2 py-2 rounded">
            <Search size={18} />
          </div>
          <div className="cursor-pointer hover:shadow-md bg-red-200 hover:bg-red-400 hover:text-white px-2 py-2 rounded">
            <X size={18} />
          </div>
        </div> */}
      </div>

      <div className="flex w-full mt-5 lg:mt-0">
        <div className="mt-[85px] space-y-[10px] min-w-16">
          {["Săpt 1", "Săpt 2", "Săpt 3", "Săpt 4", "Săpt 5"].map(
            (day, index) => (
              <div key={index} className="font-bold lg:text-[15px] text-[12px]">
                {day}
              </div>
            )
          )}
        </div>
        <div className="flex flex-col w-full">
          {/* Header with Month Navigation */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => handleMonthChange(-1)}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded lg:text-[15px] text-[12px]"
            >
              ← Previous
            </button>
            <div className="text-lg font-bold">
              {currentDate.format("MMMM YYYY")}
            </div>
            <button
              onClick={() => handleMonthChange(1)}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded lg:text-[15px] text-[12px]"
            >
              Next →
            </button>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-6 gap-2 text-center lg:text-[15px] text-[12px]">
             {/* Days of the Week */}
             {[
              "Luni",
              "Marți",
              "Miercuri",
              "Joi",
              "Vineri",
              "Sâmbătă",
             
            ].map((day, index) => (
              <div key={index} className="font-bold">
                {day}
              </div>
            ))}
            {/* Dates */}
            {calendarDays.map((date:any, index:number) => {
              const isCurrentMonth = date.month() === currentDate.month();
              const isSelected =
                selectedDate && date.isSame(selectedDate, "day");

              return (
                <div
                  key={index}
                  onClick={() => handleDateSelect(date)}
                  className={`border rounded cursor-pointer ${
                    isCurrentMonth
                      ? isSelected
                        ? "bg-green-500 text-white"
                        : "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {formatDate(date)}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarGrid;

