export interface CreateProductDto {
  name: string;
  brand: string;
  gallery: string;
  description: string;
  minPrice: number;
  maxPrice: number | null;
  store: string;
  category: string;
  active: boolean;
  pictures: string[];
  extraAttributes: {
    characteristics: string[];
  };
}
