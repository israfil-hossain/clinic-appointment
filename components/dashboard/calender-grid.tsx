// components/CalendarGrid.js
import Image from "next/image";
import { useState } from "react";

const CalendarGrid = () => {
  const [location, setLocation] = useState("Oradea");

  const weeks = [
    { label: "Săpt 1", dates: ["", "", "", "", "12/04/24"] },
    {
      label: "Săpt 2",
      dates: ["15/04/24", "16/04/24", "17/04/24", "18/04/24", "19/04/24"],
    },
    {
      label: "Săpt 3",
      dates: ["22/04/24", "23/04/24", "24/04/24", "25/04/24", "26/04/24"],
    },
    {
      label: "Săpt 4",
      dates: ["29/04/24", "30/04/24", "01/05/24", "02/05/24", "03/05/24"],
    },
    {
      label: "Săpt 5",
      dates: ["06/05/24", "07/05/24", "08/05/24", "09/05/24", "10/05/24"],
    },
  ];

  const days = ["Luni", "Marți", "Miercuri", "Joi", "Vineri"];

  return (
    <div className="flex lg:flex-row flex-col p-4 lg:space-x-10 w-full justify-between lg:px-10 px-5">
      {/* Sidebar */}
      <div className="lg:space-y-4 flex items-center lg:flex-col lg:space-x-0 space-x-8 pb-5 lg:pb-0">
        <div className="flex flex-col space-y-2 border rounded-md px-4 py-2 w-32">
          <label className="cursor-pointer">
            <input
              type="radio"
              name="location"
              value="Beiuș"
              checked={location === "Beiuș"}
              onChange={() => setLocation("Beiuș")}
              className="mr-2 cursor-pointer"
            />
            Beiuș
          </label>
          <label className="cursor-pointer">
            <input
              type="radio"
              name="location"
              value="Oradea"
              checked={location === "Oradea"}
              onChange={() => setLocation("Oradea")}
              className="mr-2 cursor-pointer"
            />
            Oradea
          </label>
        </div>
        {/* Icons */}
        <div className="flex space-x-2 items-center justify-center">
          <div className="cursor-pointer hover:shadow-md hover:rounded-lg">
            <Image src="/calender.png" width={40} height={40} alt="calender" />
          </div>
          <div className="cursor-pointer hover:shadow-md hover:rounded-lg">
            <Image src="/search.png" width={40} height={40} alt="calender" />
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="flex flex-col w-full">
        <div className="flex items-center space-x-2">
          <div className="w-24"></div>
          {weeks.map((week, index) => (
            <div key={index} className="lg:w-[150px] w-20  text-center font-normal">
              {week.label}
            </div>
          ))}
        </div>

        {/* Days and Dates */}
        {days.map((day, rowIndex) => (
          <div
            key={rowIndex}
            className="flex items-center lg:space-x-4 space-x-2"
          >
            <div className="w-24 lg:px-4 text-left font-normal text-[16px]">{day}</div>
            {weeks.map((week, colIndex) => (
              <div
                key={colIndex}
                className={`lg:w-[150px] w-20 lg:h-8 h-6 flex items-center justify-center text-white lg:text-[15px] text-[13px] ${
                  rowIndex === 0 && colIndex === 0
                    ? "bg-[#BDBDBD]"
                    : rowIndex === 2 && colIndex === 2
                    ? "bg-[#6A994E]"
                    : "bg-[#2096F3]"
                } border-b rounded-[2px] cursor-pointer `}
              >
                {week.dates[rowIndex]}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarGrid;
