import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs';
import { AccountService } from '../services/account.service';

export const permissionGuard: CanActivateFn = (route) => {
  const accountService = inject(AccountService);

  const router: Router = inject(Router);

  const expectedPermissions: string[] = route.data['permissions'];

  return accountService.userPermissions().pipe(
    map((permissions) => {
      const hasRequiredPermissions = expectedPermissions.every((expectedPermission) =>
        permissions.includes(expectedPermission)
      );

      if (!hasRequiredPermissions) {
        router.navigate(['..']);
      }

      return hasRequiredPermissions;
    })
  );
};
