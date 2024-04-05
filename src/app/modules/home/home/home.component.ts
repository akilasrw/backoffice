import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js/auto';
import * as moment from 'moment';
import {HomeService} from "../../../_services/home.service";
import {DeliveryAuditQueryModel} from "../../../_models/queries/dashboard/delivery-audit-query.model";
import {DeliveryAudit} from "../../../_models/view-models/dashboard/delivery-audit";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public chart: any;
  isLoading: boolean = false;
  parcelDelivered: any[] = [];
  filterDateFrom: any;
  filterDateTo: any;
  filterFormHasValue:boolean=false;
  chartData: DeliveryAudit | undefined;

  constructor(private homeService: HomeService) {

}

  ngOnInit(): void {
    this.filterDateFrom = this.getYesterdayDate();
    this.filterDateTo = new Date();
    this.createChart();
    this.getChatData();
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

  getYesterdayDate(): Date {
    return moment().subtract(1, 'days').toDate();
  }

  onChangeFilterFrm(event: any) {
    if ((this.filterDateTo !== null))
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
        labels: ['24', '24-36', '36'],
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
        aspectRatio:1.5
      }

    })
  }
  getChatData(){
    let query = new DeliveryAuditQueryModel();
    query.start = new Date('2024-04-03');
    query.end = new Date();
    this.homeService.getChartData(query).subscribe(
      {
        next: (res) => {
          this.chartData = res;
        },
        error: (error) => {
          this.chartData = undefined;
        }
      });
  }
}
