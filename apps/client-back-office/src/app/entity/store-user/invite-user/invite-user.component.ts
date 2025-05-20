import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BaseFormComponent } from '../../base-form.component';

@Component({
  selector: 'app-invite-user',
  templateUrl: './invite-user.component.html',
})
export class InviteUserComponent extends BaseFormComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { title: string; action: string; stores: string[] }) {
    const createStoreForm = new FormGroup({
      email: new FormControl(null, [
        Validators.required,
        Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
      ]),
      store: new FormControl(null, Validators.required),
    });

    super(createStoreForm);
  }
}
