import mongoose from "mongoose";

const stockSchema = mongoose.Schema(
  {
    stationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "stations",
      required: true,
    },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "products", required: true },
    Full: { type: Number, default: 0 },
    Empty: { type: Number, default: 0 },

  },
  {
    timestamps: true,
  }
);

export const stockModel = mongoose.model("stock", stockSchema);
