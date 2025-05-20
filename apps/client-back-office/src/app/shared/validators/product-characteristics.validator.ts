import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function alphabeticValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const alphabeticRegex = /^[a-z]+(\s\w+)*(,\s[a-z]+(\s\w+)*)*$/;
    const valid = alphabeticRegex.test(control.value);

    if (control.value && !valid) {
      return { alphabetic: true };
    }

    return null;
  };
}
