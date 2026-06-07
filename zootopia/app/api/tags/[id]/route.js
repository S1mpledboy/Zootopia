import { NextResponse } from 'next/server';
import { connectToDatabase } from "@/lib/mongodb";
import Tag from '@/models/Tag';

export async function PATCH(request, { params }) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const { name } = await request.json();
    const updated = await Tag.findByIdAndUpdate(id, { name }, { new: true });
    return NextResponse.json({ data: updated }, { status: 200 });
  } catch { return NextResponse.json({ status: 500 }); }
}

export async function DELETE(request, { params }) {
  try {
    await connectToDatabase();
    const { id } = await params;
    await Tag.findByIdAndDelete(id);
    return NextResponse.json({ message: "Usunięto." }, { status: 200 });
  } catch { return NextResponse.json({ status: 500 }); }
}