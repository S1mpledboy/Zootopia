
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import validator from "validator";

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

  const user = await User.create({
    email,
    password: hashedPassword,
    role: "user",
  });

  const token = generateToken(user);

  return Response.json(
    {
      message: "User created",
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
      },
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

  return Response.json({
    user: {
      id: user._id,
      email: user.email,
      role: user.role,
    },
  });
}