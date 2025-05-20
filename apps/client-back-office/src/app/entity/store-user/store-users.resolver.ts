import { inject } from '@angular/core';
import type { ResolveFn } from '@angular/router';
import type { Observable } from 'rxjs';
import type { StoreUser } from './store-user';
import { StoreUserService } from './store-user.service';

export const storeUsersResolver: ResolveFn<StoreUser[]> = (): Observable<StoreUser[]> => {
  return inject(StoreUserService).getAllStoreUsers();
};
