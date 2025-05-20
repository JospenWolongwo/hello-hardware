import type { MappingProperty } from '@elastic/elasticsearch/lib/api/types';

export const ProductIndexSchema: Record<string, MappingProperty> = {
  id: {
    type: 'keyword',
  },
  name: {
    type: 'text',
    fields: {
      keyword: {
        type: 'keyword',
        ignore_above: 256,
      },
    },
  },
  brand: {
    type: 'keyword',
  },
  specs: {
    type: 'text',
    fields: {
      keyword: {
        type: 'keyword',
        ignore_above: 256,
      },
    },
  },
  price: {
    type: 'float',
    index: false,
  },
  currency: {
    type: 'keyword',
    index: false,
  },
  description: {
    type: 'text',
    fields: {
      keyword: {
        type: 'keyword',
        ignore_above: 256,
      },
    },
  },
  shortDescription: {
    type: 'text',
    fields: {
      keyword: {
        type: 'keyword',
        ignore_above: 256,
      },
    },
  },
  category: {
    type: 'keyword',
  },
  imageUrl: {
    type: 'keyword',
    index: false,
  },
  label: {
    type: 'keyword',
  },
  labelColor: {
    type: 'keyword',
    index: false,
  },
  inStock: {
    type: 'boolean',
    index: false,
  },
  active: {
    type: 'boolean',
    index: false,
  },
  extraAttributes: {
    type: 'object',
    enabled: false,
  },
};
