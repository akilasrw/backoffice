import { VerifyInputBase } from './../../../../core/enums/common-enums';
import { SelectList } from 'src/app/shared/models/select-list.model';
import { FlightScheduleLink } from '../../../../_models/view-models/link-aircraft/flight-schedule-link.model';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FlightScheduleManagementLinkFilterList } from 'src/app/_models/queries/link-aircraft/flight-schedule-management-link-filter-list.model';
import { LinkAircraftFliterStatus } from 'src/app/core/enums/common-enums';
import { CoreExtensions } from 'src/app/core/extensions/core-extensions.model';
import { LinkAircraftToScheduleService } from 'src/app/_services/link-aircraft-to-schedule.service';
import { AutoCompleteDropdownComponent } from 'src/app/shared/components/forms/auto-complete-dropdown/auto-complete-dropdown.component';
import { AirportService } from 'src/app/_services/airport.service';
import { NgForm } from '@angular/forms';
import { FlightScheduleService } from 'src/app/_services/flight-schedule.service';
import { jsPDF } from 'jspdf';

@Component({
  selector: 'app-link-aircraft-list',
  templateUrl: './link-aircraft-list.component.html',
  styleUrls: ['./link-aircraft-list.component.scss']
})
export class LinkAircraftListComponent implements OnInit {

  modalVisible = false;
  modalVisibleAnimate = false;
  updateATAModalVisible = false;
  updateATAModalVisibleAnimate = false;
  verifyBookingModalVisible = false;
  verifyBookingModalVisibleAnimate = false;
  editFlightModalVisible = false;
  editFlightModalVisibleAnimate = false;
  flightScheduleLinks: FlightScheduleLink[]=[];
  query: FlightScheduleManagementLinkFilterList=  new FlightScheduleManagementLinkFilterList();
  selectedId?: string;
  isLoading :boolean= false;
  totalCount: number = 0;
  isFiltered: boolean = false;
  keyword = 'value';
  statusList: SelectList[] = [];
  originAirpots: SelectList[] = [];
  destinationAirpots: SelectList[] = [];
  ATAValue: string ='';
  inputBase: VerifyInputBase = VerifyInputBase.FromHistory;
  editFlightData: any = {
    flightNumber: '',
    scheduledDepartureDateTime: '',
    scheduledArrivalDateTime: '',
    actualDepartureDateTime: '',
    actualArrivalDateTime: ''
  };

  @ViewChild('originAirportAutoComplete') originAirportDropdown!: AutoCompleteDropdownComponent;
  @ViewChild('destinationAirportAutoComplete') destinationAirportDropdown!: AutoCompleteDropdownComponent;

  constructor(private linkAircraftToScheduleService: LinkAircraftToScheduleService,
    private airportService: AirportService, private flightScheduleService: FlightScheduleService) { }

  ngOnInit(): void {
    this.loadAirports();
    this.getFilterList();
    this.loadLinkAircraftStatusList();
  }

  loadAirports() {
    this.airportService.getSelectList()
      .subscribe(res => {
        if (res.length > 0) {
          this.originAirpots = res;
          Object.assign(this.destinationAirpots, res);
        }
      });
  }

  show(id:string) {
    this.selectedId=id;
    this.modalVisible = true;
    setTimeout(() => (this.modalVisibleAnimate = true));
  }

  showATA(id:string) {
    this.selectedId=id;
    this.updateATAModalVisible = true;
    setTimeout(() => (this.updateATAModalVisibleAnimate = true));
  }

  showSummary(id:string) {
    this.selectedId=id;
  }

  close() {
    this.modalVisibleAnimate = false;
    setTimeout(() => (this.modalVisible = false), 300);
  }

  closeUpdateATA() {
    this.updateATAModalVisibleAnimate = false;
    setTimeout(() => (this.updateATAModalVisible = false), 300);
  }

  editFlight(id: string) {
    this.selectedId = id;
    const flight = this.flightScheduleLinks.find(f => f.id === id);
    if (flight) {

      console.log(flight);

      this.editFlightData = {
        flightNumber: flight.flightNumber,
        scheduledDepartureDateTime: flight.scheduledDepartureDateTime,
        scheduledArrivalDateTime: flight.scheduledArrivalDateTime,
        actualDepartureDateTime: flight.actualDepartureDateTime,
        actualArrivalDateTime: flight.actualArrivalDateTime
      };
    }
    this.editFlightModalVisible = true;
    setTimeout(() => (this.editFlightModalVisibleAnimate = true));
  }

  closeEditFlight() {
    this.editFlightModalVisibleAnimate = false;
    setTimeout(() => (this.editFlightModalVisible = false), 300);
  }
 
  formatDateForInput(date: string | null): string {
    if (!date) return '';
    return new Date(date).toISOString().slice(0, 16);
  }

  onSubmitEditFlight(form: NgForm) {
    if (form.valid && this.selectedId) {
      this.flightScheduleService.updateFlight(this.selectedId, this.editFlightData)
        .subscribe({
          next: () => {
            this.closeEditFlight();
            this.getFilterList();
          },
          error: (error) => {
            console.error('Error updating flight:', error);
          }
        });
    }
  }

