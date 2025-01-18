
const { timeSlotSeedData } = require("./data/timeslotdata");
const TimeSlot = require("./schema/TimeSlot");

export const timeSlot = async () => {
  try {
    // Clear existing time slots
    await TimeSlot.deleteMany();

    // Insert seed data
    const formattedData = Object.keys(timeSlotSeedData).map((location) => ({
      location,
      schedule: timeSlotSeedData[location],
    }));
    await TimeSlot.insertMany(formattedData);

    console.log("Time slots seeded successfully!");
  } catch (error) {
    console.error("Error seeding the database:", error);
  } 
};
