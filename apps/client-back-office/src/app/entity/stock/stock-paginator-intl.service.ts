import { Injectable } from '@angular/core';
import { CustomPaginatorIntl } from '../custom-paginator-intl.service';

@Injectable()
export class StockPaginatorIntl extends CustomPaginatorIntl {
  constructor() {
    super();
    this.itemsPerPageLabel = $localize`:Paginator Label|Product Stocks per page label@@stockItemLabel:Product stocks per page:`;
  }
}
