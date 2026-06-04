import Tag from "@/models/Tag";
import { getAuthUser } from "@/middleware/auth";
import { connectToDatabase } from "@/lib/mongodb";

async function requireAdmin(req) {
  const admin = await getAuthUser(req);

  if (!admin) {
    return {
      error: Response.json({ message: "Unauthorized" }, { status: 401 }),
    };
  }

  if (admin.role !== "admin") {
    return {
      error: Response.json({ message: "Forbidden: admin only" }, { status: 403 }),
    };
  }

  return { admin };
}

export async function DELETE(req, { params }) {
  await connectToDatabase();

  const { id } = await params;

  const { error } = await requireAdmin(req);
  if (error) return error;

  const deletedTag = await Tag.findByIdAndDelete(id);

  if (!deletedTag) {
    return Response.json(
      { message: "Tag not found" },
      { status: 404 }
    );
  }

  return Response.json({
    message: "Tag deleted successfully",
  });
}