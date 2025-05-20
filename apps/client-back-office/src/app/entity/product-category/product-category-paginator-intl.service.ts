import { Injectable } from '@angular/core';
import { CustomPaginatorIntl } from '../custom-paginator-intl.service';

@Injectable()
export class ProductCategoryPaginatorIntl extends CustomPaginatorIntl {
  constructor() {
    super();
    this.itemsPerPageLabel = $localize`:Paginator Label|Product categories per page label@@productCategoriesItemLabel:Product categories per page:`;
  }
}
