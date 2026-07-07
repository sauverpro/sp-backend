const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
  UserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "products",
        required: true,
      },
      quantity: { type: Number, default: 1 },
    },
  ],
  addOns: [
    {
      addonId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "addOns",
      },
      Count: Number
    },
  ],
  TotalAmount: { type: Number, default: 0 },
  status: { type: String, enum: ["pending", "checkout"], default: "pending" },
});

export const cartModel = mongoose.model("CartItem", cartItemSchema);
