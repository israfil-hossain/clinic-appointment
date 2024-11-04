"use client";

import { useState } from "react";
import { Formik, Form, Field, FormikHelpers, FormikErrors } from "formik";
import * as Yup from "yup";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MoreHorizontal, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { departmentsData, locations } from "@/lib/department";

// Define the shape of your form values
interface AppointmentFormValues {
  time: string;
  name: string;
  surname: string;
  type: string;
  phone: string;
  description: string;
  department: string;
  doctor: string;
  location: string;
}

// Validation schema using Yup
const AppointmentSchema = Yup.object().shape({
  time: Yup.string().required("Time is required"),
  name: Yup.string().required("Name is required"),
  surname: Yup.string().required("Surname is required"),
  type: Yup.string().required("Type is required"),
  phone: Yup.string().required("Phone number is required"),
  department: Yup.string().required("Department is required"),
  doctor: Yup.string().required("Doctor is required"),
  location: Yup.string().required("Location is required"),
});

interface AppointmentAddEditProps {
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
  data?: AppointmentFormValues; // Optional initial data
}

export default function AppointmentAddEdit({
  isModalOpen,
  setIsModalOpen,
  data,
}: AppointmentAddEditProps) {
  const [selectedDepartment, setSelectedDepartment] = useState("");

  const handleAddAppointment = (
    values: AppointmentFormValues,
    { resetForm }: FormikHelpers<AppointmentFormValues>
  ) => {
    console.log("New appointment added:", values);
    resetForm();
    setIsModalOpen(false);
  };

  return (
    <div className="w-full overflow-auto">
      <div className="mb-4">
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Appointment
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] min-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add New Appointment For 05/11/2024</DialogTitle>
            </DialogHeader>
            <Formik
              initialValues={{
                time: data?.time || "",
                name: data?.name || "",
                surname: data?.surname || "",
                type: data?.type || "",
                phone: data?.phone || "",
                description: data?.description || "",
                department: data?.department || "",
                doctor: data?.doctor || "",
                location: data?.location || "",
              }}
              validationSchema={AppointmentSchema}
              onSubmit={handleAddAppointment}
            >
              {({ errors, touched, setFieldValue, values }) => (
                <Form className="space-y-4">
                  <div className="flex space-x-5 w-full">
                    <div className="w-1/2">
                      <Label htmlFor="name">Name</Label>
                      <Field name="name" as={Input} id="name" />
                      {errors.name && touched.name && (
                        <div className="text-red-500">{errors.name}</div>
                      )}
                    </div>
                    <div className="w-1/2">
                      <Label htmlFor="surname">Surname</Label>
                      <Field name="surname" as={Input} id="surname" />
                      {errors.surname && touched.surname && (
                        <div className="text-red-500">{errors.surname}</div>
                      )}
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Field name="phone" as={Input} id="phone" />
                    {errors.phone && touched.phone && (
                      <div className="text-red-500">{errors.phone}</div>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="department">Tip Ecografie</Label>
                    <Field
                      as="select"
                      name="department"
                      id="department"
                      onChange={(e: any) => {
                        const selected = e.target.value;
                        setFieldValue("department", selected);
                        setSelectedDepartment(selected);
                        setFieldValue("doctor", ""); // Reset doctor when department changes
                      }}
                      value={values.department}
                      className="block w-full p-2 border border-gray-300 rounded"
                    >
                      <option value="">Select a Tip Ecografie</option>
                      {departmentsData.map((dept) => (
                        <option key={dept.name} value={dept.name}>
                          {dept.name}
                        </option>
                      ))}
                    </Field>
                    {errors.department && touched.department && (
                      <div className="text-red-500">{errors.department}</div>
                    )}
                  </div>

                  {selectedDepartment && (
                    <div>
                      <Label htmlFor="doctor">Doctor</Label>
                      <Field
                        as="select"
                        name="doctor"
                        id="doctor"
                        value={values.doctor}
                        onChange={(e: any) =>
                          setFieldValue("doctor", e.target.value)
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
                      {errors.doctor && touched.doctor && (
                        <div className="text-red-500">{errors.doctor}</div>
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
                        {locations.map((location) => (
                          <label
                            key={location.value}
                            className="flex items-center"
                          >
                            <Field
                              type="radio"
                              name="location"
                              value={location.value}
                              className="mr-2"
                            />
                            {location.label}
                          </label>
                        ))}
                      </div>
                      {errors.location && touched.location && (
                        <div className="text-red-500">{errors.location}</div>
                      )}
                    </div>
                  </div>

                  <Button type="submit">Add Appointment</Button>
                </Form>
              )}
            </Formik>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
