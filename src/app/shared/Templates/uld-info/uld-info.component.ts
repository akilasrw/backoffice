import { Component, Input, OnInit } from '@angular/core';
import { NumberExtension } from 'src/app/core/extensions/number-extension.model';

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

  convertcm3Tom3(volume: number): number {
    return NumberExtension.convertcm3Tom3(volume);
  }

}
