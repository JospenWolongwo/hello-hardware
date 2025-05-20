import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NewsletterController } from './controller/news-letter-controller';
import { Subscriber } from './entities/subscriber-entity';
import { NewsletterService } from './service/news-letter.service';

@Module({
  imports: [TypeOrmModule.forFeature([Subscriber])],
  providers: [NewsletterService],
  controllers: [NewsletterController],
  exports: [NewsletterService],
})
export class NewsLetterModule {}
