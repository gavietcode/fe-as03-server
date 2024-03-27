import mongoose from "mongoose";

const CartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
      ref: "User",
    },
    items: {
      productId: {
        type: String,
        require: true,
      },
      quantity: {
        type: Number,
        require: true,
      },
      price: {
        type: Number,
        require: true,
      },
    },
  },
  { timestamps: true }
);

// CartSchema.pre("save", (next) => {
//   this.updatedAt = new Date();
//   next();
// });

export default mongoose.model("Cart", CartSchema);
