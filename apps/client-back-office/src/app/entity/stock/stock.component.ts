/* eslint-disable max-lines */
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { ActivatedRoute } from '@angular/router';
import { isEmpty } from 'lodash-es';
import { Subscription } from 'rxjs';
import { PopUpMessageComponent } from '../../shared/pop-up-message/pop-up-message.component';
import { dialogFormConfig, successModalConfig, viewModalConfig } from '../../shared/utils/constants';
import { EntityComponent } from '../entity.component';
import { Product } from '../product/product';
import { UploadImagesDialogComponent } from '../product/upload-product-images/upload-images-dialog.component';
import { CreateStockComponent } from './create-stock/create-stock.component';
import { CreateStockDto, createStockDtoFromResult } from './create-stock/create-stock-dto';
import { EditStockDto } from './create-stock/edit-stock-dto';
import { EditStockQuantityDto } from './create-stock/edit-stock-quantity-dto';
import { ViewStockComponent } from './view-stock/view-stock.component';
import { Stock } from './stock';
import { StockService } from './stock.service';
import { StockPaginatorIntl } from './stock-paginator-intl.service';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  providers: [StockService, { provide: MatPaginatorIntl, useClass: StockPaginatorIntl }],
})
export class StockComponent extends EntityComponent implements OnInit, OnDestroy, AfterViewInit {
  constructor(private route: ActivatedRoute, private stockService: StockService, public dialog: MatDialog) {
    super();
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  subscriptions: Subscription[] = [];

  product: Product | null = null;

  permissions = {
    createStock: false,
    changeStockQuantity: false,
    updateStock: false,
    viewStock: false,
  };

  get productName() {
    return this.product?.name ?? '';
  }

  private productId() {
    return this.product?.id ?? '';
  }

  private editStockQuantity(editStockQuantityDto: EditStockQuantityDto, stockId: string) {
    return this.stockService.changeProductStockQuantity(stockId, editStockQuantityDto).subscribe((updatedStock) => {
      const messageDialogRef = this.dialog.open(PopUpMessageComponent, {
        data: {
          title: $localize`:Modal Title|Successful operation pop up message title@@successPopUpMessageTitle:Success`,
          message: $localize`:Modal content|Successful stock quantity update content@@successStockQuantityUpdateMessage: ${this.productName.toLocaleUpperCase()} stock quantity was successfully updated.`,
          class: 'success',
        },
        ...successModalConfig,
      });

      this.subscriptions.push(
        messageDialogRef.afterClosed().subscribe(() => {
          this.data = this.data.map((stock) => (stock.id === updatedStock.id ? updatedStock : stock));

          this.dataSource.data = this.data;
        })
      );
    });
  }

  private editStock(editStockDto: EditStockDto, stockId: string) {
    return this.stockService.editProductStock(stockId, editStockDto).subscribe((updatedStock) => {
      const messageDialogRef = this.dialog.open(PopUpMessageComponent, {
        data: {
          title: $localize`:Modal Title|Successful operation pop up message title@@successPopUpMessageTitle:Success`,
          message: $localize`:Modal content|Successful stock update content@@successStockUpdateMessage: ${this.productName.toLocaleUpperCase()} stock was successfully updated.`,
          class: 'success',
        },
        ...successModalConfig,
      });

      this.subscriptions.push(
        messageDialogRef.afterClosed().subscribe(() => {
          this.data = this.data.map((stock) => (stock.id === updatedStock.id ? updatedStock : stock));

          this.dataSource.data = this.data;
        })
      );
    });
  }

  private createStock(createStockDto: CreateStockDto) {
    return this.stockService.createProductStock(createStockDto).subscribe((stock) => {
      const messageDialogRef = this.dialog.open(PopUpMessageComponent, {
        data: {
          title: $localize`:Modal Title|Successful operation pop up message title@@successPopUpMessageTitle:Success`,
          message: $localize`:Modal content|Successful stock creation content@@successStockCreationMessage: ${
            stock.quantity
          } ${stock.keepingUnit.toLocaleUpperCase()} of ${this.productName.toLocaleUpperCase()} were successfully added in stock.`,
          class: 'success',
        },
        ...successModalConfig,
      });

      this.subscriptions.push(
        messageDialogRef.afterClosed().subscribe(() => {
          this.data.push(stock);
          this.dataSource.data = this.data;
        })
      );
    });
  }

  updateQuantityDialog(id: string) {
    const stockToEdit = <Stock>this.data.find((stock) => stock.id === id);

    const editStockQuantityDialogRef = this.dialog.open(CreateStockComponent, {
      data: {
        title: $localize`:Modal Title|Edit a stock modal title@@editStockModalTitle:Edit ${this.productName.toUpperCase()} stock quantity`,
        action: $localize`:Modal Action|Update modal action@@updateAction:Update`,
        maxPrice: this.product?.maxPrice,
        minPrice: this.product?.minPrice,
        stockQuantity: stockToEdit.quantity,
      },
      ...dialogFormConfig,
      minHeight: '400px',
      ariaLabel: $localize`:Edit a stock quantity modal@@editStockQuantityModal:Edit stock quantity modal`,
    });

    this.subscriptions.push(
      editStockQuantityDialogRef.afterClosed().subscribe((result: { quantity: number }) => {
        if (result?.quantity) {
          if (result.quantity === stockToEdit.quantity) {
            this.dialog.open(PopUpMessageComponent, {
              data: {
                title: $localize`:Modal Title|Warning pop up message title@@warningPopUpMessageTitle:Warning`,
                message: $localize`:Modal content|Error stock update content@@errorStockUpdateMessage: The ${this.productName.toLocaleUpperCase()} stock has nothing to update.`,
                class: 'success',
              },
              ...successModalConfig,
            });
          } else {
            this.subscriptions.push(this.editStockQuantity(result, id));
          }
        }
      })
    );
  }

  viewDialog(id: string) {
    const stockData = <Stock>this.data.find((stock) => stock.id === id);

    this.dialog.open(ViewStockComponent, {
      data: {
        ...stockData,
      },
      ...viewModalConfig,
      ariaLabel: $localize`:View product stock Modal@@viewProductStockModal:View product stock modal`,
    });
  }

  updateDialog(id: string) {
    const stockToEdit = <Stock>this.data.find((stock) => stock.id === id);
    const editStockDialogRef = this.dialog.open(CreateStockComponent, {
      data: {
        title: $localize`:Modal Title|Edit a stock modal title@@editStockModalTitle:Edit ${this.productName.toUpperCase()} stock`,
        action: $localize`:Modal Action|Edit modal action@@editAction:Edit`,
        maxPrice: this.product?.maxPrice,
        minPrice: this.product?.minPrice,
        stockInfo: {
          unit: stockToEdit.keepingUnit,
          price: stockToEdit.price,
        },
      },
      ...dialogFormConfig,
      minHeight: '400px',
      ariaLabel: $localize`:Edit a stock modal@@editStockModal:Edit stock modal`,
    });

    this.subscriptions.push(
      editStockDialogRef.afterClosed().subscribe((result: { unit?: string; price?: number }) => {
        if (result?.unit) {
          if (result.unit === stockToEdit.keepingUnit) {
            delete result.unit;
          }

          if (result.price === stockToEdit.price) {
            delete result.price;
          }

          if (isEmpty(result)) {
            this.dialog.open(PopUpMessageComponent, {
              data: {
                title: $localize`:Modal Title|Warning pop up message title@@warningPopUpMessageTitle:Warning`,
                message: $localize`:Modal content|Error stock update content@@errorStockUpdateMessage: The ${this.productName.toLocaleUpperCase()} stock has nothing to update.`,
                class: 'success',
              },
              ...successModalConfig,
            });
          } else {
            this.subscriptions.push(this.editStock(result, id));
          }
        }
      })
    );
  }

  creationDialog() {
    const createStockDialogRef = this.dialog.open(CreateStockComponent, {
      data: {
        title: $localize`:Modal Title|Create a stock modal title@@createStockModalTitle:Add a stock for ${this.productName.toUpperCase()}`,
        action: $localize`:Modal Action|Create modal action@@createAction:Create`,
        maxPrice: this.product?.maxPrice,
        minPrice: this.product?.minPrice,
        characteristics: this.product?.extraAttributes?.characteristics ?? [],
      },
      ...dialogFormConfig,
      minHeight: '400px',
      ariaLabel: $localize`:Add a stock modal@@addStockModal:Add stock modal`,
    });

    this.subscriptions.push(
      createStockDialogRef.afterClosed().subscribe((result) => {
        if (result?.keepingUnit) {
          const createStockPayload = createStockDtoFromResult(result, this.productId());
          this.subscriptions.push(this.createStock(createStockPayload));
        }
      })
    );
  }

  openUploadStockImagesDialog(stockId: string): void {
    const dialogData = {
      entityId: stockId,
      uploadService: {
        getImages: this.stockService.getStockImages.bind(this.stockService),
        uploadImage: this.stockService.uploadStockImage.bind(this.stockService),
        deleteImage: this.stockService.deleteStockImage.bind(this.stockService),
        getImageUrl: this.stockService.getImageUrl.bind(this.stockService),
      },
      dialogTitle: 'Upload Stock Images',
    };

    const dialogRef = this.dialog.open(UploadImagesDialogComponent, {
      width: '600px',
      data: dialogData,
    });

    dialogRef.afterClosed().subscribe((success: boolean) => {
      if (success) {
        this.dialog.open(PopUpMessageComponent, {
          data: {
            title: 'Success',
            message: 'Stock images uploaded successfully.',
            class: 'success',
          },
          ...successModalConfig,
        });
      }
    });
  }

  ngOnInit(): void {
    this.displayedColumns = ['row-number', 'unit', 'price', 'quantity', 'created-at', 'updated-at', 'actions'];
    this.subscriptions.push(
      this.route.data.subscribe(({ stocks, userPermissions, product }) => {
        const permissions = <string[]>userPermissions;

        this.permissions.changeStockQuantity = permissions.includes('ChangeStockQuantity');

        this.permissions.createStock = permissions.includes('CreateStock');

        this.permissions.updateStock = permissions.includes('UpdateStock');

        this.permissions.viewStock = permissions.includes('ViewStock');

        this.product = <Product>product;

        this.data = <Stock[]>stocks;

        this.dataSource.data = this.data;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
