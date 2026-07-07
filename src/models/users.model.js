const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    FullNames: { type: String, required: true },
    Profile: { type: String },
    Email: { type: String, required: true},
    PhoneNumber: { type: Array},
    IdNumber: { type: String},
    Location: {type: Array},
    Password: { type: String, required: true },
    Role: { type: String, default: "Customer" },
  },
  {
    timestamps: true,
  }
);

export const userModel = mongoose.model("users", userSchema);
