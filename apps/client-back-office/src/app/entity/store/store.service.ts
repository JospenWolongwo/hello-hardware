/* eslint-disable  @typescript-eslint/consistent-type-imports */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { ResponseMessage } from '../../shared/interfaces/response-message';
import { BaseService } from '../../shared/services/base.service';
import { InviteUserDto } from '../store-user/invite-user/invite-user-dto.interface';
import { CreateStoreDto } from './create-store/create-store-dto.interface';
import type { Store } from './store';

@Injectable({
  providedIn: 'root',
})
export class StoreService extends BaseService {
  constructor(private http: HttpClient) {
    super();
  }

  getAllStores() {
    return this.http.get<Store[]>(`${this.baseurl}/stores`, this.httpOptions).pipe(
      map((stores) => {
        return stores.map((store) => <Store>this.formatEntityDate(store));
      })
    );
  }

  createStore(createStoreDto: CreateStoreDto, parent: string | null = null) {
    let data: CreateStoreDto | { name: string };

    if (createStoreDto.description === null) {
      data = { name: createStoreDto.name };
    } else {
      data = createStoreDto;
    }

    if (parent !== null) {
      return this.http
        .post<Store>(`${this.baseurl}/stores/${parent}/branches`, data, this.httpOptions)
        .pipe(map((store) => <Store>this.formatEntityDate(store)));
    }

    return this.http
      .post<Store>(`${this.baseurl}/stores`, data, this.httpOptions)
      .pipe(map((store) => <Store>this.formatEntityDate(store)));
  }

  inviteUserToStore(invitationDto: InviteUserDto) {
    return this.http.post<ResponseMessage>(`${this.baseurl}/stores/invite-user`, invitationDto, this.httpOptions);
  }

  editStore(editStoreDto: CreateStoreDto, storeId: string) {
    return this.http.patch<Store>(`${this.baseurl}/stores/${storeId}`, editStoreDto, this.httpOptions).pipe(
      map((store) => {
        return <Store>this.formatEntityDate(store);
      })
    );
  }
}
