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
import { generatePDF } from "@/utils/pdfUtils";
import EcoTable from "../common/EcoTable";
import Notes from "./Notes";
import { getTimeSlotsByLocationAndDay } from "@/lib/timeSlots";
import { useTimeSlotStore } from "@/store/timeStore";
import AddAppointButton from "./AddButton";

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | null>(dayjs());
  const [location, setLocation] = useState("Beiuș");
  const [dayName, setDayName] = useState("");
  const [editData, setEditData] = useState<any>(null);
  const [data, setAppointments] = useState<any>(null);
  const [selectedTestType, setSelectedTestType] = useState<string | null>(null);
  const [textareaContent, setTextareaContent] = useState<string>("");
  const { setTimeSlots, timeSlots } = useTimeSlotStore();

  const handleModal = () => {
    setIsModalOpen(false);
    setEditData(null);
  };

  // Map the Normal Day with Romania Day name ...
  const selectDay =
    selectedDate?.format("dddd") && dayNameMap[selectedDate?.format("dddd")];

  // Get The Appointments by API Calling ....
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

  // Handle The Tab Selection ...
  const handleTestTypeSelection = (testType: string) => {
    setSelectedTestType(testType);
    TestTypeSelectedRefresh(testType);
  };

  const TestTypeSelectedRefresh = (testType: string | null) => {
    if (testType) {
      localStorage.setItem("selectedTestType", testType);
    } else {
      localStorage.removeItem("selectedTestType");
    }
  };

  // According to Location and Day Name Get the timeSlots....
  const fetchTimeSlots = () => {
    if (location && selectDay) {
      const slots = getTimeSlotsByLocationAndDay(location, selectDay);
      const apiTimes =
        data?.map((item: any) => item?.time).filter(Boolean) || [];

      const mergedTimes = Array.from(new Set([...slots, ...apiTimes]));
      setTimeSlots(mergedTimes);
    } else {
      console.warn("Location or selectDay is missing.");
      setTimeSlots([]);
    }
  };

  // For EcoTable Fetch The Time Slot Initiallly when select Ecografie Tab ...
  useEffect(() => {
    if (selectedTestType === "Ecografie" && selectedDate) {
      fetchTimeSlots();
    }
  }, [location, selectDay, selectedTestType, selectedDate, data]);

  // Persist selectedTestType in local storage
  useEffect(() => {
    const savedTestType = localStorage.getItem("selectedTestType");
    if (savedTestType) {
      setSelectedTestType(savedTestType);
    }
  }, []);

  // Table View Function ....
  const handleView = (appointment: any) => {
    alert(`Viewing appointment for ${appointment.name} ${appointment.surname}`);
  };

  // Table Edit Function ...
  const handleEdit = async (appointment: any) => {
    if (!selectedDate) {
      alert(`Please Select Date. `);
    } else {
      await setEditData(appointment);
      setIsModalOpen(true);
    }
  };

  // handle Download function
  const handleDownloadPDF = () => {
    generatePDF({
      data,
      location,
      day: selectDay,
      date: selectedDate?.format("D MMMM YYYY"),
      notes: textareaContent,
    });
  };

  const handleButtonClick = () => {
    setIsModalOpen(true);
  };

  return (
    <div className="flex flex-col items-center justify-start  bg-gray-200 py-5">
      <div className="w-full max-w-7xl p-5 space-y-4 bg-gray-100 rounded-md shadow-md py-5 ">
        <div className="flex justify-between ">
          <p>Lista departamentului :</p>
        </div>
        <div className="w-full bg-white grid lg:grid-cols-5 md:grid-cols-3 grid-cols-2 gap-3 p-5">
          <div
            className={`cursor-pointer flex justify-center items-center px-4 py-1 text-white text-[15px] font-medium rounded-md  text-center ${
              selectedTestType === "Ecografie"
                ? "bg-green-500"
                : "bg-indigo-500 hover:bg-green-500"
            }`}
            onClick={() => {
              handleTestTypeSelection("Ecografie");
            }}
          >
            Ecografie
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
        <AddAppointButton selectedDate={selectedDate} onClick={handleButtonClick} />

          <button
            className="bg-blue-500 hover:bg-blue-400 text-white rounded px-4 py-1"
            onClick={handleDownloadPDF}
          >
            Download PDF
          </button>
        </div>
        {isLoading ? (
          <div className="py-5 bg-slate-200 rounded-md mt-5 h-28 w-[100%]">
            <Spinner />
          </div>
        ) : (
          <>
            {selectedTestType === "Ecografie" ? (
              <div>
                <EcoTable
                  timeSlots={timeSlots}
                  appointments={data || []}
                  onView={handleView}
                  onEdit={handleEdit}
                  fetchData={fetchAppointments}
                />
              </div>
            ) : (
              <TableComponent
                appointments={data || []}
                onView={handleView}
                onEdit={handleEdit}
                fetchData={fetchAppointments}
              />
            )}
          </>
        )}

        <Notes
          selectedDate={selectedDate}
          location={location}
          textareaContent={textareaContent}
          setTextareaContent={setTextareaContent}
        />
      </div>
      <AppointmentAddEdit
        isModalOpen={isModalOpen}
        handleModal={handleModal}
        isEco={selectedTestType === "Ecografie"}
        date={selectedDate}
        location={location}
        fetchAppointments={fetchAppointments}
        data={editData ? editData : null}
      />
    </div>
  );
};

export default Dashboard;
