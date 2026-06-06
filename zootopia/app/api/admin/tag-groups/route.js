import TagGroup from "@/models/TagGroup";
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

export async function GET(req) {
  await connectToDatabase();

  const { error } = await requireAdmin(req);
  if (error) return error;

  const groups = await TagGroup.find()
    .populate("category", "name slug parent")
    .sort({ name: 1 });

  return Response.json({ groups });
}

export async function POST(req) {
  await connectToDatabase();

  const { error } = await requireAdmin(req);
  if (error) return error;

  const body = await req.json();

  if (!body.name || !body.category) {
    return Response.json(
      { message: "Group name and category are required" },
      { status: 400 }
    );
  }

  const group = await TagGroup.create({
    name: body.name,
    category: body.category,
  });

  return Response.json(
    {
      message: "Tag group created successfully",
      group,
    },
    { status: 201 }
  );
}