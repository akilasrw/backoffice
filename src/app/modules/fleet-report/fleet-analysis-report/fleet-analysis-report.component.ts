import { ToastrService } from 'ngx-toastr';
import { CoreExtensions } from 'src/app/core/extensions/core-extensions.model';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as _ from 'lodash';
import { MasterSheduleReportType, ScheduleStatus } from 'src/app/core/enums/common-enums';
import { SelectList } from 'src/app/shared/models/select-list.model';
import { FlightScheduleReportQuery } from 'src/app/_models/queries/flight-schedule/flight-schedule-report-query.model';
import { NgxSpinnerService } from 'ngx-spinner';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { AircraftIdleReport } from 'src/app/_models/view-models/aircraft-schedule/aircraft-idle-report.model';
import { FleetAnalysisService } from 'src/app/_services/fleet-analysis.service';

@Component({
  selector: 'app-fleet-analysis-report',
  templateUrl: './fleet-analysis-report.component.html',
  styleUrls: ['./fleet-analysis-report.component.scss']
})
export class FleetAnalysisReportComponent implements OnInit {


  pickerDate = new Date();
  query: FlightScheduleReportQuery = new FlightScheduleReportQuery();
  aircraftIdleReport?: AircraftIdleReport[]=[];
  reportTypes: SelectList[] = [];
  keyword = 'value';
  selectedType?: number;
  reportType? = MasterSheduleReportType;
  reportTypeIndex?: number = MasterSheduleReportType.IdleTimeReport;
  totalReportHours?: number = 0;
  isLoading :boolean= false;
  startDayPicked?: string ='1';
  lastDayPicked?: string;
  @ViewChild('report') reportElement!: ElementRef;
  reportData: any;
  overedAircraftIdleReport: AircraftIdleReport = new AircraftIdleReport();
  scheduleStatus= ScheduleStatus

  constructor(private fleetAnalysisService: FleetAnalysisService,
    private toastr:ToastrService,
    private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.loadReportType();
    if(!this.query.reportType){
      this.query.reportType = MasterSheduleReportType.IdleTimeReport;
      this.getReports();
    }
  }

  loadReportType() {
    this.reportTypes.push(
    { id: MasterSheduleReportType.None.toString(), value: '' },
    {id: MasterSheduleReportType.IdleTimeReport.toString(), value: CoreExtensions.GetReportType(MasterSheduleReportType.IdleTimeReport)},
    {id: MasterSheduleReportType.Running.toString(), value: CoreExtensions.GetReportType(MasterSheduleReportType.Running)})
  }

  onOpenCalendar(container :any) {
    container.monthSelectHandler = (event: any): void => {
      container._store.dispatch(container._actions.select(event.date));
    };
    container.setViewMode('month');
    this.reportData = undefined;
  }

  addFilter() {
    this.isLoading = true;
    if(!this.pickerDate){
      this.toastr.warning('Selecting a month is required.')
    } else {
      this.getReports();
    }
  }

  getReports() {
    this.query.year = new Date(this.pickerDate).getFullYear();
    this.query.month = new Date(this.pickerDate).getMonth() + 1;

    this.fleetAnalysisService.getAircraftScheduleList(this.query)
    .subscribe({
      next: (res)=> {
        this.aircraftIdleReport = res;

        this.reportData = _.chain(this.aircraftIdleReport)
          .groupBy(d => d.aircraftRegNo)
          .map((aircraftData, aircraftRegNo) => ({ aircraftRegNo, aircraftData }))
          .value();

          this.totalReportHours = this.aircraftIdleReport.reduce((hrs, obj) => {
            return hrs + obj.noOfHours;
          }, 0);
          this.isLoading = false;
      }
    });
  }

  getDates() {
    if(this.reportData != undefined)
      return this.reportData[0].aircraftData;
  }

  onClearReportType() {
    this.reportData = undefined;
    this.query.reportType = undefined;
    this.overedAircraftIdleReport = new AircraftIdleReport();
  }

  selectedReportType(value: any) {
    this.reportData = undefined;
    this.query.reportType = Number(value.id);
  }

  getLastDay() {
    var date = new Date(this.pickerDate.getFullYear(), this.pickerDate.getMonth()+1, 0);
    return date.getDate();
  }

  print() {
    this.spinner.show();
    setTimeout(() => {
      this.generatePDF();
      this.spinner.hide();
    }, 2000);
  }

  generatePDF(): void {
    let DATA: any = document.getElementById('report');
    html2canvas(DATA).then((canvas) => {
      let fileWidth = 208;
      let fileHeight = (canvas.height * fileWidth) / canvas.width;
      const FILEURI = canvas.toDataURL('image/png');
      let PDF = new jsPDF('p', 'mm', 'a4');
      let position = 0;
      PDF.addImage(FILEURI, 'PNG', 0, position, fileWidth, fileHeight);
      PDF.save('report.pdf');
    });
  }

  mouseEnter(event: any) {

    this.overedAircraftIdleReport.totalFlightTimeHrs = event.totalFlightTimeHrs;
    this.overedAircraftIdleReport.origin = event.origin;
    this.overedAircraftIdleReport.destination = event.destination;
    this.overedAircraftIdleReport.noOfHours = event.noOfHours;
    this.overedAircraftIdleReport.showHover = true;
  }

  mouseLeave() {
    this.overedAircraftIdleReport.showHover = false;
  }

  getHoursLable() {
    return this.overedAircraftIdleReport.scheduleStatus == 3? 'Maintainance ':'Idle ' + 'Hour(s)';
  }


}
