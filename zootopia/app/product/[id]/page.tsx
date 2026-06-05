import Image from "next/image";
import styles from "./product.module.css";

import Accordion from "./productInfo";
import ReviewsSection from "./Reviews";
import Carousel from "./photoCarousel";
import ProductActions from "./ProductActions"; 
import HeartButton from "./HeartButton"; 
import RecommendedProducts from "./RecommendedProducts";
import "@/models/Company";
import "@/models/Category";

import ReviewModel from "@/models/Review"; 
import { connectToDatabase } from "@/lib/mongodb";
import Product from "@/models/Product";
import { Types } from "mongoose";

import starFull from "@/app/Public/Images/tabler-icon-star.svg";
import starHalf from "@/app/Public/Images/star-half.svg";
import starEmpty from "@/app/Public/Images/empty-star.svg";

type ProductPageProps = {
  params: Promise<{
    id: string;
  }>;
};

const getServerStars = (rating: number, className: string) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    let currentIcon = starFull;
    if (i > rating) {
      currentIcon = i - rating <= 0.5 ? starHalf : starEmpty;
    }
    stars.push(
      <Image key={i} className={className} src={currentIcon} alt="star" width={24} height={24} />
    );
  }
  return stars;
};

export default async function ProductPage({
  params,
}: ProductPageProps) {

  const { id } = await params;

  await connectToDatabase();

  if (!Types.ObjectId.isValid(id)) {
    return <div>Nieprawidłowe ID produktu</div>;
  }

  const product = await Product.findById(id)
    .populate("category")
    .populate("company")
    .lean();

  if (!product) {
    return <div>Produkt nie istnieje</div>;
  }

  const rawReviews = await ReviewModel.find({ product: new Types.ObjectId(id) }).lean();
  
  const totalReviews = rawReviews.length;
  const avgRating = totalReviews > 0 
    ? Number((rawReviews.reduce((acc: number, r: any) => acc + r.rating, 0) / totalReviews).toFixed(1))
    : 0;

  const categoryId = (product.category as any)?._id || product.category;

  const rawRecommended = await Product.find({
    category: categoryId,
    _id: { $ne: new Types.ObjectId(id) },
    isActive: true,
    stock: { $gt: 0 },
  })
    .populate("company")
    .lean();

  const shuffled = rawRecommended.sort(() => Math.random() - 0.5).slice(0, 4);

  const hasValidPromo = product.promoPrice !== undefined && product.promoPrice !== null;

  return (
    <div className={styles.kategorie}>
      <div className={styles.produktKaruzelaParent}>

        {/* LEWA KOLUMNA - CAROUSEL */}
        <div className={styles.produktKaruzela}>
          <Carousel images={product.images || []} />
        </div>

        {/* PRAWA KOLUMNA */}
        <div className={styles.frameGroup}>

          {/* KATEGORIA + SERCE */}
          <div className={styles.frameContainer}>
            <div className={styles.alphawolfParent}>
              <div className={styles.alphawolf}>
                {product.company?.name || "Zootopia"}
              </div>
              
              <HeartButton productId={product._id.toString()} />
              
            </div>
            <div className={styles.divider} />
          </div>

          {/* NAZWA */}
          <div className={styles.alphawolf400gBezzboowaMokrWrapper}>
            <h1 className={styles.alphawolf400gBezzboowa}>
              {product.name}
            </h1>
          </div>

          <div className={styles.divider} />

          {/* GWIAZDKI */}
          <div className={styles.frameDiv}>
            <div className={styles.tablerIconStarParent}>
              {getServerStars(avgRating, styles.tablerIconStar)}
            </div>
            <div className={styles.div}>({totalReviews})</div>
          </div>

          {/* CENA */}
          <div className={styles.frameParent2}>
            <div className={styles.alphawolfParent} style={{ alignItems: 'baseline', justifyContent: 'flex-start', gap: '12px' }}>
              <div className={`${styles.z} ${hasValidPromo ? styles.przekreslona : ""}`}>
                {product.price} zł
              </div>

              {hasValidPromo && (
                <b className={styles.cenaPromocyjna}>
                  {product.promoPrice} zł
                </b>
              )}

              <div className={styles.zkg} style={{ marginLeft: 'auto' }}>
                Stan: {product.stock}
              </div>
            </div>

            <div className={styles.najniszaCenaZ30DniPrzedParent}>
              <div className={styles.najniszaCenaZ}>
                Dostępny w magazynie
              </div>
            </div>

            <div className={styles.cenaObowizujeDo10052026Wrapper}>
              <div className={styles.div}>
                Wysyłka w ciągu 24h
              </div>
            </div>
          </div>

          <div className={styles.divider} />

          {/* ILOŚĆ + KOSZYK */}
          <div className={styles.frameWrapper}>
            <ProductActions productId={product._id.toString()} />
          </div>
        </div>
      </div>

      {/* DÓŁ */}
      <div className={styles.vectorParent}>
        <div className={styles.dividerFull} />

        <Accordion
          title="Opis"
          content={product.description || "Brak opisu produktu"}
        />

        <Accordion
          title="Składniki"
          content={product.ingredients || "Brak informacji o składnikach."}
        />

        <Accordion
          title="Dodatkowe informacje"
          content={product.additionalInfo || "Brak dodatkowych informacji."}
        />

        <ReviewsSection productId={id} initialReviews={JSON.parse(JSON.stringify(rawReviews))} />

        <RecommendedProducts products={JSON.parse(JSON.stringify(shuffled))} />
      </div>
    </div>
  );
}