import mongoose from "mongoose";

const productSchema = mongoose.Schema(
  {
    Image: { type: String },
    Kilograms: { type: Number, default: 0 },
    Type: { type: String },
  },
  {
    timestamps: true,
  }
);
export const productModel = mongoose.model("products", productSchema);
