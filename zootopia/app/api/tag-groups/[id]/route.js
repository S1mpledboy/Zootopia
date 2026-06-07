import { NextResponse } from 'next/server';
import { connectToDatabase } from "@/lib/mongodb";
import TagGroup from '@/models/TagGroup';

export async function PATCH(request, { params }) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const { name } = await request.json();
    const updated = await TagGroup.findByIdAndUpdate(id, { name }, { new: true });
    return NextResponse.json({ data: updated }, { status: 200 });
  } catch { return NextResponse.json({ status: 500 }); }
}

export async function DELETE(request, { params }) {
  try {
    await connectToDatabase();
    const { id } = await params;
    await TagGroup.findByIdAndDelete(id);
    return NextResponse.json({ message: "Usunięto." }, { status: 200 });
  } catch { return NextResponse.json({ status: 500 }); }
}