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
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { NgxColorsModule } from 'ngx-colors';
import { CreateStockComponent } from './create-stock/create-stock.component';
import { ViewStockComponent } from './view-stock/view-stock.component';
import { StockComponent } from './stock.component';

@NgModule({
  declarations: [StockComponent, CreateStockComponent, ViewStockComponent],
  imports: [
    CommonModule,
    RouterModule,
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
    NgxColorsModule,
    MatSelectModule,
  ],
})
export class StockModule {}
