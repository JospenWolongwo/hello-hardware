import type { FormGroup } from '@angular/forms';

export class BaseFormComponent {
  form: FormGroup;

  isFormValid = false;

  constructor(form: FormGroup) {
    this.form = form;
  }

  onSubmit(form: FormGroup) {
    this.isFormValid = form.valid;
    if (this.isFormValid) {
      return form.value;
    }

    return false;
  }
}
