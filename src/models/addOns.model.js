import mongoose from "mongoose";

const addOnsSchema = mongoose.Schema(
  {
    Name: String,
    Image: { type: String, required: true },
    Price: { type: Number, required: true, default: 0 },
    productId: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "products",
      required: true,
    }],
  },
  {
    timestamps: true,
  }
);
export const addOnsModel = mongoose.model("addOns", addOnsSchema);