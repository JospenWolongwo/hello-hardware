import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs';
import { StoreUserService } from '../../entity/store-user/store-user.service';

export const storeUserPermissionsGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const storeUserService = inject(StoreUserService);
  const router: Router = inject(Router);

  return storeUserService.userExist(<string>route.paramMap.get('id')).pipe(
    map((exist) => {
      if (!exist) {
        router.navigate(['store-users']);
      }

      return exist;
    })
  );
};
