// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { CookieService } from 'ngx-cookie-service';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import type { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private cookieService: CookieService) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const accessToken = this.cookieService.get(environment.accessTokenKey);

    const isApiUrl = req.url.startsWith(environment.apiBaseUrl);

    if (accessToken && isApiUrl) {
      const cloned = req.clone({
        headers: req.headers.set('Authorization', 'Bearer ' + accessToken),
      });

      return next.handle(cloned);
    } else {
      return next.handle(req);
    }
  }
}
