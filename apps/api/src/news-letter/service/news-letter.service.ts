import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { UserSubscriptionDto } from '../dto';
import { Subscriber } from '../entities/subscriber-entity';
import type { SubscribeNewsletterResponse } from '../types';

@Injectable()
export class NewsletterService {
  private readonly logger = new Logger(NewsletterService.name);
  constructor(
    @InjectRepository(Subscriber)
    private subscriberRepository: Repository<Subscriber>
  ) {}

  async addSubscriber(userSubscriptionDto: UserSubscriptionDto): Promise<SubscribeNewsletterResponse> {
    try {
      const existingSubscriber = await this.subscriberRepository.findOneBy({
        email: userSubscriptionDto.email,
      });
      if (existingSubscriber) {
        this.logger.warn(`Subscription attempt for already registered email: ${userSubscriptionDto.email}`);

        return { status: 'alreadyRegistered', message: 'This email is already subscribed.' };
      }

      const subscriber = this.subscriberRepository.create({ ...userSubscriptionDto });
      await this.subscriberRepository.save(subscriber);

      return { status: 'ok', message: 'Subscription successful!' };
    } catch (error) {
      this.logger.error(`Error adding subscriber: ${JSON.stringify(error)} | Stack: ${error.stack}`);

      return { status: 'failed', message: 'Failed to add subscriber.' };
    }
  }
}
