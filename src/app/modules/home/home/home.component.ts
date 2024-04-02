import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public chart: any;
  isLoading: boolean = false;
  parcelDelivered: any[] = [];
  fileterDate?: Date = new Date(); 
  filterFormHasValue:boolean=false;

  constructor() { }

  ngOnInit(): void {
    this.createChart();
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

  createChart(){

    this.chart = new Chart("MyChart", {
      type: 'bar', //this denotes tha type of chart

      data: {// values on X-Axis
        labels: ['2022-05-10', '2022-05-11', '2022-05-12'],
        datasets: [
          {
            label: "Total Delivery",
            data: ['400','576', '100'],
            backgroundColor: '#338CE5',
            borderRadius: 6,
            barThickness:30
          }
        ]
      },
      options: {
        aspectRatio:1.3
      }

    })
 

}}
