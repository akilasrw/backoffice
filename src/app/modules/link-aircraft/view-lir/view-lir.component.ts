import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FlightScheduleService } from 'src/app/_services/flight-schedule.service';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface CargoPosition {
  id: string;
  name: string;
  maxWeight: number;
  maxVolume: number;
  currentWeight: number;
  currentVolume: number;
  cargoPositionType: number;
  priority: number;
  flightLeg: number;
}

interface ULD {
  id: string;
  serialNumber: string;
  uldType: number;
  maxWeight: number;
  maxVolume: number;
  weight: number;
  volume: number;
  cargoPositionID: string | null;
}

interface DisplayData {
  position: string;
  maxWeight: string;
  uldNumber: string;
  grossWeight: string;
  destination: string;
  remarks: string;
}

@Component({
  selector: 'app-view-lir',
  templateUrl: './view-lir.component.html',
  styleUrls: ['./view-lir.component.scss']
})
export class ViewLirComponent implements OnInit {
  sectorId: string = '';
  cargoPositions: CargoPosition[] = [];
  pallets: ULD[] = [];
  displayData: DisplayData[] = [];
  mainDeckPositions: DisplayData[] = [];
  forwardHoldPositions: DisplayData[] = [];
  aftHoldPositions: DisplayData[] = [];
  totalGrossWeight: number = 0;

  constructor(
    private route: ActivatedRoute,
    private flightScheduleService: FlightScheduleService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.sectorId = params['sectorId'];
      this.getCargoPositions();
      this.getPallets();
    });
  }

  getCargoPositions() {
    this.flightScheduleService.getCargoPositionList(this.sectorId).subscribe(
      (response: CargoPosition[]) => {
        this.cargoPositions = response;
        this.mapDisplayData();
      },
      (error: any) => {
        console.error('Error fetching cargo positions:', error);
      }
    );
  }

  getPallets() {
    this.flightScheduleService.getPalletsBySectorId(this.sectorId).subscribe(
      (response: ULD[]) => {
        this.pallets = response;
        this.calculateTotalGrossWeight();
        this.mapDisplayData();
      }
    );
  }

  calculateTotalGrossWeight() {
    this.totalGrossWeight = this.pallets.reduce((total, pallet) => total + pallet.weight, 0);
  }

  mapDisplayData() {
    if (!this.cargoPositions.length || !this.pallets.length) return;

    const mappedData = this.cargoPositions.map(position => {
      const matchingPallet = this.pallets.find(p => p.cargoPositionID === position.id);
      
      return {
        position: position.name,
        maxWeight: `${position.maxWeight}KG`,
        uldNumber: matchingPallet?.serialNumber || '-',
        grossWeight: matchingPallet ? `${matchingPallet.weight}KG` : '-',
        destination: 'N/A',
        remarks: 'N/A'
      };
    });

    // Split positions into their respective sections
    this.mainDeckPositions = mappedData.filter(d => d.position.match(/^[1-9]|10$/));
    this.forwardHoldPositions = mappedData.filter(d => d.position.match(/^b[1-3]$/));
    this.aftHoldPositions = mappedData.filter(d => d.position.match(/^b[4-6]$/));


    console.log(this.mainDeckPositions);
    console.log(this.forwardHoldPositions);
    console.log(this.aftHoldPositions);

    // Combine all for the full display data
    this.displayData = [...this.mainDeckPositions, ...this.forwardHoldPositions, ...this.aftHoldPositions];
  }

  downloadPDF() {
    const element = document.querySelector('.container') as HTMLElement;
    
    // Set container height to auto to get full content
    const originalStyle = element.style.cssText;
    element.style.height = 'auto';
    element.style.overflow = 'visible';
    
    html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      scrollY: 0,
      height: element.scrollHeight,
      windowHeight: element.scrollHeight
    }).then(canvas => {
      // Reset container style
      element.style.cssText = originalStyle;

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 0;

      const totalPages = Math.ceil(imgHeight * ratio / pdfHeight);
      
      for(let page = 0; page < totalPages; page++) {
        if(page > 0) {
          pdf.addPage();
        }
        
        // Calculate the portion of image to show on this page
        const sy = page * pdfHeight / ratio;
        const sHeight = Math.min(pdfHeight / ratio, imgHeight - sy);
        const dy = 0;
        const dHeight = sHeight * ratio;
        
        pdf.addImage(
          imgData, 'PNG',
          imgX, dy,
          imgWidth * ratio, dHeight,
          '', 'FAST',
          0,
        );
      }
      
      pdf.save('load-instruction-report.pdf');
    });
  }
}
