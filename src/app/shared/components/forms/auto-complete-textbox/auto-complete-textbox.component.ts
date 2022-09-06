import { SelectList } from './../../../models/select-list.model';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-auto-complete-textbox',
  templateUrl: './auto-complete-textbox.component.html',
  styleUrls: ['./auto-complete-textbox.component.scss']
})
export class AutoCompleteTextboxComponent implements OnInit {

  objectList?: SelectList[];
  displayDropdown = false;
  //selectedText: string;
  searchTextUpdate = new Subject<string>();

  @Output() searchedText = new EventEmitter();
  @Output() selectedObject = new EventEmitter();

  @Input() set SelectedList(value: SelectList[]) {
    this.objectList = value;
  }

  @Input() selectedText?: string;
  @Input() isDisabled:Boolean = false;
  @Input() control?: FormControl;
  @Input() form!: FormGroup;

  constructor() {
    this.searchTextUpdate.pipe(
      debounceTime(300),
      distinctUntilChanged())
      .subscribe(value => {
        //this.searchedText.emit(value);
        this.displayDropdown = false;
        if(value)
          this.displayDropdown = true;
      });
  }

  ngOnInit(): void {
  }

  itemSelectEvent($item: any) {
    this.selectedText = $item.value;
    this.selectedObject.emit($item);
    this.displayDropdown = false;
  }

  closeDropdown(){
    this.displayDropdown = false;
  }

}
