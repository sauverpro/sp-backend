import mongoose from "mongoose";

const externalOrders = mongoose.Schema(
  {
    FullName: {
      type: String,
    },
    PhoneNumber: {
      type: String,
    },
    ProductId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "products",
    },
    StationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "stations",
    },

    Quantity: {
      type: Number,
    },
    receiptNumber: {
      type: String,
    },
    PaymentMethod: {
      type: String, enum: ["CASH", "MOMO"],
    },
    Amount: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

export const externalOrder = mongoose.model("extOrder", externalOrders);
