import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import type { Store } from '../store';

@Component({
  selector: 'app-view-store',
  templateUrl: './view-store.component.html',
})
export class ViewStoreComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: Store
  ) {}
}
