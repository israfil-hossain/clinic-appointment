import mongoose from 'mongoose';

const TimeSlotSchema = new mongoose.Schema({
    location: { type: String, required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
   
});

export default mongoose.models.TimeSlot || mongoose.model('TimeSlot', TimeSlotSchema);