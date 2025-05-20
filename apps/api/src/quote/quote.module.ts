import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailModule } from '../email/email.module';
import { Stock } from '../stock/entity/stock.entity';
import { StockModule } from '../stock/stock.module';
import { QuoteController } from './controller/quote.controller';
import { QuoteService } from './service/quote.service';
import { Quote, QuoteItem } from './entity';

@Module({
  imports: [TypeOrmModule.forFeature([Quote, QuoteItem, Stock]), StockModule, EmailModule],
  providers: [QuoteService],
  controllers: [QuoteController],
  exports: [QuoteService],
})
export class QuoteModule {}
