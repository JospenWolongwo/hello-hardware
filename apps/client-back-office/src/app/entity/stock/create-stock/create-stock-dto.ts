import { StockAvailability } from '../../../shared/enums/stock-availability.enum';

export interface CreateStockDto {
  productId: string;
  keepingUnit: string;
  quantity: number;
  price: number;
  characteristics: { [key: string]: string };
  availabilityStatus: string;
  guarantee?: { amount: number; timeUnit: string };
  discounts?: CreateDiscountDto[];
  description?: { shortDescription: string; longDescription: string };
}

export interface CreateDiscountDto {
  percentage: number;
  validUntil?: string;
}

// Define a type for attributes that could have nested structure or simple value
export type AttributeValue = string | { inputCtrl: string; pickerCtrl?: string } | number | undefined;

// Define an interface for the attributes object
export interface AttributesObject {
  [key: string]: AttributeValue;
}

// Define an interface for the result object to improve type safety
interface ResultObject {
  attributes?: AttributesObject;
  characteristics?: { [key: string]: string };
  keepingUnit?: string;
  quantity?: number;
  price?: number;
  availabilityStatus?: string;
  guarantee?: { amount: number; timeUnit: string };
  discounts?: CreateDiscountDto[];
  description?: { shortDescription: string; longDescription: string };
}

// Helper function to extract characteristics from attributes if not directly present
function extractCharacteristicsFromAttributes(result: ResultObject): Record<string, string> {
  if (!result.attributes) {
    return {};
  }

  const characteristics: Record<string, string> = {};

  for (const key in result.attributes) {
    const attribute = result.attributes[key];
    if (attribute !== null && typeof attribute === 'object' && 'inputCtrl' in attribute) {
      characteristics[key] = (attribute as { inputCtrl: string }).inputCtrl;
    } else if (typeof attribute === 'string') {
      characteristics[key] = attribute;
    } else if (typeof attribute === 'number') {
      characteristics[key] = attribute.toString();
    }
  }

  return characteristics;
}

// Factory method for default handling
export function createStockDtoFromResult(result: ResultObject, productId: string): CreateStockDto {
  // Check if characteristics exist in the result
  const characteristics = result.characteristics || extractCharacteristicsFromAttributes(result) || {};

  return {
    productId,
    keepingUnit: result.keepingUnit ?? '',
    quantity: result.quantity ?? 0,
    price: result.price ?? 0,
    characteristics: characteristics,
    availabilityStatus: result.availabilityStatus ?? StockAvailability.IN_STOCK,
    guarantee: result.guarantee ?? undefined,
    discounts: result.discounts ?? [],
    description: result.description ?? { shortDescription: '', longDescription: '' },
  };
}
