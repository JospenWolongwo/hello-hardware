import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import type { ProductCategory } from '../product-category';

@Component({
  selector: 'app-view-product-category',
  templateUrl: './view-product-category.component.html',
})
export class ViewProductCategoryComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: ProductCategory
  ) {}
}
