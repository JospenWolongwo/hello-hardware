import { inject } from '@angular/core';
import type { ResolveFn } from '@angular/router';
import type { Observable } from 'rxjs';
import { SelectEntity } from '../../shared/interfaces/select-entity';
import type { ProductCategory } from './product-category';
import { ProductCategoryService } from './product-category.service';

export const productCategoryResolver: ResolveFn<ProductCategory[]> = (): Observable<ProductCategory[]> => {
  return inject(ProductCategoryService).getAllCategories();
};

export const endProductCategoryResolver: ResolveFn<SelectEntity[]> = (): Observable<SelectEntity[]> => {
  return inject(ProductCategoryService).getEndCategories();
};
