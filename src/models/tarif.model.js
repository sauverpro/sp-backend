import mongoose from "mongoose";

const tariffSchema = mongoose.Schema(
  {
    Price: { type: Number },
    isDeleted: { type: Boolean, default:  false },
  },
  {
    timestamps: true,
  }
);
export const tariffModel = mongoose.model("tariff", tariffSchema);
