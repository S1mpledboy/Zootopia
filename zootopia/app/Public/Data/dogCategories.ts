import mokra from "@/app/Public/Images/piesMokra.png";
import sucha from "@/app/Public/Images/piesSucha.png";
import legowiska from "@/app/Public/Images/piesLegowiska.png";
import przekaski from "@/app/Public/Images/piesPrzekaski.png";

export const items = [
  {
    id: 1,
    name: "Karma mokra",
    image: mokra,
    // Przenosi do sekcji Pies -> Podkategoria Karma -> Zaznacza filtr "Karma mokra"
    link: "/ShopPage?type=pies&category=karma&tag=Karma+mokra"
  },
  {
    id: 2,
    name: "Karma sucha",
    image: sucha,
    // Przenosi do sekcji Pies -> Podkategoria Karma -> Zaznacza filtr "Karma sucha"
    link: "/ShopPage?type=pies&category=karma&tag=Karma+sucha"
  },
  {
    id: 3,
    name: "Legowiska",
    image: legowiska,
    // Przenosi do sekcji Pies -> Podkategoria Legowiska
    link: "/ShopPage?type=pies&category=legowiska"
  },
  {
    id: 4,
    name: "Przekąski",
    image: przekaski,
    // Przenosi do sekcji Pies -> Podkategoria Siano i przysmaki (lub jak nazwałaś przekąski w bazie)
    link: "/ShopPage?type=pies&category=siano-i-przysmaki"
  },
];