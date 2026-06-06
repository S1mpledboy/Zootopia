import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    orderNumber: {
      type: String,
      required: true,
      unique: true,
    },

    items: {
      type: [orderItemSchema],
      required: true,
    },

    totalAmount: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["IN_PROGRESS", "SHIPPED", "CANCELLED"],
      default: "IN_PROGRESS",
    },

  
    deliveryAddress: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      country: { type: String, required: true, default: "Polska" },
      street: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      phone: { type: String, required: true },
      email: { type: String, required: true },
    },


    shippingMethod: {
      type: String,
      required: true,
    },
    paymentMethod: {
      type: String,
      required: true,
    },


    invoiceData: {
      companyName: { type: String, default: "" },
      nip: { type: String, default: "" },
    },

    alternativeShippingAddress: {
      country: { type: String, default: "" },
      street: { type: String, default: "" },
      city: { type: String, default: "" },
      postalCode: { type: String, default: "" },
    },

 
    notes: {
      type: String,
      default: "",
    },

 
    discountCode: {
      type: String,
      default: null,
    },
    discountValue: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model("Order", orderSchema);