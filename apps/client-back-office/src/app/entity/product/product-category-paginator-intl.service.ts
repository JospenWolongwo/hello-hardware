import { Injectable } from '@angular/core';
import { CustomPaginatorIntl } from '../custom-paginator-intl.service';

@Injectable()
export class ProductPaginatorIntl extends CustomPaginatorIntl {
  constructor() {
    super();
    this.itemsPerPageLabel = $localize`:Paginator Label|Products per page label@@productsItemLabel:Products per page:`;
  }
}
