import { connectToDatabase } from "@/lib/mongodb";
import { getAuthUser } from "@/middleware/auth";

export async function GET(req: Request) {
  try {
    await connectToDatabase();
    const user = await getAuthUser(req);
    

    return Response.json({ isLoggedIn: !!user });
  } catch (error) {
    return Response.json({ isLoggedIn: false });
  }
}