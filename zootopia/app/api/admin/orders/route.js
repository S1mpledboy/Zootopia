import Order from "@/models/Order";
import { getAuthUser } from "@/middleware/auth";
import { connectToDatabase } from "@/lib/mongodb";

export async function GET(req) {
  await connectToDatabase();

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

  const { searchParams } = new URL(req.url);

  const status = searchParams.get("status");
  const search = searchParams.get("search");

  const filter = {};

  if (status && status !== "ALL") {
    filter.status = status;
  }

  if (search) {
    filter.$or = [
      { orderNumber: { $regex: search, $options: "i" } },
      { invoiceNumber: { $regex: search, $options: "i" } },
      { "deliveryAddress.lastName": { $regex: search, $options: "i" } },
    ];
  }

  const orders = await Order.find(filter)
    .populate("userId", "email firstName lastName")
    .sort({ createdAt: -1 });

  const counts = {
    ALL: await Order.countDocuments(),
    COMPLETED: await Order.countDocuments({ status: "COMPLETED" }),
    IN_PROGRESS: await Order.countDocuments({ status: "IN_PROGRESS" }),
    SHIPPED: await Order.countDocuments({ status: "SHIPPED" }),
    CANCELLED: await Order.countDocuments({ status: "CANCELLED" }),
  };

  return Response.json({
    orders,
    counts,
  });
}