import mongoose from "mongoose";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import PetModel from "@/models/Pet";
import ShelterModel from "@/models/Shelter";
import AdoptForm from "@/app/adoptuj/AdoptForm";

export const dynamic = "force-dynamic";

let cachedDb: any = null;
async function getDatabaseConnection() {
  const baseUri = process.env.MONGODB_URI;
  if (!baseUri) throw new Error("Brak MONGODB_URI!");
  if (cachedDb && mongoose.connection.readyState === 1) return cachedDb;
  cachedDb = await mongoose.connect(baseUri, { dbName: "mydb" });
  return cachedDb;
}

function formatAge(months: number): string {
  if (months < 12) return `${months} mies.`;
  const years = Math.floor(months / 12);
  const rem = months % 12;
  if (rem === 0)
    return `${years} ${years === 1 ? "rok" : years < 5 ? "lata" : "lat"}`;
  return `${years} ${years === 1 ? "rok" : "lata"} ${rem} mies.`;
}

const genderLabel: Record<string, string> = {
  male: "Samiec ♂",
  female: "Samica ♀",
};
const sizeLabel: Record<string, string> = {
  small: "Mały",
  medium: "Średni",
  large: "Duży",
};

type Props = { params: { id: string } };

export default async function PetPage({ params }: Props) {
  await getDatabaseConnection();

  let pet: any;
  try {
    pet = await PetModel.findById(params.id).lean();
  } catch {
    notFound();
  }
  if (!pet) notFound();

  const shelter = pet.shelterId
    ? await ShelterModel.findById(pet.shelterId).lean()
    : null;

  const petData = {
    _id: pet._id.toString(),
    name: pet.name,
    breed: pet.breed || "Mieszaniec",
    age: pet.age,
    gender: pet.gender,
    size: pet.size,
    description: pet.description,
    healthInfo: pet.healthInfo || "",
    image: pet.images?.[0] || "/fallback-image.png",
    status: pet.status,
    tags: pet.tags || [],
  };

  const shelterData = shelter
    ? {
        name: (shelter as any).name,
        address: (shelter as any).address,
        phone: (shelter as any).phone,
        email: (shelter as any).email,
      }
    : null;

  return (
    <main className="min-h-screen bg-[#fafffe]">
      <div className="max-w-5xl mx-auto px-6 pt-6">
        <nav className="flex items-center gap-2 text-sm text-gray-400">
          <Link href="/" className="hover:text-[#3d8b3d]">Strona główna</Link>
          <span>/</span>
          <Link href="/adoptuj" className="hover:text-[#3d8b3d]">Adoptuj pieska</Link>
          <span>/</span>
          <span className="text-gray-700 font-medium">{petData.name}</span>
        </nav>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Lewa kolumna */}
        <div>
          <div className="relative rounded-3xl overflow-hidden aspect-[4/3] shadow-md mb-6">
            <Image
              src={petData.image}
              alt={petData.name}
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { label: "Wiek", value: formatAge(petData.age) },
              { label: "Płeć", value: genderLabel[petData.gender] },
              { label: "Rozmiar", value: sizeLabel[petData.size] },
            ].map(({ label, value }) => (
              <div key={label} className="bg-[#edf7ed] rounded-2xl p-4 text-center">
                <p className="text-xs text-gray-500 mb-1">{label}</p>
                <p className="font-bold text-[#2d6a2d] text-sm">{value}</p>
              </div>
            ))}
          </div>

          {petData.healthInfo && (
            <div className="bg-white border border-gray-100 rounded-2xl p-5 mb-6 shadow-sm">
              <h3 className="font-bold text-gray-800 mb-2 text-sm">🏥 Zdrowie</h3>
              <p className="text-sm text-gray-600">{petData.healthInfo}</p>
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            {petData.tags.map((tag: string) => (
              <span key={tag} className="text-sm bg-[#edf7ed] text-[#2d6a2d] px-3 py-1.5 rounded-full font-medium">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Prawa kolumna */}
        <div>
          <div className="mb-8">
            <p className="text-[#3d8b3d] font-semibold text-sm mb-1">
              {petData.breed}
            </p>
            <h1 className="text-4xl font-black text-gray-900 mb-4">{petData.name}</h1>
            <p className="text-gray-600 leading-relaxed">{petData.description}</p>
          </div>

          {shelterData && (
            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm mb-8">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">Schronisko</p>
              <p className="font-bold text-gray-800 mb-1">{shelterData.name}</p>
              <p className="text-sm text-gray-500 mb-3">{shelterData.address}</p>
              <div className="flex gap-3">
                <a href={`tel:${shelterData.phone.replace(/\s/g, "")}`}
                  className="flex-1 text-center text-sm font-semibold bg-[#edf7ed] text-[#2d6a2d] px-4 py-2 rounded-xl hover:bg-[#d4edd4] transition-colors">
                  📞 Zadzwoń
                </a>
                <a href={`mailto:${shelterData.email}`}
                  className="flex-1 text-center text-sm font-semibold bg-[#edf7ed] text-[#2d6a2d] px-4 py-2 rounded-xl hover:bg-[#d4edd4] transition-colors">
                  ✉️ E-mail
                </a>
              </div>
            </div>
          )}

          {petData.status === "available" ? (
            <div>
              <h2 className="text-xl font-black text-gray-900 mb-4">Złóż wniosek o adopcję</h2>
              <AdoptForm petId={petData._id} petName={petData.name} />
            </div>
          ) : (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-center">
              <p className="text-2xl mb-2">🐾</p>
              <p className="font-bold text-amber-700">{petData.name} jest już zarezerwowany/a</p>
              <Link href="/adoptuj"
                className="mt-4 inline-block bg-[#3d8b3d] text-white font-bold px-6 py-2.5 rounded-xl text-sm hover:bg-[#2d6a2d] transition-colors">
                Zobacz inne psiaki
              </Link>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}