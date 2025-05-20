/* eslint-disable  @typescript-eslint/consistent-type-imports */
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
/* eslint-disable  @typescript-eslint/consistent-type-imports */
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
/* eslint-disable  @typescript-eslint/consistent-type-imports */
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProductCategoryService } from '../../entity/product-category/product-category.service';
import { PopUpConfirmationComponent } from '../../shared/pop-up-confirmation/pop-up-confirmation.component';
import { PopUpMessageComponent } from '../../shared/pop-up-message/pop-up-message.component';
import {
  confirmationModalConfig,
  dialogFormConfig,
  successModalConfig,
  viewModalConfig,
} from '../../shared/utils/constants';
import { EntityComponent } from '../entity.component';
import { CreateProductCategoryComponent } from './create-product-category/create-product-category.component';
import { CreateProductCategoryDto } from './create-product-category/create-product-category-dto.interface';
import { ViewProductCategoryComponent } from './view-product-category/view-product-category.component';
import { ProductCategory } from './product-category';
import { ProductCategoryPaginatorIntl } from './product-category-paginator-intl.service';

@Component({
  selector: 'app-product-category',
  templateUrl: './product-category.component.html',
  providers: [ProductCategoryService, { provide: MatPaginatorIntl, useClass: ProductCategoryPaginatorIntl }],
})
export class ProductCategoryComponent extends EntityComponent implements OnInit, OnDestroy, AfterViewInit {
  constructor(
    private route: ActivatedRoute,
    private productCategoryService: ProductCategoryService,
    public dialog: MatDialog
  ) {
    super();
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  subscriptions: Subscription[] = [];

  updateDataListElement(editedCategory: ProductCategory) {
    const categoryIndex = this.data.findIndex((category) => category.id === editedCategory.id);
    this.data = this.data.map((category) => {
      const index = (<ProductCategory>category).subCategories.findIndex(
        (subCategory) => subCategory === (<ProductCategory>this.data[categoryIndex]).name
      );

      if (index !== -1) {
        (<ProductCategory>category).subCategories[index] = editedCategory.name;
      }

      if ((<ProductCategory>category).parent === (<ProductCategory>this.data[categoryIndex]).name) {
        (<ProductCategory>category).parent = editedCategory.name;
      }

      return category;
    });

    editedCategory.parent = (<ProductCategory>this.data[categoryIndex]).parent;
    editedCategory.subCategories = (<ProductCategory>this.data[categoryIndex]).subCategories;

    this.data[categoryIndex] = editedCategory;

    this.dataSource.data = this.data;
  }

  createCategory(createCategoryDto: CreateProductCategoryDto) {
    return this.productCategoryService.createCategory(createCategoryDto).subscribe((newCategory) => {
      const messageDialogRef = this.dialog.open(PopUpMessageComponent, {
        data: {
          title: $localize`:Modal Title|Successful operation pop up message title@@successPopUpMessageTitle:Success`,
          message: $localize`:Modal Content|Successful creation of product category message@@createdProductCategoryMessage:The ${newCategory.name} category was successfully added.`,
          class: 'success',
        },
        ...successModalConfig,
      });

      this.subscriptions.push(
        messageDialogRef.afterClosed().subscribe(() => {
          this.data.push(newCategory);

          this.dataSource.data = this.data;
        })
      );
    });
  }

  createSubCategory(createCategoryDto: CreateProductCategoryDto, parent: ProductCategory) {
    return this.productCategoryService.createCategory(createCategoryDto, parent.id).subscribe((newCategory) => {
      const messageDialogRef = this.dialog.open(PopUpMessageComponent, {
        data: {
          title: $localize`:Modal Title|Successful operation pop up message title@@successPopUpMessageTitle:Success`,
          message: $localize`:Modal Content|Successful creation of product sub-category message@@createdProductSubCategoryMessage:The ${newCategory.name} sub-category was successfully added to the ${parent.name} category.`,
          class: 'success',
        },
        ...successModalConfig,
      });

      this.subscriptions.push(
        messageDialogRef.afterClosed().subscribe(() => {
          this.data.push(newCategory);

          this.dataSource.data = this.data;
        })
      );
    });
  }

  editCategory(editCategoryDto: CreateProductCategoryDto, categoryId: string) {
    return this.productCategoryService.editCategory(editCategoryDto, categoryId).subscribe((editedCategory) => {
      const messageDialogRef = this.dialog.open(PopUpMessageComponent, {
        data: {
          title: $localize`:Modal Title|Successful operation pop up message title@@successPopUpMessageTitle:Success`,
          message: $localize`:Modal Content|Successful update of a product category message@@editProductCategoryMessage:The category was successfully edited.`,
          class: 'success',
        },
        ...successModalConfig,
      });

      this.subscriptions.push(
        messageDialogRef.afterClosed().subscribe(() => {
          this.updateDataListElement(editedCategory);
        })
      );
    });
  }

  createCategoryDialog() {
    const createProductCategoryDialogRef = this.dialog.open(CreateProductCategoryComponent, {
      data: {
        title: $localize`:Modal Title|Create product category modal title@@createProductCategoryModalTitle:New product category`,
        action: $localize`:Modal Action|Create product category modal action@@createAction:Create`,
      },
      ...dialogFormConfig,
      ariaLabel: $localize`:Product category creation modal@@categoryCreationModal:Product category creation Modal`,
    });
    this.subscriptions.push(
      createProductCategoryDialogRef.afterClosed().subscribe((result: CreateProductCategoryDto) => {
        if (result?.name) {
          this.subscriptions.push(this.createCategory(result));
        }
      })
    );
  }

  createSubCategoryDialog(parentId: string) {
    const parentData = <ProductCategory>this.data.find((category) => category.id === parentId);

    const parentName = parentData.parent ? `${parentData.name} (${parentData.parent})` : `${parentData.name}`;

    const createProductSubCategoryDialogRef = this.dialog.open(CreateProductCategoryComponent, {
      data: {
        title: $localize`:Modal Title|Create product sub-category modal title@@createProductSubCategoryModalTitle:New product sub-category of ${parentName}`,
        action: $localize`:Modal Action|Create product sub-category modal action@@createAction:Create`,
      },
      maxWidth: '500px',
      ...dialogFormConfig,
      ariaLabel: $localize`:Product sub-category creation modal@@subcategoryCreationModal:Product sub-category creation modal`,
    });

    this.subscriptions.push(
      createProductSubCategoryDialogRef.afterClosed().subscribe((result: CreateProductCategoryDto) => {
        if (result?.name) {
          this.subscriptions.push(this.createSubCategory(result, parentData));
        }
      })
    );
  }

  editCategoryDialog(categoryId: string) {
    const categoryData = <ProductCategory>this.data.find((category) => category.id === categoryId);

    const categoryName = categoryData.parent ? `${categoryData.name} (${categoryData.parent})` : `${categoryData.name}`;

    const editCategoryDialogRef = this.dialog.open(CreateProductCategoryComponent, {
      data: {
        title: $localize`:Modal Title|Edit product category modal title@@editProductCategoryModalTitle:Edit ${categoryName} category`,
        categoryInfo: { name: categoryData.name, description: categoryData.description },
        action: $localize`:Modal Action|Edit product category modal action@@editAction:Edit`,
      },
      ...dialogFormConfig,
      maxWidth: '500px',
      ariaLabel: $localize`:Edit category Modal@@editCategoryModal:Edit category modal`,
    });

    this.subscriptions.push(
      editCategoryDialogRef.beforeClosed().subscribe((result: CreateProductCategoryDto) => {
        if (result?.name) {
          const confirmationDialogRef = this.dialog.open(PopUpConfirmationComponent, {
            data: {
              message: $localize`:Confirmation Modal Message|Edit product category confirmation message@@editProductCategoryConfirmationMessage:Are you sure you want to edit the ${categoryName} category?`,
            },
            ...confirmationModalConfig,
          });

          this.subscriptions.push(
            confirmationDialogRef.afterClosed().subscribe((response: boolean) => {
              if (response) {
                this.subscriptions.push(this.editCategory(result, categoryId));
              }
            })
          );
        }
      })
    );
  }

  viewCategoryDialog(categoryId: string) {
    const categoryData = <ProductCategory>this.data.find((category) => category.id === categoryId);

    this.dialog.open(ViewProductCategoryComponent, {
      data: {
        ...categoryData,
      },
      ...viewModalConfig,
      ariaLabel: $localize`:View category Modal@@viewCategoryModal:View category modal`,
    });
  }

  ngOnInit(): void {
    this.displayedColumns = [
      'row-number',
      'name',
      'description',
      'parent',
      'sub-categories',
      'created-at',
      'updated-at',
      'actions',
    ];

    this.subscriptions.push(
      this.route.data.subscribe(({ productCategories }) => {
        this.data = productCategories;

        this.dataSource.data = this.data;
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }
}
