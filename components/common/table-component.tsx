// components/TableComponent.tsx
'use client';
import React, { useState } from 'react';
import { Eye, Edit, Trash } from 'lucide-react';

interface Appointment {
  time: string;
  name: string;
  surname: string;
  type: string;
  phone: string;
}

interface TableComponentProps {
  appointments: Appointment[];
  onView: (appointment: Appointment) => void;
  onEdit: (appointment: Appointment) => void;
  onDelete: (appointment: Appointment) => void;
}

const TableComponent: React.FC<TableComponentProps> = ({ appointments, onView, onEdit, onDelete }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const itemsPerPage = 5;

  const totalPages = Math.ceil(appointments.length / itemsPerPage);

  const handleCheckboxChange = (index: number) => {
    setSelectedRows((prevSelectedRows) =>
      prevSelectedRows.includes(index)
        ? prevSelectedRows.filter((i) => i !== index)
        : [...prevSelectedRows, index]
    );
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const allIndexes = appointments
        .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
        .map((_, index) => index);
      setSelectedRows(allIndexes);
    } else {
      setSelectedRows([]);
    }
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    setSelectedRows([]);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedAppointments = appointments.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="py-2 px-4 border-b border-gray-300">
              <input type="checkbox" onChange={handleSelectAll} />
            </th>
            <th className="py-2 px-4 border-b border-gray-300 text-left text-sm font-medium text-gray-600">Time</th>
            <th className="py-2 px-4 border-b border-gray-300 text-left text-sm font-medium text-gray-600">Name</th>
            <th className="py-2 px-4 border-b border-gray-300 text-left text-sm font-medium text-gray-600">Surname</th>
            <th className="py-2 px-4 border-b border-gray-300 text-left text-sm font-medium text-gray-600">Type</th>
            <th className="py-2 px-4 border-b border-gray-300 text-left text-sm font-medium text-gray-600">Phone</th>
            <th className="py-2 px-4 border-b border-gray-300 text-left text-sm font-medium text-gray-600">Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedAppointments.map((appointment, index) => (
            <tr key={index} className="border-b border-gray-300">
              <td className="py-2 px-4 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={selectedRows.includes(index)}
                  onChange={() => handleCheckboxChange(index)}
                />
              </td>
              <td className="py-2 px-4 text-sm text-gray-700">{appointment.time}</td>
              <td className="py-2 px-4 text-sm text-gray-700">{appointment.name}</td>
              <td className="py-2 px-4 text-sm text-gray-700">{appointment.surname}</td>
              <td className="py-2 px-4 text-sm text-gray-700">{appointment.type}</td>
              <td className="py-2 px-4 text-sm text-gray-700">{appointment.phone}</td>
              <td className="py-2 px-4 text-sm text-gray-700 flex space-x-2">
                <button onClick={() => onView(appointment)} className="text-blue-500">
                  <Eye size={16} />
                </button>
                <button onClick={() => onEdit(appointment)} className="text-yellow-500">
                  <Edit size={16} />
                </button>
                <button onClick={() => onDelete(appointment)} className="text-red-500">
                  <Trash size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-sm text-gray-700">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default TableComponent;
