import { AccountService } from 'src/app/account/account.service';
import { CargoBookingSummaryDetail } from './../../../../../_models/view-models/booking-summary/cargo-booking-summary-detail.model';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { NgxSpinnerService } from 'ngx-spinner';
import { CoreExtensions } from 'src/app/core/extensions/core-extensions.model';
import { User } from 'src/app/_models/user.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-booking-summary-lir',
  templateUrl: './booking-summary-lir.component.html',
  styleUrls: ['./booking-summary-lir.component.scss']
})
export class BookingSummaryLirComponent implements OnInit {

  @Input() cargoBookingSummary: CargoBookingSummaryDetail = new CargoBookingSummaryDetail();
  @Output() closePopup = new EventEmitter<any>();
  @ViewChild('lir') lirElement!: ElementRef;
  currentDate = new Date();
  currentUser?: User | null
  subscription?: Subscription;

  constructor(private spinner: NgxSpinnerService,
    private accountService: AccountService) {

  }

  ngOnInit(): void {
    this.getCurrentUser();
  }

  printData(){
    this.spinner.show();
    setTimeout(() => {
      this.generatePDF();
      this.spinner.hide();
    }, 2000);
  }

  generatePDF(): void {
    let data: any = this.lirElement?.nativeElement; 
    if(data != null)
    html2canvas(data, { scale: 3 }).then((canvas) => {
      const imageGeneratedFromTemplate = canvas.toDataURL('image/png');
      var margin = 3;
      const imgWidth  = 210 - 2*margin;
      var pageHeight = 295;  
      var imgHeight = (canvas.height * imgWidth ) / canvas.width;
      var heightLeft = imgHeight;
      
      let PDF = new jsPDF('l', 'mm','a4',true);
      var position = 5;
      PDF.addImage(imageGeneratedFromTemplate, 'PNG', margin, position, imgWidth , imgHeight,);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        PDF.addPage();
        PDF.addImage(imageGeneratedFromTemplate, 'PNG', margin, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      PDF.html(this.lirElement.nativeElement.innerHTML)
      PDF.save('lir.pdf');
    });
  }

  GetAircraftType(type: any) {
    return CoreExtensions.GetAircraftType(type);
  }

  async getCurrentUser() {
    this.subscription = await this.accountService.currentUser$.subscribe(res => {
      debugger;
      this.currentUser = res;
    });
  }
  
  closeModal(){
    this.closePopup.emit();
  }

}
