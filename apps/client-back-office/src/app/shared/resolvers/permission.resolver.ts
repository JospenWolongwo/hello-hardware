import { inject } from '@angular/core';
import type { ResolveFn } from '@angular/router';
import type { Observable } from 'rxjs';
import { AccountService } from '../services/account.service';

export const permissionResolver: ResolveFn<string[]> = (): Observable<string[]> => {
  return inject(AccountService).userPermissions();
};
