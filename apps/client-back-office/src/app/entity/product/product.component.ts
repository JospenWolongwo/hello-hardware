/* eslint-disable max-lines */
import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { SelectEntity } from '../../shared/interfaces/select-entity';
import { PopUpConfirmationComponent } from '../../shared/pop-up-confirmation/pop-up-confirmation.component';
import { PopUpMessageComponent } from '../../shared/pop-up-message/pop-up-message.component';
import {
  confirmationModalConfig,
  dialogFormConfig,
  successModalConfig,
  viewModalConfig,
} from '../../shared/utils/constants';
import { EntityComponent } from '../entity.component';
import { Store } from '../store/store';
import { CreateProductComponent } from './create-product/create-product.component';
import { CreateProductDto } from './create-product/create-product-dto.interface';
import { UploadImagesDialogComponent } from './upload-product-images/upload-images-dialog.component';
import { ViewProductComponent } from './view-product/view-product.component';
import { Product } from './product';
import { ProductService } from './product.service';
import { ProductPaginatorIntl } from './product-category-paginator-intl.service';
import { ProductEditProperty } from './product-edit-property.interface';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  providers: [ProductService, { provide: MatPaginatorIntl, useClass: ProductPaginatorIntl }],
})
export class ProductComponent extends EntityComponent implements OnInit, OnDestroy, AfterViewInit {
  constructor(private route: ActivatedRoute, private productService: ProductService, public dialog: MatDialog) {
    super();
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  subscriptions: Subscription[] = [];

  stores: SelectEntity[] = [];

  products: Product[] = [];

  categories: SelectEntity[] = [];

  selectedStore = '';

  permissions = {
    viewProduct: false,
    createProduct: false,
    viewStock: false,
    editProduct: false,
  };

  selection = new SelectionModel<Product>(true, []);

  changeStore(storeId: string) {
    this.selectedStore = storeId;
    this.selection.clear();

    // Filter products for the selected store
    this.data = this.products.filter((product) => product.store?.id === this.selectedStore);

    this.dataSource.data = this.data;

    // Dynamically load categories for the selected store
    this.loadCategoriesForStore(storeId);
  }

  get isAllSelected() {
    const numSelected = this.selection.selected.length;

    const numRows = this.dataSource.data.length;

    return numSelected === numRows;
  }

  isSelected(product: Product) {
    return this.selection.isSelected(product);
  }

  toggleRow(event: Event, product: Product) {
    event.stopPropagation();
    this.selection.toggle(product);
  }

  toggleAllRows() {
    if (this.isAllSelected) {
      this.selection.clear();

      return;
    }

    this.selection.select(...(<Product[]>this.dataSource.data));
  }

  get selectionIsNotEmpty() {
    return this.selection.hasValue();
  }

  get allIsSelected() {
    return this.selectionIsNotEmpty && this.isAllSelected;
  }

  get undetermined() {
    return this.selectionIsNotEmpty && !this.isAllSelected;
  }

  private updateProductList(editedProduct: Product) {
    const productIndex = this.products.findIndex((product) => product.id === editedProduct.id);

    if (productIndex !== -1) {
      this.products[productIndex] = editedProduct;
    }

    this.changeStore(this.selectedStore);
  }

  private cleanFormData(productId: string, formData: CreateProductDto) {
    const productToEdit = <Product>this.products.find((product) => product.id === productId);

    const productKeys = <ProductEditProperty[]>Object.keys(productToEdit);

    productKeys.forEach((key) => {
      if (formData[key] === productToEdit[key]) {
        delete formData[key];
      }
    });

    return formData;
  }

  private editProductsStatus(products: string[], status: boolean) {
    products.forEach((product) => {
      const productIndex = this.products.findIndex((productToEdit) => productToEdit.id === product);

      if (productIndex > -1) {
        this.products[productIndex].status = status;
      }
    });

    this.changeStore(this.selectedStore);
  }

  private deactivateProduct(products: string[], store: string) {
    return this.productService.toggleProducts(products, store, false).subscribe((response) => {
      const messageDialogRef = this.dialog.open(PopUpMessageComponent, {
        data: {
          title: $localize`:Modal Title|Successful operation pop up message title@@successPopUpMessageTitle:Success`,
          message: response.message,
          class: 'success',
        },
        ...successModalConfig,
      });

      this.subscriptions.push(
        messageDialogRef.afterClosed().subscribe(() => {
          this.editProductsStatus(products, false);
        })
      );
    });
  }

  private activateProduct(products: string[], store: string) {
    return this.productService.toggleProducts(products, store, true).subscribe((response) => {
      const messageDialogRef = this.dialog.open(PopUpMessageComponent, {
        data: {
          title: $localize`:Modal Title|Successful operation pop up message title@@successPopUpMessageTitle:Success`,
          message: response.message,
          class: 'success',
        },
        ...successModalConfig,
      });

      this.subscriptions.push(
        messageDialogRef.afterClosed().subscribe(() => {
          this.editProductsStatus(products, true);
        })
      );
    });
  }

  private editProduct(formData: CreateProductDto, productId: string) {
    const editProductDto = this.cleanFormData(productId, formData);

    return this.productService.editProduct(productId, editProductDto).subscribe((editedProduct) => {
      if ('statusCode' in editedProduct) {
        this.dialog.open(PopUpMessageComponent, {
          data: {
            title: $localize`:Modal Title|Failed operation pop up message title@@errorPopUpMessageTitle:Error`,
            message: editedProduct.message,
            class: 'error',
          },
          minWidth: '300px',
          ariaLabel: $localize`:An Error occurred@@errorModal:An error occurred`,
        });
      } else {
        const messageDialogRef = this.dialog.open(PopUpMessageComponent, {
          data: {
            title: $localize`:Modal Title|Successful operation pop up message title@@successPopUpMessageTitle:Success`,
            message: $localize`:Modal Content|Successful update of a store message@@editProductMessage:The product was successfully edited.`,
            class: 'success',
          },
          ...successModalConfig,
        });

        this.subscriptions.push(
          messageDialogRef.afterClosed().subscribe(() => {
            this.updateProductList(editedProduct);
          })
        );
      }
    });
  }

  private createProduct(createProductDto: CreateProductDto) {
    return this.productService.createProduct(createProductDto).subscribe((product) => {
      const messageDialogRef = this.dialog.open(PopUpMessageComponent, {
        data: {
          title: $localize`:Modal Title|Successful operation pop up message title@@successPopUpMessageTitle:Success`,
          message: $localize`:Modal content|Successful product creation content@@successProductCreationMessage:The Product ${
            (<Product>product).name
          } was successfully created.`,
          class: 'success',
        },
        ...successModalConfig,
      });

      this.subscriptions.push(
        messageDialogRef.afterClosed().subscribe(() => {
          this.products.push(product);
        })
      );
    });
  }

  creationDialog() {
    const createProductDialogRef = this.dialog.open(CreateProductComponent, {
      data: {
        title: $localize`:Modal Title|Create a Product modal title@@createProductModalTitle:Create a Product`,
        action: $localize`:Modal Action|Create modal action@@createAction:Create`,
        stores: this.stores,
        categories: this.categories,
      },
      ...dialogFormConfig,
      minHeight: '400px',
      ariaLabel: $localize`:Add a product modal@@addProductModal:Add product modal`,
    });

    this.subscriptions.push(
      createProductDialogRef.afterClosed().subscribe((result: CreateProductDto) => {
        if (result?.name) {
          this.subscriptions.push(this.createProduct(result));
        }
      })
    );
  }

  updateDialog(productId: string) {
    const selectedProduct = <Product>this.products.find((product) => product.id === productId);

    const productData: CreateProductDto = {
      name: selectedProduct.name,
      description: selectedProduct.description,
      maxPrice: selectedProduct.maxPrice,
      minPrice: selectedProduct.minPrice,
      brand: selectedProduct.brand,
      gallery: selectedProduct.gallery,
      store: selectedProduct.store.id,
      category: selectedProduct.category.id,
      active: selectedProduct.active ?? true,
      pictures: selectedProduct.pictures || [],
      extraAttributes: selectedProduct.extraAttributes,
    };

    const editProductDialogRef = this.dialog.open(CreateProductComponent, {
      data: {
        title: $localize`:Modal Title|Edit product modal title@@editProductModalTitle:Edit ${productData.name} Product`,
        productInfo: productData,
        action: $localize`:Modal Action|Edit store modal action@@editModalAction:Edit`,
        stores: this.stores,
        categories: this.categories,
      },
      ...dialogFormConfig,
      minHeight: '400px',
      ariaLabel: $localize`:Edit a product modal@@editProductModal:Edit product modal`,
    });

    this.subscriptions.push(
      editProductDialogRef.beforeClosed().subscribe((formData: CreateProductDto) => {
        if (formData?.name) {
          const confirmationDialogRef = this.dialog.open(PopUpConfirmationComponent, {
            data: {
              message: $localize`:Confirmation Modal Message|Edit product confirmation message@@editProductConfirmationMessage:Are you sure you want to edit the ${productData.name} product?`,
            },
            ...confirmationModalConfig,
          });

          this.subscriptions.push(
            confirmationDialogRef.afterClosed().subscribe((response: boolean) => {
              if (response) {
                this.subscriptions.push(this.editProduct(formData, productId));
              }
            })
          );
        }
      })
    );
  }

  activateProductDialog() {
    const confirmActivationDialogRef = this.dialog.open(PopUpConfirmationComponent, {
      data: {
        message: $localize`:Activation of products message@@activateProductsConfirmationMessage:Are you sure you want to activate the selected product(s)?`,
      },
      ...confirmationModalConfig,
    });

    this.subscriptions.push(
      confirmActivationDialogRef.afterClosed().subscribe((answer: boolean) => {
        if (answer) {
          const products = this.selection.selected.map((product) => product.id);

          this.subscriptions.push(this.activateProduct(products, this.selectedStore));
        }
      })
    );
  }

  deactivateProductDialog() {
    const confirmActivationDialogRef = this.dialog.open(PopUpConfirmationComponent, {
      data: {
        message: $localize`:Deactivation of products message@@deactivateProductsConfirmationMessage:Are you sure you want to deactivate the selected product(s)?`,
      },
      ...confirmationModalConfig,
    });

    this.subscriptions.push(
      confirmActivationDialogRef.afterClosed().subscribe((answer: boolean) => {
        if (answer) {
          const products = this.selection.selected.map((product) => product.id);

          this.subscriptions.push(this.deactivateProduct(products, this.selectedStore));
        }
      })
    );
  }

  viewProductDialog(productId: string) {
    const productData = <Product>this.products.find((product) => product.id === productId);

    const categoryName = (<SelectEntity>this.categories.find((category) => category.id === productData.category.id))
      .name;

    this.dialog.open(ViewProductComponent, {
      data: {
        ...productData,
        category: categoryName,
        store: productData.store.name,
      },
      ...viewModalConfig,
      ariaLabel: $localize`:View product Modal@@viewProductModal:View product modal`,
    });
  }

  loadCategoriesForStore(storeId: string) {
    this.productService.getStoreCategories(storeId).subscribe({
      next: (categories) => {
        this.categories = categories; // Update categories dynamically
      },
      error: () => {
        this.categories = [];
      },
    });
  }

  openUploadImagesDialog(productId: string): void {
    const dialogRef = this.dialog.open(UploadImagesDialogComponent, {
      width: '600px',
      data: {
        entityId: productId,
        uploadService: {
          getImages: this.productService.getProductImages.bind(this.productService),
          uploadImage: this.productService.uploadProductImage.bind(this.productService),
          deleteImage: this.productService.deleteProductImage.bind(this.productService),
        },
        dialogTitle: 'Upload Product Images',
      },
    });

    // Handle dialog close event
    dialogRef.afterClosed().subscribe((success: boolean) => {
      if (success) {
        this.dialog.open(PopUpMessageComponent, {
          data: {
            title: 'Success',
            message: 'Product images uploaded successfully.',
            class: 'success',
          },
          ...successModalConfig,
        });
      }
    });
  }

  ngOnInit(): void {
    this.displayedColumns = ['select', 'row-number', 'name', 'gallery', 'brand', 'category', 'status', 'actions'];

    this.subscriptions.push(
      this.route.data.subscribe(({ products, stores, userPermissions }) => {
        const permissions = <string[]>userPermissions;

        this.permissions.createProduct = permissions.includes('CreateProduct');

        this.permissions.editProduct = permissions.includes('EditProduct');

        this.permissions.viewProduct = permissions.includes('ViewProduct');

        this.permissions.viewStock = permissions.includes('ViewStock');

        this.products = products;

        this.categories = [];

        this.stores = (<Store[]>stores).map(
          (store) =>
            <SelectEntity>{
              id: store.id,
              name: store.name,
            }
        );
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
