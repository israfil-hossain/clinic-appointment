"use client";

import { Plus, X } from "lucide-react";
import React, { useEffect, useState } from "react";

import TableComponent from "../common/table-component";
import CalendarGrid from "./calender-grid";
import AppointmentAddEdit from "./add-appointment";
import { departmentsData } from "@/lib/department";
import dayjs from "dayjs";
import { dayNameMap } from "@/lib/dayNameMap";
import axios from "axios";
import Spinner from "../common/loader";

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | null>(dayjs());
  const [location, setLocation] = useState("Oradea");
  const [dayName, setDayName] = useState("");
  const [editData, setEditData] = useState<any>(null);
  const [data, setAppointments] = useState<any>(null);
  const [selectedTestType, setSelectedTestType] = useState<string | null>(null);

  const handleModal = () => {
    setIsModalOpen(false);
    setEditData(null);
  };

  const selectDay =
    selectedDate?.format("dddd") && dayNameMap[selectedDate?.format("dddd")];

  const fetchAppointments = async () => {
    try {
      setIsLoading(true);
      const filters = {
        date: selectedDate ? selectedDate.format("YYYY-MM-DD") : undefined,
        location,
        testType: selectedTestType,
      };

      // Make GET request with filters
      const response = await axios.get("/api/appointments", {
        params: filters,
        withCredentials: true,
      });

      if (response.data?.success) {
        setAppointments(response.data.data);
      } else {
        console.error("Failed to fetch appointments:", response.data.message);
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [selectedDate, location, selectedTestType]);

  const handleView = (appointment: any) => {
    alert(`Viewing appointment for ${appointment.name} ${appointment.surname}`);
  };

  const handleEdit = async (appointment: any) => {
    console.log(appointment);
    if (!selectedDate) {
      alert(`Please Select Date. `);
    } else {
      await setEditData(appointment);
      setIsModalOpen(true);
    }
  };

  const handleTestTypeSelection = (testType: string) => {
    setSelectedTestType(testType);
    
  };

  const handleReset = () => {
    setSelectedTestType(null);
    setLocation("Oradea")
    setSelectedDate(dayjs()); 
  };

  return (
    <div className="flex flex-col items-center justify-start  bg-gray-200 py-5">
      <div className="w-full max-w-7xl p-5 space-y-4 bg-gray-100 rounded-md shadow-md py-5 ">
        <div className="flex justify-between ">
          <p>Lista departamentului :</p>
          <div
            className="flex space-x-2 items-center cursor-pointer hover:shadow-md bg-red-200 hover:bg-red-400 hover:text-white px-3 py-2 rounded "
            onClick={handleReset}
          >
            <X size={18} />
            <p>Clear</p>
          </div>
        </div>
        <div className="w-full bg-white grid lg:grid-cols-5 md:grid-cols-3 grid-cols-2 gap-3 p-5">
          <div className="flex justify-center items-center px-4 py-1  text-white text-[15px] font-medium bg-indigo-500 shadow-lg rounded-md hover:bg-indigo-600 text-center">
            Ecography
          </div>

          {departmentsData?.map((item, index) => (
            <div
              className={`cursor-pointer flex justify-center items-center px-4 py-1 text-white text-[15px] font-medium rounded-md  text-center ${
                selectedTestType === item.name
                  ? "bg-green-500"
                  : "bg-indigo-500 hover:bg-green-500"
              }`}
              key={index}
              onClick={() => handleTestTypeSelection(item.name)}
            >
              {item?.name}
            </div>
          ))}
        </div>
        <CalendarGrid
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          location={location}
          setLocation={setLocation}
          dayName={dayName}
          setDayName={setDayName}
        />
        <div className="w-full text-center text-[18px] font-semibold py-2 border-t pt-5">
          {location} - {selectDay},{" "}
          {selectedDate?.format("D MMMM YYYY") ||
            "Nu a fost selectată nicio dată"}
        </div>
        <div className="w-full flex justify-between lg:px-10 px-5 ">
          <div
            className={`relative ${
              selectedDate
                ? "bg-[#D6EDFF] hover:bg-blue-200 cursor-pointer"
                : "bg-gray-300 cursor-not-allowed"
            } rounded-sm p-1 px-4 flex items-center space-x-2`}
            onClick={() => {
              if (selectedDate) setIsModalOpen(true);
            }}
          >
            <Plus
              size={20}
              className={selectedDate ? "text-blue-500" : "text-gray-400"}
            />
            <p
              className={`font-medium text-[14px] ${
                selectedDate ? "text-blue-500" : "text-gray-500"
              }`}
            >
              Adauga Rand
            </p>

            {/* Tooltip */}
            {!selectedDate && (
              <div className="absolute top-[-40px] left-1/2 transform -translate-x-1/2 bg-gray-700 text-white text-sm rounded-md py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                Please select a date
              </div>
            )}
          </div>

          <div className="bg-blue-500 hover:bg-blue-400 cursor-pointer rounded-sm items-center px-1 font-medium text-[14px] text-white text-center w-20 py-1">
            <p className="font-medium text-[14px] text-white text-center">
              List
            </p>
          </div>
        </div>
        {isLoading ? (
          <div>
            <Spinner />
          </div>
        ) : (
          <TableComponent
            appointments={data || []}
            onView={handleView}
            onEdit={handleEdit}
            fetchData={fetchAppointments}
          />
        )}
      </div>
      <AppointmentAddEdit
        isModalOpen={isModalOpen}
        handleModal={handleModal}
        date={selectedDate}
        location={location}
        fetchAppointments={fetchAppointments}
        data={editData ? editData : null}
      />
    </div>
  );
};

export default Dashboard;
