import categoryNameStyle from './categoryName.module.css';

import Image from "next/image";
import Hello from "../Components/Hello";
import Link from "next/link";
import ItemsBtn from "@/Components/ItemsBtn";
import Category from "../Components/category";
import Hero from "../Components/heroSection";
import CategoryName from "../Components/categoryName";
import DogCategories from "./PageLists/dogCategoriesList";
import CatCategoreis from "./PageLists/catCategoriesList";
import PromotionList from "./PageLists/promotionList";
import BestSellersList from "./PageLists/bestsellersList";
import Newsletter from '../Components/newsletter';


const Home = () =>{
    return(
        <main>
            <Category />
            <Hero />
            <CategoryName name="Promocje"/>
            <PromotionList />
            <CategoryName name="Top kategorie dla psa"/>
            <DogCategories />
            <CategoryName name="Top kategorie dla kota"/>
            <CatCategoreis />
            <CategoryName name="Bestsellery"/>
            <BestSellersList />
            <Newsletter />
        </main>
    );
}

export default Home