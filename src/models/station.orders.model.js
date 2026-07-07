import mongoose from "mongoose";

const stationOrders = mongoose.Schema(
  {
    StationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "stations"
    },
    ProductId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "products"
    },
  
    Quantity: { type: Number},
    Status: { type: String, 
      enum:['Pending','Approved', 'Cancelled'],
      default: "Pending" },
  },
  {
    timestamps: true,
  }
);
export const stationOrderModel = mongoose.model("s_Order", stationOrders);
