import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Stock } from '../stock';

@Component({
  selector: 'app-view-stock',
  templateUrl: './view-stock.component.html',
})
export class ViewStockComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: Stock) {}
}
