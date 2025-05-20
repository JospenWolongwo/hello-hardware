import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { isEmpty } from 'lodash-es';
import { map, Observable } from 'rxjs';
import { SelectEntity } from '../../../app/shared/interfaces/select-entity';
import { ResponseMessage } from '../../shared/interfaces/response-message';
import { BaseService } from '../../shared/services/base.service';
import { CreateProductDto } from './create-product/create-product-dto.interface';
import { EditProductDto } from './edit-product-dto.interface';
import { Product } from './product';
@Injectable({
  providedIn: 'root',
})
export class ProductService extends BaseService {
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

  getAllProducts() {
    return this.http.get<Product[]>(`${this.baseurl}/managed-products`, this.httpOptions).pipe(
      map((products) => {
        return products.map((product) => <Product>this.formatEntityDate(product));
      })
    );
  }

  getProduct(productId: string) {
    return this.http.get<Product>(`${this.baseurl}/managed-products/${productId}`, this.httpOptions).pipe(
      map((product) => {
        return <Product>this.formatEntityDate(product);
      })
    );
  }

  createProduct(createProductDto: CreateProductDto) {
    const { maxPrice, ...restOfData } = createProductDto;

    let data = null;

    if (maxPrice) {
      data = { ...restOfData, maxPrice: maxPrice };
    } else {
      data = { ...restOfData };
    }

    return this.http.post<Product>(`${this.baseurl}/managed-products`, data, this.httpOptions).pipe(
      map((product) => {
        return <Product>this.formatEntityDate(product);
      })
    );
  }

  editProduct(id: string, editProductDto: EditProductDto): Observable<Product | ResponseMessage> {
    if (isEmpty(editProductDto)) {
      return new Observable<ResponseMessage>((subscriber) => {
        subscriber.next(<ResponseMessage>{ statusCode: '400', message: 'At least, one parameter should not be empty' });
      });
    }

    return this.http.patch<Product>(`${this.baseurl}/managed-products/${id}`, editProductDto, this.httpOptions).pipe(
      map((product) => {
        return <Product>this.formatEntityDate(product);
      })
    );
  }

  toggleProducts(products: string[], store: string, enabled: boolean) {
    const data = {
      products: products,
      store: store,
    };

    if (enabled) {
      return this.http.patch<ResponseMessage>(`${this.baseurl}/managed-products/status/`, data, this.httpOptions);
    } else {
      return this.http.patch<ResponseMessage>(`${this.baseurl}/managed-products/status/`, data, this.httpOptions);
    }
  }

  getStoreCategories(storeId: string) {
    return this.http.get<SelectEntity[]>(`${this.baseurl}/stores/${storeId}/categories`, this.httpOptions);
  }

  uploadProductImage(productId: string, file: FormData): Observable<any> {
    const url = `${this.baseurl}/files/upload/product/${productId}`;

    return this.http.post<any>(url, file, {
      reportProgress: true,
      observe: 'events',
    });
  }

  getProductImages(productId: string) {
    return this.http.get<{ name: string }[]>(`${this.baseurl}/files/product/${productId}`, this.httpOptions);
  }

  deleteProductImage(fileName: string) {
    return this.http.delete<{ message: string }>(`${this.baseurl}/files/${fileName}`, this.httpOptions);
  }

  // Generate full image URL
  getImageUrl(fileName: string): string {
    if (!this.baseStorageUrl) {
      return '';
    }

    return `${this.baseStorageUrl}${fileName}`;
  }
}
