import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Order from "@/models/Order";
import { getAuthUser } from "@/middleware/auth";

export async function GET(req, { params }) {
  try {
    await connectToDatabase();

    // Next.js App Router: params mogą być Promise w nowszych wersjach
    const { id } = await params;

    const user = await getAuthUser(req);
    if (!user || !user._id) {
      return NextResponse.json({ message: "Brak autoryzacji" }, { status: 401 });
    }

    const order = await Order.findOne({ _id: id, userId: user._id });

    if (!order) {
      return NextResponse.json({ message: "Nie znaleziono zamówienia" }, { status: 404 });
    }

    return NextResponse.json(order, { status: 200 });
  } catch (error) {
    console.error("Błąd pobierania zamówienia:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}