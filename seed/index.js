const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const dbConnect = require("./connect");
const UserModel = require("./User");

const createUser = async () => {
  await dbConnect();

  const userData = {
    username: "Admin",
    email: "admin@gmail.com",
    password: "123456",
    accessSection: "all",
    role: "admin",
  };

  try {
    const user = await UserModel.findOne({ email: userData.email });
    if (user) throw new Error("Default admin user already exists.");

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const createdUser = new UserModel({
      ...userData,
      password: hashedPassword,
    });

    await createdUser.save();
    console.log("Default admin user created successfully.", createdUser);
  } catch (error) {
    console.error("Seeding failed:", error.message);
  } finally {
    mongoose.connection.close();
    console.log("Seeding completed.");
  }
};

createUser();
