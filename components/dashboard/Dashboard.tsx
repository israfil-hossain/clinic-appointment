"use client";

import { LogOut, Plus, SendHorizontal } from "lucide-react";
import React, { useState } from "react";
import { appointments } from "./demodata";
import TableComponent from "../common/table-component";
import CalendarGrid from "./calender-grid";
import AppointmentAddEdit from "./add-appointment";

const Dashboard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleView = (appointment: any) => {
    alert(`Viewing appointment for ${appointment.name} ${appointment.surname}`);
  };

  const handleEdit = (appointment: any) => {
    alert(`Editing appointment for ${appointment.name} ${appointment.surname}`);
  };

  const handleDelete = (appointment: any) => {
    alert(
      `Deleting appointment for ${appointment.name} ${appointment.surname}`
    );
  };

  return (
    <div className="flex flex-col items-center justify-start h-screen bg-gray-200 py-5">
      <div className="w-full max-w-7xl p-5 space-y-4 bg-gray-100 rounded-md shadow-md py-5">
        <div className="flex justify-start  items-center  w-full lg:px-10 px-5 mt-5 border-b pb-5">
          <h2 className="font-medium lg:text-[18px] text-[12px] ">
            Număr telefon apelant
          </h2>
          <div className="flex w-[70%] space-x-2 items-center ml-5">
            <input type="text" className="border py-2 rounded-sm w-full" />
            <SendHorizontal
              size={18}
              className="bg-blue-200 h-10 w-10 p-2 rounded-sm"
            />
          </div>
        </div>
        <CalendarGrid />
        <div className="w-full text-center text-[18px] font-semibold py-2 border-t pt-5">
          Oradea-Luni, 22 Aprille 2024
        </div>
        <TableComponent
          appointments={appointments}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        <div className="w-full flex justify-between lg:px-10 px-5 py-5">
          <div
            className="bg-[#D6EDFF] hover:bg-blue-200 cursor-pointer rounded-sm py-2 px-4 flex space-x-2"
            onClick={() => setIsModalOpen(true)}
          >
            <Plus size={20} className="text-blue-500 " />
            <p className="font-medium text-[14px] text-blue-500">Adauga Rand</p>
          </div>
          <div className="flex space-x-2">
            <div className="bg-blue-500 hover:bg-blue-400 cursor-pointer rounded-sm py-2 px-4 font-medium text-[14px] text-white text-center w-24 items-center">
              <p className="font-medium text-[14px] text-white text-center">
                List
              </p>
            </div>
            <div className="border border-blue-500 bg-white hover:bg-red-100 cursor-pointer rounded-sm py-2 px-4 flex space-x-2">
              <LogOut size={20} className="text-red-500 " />
              <p className="font-medium text-[14px] text-red-500">Lesire</p>
            </div>
          </div>
        </div>
      </div>
      <AppointmentAddEdit
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
    </div>
  );
};

export default Dashboard;
