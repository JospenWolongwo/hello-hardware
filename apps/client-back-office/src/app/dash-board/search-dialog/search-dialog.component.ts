import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import type { SearchData } from '../../shared/interfaces/search-data';

@Component({
  selector: 'app-search-dialog',
  templateUrl: './search-dialog.component.html',
})
export class SearchDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: SearchData) {}
}
