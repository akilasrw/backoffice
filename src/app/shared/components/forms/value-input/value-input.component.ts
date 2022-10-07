import { Component, Input, Self } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';

@Component({
  selector: 'app-value-input',
  templateUrl: './value-input.component.html',
  styleUrls: ['./value-input.component.scss']
})
export class ValueInputComponent implements ControlValueAccessor {

  @Input() label: string = '';
  @Input() tabindex : number = 1;
  @Input() showPlaceHolder: boolean = false;
  @Input() textBoxDisabled: boolean = false;
  @Input() validationErrorMessageClass: string = 'invalid-feedback';
  
  constructor(@Self() public ngControl: NgControl) {
    this.ngControl.valueAccessor = this;
  }

  writeValue(obj: any): void {
  }

  registerOnChange(fn: any): void {
  }

  registerOnTouched(fn: any): void {
  }

  getErrorText() {
    if (this.ngControl.control?.errors?.['required'])
      return 'Please enter ' + this.label+'.';
    if (this.ngControl.control?.errors?.['email'])
      return 'Invalid format.';
    if (this.ngControl.control?.errors?.['minlength'])
      return `${this.label} must be at least ${this.ngControl.control.errors['minlength']['requiredLength']} characters.`;
    if (this.ngControl.control?.errors?.['maxlength'])
      return `${this.label} must be at most ${this.ngControl.control.errors['maxlength']['requiredLength']} characters.`;
    if (this.ngControl.control?.errors?.['isMatching'])
      return 'Passwords do not match.';
    if (this.ngControl.control?.errors?.['min'])
      return 'Invalid range.';
    if (this.ngControl.control?.errors?.['max'])
      return 'Invalid range.';
    if (this.ngControl.control?.errors?.['pattern'])
      return 'Invalid format.';
    if (this.ngControl.control?.errors?.['whitespace'])
      return 'Required.';
    return '';
  }

}
