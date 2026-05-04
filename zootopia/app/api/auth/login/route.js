import { login } from "@/controllers/authController";

export async function POST(req) {
  try {
    const body = await req.json();
    return login(body);
  } catch (error) {
    return Response.json(
      { message: "Invalid request" },
      { status: 400 }
    );
  }
}