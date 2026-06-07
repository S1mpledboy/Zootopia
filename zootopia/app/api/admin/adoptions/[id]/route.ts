import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import AdoptionModel from "@/models/Adoption";

let cachedDb: any = null;
async function connect() {
  if (cachedDb && mongoose.connection.readyState === 1) return;
  cachedDb = await mongoose.connect(process.env.MONGODB_URI!, { dbName: "mydb" });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await connect();
  const { id } = await params;
  const body = await req.json();
  await AdoptionModel.findByIdAndUpdate(id, body);
  return NextResponse.json({ success: true });
}