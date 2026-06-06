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
  
    link: "/ShopPage?type=kot&category=karma-kot&tag=Karma+mokra"
  },
  {
    id: 2,
    name: "Karma sucha",
    image: sucha,

    link: "/ShopPage?type=kot&category=karma-kot&tag=Karma+sucha"
  },
  {
    id: 3,
    name: "Legowiska",
    image: legowiska,

    link: "/ShopPage?type=kot&category=legowiska-kot"
  },

];