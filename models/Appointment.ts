// import mongoose, { Schema, Document } from 'mongoose';
// import { Appointment } from '../types';

// const AppointmentSchema: Schema = new Schema({
//   location: { type: Schema.Types.ObjectId, ref: 'Location', required: true },
//   date: { type: Date, required: true },
//   time: { type: String, required: true },
//   patientName: { type: String, required: true },
//   patientSurname: { type: String, required: true },
//   ecographyType: { type: String, required: true },
//   phoneNumber: { type: String, required: true },
//   confirmed: { type: Boolean, default: false },
//   notes: { type: String, default: '' },
//   createdAt: { type: Date, default: Date.now },
// });

// export interface IAppointment extends Appointment, Document {}
// export default mongoose.models.Appointment || mongoose.model<IAppointment>('Appointment', AppointmentSchema);
