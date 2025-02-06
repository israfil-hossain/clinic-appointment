import { useState, useEffect } from "react";
import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import { getCalendarDays } from "@/utils/getCalenderDays";
import { checkIfFilled } from "@/utils/checkFilled";

dayjs.extend(isSameOrBefore);

const CalendarGrid = ({
  selectedDate,
  setSelectedDate,
  location,
  setLocation,
  dayName,
  setDayName,
  scheduleData,
  appointmentData,
}: {
  selectedDate: any;
  setSelectedDate: any;
  location: string;
  setLocation: any;
  dayName: string;
  setDayName: any;
  scheduleData: any;
  appointmentData: any;
}) => {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [isFilled, setIsFilled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const calendarDays = getCalendarDays(currentDate);

  const handleMonthChange = (direction: any) => {
    setCurrentDate((prev) => prev.add(direction, "month"));
  };

  const formatDate = (date: any) => date.format("DD/MM/YY");

  const handleDateSelect = (date: any) => {
    setSelectedDate(date);
    setDayName(date.format("dddd"));
  };

  // Update the isFilled state when scheduleData or appointmentData changes
  useEffect(() => {
    if (selectedDate) {
      setIsLoading(true);
      const filled = checkIfFilled(appointmentData, scheduleData);
      setIsFilled(filled);
      setIsLoading(false);
    }
  }, [appointmentData, scheduleData, selectedDate]);

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

          <div className="grid grid-cols-6 gap-2 text-center lg:text-[15px] text-[12px]">
            {["Luni", "Marți", "Miercuri", "Joi", "Vineri", "Sâmbătă"].map(
              (day, index) => (
                <div key={index} className="font-bold">
                  {day}
                </div>
              )
            )}
            {calendarDays?.map((date: any, index: number) => {
              const isCurrentMonth = date.month() === currentDate.month();
              const isBeforeToday = date.isBefore(dayjs(), "day");
              const isSelected =
                selectedDate && date.isSame(selectedDate, "day");
              let color = "";
              if (isBeforeToday) {
                // Gray color for past days
                color = "bg-gray-300 text-gray-500";
              } else if (!isBeforeToday && isCurrentMonth) {
                // Handle current month days
                if (isSelected) {
                  // If selected but not filled, green background
                  color = "bg-green-500 text-white";
                } else {
                  // Default color for available slots
                  color =
                    "bg-blue-500 text-white hover:bg-green-500 hover:text-white";
                }
              } else {
                // Gray color for non-current month days
                color =
                  "bg-gray-100 text-gray-400 hover:bg-green-500 hover:text-white";
              }

              return (
                <>
                  {isLoading ? (
                    "Loading ... "
                  ) : (
                    <>
                      {isFilled && isSelected ? (
                        <div
                          key={index}
                          onClick={() => handleDateSelect(date)}
                          className={`border rounded cursor-pointer bg-red-500 text-white `}
                        >
                          {formatDate(date)}
                        </div>
                      ) : (
                        <div
                          key={index}
                          onClick={() => handleDateSelect(date)}
                          className={`border rounded cursor-pointer ${color}`}
                        >
                          {formatDate(date)}
                        </div>
                      )}
                    </>
                  )}
                </>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarGrid;
