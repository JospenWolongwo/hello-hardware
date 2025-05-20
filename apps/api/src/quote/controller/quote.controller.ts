import { Body, Controller, Get, HttpException, HttpStatus, Logger, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateQuoteDTO } from '../dto';
import { QuoteService } from '../service/quote.service';
import { ApiCreateQuote, ApiGetQuoteById } from '../swagger';
import type { CreateQuoteResponse, SerializedQuote } from '../types';

@ApiTags('Quotes')
@Controller('quotes')
export class QuoteController {
  private readonly logger = new Logger(QuoteController.name);

  constructor(private readonly quoteService: QuoteService) {}

  @Post()
  @ApiCreateQuote()
  async createQuote(@Body() createQuoteDTO: CreateQuoteDTO): Promise<CreateQuoteResponse> {
    try {
      return await this.quoteService.createQuote(createQuoteDTO);
    } catch (error) {
      this.logger.error('Error creating quote', error);
      throw new HttpException('Failed to create quote', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get(':id')
  @ApiGetQuoteById()
  async getQuoteById(@Param('id') id: string): Promise<SerializedQuote> {
    try {
      return await this.quoteService.findOne(id);
    } catch (error) {
      this.logger.error(`Error fetching quote with id: ${id}`, error);
      throw new HttpException('Quote not found', HttpStatus.NOT_FOUND);
    }
  }
}
