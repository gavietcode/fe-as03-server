import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema({
  user: {
    _id: String,
    fullname: String,
    email: String,
    phone: String,
    address: String,
    role: String,
  },
  products: [
    {
      id: String,
      img1: String,
      name: String,
      price: Number,
      quantity: Number,
    },
  ],
  orderTime: {
    type: Date,
    default: Date.now,
  },
  totalPrice: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ["pending", "shipping", "completed", "canceled"],
    default: "pending",
  },
});

export default mongoose.model("Order", OrderSchema);
