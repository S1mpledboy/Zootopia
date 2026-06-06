import Category from "@/models/Category";
import { getAuthUser } from "@/middleware/auth";
import { connectToDatabase } from "@/lib/mongodb";

function slugify(value) {
  return value
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[ąćęłńóśźż]/g, (char) => {
      const map = {
        ą: "a",
        ć: "c",
        ę: "e",
        ł: "l",
        ń: "n",
        ó: "o",
        ś: "s",
        ź: "z",
        ż: "z",
      };

      return map[char] || char;
    })
    .replace(/[^a-z0-9-]/g, "");
}

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

  const categories = await Category.find()
    .populate("parent", "name slug")
    .sort({ name: 1 });

  return Response.json({ categories });
}

export async function POST(req) {
  await connectToDatabase();

  const { error } = await requireAdmin(req);
  if (error) return error;

  const body = await req.json();

  if (!body.name) {
    return Response.json(
      { message: "Category name is required" },
      { status: 400 }
    );
  }

  const category = await Category.create({
    name: body.name,
    slug: body.slug || slugify(body.name),
    parent: body.parent || null,
  });

  return Response.json(
    {
      message: "Category created successfully",
      category,
    },
    { status: 201 }
  );
}