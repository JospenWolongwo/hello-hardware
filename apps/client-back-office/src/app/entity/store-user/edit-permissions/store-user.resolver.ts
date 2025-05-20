import { inject } from '@angular/core';
import type { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import type { Observable } from 'rxjs';
import type { StoreUser } from '../store-user';
import { StoreUserService } from '../store-user.service';

export const storeUserResolver: ResolveFn<StoreUser | null> = (
  route: ActivatedRouteSnapshot
): Observable<StoreUser | null> => {
  return inject(StoreUserService).getStoreUser(<string>route.paramMap.get('id'));
};
