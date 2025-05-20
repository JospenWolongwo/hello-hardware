// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { CookieService } from 'ngx-cookie-service';
import type { Observable } from 'rxjs';
import { map, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import type { User } from '../interfaces/user';
import type { UserInfo } from '../interfaces/userInfo';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root',
})
export class AccountService extends BaseService {
  constructor(private http: HttpClient, private cookieService: CookieService) {
    super();
  }

  accountInfo() {
    return this.http.get<User>(`${this.baseurl}/users/me`, this.httpOptions).pipe(
      map((user) => {
        localStorage.setItem(environment.userKey, JSON.stringify(user));

        return this.userInfo();
      })
    );
  }

  userInfo(): UserInfo | null {
    const user = <User>JSON.parse(<string>localStorage.getItem(environment.userKey));

    if (user !== null) {
      const name = user?.firstName && user?.lastName ? `${user.lastName} ${user.firstName}` : null;

      return {
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: name,
        email: user.email,
        contact: user.phoneNumber,
        sex: user.gender,
      };
    } else {
      return null;
    }
  }

  userPermissions(): Observable<string[]> {
    const user = <User>JSON.parse(<string>localStorage.getItem(environment.userKey));
    if (user !== null) {
      return of(user.permissions);
    }

    return of([]);
  }

  isLoggedIn() {
    const loggedIn =
      this.cookieService.check(environment.accessTokenKey) && this.cookieService.check(environment.refreshTokenKey);

    if (!loggedIn) {
      localStorage.removeItem(environment.userKey);
    }

    return loggedIn;
  }

  logout() {
    this.cookieService.delete(environment.accessTokenKey, '/');

    this.cookieService.delete(environment.refreshTokenKey, '/');

    window.location.reload();
  }
}
