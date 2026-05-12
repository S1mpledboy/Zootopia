import { BestsellersItems } from "@/app/Public/Data/bestsellerItems";
import { PromoItems } from "@/app/Public/Data/promoItems";
import CatName from "@/Components/categoryName";
import styles from "@/app/modulesCSS/categoryItem.module.css";

const ItemDetails = async ({ params }: { params: Promise<{ id: string }>}) =>{
    const { id } =  await params;
    const allItems = [...PromoItems, ...BestsellersItems];
    const product = allItems.find((item) => item.id === Number(id));
    if (!product){
        return <div>Produkt nie istnieje</div>
    }

    return (
        <div>
            <h1>Produkt o id #{id}</h1>
            <CatName name = {product.brandName} />
            <img src={product.image.src} className={styles.frameChild} width={180} height={170} sizes="100vw" alt="" />
            <h1>{product.productName}</h1>
            <h1>Cena: {product.price}zł</h1>
            {product.promoPrice && <h1>Cena promocyjna: {product.promoPrice} zł</h1>}
        </div>
    )
}

export default ItemDetails