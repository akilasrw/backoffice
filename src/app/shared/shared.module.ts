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

@NgModule({
  declarations: [
    TextInputComponent,
    AutoCompleteDropdownComponent,
    PagerComponent,
    PagingHeaderComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-right'
    }),
    AutocompleteLibModule,
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
    NgxPaginationModule,
    PaginationModule
  ]
})
export class SharedModule { }
