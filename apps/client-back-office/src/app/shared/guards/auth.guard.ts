import { inject } from '@angular/core';
import type { CanActivateChildFn, CanActivateFn } from '@angular/router';
import { environment } from '../../../environments/environment';
import { AccountService } from '../services/account.service';

export const authGuard: CanActivateFn = (route, state) => {
  const accountService = inject(AccountService);

  const loggedIn = accountService.isLoggedIn();

  if (!loggedIn) {
    location.replace(`${environment.loginPage}?redirect=${environment.loginKey}${state.url}`);
  }

  return loggedIn;
};

export const authChildrenGuard: CanActivateChildFn = (route, state) => {
  const accountService = inject(AccountService);

  const loggedIn = accountService.isLoggedIn();

  if (!loggedIn) {
    location.replace(`${environment.loginPage}?redirect=${environment.loginKey}${state.url}`);
  }

  return loggedIn;
};
