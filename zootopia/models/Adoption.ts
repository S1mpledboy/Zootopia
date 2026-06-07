import mongoose, { Schema, Document } from "mongoose";

export interface IAdoption extends Document {
  petId: mongoose.Types.ObjectId;
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
  message?: string;
  status: "pending" | "reviewing" | "approved" | "rejected";
  createdAt: Date;
}

const AdoptionSchema = new Schema<IAdoption>(
  {
    petId: { type: Schema.Types.ObjectId, ref: "Pet", required: true },
    applicantName: { type: String, required: true },
    applicantEmail: { type: String, required: true },
    applicantPhone: { type: String, required: true },
    message: { type: String },
    status: {
      type: String,
      enum: ["pending", "reviewing", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Adoption ||
  mongoose.model<IAdoption>("Adoption", AdoptionSchema);