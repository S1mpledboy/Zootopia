import User from "@/models/User";
import { connectToDatabase } from "@/lib/mongodb.js";

export async function GET(req) {
  await connectToDatabase();

  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");

  if (!token) {
    return Response.json(
      { message: "Verification token is missing" },
      { status: 400 }
    );
  }

  const user = await User.findOne({
    emailVerificationToken: token,
    emailVerificationTokenExpires: { $gt: new Date() },
  }).select("+emailVerificationToken +emailVerificationTokenExpires");

  if (!user) {
    return Response.json(
      { message: "Invalid or expired token" },
      { status: 400 }
    );
  }

  user.isEmailVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationTokenExpires = undefined;
  user.deleteUnverifiedAt = undefined;

  await user.save();

  return Response.redirect(`${process.env.APP_URL}/MojeKonto`, 302);
}