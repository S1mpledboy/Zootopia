import User from "@/models/User";
import { getAuthUser } from "@/middleware/auth";
import { connectToDatabase } from "@/lib/mongodb";

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

  const allowedFields = [
    "firstName",
    "lastName",
    "country",
    "street",
    "city",
    "postalCode",
    "phone",
  ];

  const updateData = {};

  allowedFields.forEach((field) => {
    if (body[field] !== undefined) {
      updateData[field] = body[field];
    }
  });

  const updatedUser = await User.findByIdAndUpdate(
    user._id,
    updateData,
    { new: true }
  );

  return Response.json({
    message: "Profile updated successfully",
    user: {
      id: updatedUser._id,
      email: updatedUser.email,
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