const mongoose = require('mongoose');
const TimeSlot = require('./models/TimeSlot'); // Adjust path as per your project structure
const dbConnect = require('./connect');
const { timeSlotSeedData } = require('./data/timeslot_data');

export const seedDatabase = async () => {
  try {
     await dbConnect();
    // Clear existing time slots
    await TimeSlot.deleteMany();

    // Insert seed data
    await TimeSlot.insertMany(timeSlotSeedData);

    console.log('Time slots seeded successfully!');
    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding the database:', error);
    mongoose.connection.close();
  }
};
