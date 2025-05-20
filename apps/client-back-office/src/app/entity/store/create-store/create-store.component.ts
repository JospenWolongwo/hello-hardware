import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BaseFormComponent } from '../../base-form.component';

@Component({
  selector: 'app-create-store',
  templateUrl: './create-store.component.html',
})
export class CreateStoreComponent extends BaseFormComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { title: string; categoryInfo: { name: string; description: string } | undefined; action: string }
  ) {
    const nameValue = data.categoryInfo?.name ? data.categoryInfo.name : null;

    const descriptionValue = data.categoryInfo?.description ? data.categoryInfo.description : null;

    const createStoreForm = new FormGroup({
      name: new FormControl(nameValue, Validators.required),
      description: new FormControl(descriptionValue, [Validators.minLength(1)]),
    });

    super(createStoreForm);
  }
}
