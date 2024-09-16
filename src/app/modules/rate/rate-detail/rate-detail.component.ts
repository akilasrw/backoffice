import { Component, Input, OnInit } from '@angular/core';
import { CoreExtensions } from 'src/app/core/extensions/core-extensions.model';
import { AgentRateQuery } from 'src/app/_models/queries/rate/agent-rate-query.model';
import { AgentRateManagement } from 'src/app/_models/view-models/rate/agent-rate-management';
import { RateService } from 'src/app/_services/rate.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-rate-detail',
  templateUrl: './rate-detail.component.html',
  styleUrls: ['./rate-detail.component.scss']
})
export class RateDetailComponent implements OnInit {

  @Input() rateId?: string;
  rateDetail?: AgentRateManagement ;
  isLoading:boolean = false;

  constructor(private rateService : RateService) { }

  ngOnInit(): void {
    this.getDetail();
  }

  
  generatePDF(): void {
    const tableElement: any = document.querySelector('.modal-body');
  
    if (!tableElement) {
      console.error('Table element not found.');
      return;
    }
  
    const PDF = new jsPDF('p', 'mm', 'a4', true);
  
    const headerText = `Rates`;
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
  
      PDF.save('rating.pdf');
    });
  }
  getDetail(){
    if(this.rateId != null){
      this.isLoading=true;
      this.rateService.getDetail({id : this.rateId,includeCargoAgent : true}).subscribe(
        {
          next: (res) => {
            this.rateDetail = res;
            this.isLoading=false;
          },
          error: (error) => {
            this.isLoading=false;
          }
        }
      );
    }
  }

  GetWeightType(type: number) {
    return CoreExtensions.GetWeightType(type);
  }

  GetRateType(type:number){
    return CoreExtensions.GetRateType(type);
  }

  GetCargoType(type:number){
    return CoreExtensions.GetCargoType(type);
  }

}
