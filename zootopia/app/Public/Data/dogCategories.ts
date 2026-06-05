import mokra from "@/app/Public/Images/piesMokra.png";
import sucha from "@/app/Public/Images/piesSucha.png";
import legowiska from "@/app/Public/Images/piesLegowiska.png";
import przekaski from "@/app/Public/Images/piesPrzekaski.png";

// Definiujemy czysty interfejs danych dla kafelków, bez kodu HTML
export interface DogCategoryItem {
  id: number;
  name: string;
  image: any;
  link: string;
}

export const items: DogCategoryItem[] = [
  {
    id: 1,
    name: "Karma mokra",
    image: mokra,
    // Przenosi do sekcji Pies -> Kategoria Karma -> Aktywuje filtr "Karma mokra"
    link: "/ShopPage?type=pies&category=karma&tag=Karma+mokra"
  },
  {
    id: 2,
    name: "Karma sucha",
    image: sucha,
    // Przenosi do sekcji Pies -> Kategoria Karma -> Aktywuje filtr "Karma sucha"
    link: "/ShopPage?type=pies&category=karma&tag=Karma+sucha"
  },
  {
    id: 3,
    name: "Legowiska",
    image: legowiska,
    // Przenosi do sekcji Pies -> Kategoria Legowiska
    link: "/ShopPage?type=pies&category=legowiska"
  },
  {
    id: 4,
    name: "Przekąski",
    image: przekaski,
    // Przenosi do sekcji Pies -> Kategoria Siano i przysmaki
    link: "/ShopPage?type=pies&category=siano-i-przysmaki"
  }
];