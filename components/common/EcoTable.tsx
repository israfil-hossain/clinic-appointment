import { Edit, Trash } from "lucide-react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "./button";
import axios from "axios";
import toast from "react-hot-toast";
import { useState } from "react";

interface Appointment {
    _id: string;
    time: string;
    patientName: string;
    patientSurname: string;
    testType: string;
    phoneNumber: string;
    isConfirmed: boolean;
    doctorName: string;
    notes: string;
  }

  interface TableComponentProps {
    appointments: Appointment[];
    onView: (appointment: Appointment) => void;
    onEdit: (appointment: Appointment) => void;
    fetchData: () => void;
  }

const EcoTable: React.FC<TableComponentProps> = ({
    appointments,
    fetchData,
    onEdit,
  }) => {
    const timeSlots = [
      "8:30", "8:45", "9:00", "9:15", "9:30", "9:45", "10:00", "10:15", "10:30", "10:45", 
      "11:00", "11:15", "11:30", "11:45", "12:00", "12:15", "12:30", "12:45", "13:00", 
      "13:15", "13:30", "13:45", "14:00"
    ];
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [appointmentToDelete, setAppointmentToDelete] =
      useState<Appointment | null>(null);
  
    // Convert appointments array to an object for easy lookup
    const appointmentsMap = new Map(
      appointments.map((appt) => [appt.time, appt])
    );

    const confirmDelete = (appointment: Appointment) => {
        setAppointmentToDelete(appointment);
        setIsModalOpen(true);
      };
    
      const handleConfirm = async () => {
        if (appointmentToDelete) {
          try {
            await axios.delete(`/api/appointments?id=${appointmentToDelete?._id}`);
            toast.success("Appointment Deleted Successfully !");
            fetchData();
          } catch (err) {
            console.error(err);
            toast.error("Something went wrong !");
          }
        }
        setIsModalOpen(false);
        setAppointmentToDelete(null);
      };
  
    return (
      <div className="overflow-x-auto lg:px-10 px-5 mb-10">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-white">
              <th className="border border-gray-200 px-4 py-2 text-left font-medium">Timp prezent</th>
              <th className="border border-gray-200 px-4 py-2 text-left font-medium">Nume</th>
              <th className="border border-gray-200 px-4 py-2 text-left font-medium">Prenume</th>
              <th className="border border-gray-200 px-4 py-2 text-left font-medium">Department</th>
              <th className="border border-gray-200 px-4 py-2 text-left font-medium">Telefon</th>
              <th className="border border-gray-200 px-4 py-2 text-left font-medium">Doctor</th>
              <th className="border border-gray-200 px-4 py-2 text-left font-medium w-52">Notes</th>
              <th className="border border-gray-200 px-4 py-2 text-left font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {timeSlots.map((timeSlot) => {
              const appointment = appointmentsMap.get(timeSlot);
  
              return (
                <tr key={timeSlot} className="bg-white">
                  <td className="border border-gray-200 px-4 py-2 text-gray-700">{timeSlot}</td>
                  <td className="border border-gray-200 px-4 py-2 text-gray-700">
                    {appointment ? appointment.patientName : "-"}
                  </td>
                  <td className="border border-gray-200 px-4 py-2 text-gray-700">
                    {appointment ? appointment.patientSurname : "-"}
                  </td>
                  <td className="border border-gray-200 px-4 py-2 text-gray-700">
                    {appointment ? appointment.testType : "-"}
                  </td>
                  <td className="border border-gray-200 px-4 py-2 text-gray-700">
                    {appointment ? appointment.phoneNumber : "-"}
                  </td>
                  <td className="border border-gray-200 px-4 py-2 text-gray-700">
                    {appointment ? appointment.doctorName : "-"}
                  </td>
                  <td className="border border-gray-200 px-4 py-2 text-gray-700 text-[12px] text-wrap overflow-x-auto">
                    {appointment ? appointment.notes : "-"}
                  </td>
                  <td className="border border-gray-200 px-4 py-2 flex space-x-2">
                    <button
                      onClick={() => appointment && onEdit(appointment)} // Pass the full appointment object
                      className="text-blue-500"
                    >
                      <Edit size={20} />
                    </button>
                    <button
                      onClick={() => confirmDelete(appointment)}
                      className="text-red-500"
                    >
                      <Trash size={20} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Delete Confirmation Dialog */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px] min-w-[400px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            Are you sure you want to delete this appointment?
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirm}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      </div>
    );
  };
  
  export default EcoTable; 