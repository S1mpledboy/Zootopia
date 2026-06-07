import mongoose, { Schema, Document } from "mongoose";

export interface IShelter extends Document {
  name: string;
  city: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  description?: string;
}

const ShelterSchema = new Schema<IShelter>({
  name: { type: String, required: true },
  city: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  website: { type: String },
  description: { type: String },
});

export default mongoose.models.Shelter ||
  mongoose.model<IShelter>("Shelter", ShelterSchema);