import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { Observable } from 'rxjs';
import { Product } from './product';
import { ProductService } from './product.service';

export const productsResolver: ResolveFn<Product[]> = (): Observable<Product[]> => {
  return inject(ProductService).getAllProducts();
};

export const productResolver: ResolveFn<Product | null> = (
  route: ActivatedRouteSnapshot
): Observable<Product | null> => {
  const productId = route.paramMap.get('id');

  if (productId) {
    return inject(ProductService).getProduct(productId);
  } else {
    return new Observable<null>((subscriber) => {
      subscriber.next(null);
    });
  }
};
