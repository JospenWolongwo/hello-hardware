import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BaseFormComponent } from '../../base-form.component';

@Component({
  selector: 'app-create-product-category',
  templateUrl: './create-product-category.component.html',
})
export class CreateProductCategoryComponent extends BaseFormComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { title: string; categoryInfo: { name: string; description: string } | undefined; action: string }
  ) {
    const nameValue = data.categoryInfo?.name ?? null;

    const descriptionValue = data.categoryInfo?.description ?? null;

    const productCategoryCreationForm = new FormGroup({
      name: new FormControl(nameValue, Validators.required),
      description: new FormControl(descriptionValue, [Validators.minLength(1)]),
    });

    super(productCategoryCreationForm);
  }
}