  getFilterList() {
    this.isLoading = true;
    this.query.isHistory = true;
    this.linkAircraftToScheduleService.getFilteredList(this.query)
    .subscribe(res => {
      if (res != null) { console.log(res);
        this.flightScheduleLinks = res.data;
        this.totalCount = res.count
        this.onChangeFilter();
        this.isLoading = false;
      }
    });
  }

  clearFilter() {
    this.query=  new FlightScheduleManagementLinkFilterList();
    this.originAirportDropdown.clear();
    this.destinationAirportDropdown.clear();
    this.getFilterList();
    this.isFiltered = false;
  }

  selectedStatusValue(value: any) {
    this.query.status = Number(value.id);
  }

  onClearStatus() {
    this.query.status = undefined;
  }

  getStatus(val: LinkAircraftFliterStatus){
    return CoreExtensions.GetLinkAircraftStatus(val)
  }

  loadLinkAircraftStatusList() {
    this.statusList.push({ id: LinkAircraftFliterStatus.None.toString(), value: 'All' },
      { id: LinkAircraftFliterStatus.Pending.toString(), value: CoreExtensions.GetLinkAircraftStatus(LinkAircraftFliterStatus.Pending) },
      { id: LinkAircraftFliterStatus.PartiallyCompleted.toString(), value: CoreExtensions.GetLinkAircraftStatus(LinkAircraftFliterStatus.PartiallyCompleted)},
      { id: LinkAircraftFliterStatus.Completed.toString(), value: CoreExtensions.GetLinkAircraftStatus(LinkAircraftFliterStatus.Completed)});
  }

  onSubmitSuccess(event: any){
    this.getFilterList();
  }

  public onPageChanged(event: any) {
    if (this.query?.pageIndex !== event) {
      this.query.pageIndex = event;
      this.getFilterList();
    }
  }

  timeDiff(date1: string, date2: string) {
    if(date1 == null || date2 == null)
      return 'n/a';
    const diffInMs = Date.parse(date2) - Date.parse(date1);
    const diffInHours = diffInMs / 1000 / 60 / 60;
    return (Math.round(diffInHours * 100) / 100).toFixed(2);;
  }

  selectedOrigin(value: any) {
    this.query.originAirportId = value.id;
    this.onChangeFilter();
  }

  onClearOrigin(){
    this.query.originAirportId = undefined;
  }

  selectedDestination(value: any) {
    this.query.destinationAirportId = value.id;
    this.onChangeFilter();
  }

  onClearDestination(){
    this.query.destinationAirportId = undefined;
  }

  onChangeFilter() {
    this.isFiltered= true;
    if((this.query.flightNumber == undefined || this.query.flightNumber == '') &&
    (this.query.originAirportId == undefined || this.query.originAirportId == '') &&
    (this.query.destinationAirportId == undefined || this.query.destinationAirportId == '') &&
    this.query.flightDate == undefined){
      this.isFiltered = false;
    }
  }

  viewBooking(id: any){
    this.selectedId=id;
    this.verifyBookingModalVisible = true;
    setTimeout(() => (this.verifyBookingModalVisibleAnimate = true));
  }

  closeVerifyBooking(){
    this.verifyBookingModalVisibleAnimate = false;
    setTimeout(() => (this.verifyBookingModalVisible = false), 300);
  }

