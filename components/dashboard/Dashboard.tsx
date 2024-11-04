'use client'; 

import { SendHorizontal } from "lucide-react";
import React from "react";
import { appointments } from "./demodata";
import TableComponent from "../common/table-component";

const Dashboard = () => {
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
    <div className="flex flex-col items-center justify-start h-screen bg-gray-100 py-5">
      <div className="w-full max-w-7xl p-5 space-y-4 bg-white shadow-md rounded-md">
        <div className="flex justify-around items-center  w-full lg:px-10 px-5">
          <h2 className="font-medium lg:text-[18px] text-[12px]">
            Număr telefon apelant
          </h2>
          <div className="flex w-[70%] space-x-2 items-center">
            <input type="text" className="border py-2 rounded-sm w-full" />
            <SendHorizontal
              size={18}
              className="bg-blue-200 h-10 w-10 p-2 rounded-sm"
            />
          </div>
        </div>
        <TableComponent
          appointments={appointments}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
};

export default Dashboard;
