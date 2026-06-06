import User from "@/models/User";
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

  const filter = {
    role: "user",
  };

  if (status === "ACTIVE") {
    filter.isActive = true;
  }

  if (status === "INACTIVE") {
    filter.isActive = false;
  }

  if (search) {
    filter.$or = [
      { firstName: { $regex: search, $options: "i" } },
      { lastName: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }

  const users = await User.find(filter)
    .select("-password")
    .sort({ createdAt: -1 });

  const counts = {
    ALL: await User.countDocuments({ role: "user" }),
    ACTIVE: await User.countDocuments({
      role: "user",
      isActive: true,
    }),
    INACTIVE: await User.countDocuments({
      role: "user",
      isActive: false,
    }),
  };

  return Response.json({
    users,
    counts,
  });
}