import { inject } from '@angular/core';
import type { ResolveFn } from '@angular/router';
import type { Observable } from 'rxjs';
import type { UserInfo } from '../interfaces/userInfo';
import { AccountService } from '../services/account.service';

export const UserResolver: ResolveFn<UserInfo | null> = (): Observable<UserInfo | null> => {
  return inject(AccountService).accountInfo();
};
