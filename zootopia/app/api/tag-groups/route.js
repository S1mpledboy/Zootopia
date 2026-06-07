import { NextResponse } from 'next/server';
import { connectToDatabase } from "@/lib/mongodb";
import TagGroup from '@/models/TagGroup';

export async function POST(request) {
  try {
    await connectToDatabase();
    const { name, category } = await request.json();
    const newGroup = await TagGroup.create({ name, category });
    return NextResponse.json({ data: newGroup }, { status: 201 });
  } catch {
    return NextResponse.json({ message: "Błąd serwera." }, { status: 500 });
  }
}