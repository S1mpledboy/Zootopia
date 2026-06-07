import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import PetModel from "@/models/Pet";

let cachedDb: any = null;
async function connect() {
  if (cachedDb && mongoose.connection.readyState === 1) return;
  cachedDb = await mongoose.connect(process.env.MONGODB_URI!, { dbName: "mydb" });
}

export async function GET() {
  await connect();
  const pets = await PetModel.find({}).sort({ createdAt: -1 }).lean();
  const serialized = pets.map((p: any) => ({
    _id: p._id.toString(),
    name: p.name,
    breed: p.breed || "Mieszaniec",
    age: p.age,
    gender: p.gender,
    size: p.size,
    description: p.description,
    healthInfo: p.healthInfo || "",
    images: p.images || [],
    status: p.status,
    tags: p.tags || [],
    createdAt: new Date(p.createdAt).toLocaleDateString("pl-PL"),
  }));
  return NextResponse.json({ pets: serialized });
}

export async function POST(req: NextRequest) {
  await connect();
  const body = await req.json();
  const pet = await PetModel.create(body);
  return NextResponse.json({
    pet: { ...body, _id: pet._id.toString(), createdAt: new Date().toLocaleDateString("pl-PL") }
  }, { status: 201 });
}