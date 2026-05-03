import User from "@/models/User";
import { getAuthUser } from "@/middleware/auth";
import { connectToDatabase } from "@/lib/mongodb";

export async function GET(req) {
  const currentUser = await getAuthUser(req);

  if (!currentUser) {
    return Response.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  if (currentUser.role !== "admin") {
    return Response.json(
      { message: "Forbidden: admin only" },
      { status: 403 }
    );
  }

  await connectToDatabase();

  const users = await User.find().select("-password");

  return Response.json({
    users,
  });
}