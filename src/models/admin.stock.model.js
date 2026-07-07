import mongoose from "mongoose";

const adminStockSchema = mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "products",
      required: true,
    },
    Full: { type: Number, default: 0 },
    purchasePrice: { type: Number, default: 0 },
    Empty: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);
export const adminStockModel = mongoose.model("adminstock", adminStockSchema);
