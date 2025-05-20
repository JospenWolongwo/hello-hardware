import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { validColorValidator } from 'ngx-colors';
import { StockAvailability } from '../../../shared/enums/stock-availability.enum';
import { BaseFormComponent } from '../../base-form.component';
import { AttributesObject } from './create-stock-dto';

@Component({
  selector: 'app-create-stock',
  templateUrl: './create-stock.component.html',
})
export class CreateStockComponent extends BaseFormComponent implements OnInit {
  availabilityOptions = Object.values(StockAvailability);
  guaranteeUnits = ['day', 'week', 'month', 'year'];

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      title: string;
      action: string;
      maxPrice: number | null;
      minPrice: number;
      stockInfo: { keepingUnit: string; price: number } | undefined;
      stockQuantity: number | undefined;
      characteristics: string[];
    }
  ) {
    const keepingUnit = data.stockInfo?.keepingUnit ?? '';

    const stockPrice = data.stockInfo?.price ?? data.minPrice;

    const stockQuantity = data.stockQuantity ?? 1;

    const editForm = !!data.stockInfo?.keepingUnit;

    const changeQuantity = !!data.stockQuantity;

    const characteristicsForm = new FormGroup({});

    const discountsFormArray = new FormArray([]);

    // Dynamically create form controls for each characteristic
    data.characteristics.forEach((characteristic) => {
      if (characteristic === 'color') {
        // Create a nested form group for the "color" characteristic
        const colorFormGroup = new FormGroup(
          {
            inputCtrl: new FormControl('#127932', [Validators.required, validColorValidator()]),
            pickerCtrl: new FormControl('#127932'),
          },
          { updateOn: 'change' }
        );
        // Add the nested form group to the characteristicsForm
        characteristicsForm.addControl(characteristic, colorFormGroup);
      } else {
        characteristicsForm.addControl(characteristic, new FormControl('', Validators.required));
      }
    });

    const createStoreForm: FormGroup = new FormGroup({
      keepingUnit: new FormControl(keepingUnit, Validators.required),

      price: new FormControl(stockPrice, [
        Validators.required,
        Validators.min(data.minPrice),
        ...(data.maxPrice ? [Validators.max(data.maxPrice)] : []),
      ]),

      quantity: new FormControl(stockQuantity, [Validators.required, Validators.min(1)]),
      attributes: characteristicsForm,
      availabilityStatus: new FormControl(StockAvailability.IN_STOCK, Validators.required),

      guarantee: new FormGroup({
        amount: new FormControl(null, [Validators.min(1)]),
        timeUnit: new FormControl(''),
      }),
      discounts: discountsFormArray,
      description: new FormGroup({
        shortDescription: new FormControl(''),
        longDescription: new FormControl(''),
      }),
    });

    if (editForm) {
      createStoreForm.removeControl('quantity');
    }

    if (changeQuantity) {
      createStoreForm.removeControl('keepingUnit');
      createStoreForm.removeControl('price');
    }

    super(createStoreForm);

    this.minPrice = data.minPrice;

    this.maxPrice = data.maxPrice ?? 0;

    this.minQuantity = stockQuantity;

    this.createForm = !editForm && !changeQuantity;

    this.changeQuantity = changeQuantity;
  }

  minPrice = 0;

  maxPrice = 0;

  minQuantity = 0;

  createForm = true;

  changeQuantity = false;

  get useQuantity() {
    return this.createForm || this.changeQuantity;
  }

  get createOrEdit() {
    return !this.changeQuantity;
  }

  get discounts(): FormArray {
    return this.form.get('discounts') as FormArray;
  }

  addDiscount(): void {
    this.discounts.push(
      new FormGroup({
        percentage: new FormControl(null, [Validators.required, Validators.min(0), Validators.max(100)]),
        validUntil: new FormControl(null),
      })
    );
  }

  removeDiscount(index: number): void {
    this.discounts.removeAt(index);
  }

  ngOnInit(): void {
    const colorFormGroup = this.form.get('attributes.color') as FormGroup;
    if (colorFormGroup) {
      colorFormGroup.controls['inputCtrl'].valueChanges.subscribe((color) => {
        if (colorFormGroup.controls['pickerCtrl'].valid) {
          colorFormGroup.controls['pickerCtrl'].setValue(color, {
            emitEvent: false,
          });
        }
      });
      colorFormGroup.controls['pickerCtrl'].valueChanges.subscribe((color) =>
        colorFormGroup.controls['inputCtrl'].setValue(color, {
          emitEvent: false,
        })
      );
    }
  }

  override onSubmit(): void {
    const formValue = this.form.value;
    const characteristics = this.extractCharacteristics(formValue.attributes);
    const payload = {
      ...formValue,
      characteristics,
      attributes: undefined,
    };

    return super.onSubmit(payload);
  }

  // Extract characteristics with a separate method
  private extractCharacteristics(attributes: AttributesObject): Record<string, string> {
    const characteristics: Record<string, string> = {};
    for (const key in attributes) {
      const attribute = attributes[key];
      // Type guard to check for object with inputCtrl
      if (attribute !== null && typeof attribute === 'object' && 'inputCtrl' in attribute) {
        characteristics[key] = (attribute as { inputCtrl: string }).inputCtrl;
      } else if (typeof attribute === 'string') {
        characteristics[key] = attribute;
      } else if (typeof attribute === 'number') {
        characteristics[key] = attribute.toString();
      }
    }

    return characteristics;
  }
}
