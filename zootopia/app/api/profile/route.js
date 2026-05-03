import { getAuthUser } from "@/middleware/auth";

export async function GET(req) {
  const user = await getAuthUser(req);

  if (!user) {
    return Response.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  return Response.json({
    user: {
      id: user._id,
      email: user.email,
      role: user.role,
    },
  });
}