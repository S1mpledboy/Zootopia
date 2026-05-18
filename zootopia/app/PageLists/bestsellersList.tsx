import styles from '@/app/modulesCSS/promotionList.module.css';
import PromotionItem from '../ItemBlocks/promotionItem';
import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

type Product = {
  _id: number;
  brandName: string;
  productName: string;
  price: number;
  image: string;
  stock: number;
};

export default async function Kategorie() {
  const { client } = await connectToDatabase();


  const products = (await client
    .collection("products")
    .find({})
    .sort({ stock: 1 })
    .toArray()) as Product[];

  return (
    <div className={styles.kategorie}>
      {products.map((item) => (
        <PromotionItem
          key={item._id.toString()}
          id={item._id}
          brandName={item.brandName}
          productName={item.productName}
          price={item.price}
          image={item.image}
        />
      ))}
    </div>
  );
}