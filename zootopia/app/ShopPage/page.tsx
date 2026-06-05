import mongoose from "mongoose";
import CategoryModel from "@/models/Category";
import TagGroupModel from "@/models/TagGroup";
import TagModel from "@/models/Tag";
import CompanyModel from "@/models/Company"; // Wymagane do rejestracji modelu w Mongoose

import KategorieClient from "./pageClient"; 

// Cache'owanie struktury drzewa kategorii i tagów na 5 minut (rzadko się zmieniają)
export const revalidate = 300; 

export default async function KategoriePage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const baseUri = process.env.MONGODB_URI;
  if (!baseUri) throw new Error("Brak MONGODB_URI w zmiennych środowiskowych!");

  // Połączenie z bazą mydb po dane strukturalne
  const conn = await mongoose.createConnection(baseUri, { dbName: "mydb" }).asPromise();

  // Rejestracja modeli na połączeniu, by zapobiec błędom Mongoose
  const Category = conn.models.Category || conn.model("Category", CategoryModel.schema, "categories");
  const TagGroup = conn.models.TagGroup || conn.model("TagGroup", TagGroupModel.schema, "taggroups");
  const Tag = conn.models.Tag || conn.model("Tag", TagModel.schema, "tags");
  // Rejestrujemy Company, aby populate na API działał bez problemu
  if (!conn.models.Company) conn.model("Company", CompanyModel.schema, "companies");

  // Pobieranie danych równolegle
  const [allCategoriesRaw, allTagGroupsRaw, allTagsRaw] = await Promise.all([
    Category.find({}).lean(),
    TagGroup.find({}).lean(),
    Tag.find({}).lean()
  ]);

  // Zamykamy połączenie serwerowe po pobraniu filtrów
  await conn.close();

  const resolvedSearchParams = await searchParams;
  const urlType = resolvedSearchParams.type || 'pies';

  // Serializacja kategorii
  const serializedCategories = allCategoriesRaw.map((cat: any) => ({
    _id: cat._id.toString(),
    name: cat.name,
    slug: cat.slug,
    parent: cat.parent ? cat.parent.toString() : null
  }));

  // Serializacja grup filtrów
  const serializedTagGroups = allTagGroupsRaw.map((group: any) => ({
    _id: group._id.toString(),
    name: group.name,
    category: group.category.toString()
  }));

  // Serializacja poszczególnych tagów + sortowanie alfabetyczne (w tym polskie znaki)
  const serializedTags = allTagsRaw
    .map((tag: any) => ({
      _id: tag._id.toString(),
      name: tag.name,
      group: tag.group.toString()
    }))
    .sort((a: any, b: any) => a.name.localeCompare(b.name, 'pl', { sensitivity: 'base' }));

  return (
    <KategorieClient
      currentType={urlType}
      allCategories={serializedCategories}
      allTagGroups={serializedTagGroups}
      allTags={serializedTags}
    />
  );
}