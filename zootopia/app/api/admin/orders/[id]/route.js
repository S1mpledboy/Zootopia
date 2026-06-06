import Order from "@/models/Order";
import { getAuthUser } from "@/middleware/auth";
import { connectToDatabase } from "@/lib/mongodb";

export async function GET(req, { params }) {
  await connectToDatabase();

  const { id } = await params;

  const admin = await getAuthUser(req);

  if (!admin) {
    return Response.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  if (admin.role !== "admin") {
    return Response.json(
      { message: "Forbidden: admin only" },
      { status: 403 }
    );
  }

  const order = await Order.findById(id).populate(
    "userId",
    "email firstName lastName phone"
  );

  if (!order) {
    return Response.json(
      { message: "Order not found" },
      { status: 404 }
    );
  }

  return Response.json({ order });
}

export async function PATCH(req, { params }) {
  await connectToDatabase();

  const { id } = await params;

  const admin = await getAuthUser(req);

  if (!admin) {
    return Response.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  if (admin.role !== "admin") {
    return Response.json(
      { message: "Forbidden: admin only" },
      { status: 403 }
    );
  }

  const body = await req.json();

  const allowedStatuses = [
    "COMPLETED",
    "IN_PROGRESS",
    "SHIPPED",
    "CANCELLED",
  ];

  if (!allowedStatuses.includes(body.status)) {
    return Response.json(
      { message: "Invalid order status" },
      { status: 400 }
    );
  }

  console.log("ORDER ID FROM PARAMS:", id);

  const updatedOrder = await Order.findByIdAndUpdate(
    id,
    { status: body.status },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updatedOrder) {
    return Response.json(
      { message: "Order not found" },
      { status: 404 }
    );
  }

  return Response.json({
    message: "Order status updated successfully",
    order: updatedOrder,
  });
}