import Order from "@/models/Order";
import { getAuthUser } from "@/middleware/auth";
import { connectToDatabase } from "@/lib/mongodb.js";

export async function GET(req, { params }) {
  await connectToDatabase();

  const user = await getAuthUser(req);

  if (!user) {
    return Response.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  const order = await Order.findOne({
    _id: params.id,
    userId: user._id,
  });

  if (!order) {
    return Response.json(
      { message: "Order not found" },
      { status: 404 }
    );
  }

  return Response.json({ order });
}