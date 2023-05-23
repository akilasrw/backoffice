import { Directive, Input } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appDisableControl]'
})
export class DisableControlDirective {

  @Input() set disableControl( condition : boolean ) {
    const action = condition ? 'disable' : 'enable';
    if(this.ngControl != null && this.ngControl.control != null)
      this.ngControl.control[action]();
  }

  constructor(private ngControl: NgControl ) {
  }

}
