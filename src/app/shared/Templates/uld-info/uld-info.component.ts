import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-uld-info',
  templateUrl: './uld-info.component.html',
  styleUrls: ['./uld-info.component.scss']
})
export class UldInfoComponent implements OnInit {
  @Input() selectedCargoPosition: any;
  constructor() { }

  ngOnInit(): void {
    console.log('selectedCargoPosition',this.selectedCargoPosition);
  }

}
