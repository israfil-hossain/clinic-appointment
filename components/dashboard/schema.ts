// schemas/taskSchema.ts
import * as Yup from 'yup';

// Define the schema using Yup
export const taskSchema = Yup.object({
  _id: Yup.string().required('ID is required'),
  time: Yup.string().required('Time is required'),
  name: Yup.string().required('Name is required'),
  lastname: Yup.string().required("Nume is required"),
  type: Yup.string().required('Type is required'),
  phone: Yup.string().required('Priority is required'),
});

// Define the Task Type using Yup’s TypeScript utility
export type Task = Yup.InferType<typeof taskSchema>;
