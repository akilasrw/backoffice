import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-al-b737400-type-one',
  templateUrl: './al-b737400-type-one.component.html',
  styleUrls: ['./al-b737400-type-one.component.scss']
})
export class AlB737400TypeOneComponent implements OnInit {

  @Output() ULDClick = new EventEmitter<any>();

  constructor() { }

  ngOnInit(): void {
  }

  onULDClick(uldPosition:number){
    this.ULDClick.emit(uldPosition);
  }
}
