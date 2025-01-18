const mongoose = require("mongoose");

const timeSlotSchema = new mongoose.Schema({
  location: {
    type: String,
    required: true,
  },
  schedule: {
    type: Map,
    of: [String],
    required: true,
    validate: {
      validator: function (value) {
        // Ensure keys match the days of the week
        const validDays = ["Luni", "Marți", "Miercuri", "Joi", "Vineri", "Sâmbătă", "Duminica"];
        return Object.keys(value).every((day) => validDays.includes(day));
      },
      message: "Invalid schedule days",
    },
  },
});

module.exports = mongoose.model("TimeSlot", timeSlotSchema);
