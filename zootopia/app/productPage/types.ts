// types.ts
export interface ProductProps {
  brand: string;
  fullName: string;
  mainImage: string;
  gallery: string[];
  price: number;
  pricePerKg: string;
  oldPrice?: number;
  promoEndDate?: string;
  rating: number;
  reviewsCount: number;
  description: string;
  ingredients: {
    intro: string;
    list: string[];
  };
  additionalInfo: string[];
  reviews: Array<{
    author: string;
    rating: number;
    date: string;
    comment: string;
  }>;
}