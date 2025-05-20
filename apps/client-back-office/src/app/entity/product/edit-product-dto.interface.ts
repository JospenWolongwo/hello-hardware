export interface EditProductDto {
  name?: string;
  code?: string;
  brand?: string;
  gallery?: string;
  description?: string;
  status?: boolean;
  minPrice?: number;
  maxPrice?: number | null;
  store?: string;
  category?: string;
}
