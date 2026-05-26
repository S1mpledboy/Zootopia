import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Order from "@/models/Order";
import { getAuthUser } from "@/middleware/auth";

export async function GET(req, { params }) {
  try {
    await connectToDatabase();
    const { id } = params;

    const user = await getAuthUser(req);
    if (!user) {
      return NextResponse.json({ message: "Brak autoryzacji" }, { status: 401 });
    }

    // Szukamy zamówienia po ID i pilnujemy, by należało do zalogowanego użytkownika
    const order = await Order.findOne({ _id: id, userId: user._id });

    if (!order) {
      return NextResponse.json({ message: "Nie znaleziono zamówienia" }, { status: 404 });
    }

    return NextResponse.json(order, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}