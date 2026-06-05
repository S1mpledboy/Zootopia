import mongoose from "mongoose";
import CategoryModel from "@/models/Category";
import TagGroupModel from "@/models/TagGroup";
import TagModel from "@/models/Tag";

import KategorieClient from "./pageClient"; 

// Dane strukturalne kategorii i tagów zmieniają się rzadko - pamiętaj je na 5 minut
export const revalidate = 300; 

export default async function KategoriePage() {
  const baseUri = process.env.MONGODB_URI;
  if (!baseUri) throw new Error("Brak MONGODB_URI!");

  // Szybkie, tymczasowe połączenie tylko po strukturę filtrów
  const conn = await mongoose.createConnection(baseUri, { dbName: "mydb" }).asPromise();

  const [allCategoriesRaw, allTagGroupsRaw, allTagsRaw] = await Promise.all([
    conn.model("Category", CategoryModel.schema, "categories").find({}).lean(),
    conn.model("TagGroup", TagGroupModel.schema, "taggroups").find({}).lean(),
    conn.model("Tag", TagModel.schema, "tags").find({}).lean()
  ]);

  await conn.close();

  const serializedCategories = allCategoriesRaw.map((cat: any) => ({
    _id: cat._id.toString(),
    name: cat.name,
    slug: cat.slug,
    parent: cat.parent ? cat.parent.toString() : null
  }));

  const serializedTagGroups = allTagGroupsRaw.map((group: any) => ({
    _id: group._id.toString(),
    name: group.name,
    category: group.category.toString()
  }));

  const serializedTags = allTagsRaw
    .map((tag: any) => ({
      _id: tag._id.toString(),
      name: tag.name,
      group: tag.group.toString()
    }))
    .sort((a: any, b: any) => a.name.localeCompare(b.name, 'pl', { sensitivity: 'base' }));

  return (
    <KategorieClient
      allCategories={serializedCategories}
      allTagGroups={serializedTagGroups}
      allTags={serializedTags}
    />
  );
}