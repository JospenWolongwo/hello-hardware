import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { EmailService } from '../../email/services/email.service';
import { Stock } from '../../stock/entity/stock.entity';
import type { CreateQuoteDTO } from '../dto';
import { Quote } from '../entity/quote.entity';
import type { CreateQuoteResponse } from '../types';
import { SerializedQuote, SerializedQuoteItem } from '../types';

@Injectable()
export class QuoteService {
  private readonly logger = new Logger(QuoteService.name);

  constructor(
    @InjectRepository(Quote)
    private readonly quoteRepository: Repository<Quote>,
    @InjectRepository(Stock)
    private readonly stockRepository: Repository<Stock>,
    private readonly emailService: EmailService
  ) {}

  async createQuote(createQuoteDto: CreateQuoteDTO): Promise<CreateQuoteResponse> {
    try {
      // Verify that all the stock items exist
      const stockIds = createQuoteDto.items.map((item) => item.stockId);

      const foundStocks = await this.stockRepository.findBy({
        id: In(stockIds),
      });

      // Check if any stock IDs are missing
      if (foundStocks.length !== stockIds.length) {
        const missingStockIds = stockIds.filter((stockId) => !foundStocks.some((stock) => stock.id === stockId));
        throw new NotFoundException(`Stock(s) with ID(s) ${missingStockIds.join(', ')} not found`);
      }

      // Create a new instance of the Quote entity
      const newQuote = this.quoteRepository.create({
        ...createQuoteDto,
        items: createQuoteDto.items.map((item) => {
          // Map each item to include the full Stock entity
          const stock = foundStocks.find((foundStock) => foundStock.id === item.stockId);

          return {
            ...item,
            stock, // Assign the Stock entity
          };
        }),
      });

      // Save the quote into the database
      const savedQuote = await this.quoteRepository.save(newQuote);

      // Send a confirmation email to the customer
      await this.emailService.sendQuoteConfirmation(savedQuote.email, savedQuote.id, savedQuote.companyName);

      return {
        success: true,
        message: 'Quote created successfully',
        quoteId: savedQuote.id.slice(0, 8),
      };
    } catch (error) {
      this.logger.error('Error creating quote', error);
      if (error instanceof NotFoundException) {
        throw error;
      }

      return {
        success: false,
        message: 'Error creating quote',
      };
    }
  }

  async findOne(id: string): Promise<SerializedQuote> {
    const quote = await this.quoteRepository.findOne({
      where: { id },
      relations: ['items', 'items.stock'],
    });

    if (!quote) {
      this.logger.error(`Quote with id: ${id} was not found.`);
      throw new NotFoundException(`Quote with id: ${id} not found`);
    }

    // Map QuoteItem to SerializedQuoteItem
    const serializedItems = quote.items.map(
      (item) =>
        new SerializedQuoteItem({
          quantity: item.quantity,
          price: item.price,
          stockId: item.stock.id,
        })
    );

    // Return serialized quote
    return new SerializedQuote({
      id: quote.id,
      email: quote.email,
      companyName: quote.companyName,
      totalItems: quote.totalItems,
      totalPrice: quote.totalPrice,
      createdAt: quote.createdAt,
      items: serializedItems,
    });
  }
}
