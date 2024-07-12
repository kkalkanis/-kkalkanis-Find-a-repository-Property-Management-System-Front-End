import { FormControl, ValidationErrors } from "@angular/forms";

export class NoSamePasswordsValidator {

  static notSamePasswords(control: FormControl): ValidationErrors {

    // check if string only contains whitespace
    if ((control.value != null) && (control?.parent?.get('password')?.value !== control.value)) {
      
      // invalid, return error object
      return { 'notSamePasswords': true };
    }
    else {
      // valid, return null
      return null as any;
    }
  }
}


