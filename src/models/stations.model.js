const mongoose = require("mongoose");

const stationSchema = mongoose.Schema(
  {
    StationName: { type: String, required: true },
    Location: { type: String },
    managerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const stationModel = mongoose.model("stations", stationSchema);
