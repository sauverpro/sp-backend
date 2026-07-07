import mongoose from "mongoose";

const customerOrders = mongoose.Schema(
  {
    CartId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CartItem",
    },
    address: { type: String },
    phoneNumber: { type: String },
    TotalOrder: { type: Number },
    ref: { type: String, default: null},
    isPaid: { type: Boolean, default: false},
    Status: { type: String, default: "Pending" },
    StationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "stations",
    },
    DriverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    Evidence: String,
  },
  {
    timestamps: true,
  }
);
export const customerOrderModel = mongoose.model("C_Order", customerOrders);
