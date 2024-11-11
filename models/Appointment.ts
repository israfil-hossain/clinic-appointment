import mongoose, { Schema, Document } from 'mongoose';
import { Appointment } from '../types';

const AppointmentSchema: Schema = new Schema({
  location: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  patientName: { type: String, required: true },
  patientSurname: { type: String, required: true },
  testType: { type: String, required: true },
  doctorName: {type:String, requierd: true },
  phoneNumber: { type: String, required: true },
  isConfirmed: { type: Boolean, default: false },
  notes: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
},{
    timestamps: true
});

export interface IAppointment extends Appointment, Document {}

const AppointModel = mongoose.models.Appointment || mongoose.model<IAppointment>('Appointment', AppointmentSchema); 

export default AppointModel;
