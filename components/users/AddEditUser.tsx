// components/UserForm.tsx
import { useFormik, FormikHelpers } from "formik";
import * as Yup from "yup";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";

// Define types for form values
interface FormValues {
  username: string;
  email: string;
  password: string;
  role: string;
}

const UserForm: React.FC = () => {
  const initialValues: FormValues = {
    username: "",
    email: "",
    password: "",
    role: "",
  };

  const validationSchema = Yup.object({
    username: Yup.string().required("Username is required"),
    email: Yup.string().email("Invalid email address").required("Email is required"),
    password: Yup.string().min(8, "Password must be at least 8 characters").required("Password is required"),
    role: Yup.string().required("Role is required"),
  });

  const onSubmit = (values: FormValues, { resetForm }: FormikHelpers<FormValues>) => {
    console.log("Form Submitted", values);
    // Handle form submission logic here
    resetForm(); // Optionally reset the form
  };

  const formik = useFormik<FormValues>({
    initialValues,
    validationSchema,
    onSubmit,
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4 max-w-md mx-auto mt-8">
      <div>
        <label className="block text-sm font-medium text-gray-700" htmlFor="username">
          Username
        </label>
        <Input
          id="username"
          name="username"
          type="text"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.username}
          className="mt-1"
        />
        {formik.touched.username && formik.errors.username ? (
          <p className="text-red-500 text-xs mt-1">{formik.errors.username}</p>
        ) : null}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700" htmlFor="email">
          Email
        </label>
        <Input
          id="email"
          name="email"
          type="email"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.email}
          className="mt-1"
        />
        {formik.touched.email && formik.errors.email ? (
          <p className="text-red-500 text-xs mt-1">{formik.errors.email}</p>
        ) : null}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700" htmlFor="password">
          Password
        </label>
        <Input
          id="password"
          name="password"
          type="password"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.password}
          className="mt-1"
        />
        {formik.touched.password && formik.errors.password ? (
          <p className="text-red-500 text-xs mt-1">{formik.errors.password}</p>
        ) : null}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700" htmlFor="role">
          Role
        </label>
        <select
          id="role"
          name="role"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.role}
          className="mt-1"
        >
          <option value="">Select Role</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
          <option value="doctor">Doctor</option>
        </select>
        {formik.touched.role && formik.errors.role ? (
          <p className="text-red-500 text-xs mt-1">{formik.errors.role}</p>
        ) : null}
      </div>

      <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
        Add User
      </Button>
    </form>
  );
};

export default UserForm;
