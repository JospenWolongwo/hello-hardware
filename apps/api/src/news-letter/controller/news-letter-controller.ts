import { Body, Controller, Post } from '@nestjs/common';
import { UserSubscriptionDto } from '../dto/user-subscription.dto';
import { NewsletterService } from '../service/news-letter.service';
import { ApiAddSubscriber } from '../swagger';

@Controller('newsletter')
export class NewsletterController {
  constructor(private readonly newsletterService: NewsletterService) {}

  @Post('subscribe')
  @ApiAddSubscriber()
  async addSubscriber(@Body() userSubscriptionDto: UserSubscriptionDto) {
    return this.newsletterService.addSubscriber(userSubscriptionDto);
  }
}
