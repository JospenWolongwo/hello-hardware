import { Injectable } from '@angular/core';
import { CustomPaginatorIntl } from '../../custom-paginator-intl.service';

@Injectable()
export class StoreUserPermissionsPaginatorIntl extends CustomPaginatorIntl {
  constructor() {
    super();
    this.itemsPerPageLabel = $localize`:Paginator Label|Permissions per page label@@permissionsLabel:Permissions per page:`;
  }
}
