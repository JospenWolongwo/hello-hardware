import type { MatPaginatorIntl } from '@angular/material/paginator';
import { Subject } from 'rxjs';

export class CustomPaginatorIntl implements MatPaginatorIntl {
  changes = new Subject<void>();

  // For internationalization, the `$localize` function from
  // the `@angular/localize` package can be used.
  firstPageLabel = $localize`:Paginator Label|First page label@@firstPageLabel:First page`;
  itemsPerPageLabel = $localize`:Paginator Label|Items per page label@@itemsPerPageLabel:Items per page:`;
  lastPageLabel = $localize`:Paginator Label|Last page label@@lastPageLabel:Last page`;

  // You can set labels to an arbitrary string too, or dynamically compute
  // it through other third-party internationalization libraries.
  nextPageLabel = $localize`:Paginator Label|Next page label@@nextPageLabel:Next page`;
  previousPageLabel = $localize`:Paginator Label|Previous page label@@previousPageLabel:Previous page`;

  getRangeLabel(page: number, pageSize: number, length: number): string {
    if (length === 0) {
      return $localize`:Paginator page number|Page number for a page size of one@@pageNumber0:Page 1 of 1`;
    }
    const numberOfPages = Math.ceil(length / pageSize);

    return $localize`:Paginator page number|Page number for a page size greater than one@@pageNumberN:Page ${
      page + 1
    } of ${numberOfPages}`;
  }
}
