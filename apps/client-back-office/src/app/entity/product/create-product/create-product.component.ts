import { Component, Inject } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SelectEntity } from '../../../shared/interfaces/select-entity';
import { alphabeticValidator } from '../../../shared/validators/product-characteristics.validator';
import { CreateProductDto } from './create-product-dto.interface';

@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
})
export class CreateProductComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      title: string;
      productInfo: CreateProductDto | undefined;
      action: string;
      stores: SelectEntity[];
      categories: SelectEntity[];
    }
  ) {}

  isEditable = true;

  minPrice = this.data.productInfo?.minPrice ?? 1;

  descriptionMinLength = 25;

  product = this.data.productInfo ?? {
    name: '',
    brand: '',
    description: '',
    minPrice: this.minPrice,
    maxPrice: null,
    store: '',
    category: '',
    gallery: '',
    active: true,
    pictures: [],
    extraAttributes: {
      characteristics: [],
    },
  };

  firstFormGroup = new FormGroup({
    name: new FormControl(this.product.name, [Validators.required]),
    brand: new FormControl(this.product.brand, [Validators.required]),
    active: new FormControl(this.product.active),
  });

  secondFormGroup = new FormGroup({
    description: new FormControl(this.product.description, [
      Validators.required,
      Validators.minLength(this.descriptionMinLength),
    ]),
  });

  thirdFormGroup = new FormGroup({
    extraAttributes: new FormGroup({
      characteristics: new FormControl('', [Validators.required, alphabeticValidator()]),
    }),
    minPrice: new FormControl(this.product.minPrice, [Validators.required, Validators.min(1)]),
    maxPrice: new FormControl(this.product.maxPrice, [this.minMaxValidator()]),
  });

  get extraAttributes() {
    return this.thirdFormGroup.get('extraAttributes') as FormGroup;
  }

  setMinPrice(value: number) {
    this.minPrice = value;
  }

  minMaxValidator(): ValidatorFn {
    return (controller: AbstractControl): ValidationErrors | null => {
      if (controller.value !== null && controller.value <= this.minPrice) {
        return { smaller: true };
      } else {
        return null;
      }
    };
  }

  csvToArray(input: string | null) {
    return input ? input.split(',').map((word) => word.trim().toLowerCase()) : [];
  }

  fourthFormGroup = new FormGroup({
    store: new FormControl(this.product.store, [Validators.required]),
    category: new FormControl(this.product.category, [Validators.required]),
    gallery: new FormControl(this.product.gallery, [Validators.required]),
  });

  get isStepperValid() {
    return (
      this.firstFormGroup.valid && this.secondFormGroup.valid && this.thirdFormGroup.valid && this.fourthFormGroup.valid
    );
  }

  get stepperValue() {
    if (this.isStepperValid) {
      const csvCharacteristics = <string>this.thirdFormGroup.value.extraAttributes?.characteristics;

      const value = {
        ...this.firstFormGroup.value,
        ...this.secondFormGroup.value,
        ...this.thirdFormGroup.value,
        ...this.fourthFormGroup.value,
        extraAttributes: {
          characteristics: this.csvToArray(csvCharacteristics),
        },
        pictures: [],
      };

      return value;
    }

    return false;
  }
}
