import User from "@/models/User";
import { getAuthUser } from "@/middleware/auth";
import { connectToDatabase } from "@/lib/mongodb";
import crypto from "crypto";
import validator from "validator";
import { sendEmailChangeVerificationEmail } from "@/lib/mail";

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
      firstName: user.firstName,
      lastName: user.lastName,
      country: user.country,
      street: user.street,
      city: user.city,
      postalCode: user.postalCode,
      phone: user.phone,
    },
  });
}

export async function PATCH(req) {
  await connectToDatabase();

  const user = await getAuthUser(req);

  if (!user) {
    return Response.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  const body = await req.json();

  const updateData = {};

  const allowedFields = [
    "firstName",
    "lastName",
    "country",
    "street",
    "city",
    "postalCode",
    "phone",
  ];

  allowedFields.forEach((field) => {
    if (body[field] !== undefined) {
      updateData[field] = body[field];
    }
  });

  if (body.email && body.email !== user.email) {
    if (!validator.isEmail(body.email)) {
      return Response.json(
        { message: "Invalid email" },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({ email: body.email });

    if (existingUser) {
      return Response.json(
        { message: "Email already in use" },
        { status: 409 }
      );
    }

    const emailChangeToken = crypto.randomBytes(32).toString("hex");

    updateData.pendingEmail = body.email;
    updateData.emailChangeToken = emailChangeToken;
    updateData.emailChangeTokenExpires = new Date(Date.now() + 60 * 60 * 1000);

    await sendEmailChangeVerificationEmail(body.email, emailChangeToken);
  }

  const updatedUser = await User.findByIdAndUpdate(
    user._id,
    updateData,
    { new: true }
  );

  return Response.json({
    message: body.email && body.email !== user.email
      ? "Profile updated. Please verify your new email."
      : "Profile updated successfully",
    user: {
      id: updatedUser._id,
      email: updatedUser.email,
      pendingEmail: updatedUser.pendingEmail,
      role: updatedUser.role,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      country: updatedUser.country,
      street: updatedUser.street,
      city: updatedUser.city,
      postalCode: updatedUser.postalCode,
      phone: updatedUser.phone,
    },
  });
}
