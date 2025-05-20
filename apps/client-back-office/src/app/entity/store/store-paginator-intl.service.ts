import { Injectable } from '@angular/core';
import { CustomPaginatorIntl } from '../custom-paginator-intl.service';

@Injectable()
export class StorePaginatorIntl extends CustomPaginatorIntl {
  constructor() {
    super();
    this.itemsPerPageLabel = $localize`:Paginator Label|Store per page label@@storesItemLabel:Stores per page:`;
  }
}
