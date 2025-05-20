/* eslint-disable no-console */
import { Client } from '@elastic/elasticsearch';
import type { OnModuleInit } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import type { Product } from '../../product/entity/product.entity';
import { ProductIndexSchema } from '../dto';

@Injectable()
export class ElasticsearchService implements OnModuleInit {
  private client: Client;
  private readonly indexName = 'products';

  onModuleInit() {
    this.client = new Client({
      node: process.env.ELASTICSEARCH_URL || 'http://localhost:9200',
    });

    this.ensureIndexSetup();
  }

  private async ensureIndexSetup(): Promise<void> {
    try {
      const exists = await this.client.indices.exists({ index: this.indexName });
      if (!exists) {
        await this.client.indices.create({
          index: this.indexName,
          body: {
            mappings: {
              properties: ProductIndexSchema,
            },
          },
        });
        console.log(`Index '${this.indexName}' created successfully.`);
      } else {
        console.log(`Index '${this.indexName}' already exists.`);
      }
    } catch (error) {
      console.error(`Failed to create or verify index '${this.indexName}': ${error.message}`);
    }
  }

  async addProductDocument(product: Product): Promise<void> {
    const document = this.transformProductForIndexing(product);
    try {
      await this.client.index({
        index: this.indexName,
        id: product.id,
        document,
      });
      console.log(`Product document with ID ${product.id} added successfully.`);
    } catch (error) {
      console.error(`Failed to add product document: ${error.message}`);
      throw error;
    }
  }

  async updateProductDocument(product: Product): Promise<void> {
    const document = this.transformProductForIndexing(product);
    try {
      await this.client.update({
        index: this.indexName,
        id: product.id,
        doc: document,
      });
      console.log(`Product document with ID ${product.id} updated successfully.`);
    } catch (error) {
      console.error(`Failed to update product document: ${error.message}`);
      throw error;
    }
  }

  async deleteProductDocument(productId: string): Promise<void> {
    try {
      await this.client.delete({
        index: this.indexName,
        id: productId,
      });
      console.log(`Product document with ID ${productId} deleted successfully.`);
    } catch (error) {
      console.error(`Failed to delete product document: ${error.message}`);
      throw error;
    }
  }

  async searchProducts(query: string, page = 1, size = 10): Promise<Product[]> {
    try {
      const response = await this.client.search({
        index: this.indexName,
        body: {
          query: {
            multi_match: {
              query,
              fields: ['name^3', 'brand^2', 'description', 'specs'],
            },
          },
          from: (page - 1) * size,
          size,
        },
      });

      return response.hits.hits.map(({ _source }) => _source as Product);
    } catch (error) {
      console.error(`Failed to search products: ${error.message}`);
      throw error;
    }
  }

  private transformProductForIndexing(product: Product): Record<string, unknown> {
    return {
      id: product.id,
      name: product.name,
      brand: product.brand,
      price: product.price,
      currency: product.currency,
      specs: product.specs,
      description: product.description,
      shortDescription: product.shortDescription,
      category: product.category?.name,
      imageUrl: product.imageUrl,
      label: product.label,
      labelColor: product.labelColor,
      inStock: product.inStock,
      active: product.active,
      extraAttributes: product.extraAttributes,
    };
  }

  getClient(): Client {
    return this.client;
  }
}
