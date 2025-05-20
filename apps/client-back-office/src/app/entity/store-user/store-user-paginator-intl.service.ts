import { Injectable } from '@angular/core';
import { CustomPaginatorIntl } from '../custom-paginator-intl.service';

@Injectable()
export class StoreUserPaginatorIntl extends CustomPaginatorIntl {
  constructor() {
    super();
    this.itemsPerPageLabel = $localize`:Paginator Label|Store users per page label@@storeUsersItemLabel:Store users per page:`;
  }
}
