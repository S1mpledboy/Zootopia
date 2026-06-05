import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import AdoptionModel from "@/models/Adoption";
import PetModel from "@/models/Pet";

let cachedDb: any = null;
async function getDatabaseConnection() {
  const baseUri = process.env.MONGODB_URI;
  if (!baseUri) throw new Error("Brak MONGODB_URI!");
  if (cachedDb && mongoose.connection.readyState === 1) return cachedDb;
  cachedDb = await mongoose.connect(baseUri, { dbName: "mydb" });
  return cachedDb;
}

export async function POST(req: NextRequest) {
  try {
    await getDatabaseConnection();
    const body = await req.json();
    const { petId, applicantName, applicantEmail, applicantPhone, message } = body;

    if (!petId || !applicantName || !applicantEmail || !applicantPhone) {
      return NextResponse.json({ error: "Brakuje wymaganych pól" }, { status: 400 });
    }

    // Sprawdź czy pies istnieje i jest dostępny
    const pet = await PetModel.findById(petId);
    if (!pet) {
      return NextResponse.json({ error: "Nie znaleziono zwierzaka" }, { status: 404 });
    }
    if (pet.status !== "available") {
      return NextResponse.json({ error: "Zwierzak nie jest już dostępny" }, { status: 409 });
    }

    await AdoptionModel.create({
      petId: new mongoose.Types.ObjectId(petId),
      applicantName,
      applicantEmail,
      applicantPhone,
      message: message || "",
      status: "pending",
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Błąd serwera" }, { status: 500 });
  }
}