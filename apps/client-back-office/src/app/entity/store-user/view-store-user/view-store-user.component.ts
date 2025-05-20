import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import type { StoreUser } from '../store-user';

@Component({
  selector: 'app-view-store-user',
  templateUrl: './view-store-user.component.html',
})
export class ViewStoreUserComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: StoreUser
  ) {}

  get userName() {
    return `${this.data.firstName} ${this.data.lastName}`;
  }

  get status() {
    const status = this.data.enabled ? 'Active' : 'Inactive';

    return status;
  }
}
