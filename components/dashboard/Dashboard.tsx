"use client";

import React, { useEffect, useState } from "react";

import TableComponent from "../common/table-component";
import CalendarGrid from "./calender-grid";
import AppointmentAddEdit from "./add-appointment";
import { departmentsData } from "@/lib/department";
import dayjs from "dayjs";
import { dayNameMap } from "@/lib/dayNameMap";
import Spinner from "../common/loader";
import EcoTable from "../common/EcoTable";
import Notes from "./Notes";
import { useTimeSlotStore } from "@/store/timeStore";
import { fetchAppointmentsAPI } from "@/service/appointmentService";
import { handleDownloadPDF, TestTypeSelectedRefresh } from "@/service/actionService";
import { fetchTimeSlotsAPI } from "@/service/scheduleService";
import AddAppointmentButton from "./AddButton";

const Dashboard = () => {
  const [location, setLocation] = useState("Beiuș");
  const [dayName, setDayName] = useState("");
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | null>(dayjs());
  const [editData, setEditData] = useState<any>(null);
  const [data, setAppointments] = useState<any>(null);
  const [selectedTestType, setSelectedTestType] = useState<string | null>(null);
  const [textareaContent, setTextareaContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const { setTimeSlots, timeSlots } = useTimeSlotStore();


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
      const data = await fetchAppointmentsAPI(filters);
      setAppointments(data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [selectedDate, location, selectedTestType]);

  // According to Location and Day Name Get the timeSlots....
  const fetchTimeSlots = async () => {
    if (location && selectDay) {
      const slots = await fetchTimeSlotsAPI(location, selectDay,selectedDate?.format("YYYY-MM-DD"));
      setTimeSlots(slots);
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


  // Handle The Tab Selection ...
  const handleTestTypeSelection = (testType: string) => {
    setSelectedTestType(testType);
    TestTypeSelectedRefresh(testType);
  };

  // Persist selectedTestType in local storage
  useEffect(() => {
    const savedTestType = localStorage.getItem("selectedTestType");
    if (savedTestType) {
      setSelectedTestType(savedTestType);
    }
  }, []);

  // Table Actions ........................................

  // Handle View Function ....
  const handleView = (appointment: any) => {
    alert(`Viewing appointment for ${appointment.name} ${appointment.surname}`);
  };

  // Handle Edit Function ...
  const handleEdit = async (appointment: any) => {
    if (!selectedDate) {
      alert(`Please Select Date. `);
    } else {
      await setEditData(appointment);
      setIsModalOpen(true);
    }
  };

  // Modal Actions ........................
  const handleModal = () => {
    setIsModalOpen(false);
    setEditData(null);
  };

  const handleAddAppointment = () => {
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
          appointmentData={data}
          scheduleData={timeSlots}
        />
        <div className="w-full text-center text-[18px] font-semibold py-2 border-t pt-5">
          {location} - {selectDay},{" "}
          {selectedDate?.format("D MMMM YYYY") ||
            "Nu a fost selectată nicio dată"}
        </div>
        <div className="w-full flex justify-between lg:px-10 px-5 ">
          <AddAppointmentButton
            selectedDate={selectedDate}
            onClick={handleAddAppointment}
          />

          <button
            className="bg-blue-500 hover:bg-blue-400 text-white rounded px-4 py-1"
            onClick={() =>
              handleDownloadPDF(
                data,
                location,
                selectDay,
                selectedDate,
                textareaContent
              )
            }
          >
            Download PDF
          </button>
        </div>
        {isLoading ? (
          <div className="py-5 bg-white rounded-md flex justify-center items-start pt-20 min-h-screen w-[100%]">
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
        day = {selectDay}
        location={location}
        appointments = {data}
        fetchAppointments={fetchAppointments}
        data={editData ? editData : null}

      />
    </div>
  );
};

export default Dashboard;
