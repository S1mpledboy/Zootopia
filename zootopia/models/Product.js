import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      minlength: 2,
      maxlength: 200,
    },

    description: {
      type: String,
      default: "",
      maxlength: 3000,
    },

    ingredients: {
      type: String,
      default: "",
      maxlength: 3000,
    },

    additionalInfo: {
      type: String,
      default: "",
      maxlength: 3000,
    },

    price: {
      type: Number,
      required: [true, "Price is required"],
      min: 0,
    },

    oldPrice: {
      type: Number,
      default: null,
      min: 0,
    },

    promoPrice: {
      type: Number,
      default: null,
      min: 0,
    },

    stock: {
      type: Number,
      default: 0,
      min: 0,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required"],
    },

    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: [true, "Company is required"],
    },

    animalType: {
      type: String,
      enum: ["DOG", "CAT", "SMALL_ANIMALS", "VET", "PROMOTIONS"],
      required: [false, "Animal type is required"],
    },

    images: {
      type: [String],
      default: [],
    },

    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    popularity: {
      type: Number,
      default: 0,
      min: 0,
    },

    tags: {
      type: [String],
      default: [],
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);


ProductSchema.index({ name: "text", description: "text", ingredients: "text", additionalInfo: "text" });

ProductSchema.index({ category: 1 });
ProductSchema.index({ company: 1 });
ProductSchema.index({ animalType: 1 });
ProductSchema.index({ price: 1 });
ProductSchema.index({ stock: 1 });
ProductSchema.index({ isActive: 1 });

export default mongoose.models.Product ||
  mongoose.model("Product", ProductSchema);