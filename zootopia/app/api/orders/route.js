import Order from "@/models/Order";
import { getAuthUser } from "@/middleware/auth";
import { connectToDatabase } from "@/lib/mongodb.js";

export async function GET(req) {
  await connectToDatabase();

  const user = await getAuthUser(req);

  if (!user) {
    return Response.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");

  const filter = {
    userId: user._id,
  };

  if (status && status !== "ALL") {
    filter.status = status;
  }

  const orders = await Order.find(filter).sort({ createdAt: -1 });

  const counts = {
    ALL: await Order.countDocuments({ userId: user._id }),
    IN_PROGRESS: await Order.countDocuments({
      userId: user._id,
      status: "IN_PROGRESS",
    }),
    SHIPPED: await Order.countDocuments({
      userId: user._id,
      status: "SHIPPED",
    }),
    CANCELLED: await Order.countDocuments({
      userId: user._id,
      status: "CANCELLED",
    }),
  };

  return Response.json({
    orders,
    counts,
  });
}

export async function POST(req) {
  await connectToDatabase();

  const user = await getAuthUser(req);

  if (!user) {
    return Response.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  const body = await req.json();

  const { items, deliveryAddress, status } = body;

  if (!items || items.length === 0) {
    return Response.json(
      { message: "Items are required" },
      { status: 400 }
    );
  }

  const totalAmount = items.reduce((sum, item) => {
    return sum + item.price * item.quantity;
  }, 0);

  const order = await Order.create({
    userId: user._id,
    orderNumber: String(Date.now()),
    items,
    totalAmount,
    status: status || "IN_PROGRESS",
    deliveryAddress,
  });

  return Response.json(
    {
      message: "Order created successfully",
      order,
    },
    { status: 201 }
  );
}