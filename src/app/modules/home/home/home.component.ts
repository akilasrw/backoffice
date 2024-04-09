import {Component, OnInit, OnChanges} from '@angular/core';
import Chart from 'chart.js/auto';
import * as moment from 'moment';
import {HomeService} from "../../../_services/home.service";
import {DeliveryAuditQueryModel} from "../../../_models/queries/dashboard/delivery-audit-query.model";
import {DeliveryAudit} from "../../../_models/view-models/dashboard/delivery-audit";
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


  constructor(private homeService: HomeService) {
  }

  ngOnInit(): void {
    this.filterDateFrom = this.getYesterdayDate();
    this.filterDateTo = this.getYesterdayDate();
    this.createChart();
    this.getChatData();

    this.parcelDelivered = [
      {
        collectedDate: '7-April',
        AWBs: 1212313,
        parcelsCollected: 1076,
        parcelsReturned: 0,
        parcelsOnHold: 0,
        ULDPacked: 12,
        onRoute: 12,
        parcelsDelivered: 1076,
        '24hrs': 400,
        '24to36hrs': 576,
        '36hrs': 100
      },
      {
        collectedDate: '4-April',
        AWBs: 1214343,
        parcelsCollected: 1000,
        parcelsReturned: 0,
        parcelsOnHold: 0,
        ULDPacked: 12,
        onRoute: 12,
        parcelsDelivered: 1000,
        '24hrs': 500,
        '24to36hrs': 100,
        '36hrs': 400
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
        labels: ['24', '24-36', '36'],
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
}
