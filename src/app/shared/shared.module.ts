import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TextInputComponent } from './components/forms/text-input/text-input.component';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { ToastrModule } from 'ngx-toastr';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { AutoCompleteDropdownComponent } from './components/forms/auto-complete-dropdown/auto-complete-dropdown.component';
import { PagerComponent } from './components/pager/pager.component';
import { PagingHeaderComponent } from './components/paging-header/paging-header.component';
import { NgxPaginationModule } from 'ngx-pagination';
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
    AutoCompleteTextboxComponent    
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
    NgxPaginationModule,
    PaginationModule
  ],
  exports:[
    ToastrModule,
    FormsModule,
    ReactiveFormsModule,
    TextInputComponent,
    AutoCompleteDropdownComponent,
    PagerComponent,
    PagingHeaderComponent,
    NgxSpinnerModule,
    NgxPaginationModule,
    PaginationModule,
    OverheadTemplateComponent,
    SeatTemplateComponent,
    AlB7879TypeOneComponent,
    AlA320200TypeOneComponent,
    AlB737400TypeOneComponent,    
    LoaderFlightComponent,
    TableLoaderComponent ,
    TextInputLoaderComponent           
  ]
})
export class SharedModule { }
