import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import validator from "validator";
import crypto from "crypto";

import { sendVerificationEmail } from "@/lib/mail";
import User from "@/models/User";
import { connectToDatabase } from "@/lib/mongodb.js";

function generateToken(user) {
  return jwt.sign(
    {
      userId: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
}

export async function register(data) {
  await connectToDatabase();

  const { email, password } = data;

  if (!email || !password) {
    return Response.json(
      { message: "Email and password required" },
      { status: 400 }
    );
  }

  if (!validator.isEmail(email)) {
    return Response.json(
      { message: "Invalid email" },
      { status: 400 }
    );
  }

  if (password.length < 6) {
    return Response.json(
      { message: "Password too short" },
      { status: 400 }
    );
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return Response.json(
      { message: "User already exists" },
      { status: 409 }
    );
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const verificationToken = crypto.randomBytes(32).toString("hex");

  const user = await User.create({
    email,
    password: hashedPassword,
    role: "user",
    isEmailVerified: false,
    emailVerificationToken: verificationToken,
    emailVerificationTokenExpires: new Date(Date.now() + 60 * 60 * 1000),

    deleteUnverifiedAt: new Date(Date.now() + 60 * 60 * 1000),
  });

  await sendVerificationEmail(user.email, verificationToken);

  return Response.json(
    {
      message: "User registered successfully. Please verify your email.",
    },
    { status: 201 }
  );
}

export async function login(data) {
  await connectToDatabase();

  const { email, password } = data;

  if (!email || !password) {
    return Response.json(
      { message: "Email and password required" },
      { status: 400 }
    );
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return Response.json(
      { message: "Invalid credentials" },
      { status: 401 }
    );
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return Response.json(
      { message: "Invalid credentials" },
      { status: 401 }
    );
  }

  if (!user.isEmailVerified) {
    return Response.json(
      { message: "Please verify your email before login" },
      { status: 403 }
    );
  }

  const token = generateToken(user);

  return Response.json({
    message: "Login successful",
    token,
    user: {
      id: user._id,
      email: user.email,
      role: user.role,
    },
  });
}

export async function getMe(userId) {
  await connectToDatabase();

  const user = await User.findById(userId);

  if (!user) {
    return Response.json(
      { message: "User not found" },
      { status: 404 }
    );
  }
  if (!user.isActive) {
  return Response.json(
    { message: "Account is inactive" },
    { status: 403 }
  );
}

  return Response.json({
    user: {
      id: user._id,
      email: user.email,
      role: user.role,
      isEmailVerified: user.isEmailVerified,
    },
  });
}