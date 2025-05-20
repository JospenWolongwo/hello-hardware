import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import type { Product } from '../product';

@Component({
  selector: 'app-view-product',
  templateUrl: './view-product.component.html',
})
export class ViewProductComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: Product
  ) {}

  get status() {
    const status = this.data.status ? 'Active' : 'Inactive';

    return status;
  }
}
