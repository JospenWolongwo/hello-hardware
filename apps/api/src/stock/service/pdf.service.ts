/* eslint-disable max-lines */
/* eslint-disable no-plusplus */
import { Injectable, Logger } from '@nestjs/common';
import * as axios from 'axios';
import PDFDocument from 'pdfkit';
import type { Stock } from '../entity/stock.entity';
import type { Discount } from '../types/discount.type';
import type { TimeLapse } from '../types/timeLapse.type';

@Injectable()
export class PdfService {
  private readonly logger = new Logger(PdfService.name);
  private readonly picturesStorageUrl = <string>process.env.AZURE_BLOB_STORAGE_URL;

  private formatPrice(price: number): string {
    try {
      const numPrice = Number(price);

      return isNaN(numPrice) ? '0.00' : numPrice.toFixed(2);
    } catch {
      return '0.00';
    }
  }

  private async fetchImage(imageUrl: string): Promise<Buffer> {
    try {
      const response = await axios.default.get(imageUrl, {
        responseType: 'arraybuffer',
        timeout: 5000,
      });

      return Buffer.from(response.data, 'binary');
    } catch (error) {
      this.logger.error(`Failed to fetch image from ${imageUrl}:`, error);
      throw error;
    }
  }

  async generateStockPdf(stock: Stock): Promise<Buffer> {
    this.logger.debug('Starting PDF generation', {
      stockId: stock.id,

      picturesCount: stock.pictures?.length,
    });

    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument();
        const buffers: Buffer[] = [];

        // Collect PDF data
        doc.on('data', buffers.push.bind(buffers));

        // Add error handler for the document
        doc.on('error', (err) => {
          reject(new Error(`PDF generation error: ${err.message}`));
        });

        // PDF content generation
        const generateContent = async () => {
          try {
            doc.fontSize(20).fillColor('blue').text('HERMES', { align: 'center' });
            doc.fontSize(18).fillColor('black').text('Stock Details', { align: 'center' });
            doc.moveDown();

            // Product Information
            doc.fontSize(16).text(`Product Name: ${stock.product?.name || 'N/A'}`, { underline: true });
            doc.fontSize(12).text(`SKU: ${stock.keepingUnit || 'N/A'}`);
            doc.text(`Price: CAD ${this.formatPrice(stock.price)}`);
            doc.text(`Availability: ${stock.availabilityStatus || 'N/A'}`);
            doc.text(`Quantity: ${stock.quantity || 0}`);
            doc.moveDown();

            // Characteristics
            doc.fontSize(14).text('Characteristics:', { underline: true });
            // eslint-disable-next-line keyword-spacing
            for (const [key, value] of Object.entries(stock.characteristics)) {
              doc.fontSize(12).text(`${key}: ${value}`);
            }
            doc.moveDown();

            // Description
            doc.fontSize(14).text('Description:', { underline: true });
            if (stock.description?.shortDescription) {
              doc.fontSize(12).text(`Short: ${stock.description.shortDescription}`);
            }
            if (stock.description?.longDescription) {
              doc.fontSize(12).text('Long:');
              stock.description.longDescription?.forEach((line) => {
                doc.text(`- ${line}`);
              });
            }
            doc.moveDown();

            // Images with pagination
            doc.fontSize(14).text('Product Images:', { underline: true });

            if (stock.pictures && stock.pictures.length > 0) {
              const pageWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
              const imageWidth = 200;
              const imagePadding = 10;
              const imagesPerRow = Math.floor(pageWidth / (imageWidth + imagePadding));
              const imageHeight = imageWidth;
              let currentRow = 0;
              let currentColumn = 0;

              for (const picture of stock.pictures) {
                try {
                  const imagePath = `${this.picturesStorageUrl}${picture}`;
                  this.logger.debug(`Loading image from: ${imagePath}`);
                  const imageBuffer = await this.fetchImage(imagePath);

                  // Check if there's enough space for the image
                  if (doc.y + imageHeight > doc.page.height - doc.page.margins.bottom) {
                    doc.addPage();
                    doc.fontSize(14).text('Product Images:', { underline: true });
                    currentRow = 0;
                    currentColumn = 0;
                  }

                  // Calculate image position
                  const x = doc.page.margins.left + currentColumn * (imageWidth + imagePadding);
                  const y = doc.y;
                  // Add image
                  doc.image(imageBuffer, x, y, {
                    width: imageWidth,
                    align: 'center',
                    valign: 'center',
                  });

                  // Move to next column/row
                  currentColumn++;
                  if (currentColumn >= imagesPerRow) {
                    currentColumn = 0;
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    currentRow++;
                    doc.y += imageHeight + imagePadding;
                  }
                } catch (imageError) {
                  this.logger.error(`Error processing image: ${picture}`, imageError);
                  doc.text(`Error loading image: ${picture}`, { align: 'center' });
                  doc.moveDown();
                }
              }

              // Ensure we move to a new page after images if needed
              doc.moveDown();
            } else {
              doc.text('No images available for this product.');
            }

            // Guarantee and Delivery
            doc.fontSize(14).text('Guarantee:', { underline: true });
            if (stock.guarantee) {
              const guarantee: TimeLapse = stock.guarantee;
              doc.fontSize(12).text(`Duration: ${guarantee.amount} ${guarantee.timeUnit}`);
            }
            doc.moveDown();

            doc.fontSize(14).text('Delivery Duration:', { underline: true });
            if (stock.deliveryDuration) {
              const delivery: TimeLapse = stock.deliveryDuration;
              doc.fontSize(12).text(`Duration: ${delivery.amount} ${delivery.timeUnit}`);
            }
            doc.moveDown();

            // Customer Reviews
            doc.fontSize(14).text('Customer Reviews:', { underline: true });
            if (stock.reviews && stock.reviews.length > 0) {
              stock.reviews.forEach((review) => {
                doc
                  .fontSize(12)
                  .text(`Review by ${review.user?.firstName || 'Anonymous'}: ${review.comment || 'No comment'}`);
              });
            } else {
              doc.fontSize(12).text('No reviews available.');
            }
            doc.moveDown();

            // Discounts
            doc.fontSize(14).text('Discounts:', { underline: true });
            if (stock.discounts && stock.discounts.length > 0) {
              stock.discounts.forEach((discount: Discount) => {
                doc
                  .fontSize(12)
                  .text(`Discount: ${discount.percentage}% (Min Quantity: ${discount.minQuantityToOrder})`);
              });
            } else {
              doc.fontSize(12).text('No discounts available.');
            }

            // Finalize the PDF document
            doc.end();
          } catch (contentError) {
            reject(new Error(`Error generating PDF content: ${contentError.message}`));
          }
        };

        // Handle PDF completion
        doc.on('end', () => {
          resolve(Buffer.concat(buffers));
        });

        // Start content generation
        generateContent().catch(reject);
      } catch (initError) {
        reject(new Error(`Error initializing PDF document: ${initError.message}`));
      }
    });
  }
}
