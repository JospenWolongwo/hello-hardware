import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { BaseService } from '../../../app/shared/services/base.service';
import { CreateStockDto } from './create-stock/create-stock-dto';
import { EditStockDto } from './create-stock/edit-stock-dto';
import { EditStockQuantityDto } from './create-stock/edit-stock-quantity-dto';
import { Stock } from './stock';

@Injectable({
  providedIn: 'root',
})
export class StockService extends BaseService {
  private baseStorageUrl = '';
  constructor(private http: HttpClient) {
    super();
    this.loadConfig();
  }

  private loadConfig(): void {
    this.http.get<{ azureBlobStorageUrl: string }>(`${this.baseurl}/config`).subscribe({
      next: (config) => {
        this.baseStorageUrl = config.azureBlobStorageUrl;
      },
      error: () => {
        // eslint-disable-next-line no-console
        console.error('Failed to load Azure storage configuration');
      },
    });
  }

  getProductStocks(productId: string) {
    return this.http.get<Stock[]>(`${this.baseurl}/stocks/product/${productId}`, this.httpOptions).pipe(
      map((stocks) => {
        return stocks.map((stock) => <Stock>this.formatEntityDate(stock));
      })
    );
  }

  createProductStock(createStockDto: CreateStockDto) {
    return this.http.post<Stock>(`${this.baseurl}/stocks`, createStockDto, this.httpOptions).pipe(
      map((stock) => {
        return <Stock>this.formatEntityDate(stock);
      })
    );
  }

  editProductStock(id: string, editStockDto: EditStockDto) {
    return this.http.patch<Stock>(`${this.baseurl}/stocks/${id}`, editStockDto, this.httpOptions).pipe(
      map((stock) => {
        return <Stock>this.formatEntityDate(stock);
      })
    );
  }

  changeProductStockQuantity(id: string, editStockQuantityDto: EditStockQuantityDto) {
    return this.http.patch<Stock>(`${this.baseurl}/stocks/${id}/quantity`, editStockQuantityDto, this.httpOptions).pipe(
      map((stock) => {
        return <Stock>this.formatEntityDate(stock);
      })
    );
  }

  // Upload stock image
  uploadStockImage(stockId: string, file: FormData): Observable<any> {
    const url = `${this.baseurl}/files/upload/stock/${stockId}`;

    return this.http.post<any>(url, file, {
      reportProgress: true,
      observe: 'events',
    });
  }

  // Retrieve stock images
  getStockImages(stockId: string) {
    return this.http.get<{ name: string }[]>(`${this.baseurl}/files/stock/${stockId}`, this.httpOptions);
  }

  // Delete stock image
  deleteStockImage(fileName: string) {
    return this.http.delete<{ message: string }>(`${this.baseurl}/files/${fileName}`, this.httpOptions);
  }

  // Generate full image URL for stock
  getImageUrl(fileName: string): string {
    if (!this.baseStorageUrl) {
      return '';
    }

    return `${this.baseStorageUrl}${fileName}`;
  }
}
