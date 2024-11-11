"use client";

import { useState } from "react";
import { Formik, Form, Field, FormikHelpers, FormikErrors } from "formik";
import * as Yup from "yup";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { departmentsData, locations } from "@/lib/department";
import axios from "axios";
import toast from "react-hot-toast";
import utc from "dayjs/plugin/utc";
import dayjs from "dayjs";

dayjs.extend(utc);

interface Appointment {
  _id?: string;
  location: string;
  date: any;
  time: string;
  patientName: string;
  patientSurname: string;
  doctorName: string;
  testType: string;
  phoneNumber: string;
  isConfirmed: boolean;
  notes: string;
}

// Validation schema using Yup
const AppointmentSchema = Yup.object().shape({
  time: Yup.string().required("Time is required"),
  patientName: Yup.string().required("Name is required"),
  patientSurname: Yup.string().required("Surname is required"),
  testType: Yup.string().required("Type is required"),
  phoneNumber: Yup.string().required("Phone number is required"),
  doctorName: Yup.string().required("Doctor is required"),
});

interface AppointmentAddEditProps {
  isModalOpen: boolean;
  handleModal: () => void; 
  date?: any;
  location: string;
  data?: Appointment | null;
  fetchAppointments: () => void;
}

export default function AppointmentAddEdit({
  isModalOpen,
  handleModal,
  date,
  location,
  data,
  fetchAppointments,
}: AppointmentAddEditProps) {
  const [selectedDepartment, setSelectedDepartment] = useState("");

  const appointmentDate = dayjs(date).startOf("day");
  const formattedDate = appointmentDate.format("YYYY-MM-DD");

  const handleAddOrUpdateAppointment = async (
    values: any,
    { resetForm }: { resetForm: any }
  ) => {
    try {
      if (data) {
        await updateAppointment(data?._id, {
          ...values,
          date: formattedDate,
        });
      } else {
        await createAppointment(values, formattedDate);
      }
      resetForm();
      handleModal();
      fetchAppointments();
      toast.success(
        data
          ? "Appointment Updated Successfully!"
          : "Appointment Created Successfully!"
      );
    } catch (error) {
      console.error("Error handling appointment:", error);
      toast.error("An error occurred while handling the appointment");
    }
  };

  const createAppointment = async (values: Appointment, formattedDate: any) => {
    try {
      const response = await axios.post(
        "/api/appointments",
        {
          ...values,
          date: formattedDate,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.data) {
        toast.error("Failed to create appointment");
      }
    } catch (error) {
      console.error("Error creating appointment:", error);
      toast.error("An error occurred while creating the appointment");
    }
  };

  const updateAppointment = async (
    appointmentId: string | undefined,
    updatedData: any
  ) => {
    try {

      console.log("Update : ", updatedData); 

      const response = await axios.patch(
        `/api/appointments?id=${appointmentId}`,
        updatedData,
        {
          headers: {
           
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Appointment Updated Successfully!", response.data);
    } catch (error) {
      console.error("Error updating appointment:", error);
      toast.error("An error occurred while updating the appointment");
    }
  };

  return (
    <div className="w-full overflow-auto">
      <div className="mb-4">
        <Dialog open={isModalOpen} onOpenChange={handleModal}>
          
          <DialogContent className="sm:max-w-[425px] min-w-[600px]">
            <DialogHeader>
              <DialogTitle>
                {data ? "Update" : "Add"} New Appointment For{" "}
                {date?.format("D MMMM YYYY")}
              </DialogTitle>
            </DialogHeader>
            <Formik
              initialValues={{
                date: data?.date || formattedDate,
                time: data?.time || "",
                patientName: data?.patientName || "",
                patientSurname: data?.patientSurname || "",
                testType: data?.testType || "",
                phoneNumber: data?.phoneNumber || "",
                notes: data?.notes || "",
                doctorName: data?.doctorName || "",
                location: data?.location || location,
                isConfirmed: data?.isConfirmed || true,
              }}
              validationSchema={AppointmentSchema}
              onSubmit={handleAddOrUpdateAppointment}
            >
              {({ errors, touched, setFieldValue, values }) => (
                <Form className="space-y-4">
                  <div className="flex space-x-5 w-full">
                    <div className="w-1/2">
                      <Label htmlFor="patientName">Name</Label>
                      <Field name="patientName" as={Input} id="patientName" />
                      {errors.patientName && touched.patientName && (
                        <div className="text-red-500">{errors.patientName}</div>
                      )}
                    </div>
                    <div className="w-1/2">
                      <Label htmlFor="patientSurname">Surname</Label>
                      <Field
                        name="patientSurname"
                        as={Input}
                        id="patientSurname"
                      />
                      {errors.patientSurname && touched.patientSurname && (
                        <div className="text-red-500">
                          {errors.patientSurname}
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="phoneNumber">Phone</Label>
                    <Field name="phoneNumber" as={Input} id="phoneNumber" />
                    {errors.phoneNumber && touched.phoneNumber && (
                      <div className="text-red-500">{errors.phoneNumber}</div>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="testType">Tip Ecografie</Label>
                    <Field
                      as="select"
                      name="testType"
                      id="testType"
                      onChange={(e: any) => {
                        const selected = e.target.value;
                        setFieldValue("testType", selected);
                        setSelectedDepartment(selected);
                        setFieldValue("doctorName", ""); // Reset doctor when department changes
                      }}
                      value={values.testType}
                      className="block w-full p-2 border border-gray-300 rounded"
                    >
                      <option value="">Select a Tip Ecografie</option>
                      {departmentsData.map((dept) => (
                        <option key={dept.name} value={dept.name}>
                          {dept.name}
                        </option>
                      ))}
                    </Field>
                    {errors.testType && touched.testType && (
                      <div className="text-red-500">{errors.testType}</div>
                    )}
                  </div>

                  {selectedDepartment && (
                    <div>
                      <Label htmlFor="doctorName">Doctor</Label>
                      <Field
                        as="select"
                        name="doctorName"
                        id="doctorName"
                        value={values.doctorName}
                        onChange={(e: any) =>
                          setFieldValue("doctorName", e.target.value)
                        }
                        className="block w-full p-2 border border-gray-300 rounded"
                      >
                        <option value="">Select a doctor</option>
                        {departmentsData
                          .find((dept: any) => dept.name === selectedDepartment)
                          ?.doctors.map((doc: any) => (
                            <option key={doc.name} value={doc.name}>
                              {doc.name}
                            </option>
                          ))}
                      </Field>
                      {errors.doctorName && touched.doctorName && (
                        <div className="text-red-500">{errors.doctorName}</div>
                      )}
                    </div>
                  )}

                  <div className="w-full flex space-x-5">
                    <div className="w-32">
                      <Label htmlFor="time">Time</Label>
                      <Field name="time" type="time" as={Input} id="time" />
                      {errors.time && touched.time && (
                        <div className="text-red-500">{errors.time}</div>
                      )}
                    </div>

                    <div>
                      <Label>Location</Label>
                      <div
                        role="group"
                        aria-labelledby="location-group"
                        className="flex space-x-5 border p-2 rounded-lg"
                      >
                        {locations.map((loc) => (
                          <label key={loc.value} className="flex items-center">
                            <Field
                              type="radio"
                              name="location"
                              value={loc.value}
                              className="mr-2"
                              checked={values.location === loc.value}
                            />
                            {loc.label}
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="notes">Notes</Label>
                    <Field
                      as="textarea"
                      name="notes"
                      id="notes"
                      className="block w-full p-2 border border-gray-300 rounded"
                    />
                  </div>

                  <div className="flex space-x-5">
                    <Button
                      type="submit"
                      disabled={Object.keys(errors).length > 0}
                    >
                      {data ? "Update" : "Add"} Appointment
                    </Button>
                    <Button type="button" onClick={handleModal}>
                      Cancel
                    </Button>
                  </div>
                </Form>
              )}
            </Formik>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
