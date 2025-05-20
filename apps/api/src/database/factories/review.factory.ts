import { faker } from '@faker-js/faker';
import { define } from 'typeorm-seeding';
import { UserReview } from '../../user-reviews/entity/user-review.entity';

define(UserReview, () => {
  const review = new UserReview();
  review.rating = faker.number.int({ min: 1, max: 5 });
  review.title = faker.lorem.sentence();
  review.comment = faker.lorem.paragraph();
  review.content = faker.lorem.paragraphs(2);

  return review;
});
