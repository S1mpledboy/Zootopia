import mokra from "@/app/Public/Images/kotMokra.png";
import sucha from "@/app/Public/Images/kotSucha.png";
import legowiska from "@/app/Public/Images/kotZwirki.png";
import przekaski from "@/app/Public/Images/kotPrzekaski.png";

export interface CatCategoryItem {
  id: number;
  name: string;
  image: any;
  link: string;
}

export const items: CatCategoryItem[] = [
  {
    id: 1,
    name: "Karma mokra",
    image: mokra,
    // Przenosi do sekcji Kot -> Kategoria Karma Kot -> Aktywuje filtr "Karma mokra"
    link: "/ShopPage?type=kot&category=karma-kot&tag=Karma+mokra"
  },
  {
    id: 2,
    name: "Karma sucha",
    image: sucha,
    // Przenosi do sekcji Kot -> Kategoria Karma Kot -> Aktywuje filtr "Karma sucha"
    link: "/ShopPage?type=kot&category=karma-kot&tag=Karma+sucha"
  },
  {
    id: 3,
    name: "Legowiska",
    image: legowiska,
    // Przenosi do sekcji Kot -> Kategoria Legowiska Kot
    link: "/ShopPage?type=kot&category=legowiska-kot"
  },
  {
    id: 4,
    name: "Przekąski",
    image: przekaski,
    // Przenosi do sekcji Kot -> Kategoria Zabawki Kot (lub jak nazwałaś przekąski/przysmaki u kota w bazie)
    link: "/ShopPage?type=kot&category=zabawki-kot"
  }
];