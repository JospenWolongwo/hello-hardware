import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { CreateProductCategoryComponent } from './create-product-category/create-product-category.component';
import { ViewProductCategoryComponent } from './view-product-category/view-product-category.component';
import { ProductCategoryComponent } from './product-category.component';

@NgModule({
  declarations: [ProductCategoryComponent, CreateProductCategoryComponent, ViewProductCategoryComponent],
  imports: [
    CommonModule,
    FlexLayoutModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatMenuModule,
    MatButtonModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  exports: [ProductCategoryComponent],
})
export class ProductCategoryModule {}
