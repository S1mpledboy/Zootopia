import User from "@/models/User";
import { getAuthUser } from "@/middleware/auth";
import { connectToDatabase } from "@/lib/mongodb";

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

  if (typeof body.isActive !== "boolean") {
    return Response.json(
      { message: "isActive must be boolean" },
      { status: 400 }
    );
  }

  const updatedUser = await User.findOneAndUpdate(
    {
      _id: id,
      role: "user",
    },
    {
      isActive: body.isActive,
    },
    {
      new: true,
      runValidators: true,
    }
  ).select("-password");

  if (!updatedUser) {
    return Response.json(
      { message: "User not found" },
      { status: 404 }
    );
  }

  return Response.json({
    message: body.isActive
      ? "User activated successfully"
      : "User deactivated successfully",
    user: updatedUser,
  });
}

export async function DELETE(req, { params }) {
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

  const deletedUser = await User.findOneAndDelete({
    _id: id,
    role: "user",
  });

  if (!deletedUser) {
    return Response.json(
      { message: "User not found" },
      { status: 404 }
    );
  }

  return Response.json({
    message: "User deleted successfully",
  });
}