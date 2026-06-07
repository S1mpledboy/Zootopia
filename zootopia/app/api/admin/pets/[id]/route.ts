import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import PetModel from "@/models/Pet";

let cachedDb: any = null;
async function connect() {
  if (cachedDb && mongoose.connection.readyState === 1) return;
  cachedDb = await mongoose.connect(process.env.MONGODB_URI!, { dbName: "mydb" });
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  await connect();
  await PetModel.findByIdAndDelete(params.id);
  return NextResponse.json({ success: true });
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  await connect();
  const body = await req.json();
  await PetModel.findByIdAndUpdate(params.id, body);
  return NextResponse.json({ success: true });
}