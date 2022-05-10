import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TextInputComponent } from './components/forms/text-input/text-input.component';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { ToastrModule } from 'ngx-toastr';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { AutoCmpleteDropdownComponent } from './components/forms/auto-cmplete-dropdown/auto-cmplete-dropdown.component';


@NgModule({
  declarations: [
    TextInputComponent,
    AutoCmpleteDropdownComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-right'
    }),
    AutocompleteLibModule
  ],
  exports:[
    ToastrModule,
    FormsModule,
    ReactiveFormsModule,
    TextInputComponent,
  ]
})
export class SharedModule { }
