import mongoose from "mongoose";

const CartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      default: 1,
      min: 1,
    },
  },
  { timestamps: true }
);

// Blokada, żeby ten sam użytkownik nie miał dwóch osobnych wpisów dla tego samego produktu
CartSchema.index({ user: 1, product: 1 }, { unique: true });

export default mongoose.models.Cart || mongoose.model("Cart", CartSchema);