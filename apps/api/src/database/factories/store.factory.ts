import { define } from 'typeorm-seeding';
import { Store } from '../../store/entities/store.entity';

define(Store, () => {
  const store = new Store();
  store.name = 'HERMES';
  store.description = 'Security Doors';

  return store;
});
