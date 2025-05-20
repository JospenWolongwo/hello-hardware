// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { BlobServiceClient, BlockBlobClient, StorageSharedKeyCredential } from '@azure/storage-blob';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Express } from 'express';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Product } from '../../product/entity/product.entity';
import { Stock } from '../../stock/entity/stock.entity';
import { File } from '../entities/file.entity';
import type { FileType } from '../types/file.type';

@Injectable()
export class FilesService {
  private readonly azureAccountName = <string>process.env.AZURE_STORAGE_ACCOUNT;
  private readonly azureAccountKey = <string>process.env.AZURE_STORAGE_SAS_KEY;
  private readonly azureContainerName = <string>process.env.AZURE_CONTAINER_NAME;
  private sharedKeyCredential = new StorageSharedKeyCredential(this.azureAccountName, this.azureAccountKey);

  constructor(
    @InjectRepository(File)
    private readonly fileRepository: Repository<File>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Stock)
    private readonly stockRepository: Repository<Stock>
  ) {}

  private getBlobClient(fileName: string): BlockBlobClient {
    const blobServiceClient = new BlobServiceClient(
      `https://${this.azureAccountName}.blob.core.windows.net`,
      this.sharedKeyCredential
    );
    const containerClient = blobServiceClient.getContainerClient(this.azureContainerName);

    return containerClient.getBlockBlobClient(fileName);
  }

  // eslint-disable-next-line max-params
  async uploadFile(
    file: Express.Multer['File'],
    type: FileType,
    productId?: string,
    stockId?: string,
    userId?: string
  ): Promise<File> {
    if (!file) {
      throw new HttpException('No file provided', HttpStatus.BAD_REQUEST);
    }

    const extension = file.originalname.split('.').pop();
    const fileName = `${uuidv4()}.${extension}`;
    const blobClient = this.getBlobClient(fileName);
    await blobClient.uploadData(file.buffer);

    const fileEntity = this.fileRepository.create({
      name: fileName,
      type,
      productId,
      stockId,
      userId,
    });
    const savedFile = await this.fileRepository.save(fileEntity);

    if (productId) {
      const product = await this.productRepository.findOne({ where: { id: productId } });
      if (product) {
        product.imageUrl = fileName;
        await this.productRepository.save(product);
      }
    } else if (stockId) {
      const stock = await this.stockRepository.findOne({ where: { id: stockId } });
      if (stock) {
        stock.pictures = [...stock.pictures, fileName];
        await this.stockRepository.save(stock);
      }
    }

    return savedFile;
  }

  async getFile(fileName: string): Promise<Uint8Array> {
    const blobClient = this.getBlobClient(fileName);
    const blobDownloaded = await blobClient.download();

    return <Uint8Array>(<unknown>blobDownloaded.readableStreamBody);
  }

  async getImagesByProductId(productId: string): Promise<File[]> {
    return this.fileRepository.find({ where: { productId } });
  }

  async getImagesByStockId(stockId: string): Promise<File[]> {
    return this.fileRepository.find({ where: { stockId } });
  }

  async deleteFile(fileName: string): Promise<void> {
    const file = await this.fileRepository.findOne({ where: { name: fileName } });

    if (!file) {
      throw new HttpException('File not found in the database', HttpStatus.NOT_FOUND);
    }

    // Delete the blob from Azure Storage
    const blobClient = this.getBlobClient(fileName);
    await blobClient.deleteIfExists();

    // Remove the file record from the File table
    await this.fileRepository.remove(file);

    // Update Product or Stock entity to remove file reference
    if (file.productId) {
      const product = await this.productRepository.findOne({ where: { id: file.productId } });
      if (product && product.imageUrl === fileName) {
        product.imageUrl = null;
        await this.productRepository.save(product);
      }
    }

    if (file.stockId) {
      const stock = await this.stockRepository.findOne({ where: { id: file.stockId } });
      if (stock) {
        stock.pictures = stock.pictures.filter((pic) => pic !== fileName);
        await this.stockRepository.save(stock);
      }
    }
  }
}
