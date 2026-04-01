import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);

    const result = await db.collection("test").insertOne({
      message: "MongoDB connected",
      createdAt: new Date(),
    });

    return Response.json({
      ok: true,
      insertedId: result.insertedId,
    });
  } catch (error) {
    return Response.json(
      {
        ok: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}