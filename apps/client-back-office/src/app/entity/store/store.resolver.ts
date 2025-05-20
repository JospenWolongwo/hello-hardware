import { inject } from '@angular/core';
import type { ResolveFn } from '@angular/router';
import type { Observable } from 'rxjs';
import type { Store } from './store';
import { StoreService } from './store.service';

export const storeResolver: ResolveFn<Store[]> = (): Observable<Store[]> => {
  return inject(StoreService).getAllStores();
};
