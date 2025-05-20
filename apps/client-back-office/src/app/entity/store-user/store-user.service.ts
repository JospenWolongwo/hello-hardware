/* eslint-disable  @typescript-eslint/consistent-type-imports */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { ResponseMessage } from '../../../app/shared/interfaces/response-message';
import { BaseService } from '../../../app/shared/services/base.service';
import type { StoreUser } from './store-user';

@Injectable({
  providedIn: 'root',
})
export class StoreUserService extends BaseService {
  constructor(private http: HttpClient) {
    super();
  }

  getAllStoreUsers() {
    return this.http.get<StoreUser[]>(`${this.baseurl}/store-users`, this.httpOptions).pipe(
      map((storeUsers) => {
        return storeUsers.map((storeUser) => <StoreUser>this.formatEntityDate(storeUser));
      })
    );
  }

  getStoreUser(storeUserId: string) {
    return this.getAllStoreUsers().pipe(
      map((storeUsers) => {
        const storeUser = storeUsers.find((user) => user.id === storeUserId);

        return storeUser ?? null;
      })
    );
  }

  userExist(storeUserId: string) {
    return this.getAllStoreUsers().pipe(
      map((storeUsers) => {
        return storeUsers.some((user) => user.id === storeUserId);
      })
    );
  }

  activateStoreUsers(users: string[], storeName: string) {
    const data = {
      users: users,
      storeName: storeName,
    };

    return this.http.patch<ResponseMessage>(`${this.baseurl}/store-users/enable`, data, this.httpOptions);
  }

  deactivateStoreUsers(users: string[], storeName: string) {
    const data = {
      users: users,
      storeName: storeName,
    };

    return this.http.patch<ResponseMessage>(`${this.baseurl}/store-users/disable`, data, this.httpOptions);
  }

  activateStoreUserPermissions(userId: string, permissions: string[]) {
    const data = {
      permissions: permissions,
    };

    return this.http.post<string[]>(`${this.baseurl}/permissions/${userId}`, data, this.httpOptions);
  }

  deactivateStoreUserPermissions(userId: string, permissions: string[]) {
    const data = {
      permissions: permissions,
    };

    return this.http.delete<string[]>(`${this.baseurl}/permissions/${userId}`, {
      ...this.httpOptions,
      body: data,
    });
  }
}
