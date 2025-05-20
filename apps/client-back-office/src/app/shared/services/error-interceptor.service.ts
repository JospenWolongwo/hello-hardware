// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { MatDialog } from '@angular/material/dialog';
import type { Observable } from 'rxjs';
import { catchError, throwError } from 'rxjs';
import { PopUpMessageComponent } from '../pop-up-message/pop-up-message.component';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { AccountService } from './account.service';

@Injectable({
  providedIn: 'root',
})
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private errorPopup: MatDialog, private accountService: AccountService) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (
          error.error.status === 403 ||
          error.error.error === 'Unauthorized' ||
          error.error.status === 400 ||
          error.error.status === 500
        ) {
          this.accountService.logout();
        } else {
          this.errorPopup.open(PopUpMessageComponent, {
            data: { title: `${error.error.error} Error!`, message: error.error.message, class: 'error' },
            minWidth: '300px',
            ariaLabel: $localize`:An Error occurred@@errorModal:An error occurred`,
          });
        }

        return throwError(() => new Error(error.error.message));
      })
    );
  }
}
