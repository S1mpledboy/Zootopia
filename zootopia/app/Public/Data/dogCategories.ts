import mokra from "@/app/Public/Images/piesMokra.png";
import sucha from "@/app/Public/Images/piesSucha.png";
import legowiska from "@/app/Public/Images/piesLegowiska.png";
import przekaski from "@/app/Public/Images/piesPrzekaski.png";

// Definiujemy poprawny interfejs danych strukturalnych dla kafelków
export interface DogCategoryItem {
  id: number;
  name: string;
  image: any;
  link: string;
}

// 🔥 Eksportujemy tablicę obiektów (To naprawia błąd o braku exported member 'items')
export const items: DogCategoryItem[] = [
  {
    id: 1,
    name: "Karma mokra",
    image: mokra,
    link: "/ShopPage?type=pies&category=karma&tag=Karma+mokra"
  },
  {
    id: 2,
    name: "Karma sucha",
    image: sucha,
    link: "/ShopPage?type=pies&category=karma&tag=Karma+sucha"
  },
  {
    id: 3,
    name: "Legowiska",
    image: legowiska,
    link: "/ShopPage?type=pies&category=legowiska"
  },
  {
    id: 4,
    name: "Przekąski",
    image: przekaski,
    link: "/ShopPage?type=pies&category=siano-i-przysmaki"
  }
];