import Tag from "@/models/Tag";
import TagGroup from "@/models/TagGroup";
import Category from "@/models/Category";
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

  const categories = await Category.find().sort({ name: 1 });

  const groups = await TagGroup.find()
    .populate("category", "name slug parent")
    .sort({ name: 1 });

  const tags = await Tag.find()
    .populate("group", "name category")
    .sort({ name: 1 });

  return Response.json({
    categories,
    groups,
    tags,
  });
}

export async function POST(req) {
  await connectToDatabase();

  const { error } = await requireAdmin(req);
  if (error) return error;

  const body = await req.json();

  if (!body.name || !body.group) {
    return Response.json(
      { message: "Tag name and group are required" },
      { status: 400 }
    );
  }

  const tag = await Tag.create({
    name: body.name,
    group: body.group,
  });

  return Response.json(
    {
      message: "Tag created successfully",
      tag,
    },
    { status: 201 }
  );
}