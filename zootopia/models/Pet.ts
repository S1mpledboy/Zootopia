import mongoose, { Schema, Document } from "mongoose";

export interface IPet extends Document {
  name: string;
  breed: string;
  age: number; // miesiące
  gender: "male" | "female";
  size: "small" | "medium" | "large";
  description: string;
  healthInfo: string;
  images: string[];
  status: "available" | "reserved" | "adopted";
  tags: string[];
  shelterId: mongoose.Types.ObjectId;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const PetSchema = new Schema<IPet>(
  {
    name: { type: String, required: true },
    breed: { type: String, default: "Mieszaniec" },
    age: { type: Number, required: true }, // w miesiącach
    gender: { type: String, enum: ["male", "female"], required: true },
    size: { type: String, enum: ["small", "medium", "large"], required: true },
    description: { type: String, required: true },
    healthInfo: { type: String, default: "" },
    images: [{ type: String }],
    status: {
      type: String,
      enum: ["available", "reserved", "adopted"],
      default: "available",
    },
    tags: [{ type: String }],
    shelterId: { type: Schema.Types.ObjectId, ref: "Shelter" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.Pet || mongoose.model<IPet>("Pet", PetSchema);