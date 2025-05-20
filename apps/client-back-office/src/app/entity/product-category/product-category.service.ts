// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { SelectEntity } from '../../shared/interfaces/select-entity';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { BaseService } from '../../shared/services/base.service';
import type { CreateProductCategoryDto } from './create-product-category/create-product-category-dto.interface';
import type { ProductCategory } from './product-category';

@Injectable({
  providedIn: 'root',
})
export class ProductCategoryService extends BaseService {
  constructor(private http: HttpClient) {
    super();
  }

  getAllCategories() {
    return this.http.get<ProductCategory[]>(`${this.baseurl}/categories`, this.httpOptions).pipe(
      map((categories) => {
        return categories.map((category) => <ProductCategory>this.formatEntityDate(category));
      })
    );
  }

  getEndCategories() {
    return this.http.get<SelectEntity[]>(`${this.baseurl}/categories/tree/leaves`, this.httpOptions);
  }

  createCategory(createProductDto: CreateProductCategoryDto, parentId: string | null = null) {
    let data: CreateProductCategoryDto | { name: string };
    if (createProductDto.description === null) {
      data = { name: createProductDto.name };
    } else {
      data = createProductDto;
    }

    if (parentId !== null) {
      return this.http
        .post<ProductCategory>(`${this.baseurl}/categories/${parentId}/sub-categories`, data, this.httpOptions)
        .pipe(
          map((category) => {
            return <ProductCategory>this.formatEntityDate(category);
          })
        );
    }

    return this.http.post<ProductCategory>(`${this.baseurl}/categories`, data, this.httpOptions).pipe(
      map((category) => {
        return <ProductCategory>this.formatEntityDate(category);
      })
    );
  }

  editCategory(editProductDto: CreateProductCategoryDto, categoryId: string) {
    return this.http
      .patch<ProductCategory>(`${this.baseurl}/categories/${categoryId}`, editProductDto, this.httpOptions)
      .pipe(
        map((category) => {
          return <ProductCategory>this.formatEntityDate(category);
        })
      );
  }
}