  printLIR(id: string): void {
    this.isLoading = true;

    interface CargoPosition {
      name: string;
      zoneAreaId: string;
      cargoPositionType: number;
      maxWeight: number;
      currentWeight: number;
      maxVolume: number;
      currentVolume: number;
      seatId: string | null;
      overheadCompartmentId: string | null;
      height: number;
      length: number;
      breadth: number;
      priority: number;
      flightLeg: number;
      id: string;
    }

    interface TableRow {
      label: string;
      data: string[];
    }

    this.flightScheduleService.getCargoPositionList(id).subscribe((res: CargoPosition[]) => {
      // Create PDF document in landscape orientation with margins
      const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
     
      });

      // Common settings
      const startY = 30; // Increased from 20 for top margin
      const cellPadding = 3; // Increased padding
      doc.setFontSize(8);

      // First table (Positions 1-10)
      let currentY = startY;
      doc.setFontSize(14);
      doc.text('LOAD DISTRIBUTION MAIN DECK COMPARTMENT', 20, currentY - 10); // Added gap before table
      doc.setFillColor('#000000');

      // Headers with padding
      currentY += 5; // Gap between heading and table
      let currentX = 45;
      doc.setFontSize(8);
      ['P1', 'P2', 'P3', 'P4', 'P5', 'P6', 'P7', 'P8', 'P9', 'P10'].forEach((pos, i) => {
        doc.text(pos, currentX + (i * 25) + cellPadding, currentY);
      });

      // Grid lines for first table
      doc.line(40, currentY - 5, 290, currentY - 5);
      doc.line(40, currentY + 80, 290, currentY + 80);
      for(let i = 0; i <= 10; i++) {
        doc.line(40 + (i * 25), currentY - 5, 40 + (i * 25), currentY + 80);
      }

      // Horizontal lines with padding
      for(let i = 0; i <= 5; i++) {
        doc.line(40, currentY + (i * 15), 290, currentY + (i * 15));
      }

      // Data for positions 1-10
      const mainPositions = res.filter(p => !p.name.startsWith('b')).sort((a,b) => Number(a.name) - Number(b.name));
      const rows: TableRow[] = [
        {label: 'Max Weight', data: mainPositions.map(p => p.maxWeight.toString())},
        {label: 'ULD No.', data: mainPositions.map(() => '')}, 
        {label: 'Weight', data: mainPositions.map(p => p.currentWeight.toString())},
        {label: 'Dest', data: mainPositions.map(() => '')},
        {label: 'Remarks', data: mainPositions.map(() => '')}
      ];

      doc.setFontSize(8);
      rows.forEach((row, index) => {
        currentY = startY + (15 * (index + 1));
        doc.text(row.label, 20 + cellPadding, currentY);
        row.data.forEach((cell, i) => {
          doc.text(cell, 45 + (i * 25) + cellPadding, currentY);
        });
      });

      // Lower Hold Tables Header with increased gap
      currentY = startY + 120; // Increased gap between tables
      doc.setFontSize(14);
      doc.text('LOAD DISTRIBUTION LOWER HOLD', 20, currentY - 10);
      doc.setFillColor('#000000');

      // Forward Hold Table
      doc.setFontSize(12);
      doc.text('FORWARD HOLD', 20, currentY + 5); // Adjusted spacing
      
      const bulkPositions1 = res.filter(p => ['b1','b2','b3'].includes(p.name)).sort((a,b) => a.name.localeCompare(b.name));
      const bulkRows1: TableRow[] = [
        {label: 'Max Weight', data: bulkPositions1.map(p => p.maxWeight.toString())},
        {label: 'ULD No.', data: bulkPositions1.map(() => '')},
        {label: 'Weight', data: bulkPositions1.map(p => p.currentWeight.toString())},
        {label: 'Dest', data: bulkPositions1.map(() => '')},
        {label: 'Remarks', data: bulkPositions1.map(() => '')}
      ];

      currentY += 10; // Gap between heading and table
      doc.setFontSize(8);
      ['B1', 'B2', 'B3'].forEach((pos, i) => {
        doc.text(pos, 45 + (i * 25) + cellPadding, currentY );
      });

      doc.line(40, currentY + 10, 115, currentY + 10);
      doc.line(40, currentY + 95, 115, currentY + 95);
      for(let i = 0; i <= 3; i++) {
        doc.line(40 + (i * 25), currentY + 10, 40 + (i * 25), currentY + 95);
      }

      // Horizontal lines with padding
      for(let i = 0; i <= 5; i++) {
        doc.line(40, currentY + 25 + (i * 15), 115, currentY + 25 + (i * 15));
      }

      bulkRows1.forEach((row, index) => {
        currentY = startY + 145 + (15 * index); // Adjusted for new spacing
        doc.text(row.label, 20 + cellPadding, currentY);
        row.data.forEach((cell, i) => {
          doc.text(cell, 45 + (i * 25) + cellPadding, currentY);
        });
      });

      // Aft Hold Table
      currentY = startY + 120; // Reset to match Forward Hold
      doc.setFontSize(12);
      doc.text('AFT HOLD', 140, currentY + 5);

      const bulkPositions2 = res.filter(p => ['b4','b5','b6'].includes(p.name)).sort((a,b) => a.name.localeCompare(b.name));
      const bulkRows2: TableRow[] = [
        {label: 'Max Weight', data: bulkPositions2.map(p => p.maxWeight.toString())},
        {label: 'ULD No.', data: bulkPositions2.map(() => '')},
        {label: 'Weight', data: bulkPositions2.map(p => p.currentWeight.toString())},
        {label: 'Dest', data: bulkPositions2.map(() => '')},
        {label: 'Remarks', data: bulkPositions2.map(() => '')}
      ];

      currentY += 10; // Gap between heading and table
      doc.setFontSize(8);
      ['B4', 'B5', 'B6'].forEach((pos, i) => {
        doc.text(pos, 165 + (i * 25) + cellPadding, currentY);
      });

      doc.line(160, currentY + 10, 235, currentY + 10);
      doc.line(160, currentY + 95, 235, currentY + 95);
      for(let i = 0; i <= 3; i++) {
        doc.line(160 + (i * 25), currentY + 10, 160 + (i * 25), currentY + 95);
      }

      // Horizontal lines with padding
      for(let i = 0; i <= 5; i++) {
        doc.line(160, currentY + 25 + (i * 15), 235, currentY + 25 + (i * 15));
      }

      bulkRows2.forEach((row, index) => {
        currentY = startY + 145 + (15 * index); // Adjusted for new spacing
        doc.text(row.label, 140 + cellPadding, currentY);
        row.data.forEach((cell, i) => {
          doc.text(cell, 165 + (i * 25) + cellPadding, currentY);
        });
      });

      try {
        doc.save(`LIR_${id}.pdf`);
      } catch (error) {
        console.error('Error generating PDF:', error);
      }
      this.isLoading = false;
    });
  }

}
