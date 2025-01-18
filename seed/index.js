const dbConnect = require("./connect");
const { timeSlot } = require("./timeslot");
const { createUser } = require("./User");
const mongoose = require("mongoose"); 

const seedDatabase = async () => {
  try {
    await dbConnect();
    await createUser();
    await timeSlot();
  } catch (err) {
    console.error(err);
    console.log("Something is wrong ... ")
  } finally {
    await mongoose.connection.close();
    console.log("Db Seeding is completed ...");
  }
};

seedDatabase();
