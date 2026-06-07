import { NextResponse } from "next/server";
import mongoose from "mongoose";
import AdoptionModel from "@/models/Adoption";
import PetModel from "@/models/Pet";

let cachedDb: any = null;
async function connect() {
  if (cachedDb && mongoose.connection.readyState === 1) return;
  cachedDb = await mongoose.connect(process.env.MONGODB_URI!, { dbName: "mydb" });
}

export async function GET() {
  await connect();
  const apps = await AdoptionModel.find({}).sort({ createdAt: -1 }).lean();
  const serialized = await Promise.all(apps.map(async (a: any) => {
    let petName = "";
    try {
      const pet = await PetModel.findById(a.petId).lean() as any;
      petName = pet?.name || "";
    } catch {}
    return {
      _id: a._id.toString(),
      petId: a.petId.toString(),
      petName,
      applicantName: a.applicantName,
      applicantEmail: a.applicantEmail,
      applicantPhone: a.applicantPhone,
      message: a.message || "",
      status: a.status,
      createdAt: new Date(a.createdAt).toLocaleDateString("pl-PL"),
    };
  }));
  return NextResponse.json({ applications: serialized });
}