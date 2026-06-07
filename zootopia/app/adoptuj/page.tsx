import mongoose from "mongoose";
import PetModel from "@/models/Pet";
import ShelterModel from "@/models/Shelter";
import PetCard from "@/app/adoptuj/PetCard";
import styles from "./adoptuj.module.css";

export const dynamic = "force-dynamic";

let cachedDb: typeof mongoose | null = null;

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
  if (rem === 0) {
    return `${years} ${years === 1 ? "rok" : years < 5 ? "lata" : "lat"}`;
  }
  return `${years} ${years === 1 ? "rok" : "lata"} ${rem} mies.`;
}

interface ShelterData {
  name: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  description: string;
}

interface PetItem {
  _id: string;
  name: string;
  breed: string;
  age: number;
  ageLabel: string;
  gender: string;
  size: string;
  description: string;
  image: string;
  status: string;
  tags: string[];
}

export default async function AdoptujPage() {
  await getDatabaseConnection();

  const [rawPets, shelter] = await Promise.all([
    PetModel.find({ isActive: true, status: { $ne: "adopted" } })
      .sort({ createdAt: -1 })
      .lean(),
    ShelterModel.findOne({}).lean(),
  ]);

  const pets: PetItem[] = (rawPets as any[]).map((p) => ({
    _id: p._id.toString(),
    name: p.name,
    breed: p.breed || "Mieszaniec",
    age: p.age,
    ageLabel: formatAge(p.age),
    gender: p.gender,
    size: p.size,
    description: p.description,
    image: Array.isArray(p.images) && p.images.length > 0 ? p.images[0] : "/fallback-image.png",
    status: p.status,
    tags: p.tags || [],
  }));

  const s = shelter as any;
  const shelterData: ShelterData | null = s
    ? {
        name: s.name,
        address: s.address,
        phone: s.phone,
        email: s.email,
        website: s.website || "",
        description: s.description || "",
      }
    : null;

  const availableCount = pets.filter((p) => p.status === "available").length;

  return (
    <main className={styles.page}>

      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroPill}>
            <span>🐾</span>
            <span className={styles.heroPillText}>Adoptuj, nie kupuj</span>
          </div>

          <h1 className={styles.heroTitle}>
            Znajdź swojego
            <br />
            <span className={styles.heroTitleGreen}>czworonożnego przyjaciela</span>
          </h1>

          <p className={styles.heroDesc}>
            W naszym schronisku czeka wiele psiaków gotowych na nowy dom i bezwarunkową miłość.
          </p>

          {shelterData !== null && (
            <div className={styles.infoBar}>
              <div>
                <p className={styles.infoBarLabel}>Schronisko</p>
                <p className={styles.infoBarValue}>{shelterData.name}</p>
              </div>
              <div className={styles.infoBarDivider} />
              <div>
                <p className={styles.infoBarLabel}>Telefon</p>
                <a 
                  href={"tel:" + shelterData.phone.replace(/\s/g, "")}
                  className={styles.infoBarValueGreen}
                >
                  {shelterData.phone}
                </a>
              </div>
              <div className={styles.infoBarDivider} />
              <div>
                <p className={styles.infoBarLabel}>Dostępnych</p>
                <p className={styles.infoBarValue}>{availableCount} psiaków</p>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className={styles.gridSection}>
        {pets.length === 0 ? (
          <div className={styles.empty}>
            <p className={styles.emptyIcon}>🐾</p>
            <p className={styles.emptyTitle}>Brak psiaków do adopcji w tej chwili</p>
            <p className={styles.emptyText}>Zajrzyj do nas wkrótce!</p>
          </div>
        ) : (
          <div className={styles.grid}>
            {pets.map((pet) => (
              <PetCard key={pet._id} pet={pet} />
            ))}
          </div>
        )}

        {shelterData !== null && (
          <div className={styles.shelterBlock}>
            <div className={styles.shelterInfo}>
              <h2 className={styles.shelterName}>{shelterData.name}</h2>
              <p className={styles.shelterDesc}>{shelterData.description}</p>
              <div className={styles.shelterDetails}>
                <div className={styles.shelterRow}>
                  <span>📍</span>
                  <span>{shelterData.address}</span>
                </div>
                <div className={styles.shelterRow}>
                  <span>📞</span>
                  <a 
                    href={"tel:" + shelterData.phone.replace(/\s/g, "")}
                    className={styles.shelterLink}
                  >
                    {shelterData.phone}
                  </a>
                </div>
                <div className={styles.shelterRow}>
                  <span>✉️</span>
                  <a 
                    href={"mailto:" + shelterData.email}
                    className={styles.shelterLink}
                  >
                    {shelterData.email}
                  </a>
                </div>
                {shelterData.website !== "" && (
                  <div className={styles.shelterRow}>
                    <span>🌐</span>
                    <a 
                      href={shelterData.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.shelterLinkMuted}
                    >
                      {shelterData.website.replace("https://", "")}
                    </a>
                  </div>
                )}
              </div>
            </div>
            
            <a 
              href={"mailto:" + shelterData.email}
              className={styles.shelterBtn}
            >
              Napisz do schroniska
            </a>
          </div>
        )}
      </section>

    </main>
  );
}