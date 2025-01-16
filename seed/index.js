const { seedDatabase } = require("./timeslot");
const { createUser } = require("./User");

createUser();
seedDatabase();