import { NextResponse } from 'next/server';
import { connectToDatabase } from "@/lib/mongodb";
import Tag from '@/models/Tag';

export async function POST(request) {
  try {
    await connectToDatabase();
    const { name, group } = await request.json();
    const newTag = await Tag.create({ name, group });
    return NextResponse.json({ data: newTag }, { status: 201 });
  } catch { return NextResponse.json({ status: 500 }); }
}