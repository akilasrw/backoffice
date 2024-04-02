import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public chart: any;
  constructor() { }

  ngOnInit(): void {
    this.createChart();
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

    });
  }

}
