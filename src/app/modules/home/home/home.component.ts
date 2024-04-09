import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js/auto';
import * as moment from 'moment';
import {HomeService} from "../../../_services/home.service";
import {DeliveryAuditQueryModel} from "../../../_models/queries/dashboard/delivery-audit-query.model";
import {DeliveryAudit} from "../../../_models/view-models/dashboard/delivery-audit";
import { DeliveryAuditData } from 'src/app/_models/view-models/dashboard/delivery-audit-data';
import {observable, Subscription} from "rxjs";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public chart: any;
  isLoading: boolean = true;
  parcelDelivered: any[] = [];
  filterDateFrom: any;
  filterDateTo: any;
  filterFormHasValue: boolean = false;
  chartData: any;
  subscription?: Subscription;
  oneDay: any = 0;
  oneAndHalfDay: any = 0;
  graterThanOneAndHalfDay: any = 0;
  deliveryAuditData: DeliveryAuditData[] = [];


  constructor(private homeService: HomeService) {
  }

  ngOnInit(): void {
    this.filterDateFrom = this.getYesterdayDate();
    this.filterDateTo = this.getYesterdayDate();
    this.createChart();
    this.getChatData();

    this.getDeliveryData();
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

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  getYesterdayDate(): Date {
    return moment().subtract(1, 'days').toDate();
  }

  onChangeFilterFrm(event: any) {
    if ((this.filterDateTo !== null)) {
      this.filterFormHasValue = true;
    } else {
      this.filterFormHasValue = false;
    }
  }

  createChart() {

    this.chart = new Chart("MyChart", {
      type: 'bar', //this denotes tha type of chart

      data: {// values on X-Axis
        labels: ['Less Than 24', '24 To 36', 'More Than 36'],
        datasets: [
          {
            label: "Total Delivery",
            data: [this.oneDay, this.oneAndHalfDay, this.oneAndHalfDay],
            backgroundColor: '#338CE5',
            borderRadius: 6,
            barThickness: 30
          }
        ]
      },
      options: {
        aspectRatio: 1.8
      }

    })
  }

  getChatData() {
    this.isLoading = true;
    let query = new DeliveryAuditQueryModel();
    query.start = this.filterDateFrom;
    query.end = this.filterDateTo;
    this.subscription = this.homeService.getChartData(query).subscribe(
      {
        next: (res) => {
          this.chartData = res;
          this.oneDay = res.oneDay;
          this.oneAndHalfDay = res.oneAndHalf;
          this.graterThanOneAndHalfDay = res.afterOneAndHalf;
          if (res != null || res != undefined) {
            this.chart.data.datasets[0].data = [res.oneDay, res.oneAndHalf, res.afterOneAndHalf];
            this.chart.update();
          }
          this.isLoading = false;
        },
        error: (error) => {
          this.chartData = undefined;
        }
      });
  }

  getDeliveryData() {
    const yesterday = moment().subtract(1, 'day').toDate();
    let query = new DeliveryAuditQueryModel();
    query.start = yesterday;
    query.end = yesterday;
    this.homeService.getDeliveryData(query).subscribe(
      {
        next: (res: DeliveryAuditData[]) => {
          this.deliveryAuditData = res;
          console.log(this.deliveryAuditData);
        },
        error: (error: any) => {
          console.error('Error fetching delivery audit data:', error);
        }
      }
    );
  }

}
