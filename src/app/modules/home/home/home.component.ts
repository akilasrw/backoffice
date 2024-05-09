import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js/auto';
import * as moment from 'moment';
import {HomeService} from "../../../_services/home.service";
import {DeliveryAuditQueryModel} from "../../../_models/queries/dashboard/delivery-audit-query.model";
import {DeliveryAudit} from "../../../_models/view-models/dashboard/delivery-audit";
import { DeliveryAuditData } from 'src/app/_models/view-models/dashboard/delivery-audit-data';
import {observable, Subscription} from "rxjs";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { PackageAudit } from 'src/app/core/enums/common-enums';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

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
  packageAuditData: PackageAudit[] = [];
  var1:number = 0;
  var2:number = 0;
  var3:number = 0;
  var4:number = 0;


  constructor(private homeService: HomeService) {
     //@ts-ignore
     pdfMake.vfs = pdfFonts.pdfMake.vfs;
     //@ts-ignore
     pdfMake.fonts = {
       Roboto: {
         normal: 'Roboto-Regular.ttf',
         bold: 'Roboto-Medium.ttf',
         italics: 'Roboto-Italic.ttf',
         bolditalics: 'Roboto-MediumItalic.ttf',
       },
     };
  }

  ngOnInit(): void {
    this.filterDateFrom = this.getYesterdayDate();
    this.filterDateTo = this.getYesterdayDate();
    this.createChart();
    this.getChatData();
    this.getPackageData();
    this.getDeliveryData();
    this.parcelDelivered = [];
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
getData(){
    this.getChatData();
    this.getDeliveryData();
    this.getPackageData()
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
          this.var1 = (this.chartData.deliverd / this.chartData.collected) * 100 ;
          var formattedValue1 = this.var1.toFixed(2);
          this.var1 = parseFloat(formattedValue1);

          this.var2 = (this.chartData.oneDay / this.chartData.collected) * 100;
          var formattedValue2 = this.var2.toFixed(2);
          this.var2 = parseFloat(formattedValue2);

          this.var3 = (this.chartData.oneAndHalf / this.chartData.collected) * 100;
          var formattedValue3 = this.var3.toFixed(2);
          this.var3 = parseFloat(formattedValue3);

          this.var4 = (this.chartData.afterOneAndHalf / this.chartData.collected) * 100;
          var formattedValue4 = this.var4.toFixed(2);
          this.var4 = parseFloat(formattedValue4);

        },
        error: (error) => {
          this.chartData = undefined;
        }
      });
  }

  getDeliveryData() {
    this.isLoading = true;

    let query = new DeliveryAuditQueryModel();
    query.start = this.filterDateFrom;
    query.end = this.filterDateTo;
    this.homeService.getDeliveryData(query).subscribe(
      {
        next: (res: DeliveryAuditData[]) => {
          this.deliveryAuditData = res;
          this.isLoading = false;
          console.log(this.deliveryAuditData);
        },
        error: (error: any) => {
          console.error('Error fetching delivery audit data:', error);
        }
      }
    );
  }

  getPackageData() {
    this.isLoading = true;

    let query = new DeliveryAuditQueryModel();
    query.start = this.filterDateFrom;
    query.end = this.filterDateTo;
    this.homeService.getPackageData(query).subscribe(
      {
        next: (res: PackageAudit[]) => {
          this.packageAuditData = res;
          this.isLoading = false;
          console.log(this.packageAuditData, 'p o data');
        },
        error: (error: any) => {
          console.error('Error fetching delivery audit data:', error);
        }
      }
    );
  }
  
  generatePDF(): void {
    const tableElement: any = document.querySelector('.table-content');
  
    if (!tableElement) {
      console.error('Table element not found.');
      return;
    }
  
    const PDF = new jsPDF('p', 'mm', 'a4', true);
  
    const headerText = `Transaction Summary: ${new Date(this.filterDateFrom).toLocaleDateString()} to ${new Date(this.filterDateTo).toLocaleDateString()}`;
    const headerHeight = 10;
  
    PDF.setFontSize(14);
    PDF.text(headerText, PDF.internal.pageSize.getWidth() / 2, headerHeight, { align: 'center' });

    const footerText = `Printed on: ${new Date().toLocaleDateString()}`;
    const footerHeight = 10;

    PDF.setFontSize(12);
    PDF.text(footerText, PDF.internal.pageSize.getWidth() / 2, PDF.internal.pageSize.getHeight() - footerHeight + 5, { align: 'center' });
  
    html2canvas(tableElement, { scale: 1 }).then((canvas) => {
      const imageData = canvas.toDataURL('image/png');
  
      PDF.addImage(imageData, 'PNG', 10, headerHeight + 10, 190, 0);
  
      PDF.save('delivery_audit.pdf');
    });
  }
 
  generatePackagePDF(x:PackageAudit[]) {

    console.log(x, )

    let body = [['Package ID', 'Collected Date', 'Flight Number','Flight Date',"AwbNumber"]]
    x.forEach((y:PackageAudit) => {
        body.push([y.packageNumber, y.collectedDate, y.flightNumber || "N/A",y.flightDate?.toString() || "N/A",  y.awb.toString()])     
    });
    const documentDefinition = {

      

      content: [
        {
          text: 'Package List',
          style: 'header',
        },
        {
          table: {
            widths: [100, 100, 100, 100, 100],
            body: body,
          },
        },
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          alignment: 'center',
          margin: [0, 0, 0, 10],
        },
      },
    };
    // @ts-ignore
    pdfMake.createPdf(documentDefinition).download('package_list.pdf');
  }

}
