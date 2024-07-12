import { FormControl, ValidationErrors } from "@angular/forms";

export class NumberOfRooomsValidator {
  // whitespace validation
  static outOfNumberRange(control: FormControl): ValidationErrors {

    // check if string only contains whitespace
    if ((control.value != null) && (control.value <= 0 || control.value>300)) {

      // invalid, return error object
      return { 'outOfNumberRange': true };
    }
    else {
      // valid, return null
      return null as any;
    }
  }
}
