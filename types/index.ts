// types/index.ts
export interface Location {
  _id: string;
  name: string;
  createdAt?: Date;
}

export interface Appointment {
  _id: string;
  location: Location;
  date: Date;
  time: string;
  patientName: string;
  patientSurname: string;
  ecographyType: string;
  phoneNumber: string;
  confirmed: boolean;
  notes?: string;
  createdAt?: Date;
}

export interface User {
  _id: string;
  username: string;
  password: string;
  accessSection: string;
  role: "admin" | "operator";
  createdAt?: Date;
}
