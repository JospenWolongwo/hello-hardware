export type ProductLabel = 'SALE' | 'NOUVEAU' | 'SOLDE' | 'PROMO' | '-25% OFF' | null;

import type { StockAvailabilityStatus } from '../enums';

export interface Stock {
  id: string;
  quantity: number;
  price: number;
  characteristics?: Record<string, string>;
  discount?: number;
  isAvailable?: boolean;
  availabilityStatus?: StockAvailabilityStatus;
}

export interface Review {
  id?: string;
  username: string;
  comment: string;
  rating: number;
  title?: string;
  date?: Date | string;
  verified?: boolean;
  helpful?: number;
  notHelpful?: number;
  content?: string;
  imageUrl?: string;
}

export type Product = {
  id: string;
  name: string;
  brand?: string;
  sku?: string;
  specs: string;
  imageUrl: string;
  description?: string;
  shortDescription?: string;
  active?: boolean;
  minPrice?: number;
  maxPrice?: number;
  price: number;
  currency: string;
  slug?: string;
  label?: ProductLabel;
  labelColor?: string;
  inStock: boolean;
  extraAttributes?: Record<string, unknown>;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  category?: {
    id: string;
    name: string;
  };
  categoryName?: string;
  reviews?: Review[];
  liked?: boolean;
  rating?: number;
  inWishlist?: boolean;
  store?: {
    id: string;
    name: string;
  } | null;
  stocks?: Stock[];
  features?: string[];
  gallery?: string;
  galleryImages?: string[];
};
