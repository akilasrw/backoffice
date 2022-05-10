import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-auto-cmplete-dropdown',
  templateUrl: './auto-cmplete-dropdown.component.html',
  styleUrls: ['./auto-cmplete-dropdown.component.scss']
})
export class AutoCmpleteDropdownComponent implements OnInit {

  
  @Input() keyword: string = '';
  //@Input() placeholder: string = 'Select Airport';
  @Input() data: any = [];
  @Output() selectFileOutput = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void {
  }

  selectEvent(item: any) {
    this.selectFileOutput.emit(item);

  }

  onChangeSearch(val: string) {
    console.log('onChangeSearch');
  }

  onFocused(e: any){
    console.log('onFocused');
  }
}
