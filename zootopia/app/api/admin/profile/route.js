import bcrypt from "bcryptjs";
import crypto from "crypto";
import validator from "validator";

import User from "@/models/User";
import { getAuthUser } from "@/middleware/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { sendEmailChangeVerificationEmail } from "@/lib/mail";

export async function GET(req) {
  await connectToDatabase();

  const user = await getAuthUser(req);

  if (!user) {
    return Response.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  if (user.role !== "admin") {
    return Response.json(
      { message: "Forbidden: admin only" },
      { status: 403 }
    );
  }

  return Response.json({
    user: {
      id: user._id,
      email: user.email,
      pendingEmail: user.pendingEmail,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
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

  if (user.role !== "admin") {
    return Response.json(
      { message: "Forbidden: admin only" },
      { status: 403 }
    );
  }

  const body = await req.json();

  const updateData = {};

  if (body.firstName !== undefined) {
    updateData.firstName = body.firstName;
  }

  if (body.lastName !== undefined) {
    updateData.lastName = body.lastName;
  }

  if (body.phone !== undefined) {
    updateData.phone = body.phone;
  }

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

  if (body.oldPassword || body.newPassword) {
    if (!body.oldPassword || !body.newPassword) {
      return Response.json(
        { message: "Old password and new password are required" },
        { status: 400 }
      );
    }

    if (body.newPassword.length < 6) {
      return Response.json(
        { message: "New password must be at least 6 characters" },
        { status: 400 }
      );
    }

    if (body.oldPassword === body.newPassword) {
      return Response.json(
        { message: "New password must be different from old password" },
        { status: 400 }
      );
    }

    const adminWithPassword = await User.findById(user._id).select("+password");

    const isOldPasswordCorrect = await bcrypt.compare(
      body.oldPassword,
      adminWithPassword.password
    );

    if (!isOldPasswordCorrect) {
      return Response.json(
        { message: "Old password is incorrect" },
        { status: 400 }
      );
    }

    updateData.password = await bcrypt.hash(body.newPassword, 12);
  }

  if (Object.keys(updateData).length === 0) {
    return Response.json(
      { message: "No data to update" },
      { status: 400 }
    );
  }

  const updatedAdmin = await User.findByIdAndUpdate(
    user._id,
    updateData,
    {
      new: true,
      runValidators: true,
    }
  );

  return Response.json({
    message:
      body.email && body.email !== user.email
        ? "Admin profile updated. Please verify new email."
        : "Admin profile updated successfully",
    user: {
      id: updatedAdmin._id,
      email: updatedAdmin.email,
      pendingEmail: updatedAdmin.pendingEmail,
      role: updatedAdmin.role,
      firstName: updatedAdmin.firstName,
      lastName: updatedAdmin.lastName,
      phone: updatedAdmin.phone,
    },
  });
}