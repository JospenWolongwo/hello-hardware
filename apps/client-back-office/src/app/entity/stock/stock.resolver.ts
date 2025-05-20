import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { Observable } from 'rxjs';
import { Stock } from './stock';
import { StockService } from './stock.service';

export const stockResolver: ResolveFn<Stock[]> = (route: ActivatedRouteSnapshot) => {
  const productId = route.paramMap.get('id');

  if (productId) {
    return inject(StockService).getProductStocks(productId);
  } else {
    return new Observable<Stock[]>((subscriber) => {
      subscriber.next([]);
    });
  }
};
