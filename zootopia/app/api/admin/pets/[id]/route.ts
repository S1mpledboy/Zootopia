import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import PetModel from "@/models/Pet";

let cachedDb: any = null;
async function connect() {
  if (cachedDb && mongoose.connection.readyState === 1) return;
  cachedDb = await mongoose.connect(process.env.MONGODB_URI!, { dbName: "mydb" });
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await connect();
  const { id } = await params;
  await PetModel.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await connect();
  const { id } = await params;
  const body = await req.json();
  await PetModel.findByIdAndUpdate(id, body);
  return NextResponse.json({ success: true });
}