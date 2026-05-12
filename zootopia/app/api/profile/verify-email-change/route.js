import User from "@/models/User";
import { connectToDatabase } from "@/lib/mongodb.js";

export async function GET(req) {
  await connectToDatabase();

  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");

  if (!token) {
    return Response.json(
      { message: "Email change token is missing" },
      { status: 400 }
    );
  }

  const user = await User.findOne({
    emailChangeToken: token,
    emailChangeTokenExpires: { $gt: new Date() },
  }).select("+emailChangeToken +emailChangeTokenExpires +pendingEmail");

  if (!user || !user.pendingEmail) {
    return Response.json(
      { message: "Invalid or expired email change token" },
      { status: 400 }
    );
  }

  const existingUser = await User.findOne({ email: user.pendingEmail });

  if (existingUser && existingUser._id.toString() !== user._id.toString()) {
    return Response.json(
      { message: "Email already in use" },
      { status: 409 }
    );
  }

  user.email = user.pendingEmail;
  user.pendingEmail = undefined;
  user.emailChangeToken = undefined;
  user.emailChangeTokenExpires = undefined;

  await user.save();

  const redirectUrl = process.env.APP_URL
    ? `${process.env.APP_URL}/profile?emailChanged=true`
    : "/profile?emailChanged=true";

  return Response.redirect(redirectUrl, 302);
}