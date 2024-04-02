import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  isLoading: boolean = false;
  parcelDelivered: any[] = [];
  fileterDate?: Date = new Date(); 
  filterFormHasValue:boolean=false;

  constructor() { }

  ngOnInit(): void {
    this.parcelDelivered = [
      {
        collectedDate: '1-April',
        AWBs: 12,
        parcelsCollected: 1588,
        parcelsReturned: 27,
        parcelsOnHold: 230,
        ULDPacked: 12,
        onRoute: 12,
        parcelsDelivered: 1588,
        '24hrs': 1588,
        '24to36hrs': 12,
        '36hrs': 87
      },
    ];
  }

  onChangeFilterFrm(event: any) {
    if ((this.fileterDate !== null))
    {
      this.filterFormHasValue = true;
    } else {
      this.filterFormHasValue = false;
    }
  }

}
