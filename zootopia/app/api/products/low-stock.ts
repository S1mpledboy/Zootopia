import type { NextApiRequest, NextApiResponse } from "next";
import { connectToDatabase } from "@/lib/mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { client } = await connectToDatabase();
    const db = client.db("yourDatabaseName");

    const products = await db
      .collection("products")
      .find({})
      .sort({ stock: 1 })
      .toArray();

    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products" });
  }
}