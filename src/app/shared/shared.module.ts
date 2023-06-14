import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TextInputComponent } from './components/forms/text-input/text-input.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { AutoCompleteDropdownComponent } from './components/forms/auto-complete-dropdown/auto-complete-dropdown.component';
import { PagerComponent } from './components/pager/pager.component';
import { PagingHeaderComponent } from './components/paging-header/paging-header.component';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { NgxSpinnerModule } from 'ngx-spinner';
import { AlB7879TypeOneComponent } from './Templates/aircraft-layout/al-b7879-type-one/al-b7879-type-one.component';
import { AlA320200TypeOneComponent } from './Templates/aircraft-layout/al-a320200-type-one/al-a320200-type-one.component';
import { OverheadTemplateComponent } from './Templates/overhead-template/overhead-template.component';
import { SeatTemplateComponent } from './Templates/seat-template/seat-template.component';
import { LoaderFlightComponent } from './components/loader-flight/loader-flight.component';
import { AlB737400TypeOneComponent } from './Templates/aircraft-layout/al-b737400-type-one/al-b737400-type-one.component';
import { TableLoaderComponent } from './components/table-loader/table-loader.component';
import { TextInputLoaderComponent } from './components/text-input-loader/text-input-loader.component';
import { AutoCompleteTextboxComponent } from './components/forms/auto-complete-textbox/auto-complete-textbox.component';
import { TwodecimalpointsDirective } from '../directives/twodecimalpoints.directive';
import { ValueInputComponent } from './components/forms/value-input/value-input.component';
import { UldInfoComponent } from './Templates/uld-info/uld-info.component';
import { WhiteSpaceInputComponent } from './components/forms/white-space-input/white-space-input.component';
import { AlB737800TypeOneComponent } from './Templates/aircraft-layout/al-b737800-type-one/al-b737800-type-one.component';
import { AlB737300TypeOneComponent } from './Templates/aircraft-layout/al-b737300-type-one/al-b737300-type-one.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { FileUploadComponent } from './components/file-upload/file-upload.component';
import { DisableControlDirective } from '../directives/disable-control.directive';

@NgModule({
  declarations: [
    TextInputComponent,
    AutoCompleteDropdownComponent,
    PagerComponent,
    PagingHeaderComponent,
    OverheadTemplateComponent,
    SeatTemplateComponent,
    AlB7879TypeOneComponent,
    AlA320200TypeOneComponent,
    LoaderFlightComponent,
    AlB737400TypeOneComponent,
    TableLoaderComponent,
    TextInputLoaderComponent,
    AutoCompleteTextboxComponent,
    TwodecimalpointsDirective,
    ValueInputComponent,
    UldInfoComponent,
    WhiteSpaceInputComponent,
    AlB737800TypeOneComponent,
    AlB737300TypeOneComponent,
    FileUploadComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-right'
    }),
    AutocompleteLibModule,
    NgxSpinnerModule,
    PaginationModule,
    NgxPaginationModule,
    BsDatepickerModule.forRoot()

  ],
  exports: [
    ToastrModule,
    FormsModule,
    ReactiveFormsModule,
    TextInputComponent,
    ValueInputComponent,
    AutoCompleteDropdownComponent,
    PagerComponent,
    PagingHeaderComponent,
    NgxSpinnerModule,
    PaginationModule,
    NgxPaginationModule,
    OverheadTemplateComponent,
    SeatTemplateComponent,
    AlB7879TypeOneComponent,
    AlA320200TypeOneComponent,
    AlB737400TypeOneComponent,
    AlB737800TypeOneComponent,
    LoaderFlightComponent,
    TableLoaderComponent,
    TextInputLoaderComponent,
    AutoCompleteTextboxComponent,
    TwodecimalpointsDirective,
    WhiteSpaceInputComponent,
    AlB737300TypeOneComponent,
    BsDatepickerModule,
    FileUploadComponent
  ]
})
export class SharedModule { }
