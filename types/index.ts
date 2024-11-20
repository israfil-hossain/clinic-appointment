// types/index.ts
export interface Location {
  _id: string;
  name: string;
  createdAt?: Date;
}

export interface Appointment {
  location: string;
  date: Date;
  time: string;
  patientName: string;
  patientSurname: string;
  doctorName: string; 
  testType: string;
  phoneNumber: string;
  isConfirmed: boolean;
  notes: string;
  createdAt?: Date;
}

export interface Notes{
  date: Date;
  notes: string; 
  createdAt?: Date;
}

export interface User {
  username: string;
  email : string; 
  password: string;
  accessSection: string;
  role: "admin" | "operator";
  createdAt?: Date;
}


export type Schedule = {
  day: string;
  startTime: string;
  endTime: string;
};

export type Doctor = {
  name: string;
  schedule: Schedule[];
};

export type Department = {
  name: string;
  doctors: Doctor[];
};
