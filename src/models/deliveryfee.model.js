import mongoose from "mongoose";

const deliveries = new mongoose.Schema(
  {
    Amount: {
      type: Number
    }
  },
  {
    timestamps: true
  }
);
export const deliveryAm = mongoose.model("delAm", deliveries);
