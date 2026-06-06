import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    pendingEmail: {
      type: String,
      lowercase: true,
      trim: true,
    },

    emailChangeToken: {
      type: String,
      select: false,
    },

    emailChangeTokenExpires: {
      type: Date,
      select: false,
    },

    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    emailVerificationToken: {
      type: String,
      select: false,
    },

    emailVerificationTokenExpires: {
      type: Date,
      select: false,
    },

    deleteUnverifiedAt: {
      type: Date,
      index: {
        expires: 0,
        partialFilterExpression: {
          isEmailVerified: false,
        },
      },
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    firstName: {
      type: String,
      default: "",
    },

    lastName: {
      type: String,
      default: "",
    },

    country: {
      type: String,
      default: "Polska",
    },

    street: {
      type: String,
      default: "",
    },

    city: {
      type: String,
      default: "",
    },

    postalCode: {
      type: String,
      default: "",
    },

    phone: {
      type: String,
      default: "",
    },

    // 🔥 NOWE POLE: Tablica polubionych produktów powiązana z modelem Product
    likedProducts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", userSchema);