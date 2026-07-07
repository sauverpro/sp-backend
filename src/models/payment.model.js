import mongoose from "mongoose";

const payment = mongoose.Schema(
  {
    ref: String,
    user_ref: String,
    kind: String,
    fee: String,
    merchant: String,
    client: String,
    amount: Number,
    provider: String,
    status: String,
    metadata: String,
    created_at: String,
    processed_at: String,
  },
  {
    timestamps: true,
  }
);
export const paymentModel = mongoose.model("payment", payment);
