import { AirportService } from './../../../_services/airport.service';
import { Component, OnInit } from '@angular/core';
import { SelectList } from 'src/app/shared/models/select-list.model';
import { FlightScheduleManagement } from 'src/app/_models/view-models/flight-schedules-management/flight-schedule-management';
import { FlightScheduleManagementService } from 'src/app/_services/flight-schedule-management.service';
import { FlightScheduleManagementFilterQuery } from 'src/app/_models/queries/flight-schedules-management/flight-schedule-management-filter-query.model';
import { CoreExtensions } from 'src/app/core/extensions/core-extensions.model';
import { CommonMessages } from 'src/app/core/constants/common-messages';
import { ToastrService } from 'ngx-toastr';
import { FlightScheduleDeleteRM } from 'src/app/_models/request-models/flight-schedule-management/flight-schedule-management-update-rm';

@Component({
  selector: 'app-flight-schedule-list',
  templateUrl: './flight-schedule-list.component.html',
  styleUrls: ['./flight-schedule-list.component.scss']
})
export class FlightScheduleListComponent implements OnInit {

  modalVisible = false;
  modalVisibleAnimate = false;
  flightNumber?: string;
  filterFormHasValue:boolean=false;
  originAirpots: SelectList[] = [];
  destinationAirpots: SelectList[] = [];
  originAirportId?: string;
  selectedDeletedID?: string;
  destinationAirportId?: string;
  keyword = 'value';
  isLoading:boolean=false;
  modalVisibleDelete = false;
  modalVisibleAnimateDelete = false;
  flightScheduleFilterQuery: FlightScheduleManagementFilterQuery = new FlightScheduleManagementFilterQuery();
  totalCount: number = 0;
  flightSchedule: FlightScheduleManagement[] = [];
  selectedEditFlightSchedule?: FlightScheduleManagement;


  constructor(private airportService:AirportService,
    private flightScheduleService:FlightScheduleManagementService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.loadAirports();
    this.getFlightScheduleList();
  }

  onDelete(sectorId: string) {
    
    this.selectedDeletedID = sectorId;
    this.showDelete();
  }

  showDelete() {
    this.modalVisibleDelete = true;
    setTimeout(() => (this.modalVisibleAnimateDelete = true));
  }

  cancelDelete() {
    this.selectedDeletedID = '';
    this.modalVisibleAnimateDelete = false;
    setTimeout(() => (this.modalVisibleDelete = false), 300);
  }

  deleteSchedule(){
    console.log("working")
    console.log(this.selectedDeletedID)
    if (this.selectedDeletedID) {
      let rm:FlightScheduleDeleteRM = {
          id:this.selectedDeletedID
      }
      this.flightScheduleService.deleteSchedule(rm)
        .subscribe({
          next: (res:any) => {
            this.toastr.success(CommonMessages.DeletedSuccessMsg);
            this.cancelDelete();
            this.flightSchedule = [];
            this.getFlightScheduleList();
          },
          error: (error:any) => {
            this.toastr.error(CommonMessages.DeleteFailMsg);
            this.cancelDelete();
          }
        });
    }
  } 
  


  loadAirports() {
    this.isLoading=true;
    this.airportService.getSelectList()
      .subscribe(res => {
        if (res.length > 0) {
          this.originAirpots = res;
          Object.assign(this.destinationAirpots, res);
        }
        this.isLoading=false;
      });
  }

  getFlightScheduleList(){
    this.isLoading=true;
    this.flightScheduleFilterQuery.flightNumber = this.flightNumber;
    this.flightScheduleFilterQuery.originAirportId = this.originAirportId;
    this.flightScheduleFilterQuery.destinationAirportId = this.destinationAirportId;
    this.flightScheduleService.getFilteredList(this.flightScheduleFilterQuery).subscribe(
      {
        next: (res) => {
          this.flightSchedule = res.data;
          this.totalCount = res.count;
          this.isLoading=false;
        },
        error: (error) => {
          this.totalCount = 0;
          this.flightSchedule = [];
          this.isLoading=false;
        }
      }
    );
  }

  openAddFlightSchedule() {
    this.modalVisible = true;
    setTimeout(() => (this.modalVisibleAnimate = true));
  }


  closeAddFlightSchedule() {
    this.selectedEditFlightSchedule = undefined;
    this.modalVisibleAnimate = false;
    setTimeout(() => (this.modalVisible = false), 300);
  }
  onAddFlightSchedule(){
    this.selectedEditFlightSchedule = undefined;
    this.getFlightScheduleList();
  }

  onEditFlightSchedule(flightSchedule: FlightScheduleManagement){
    this.selectedEditFlightSchedule = flightSchedule;
    this.openAddFlightSchedule();
  }

  clearFilter() {
    this.flightNumber = undefined;
    this.onClearOrigin();
    this.onClearDestination();
    this.filterFormHasValue = false;
  }

  onChangeFilterFrm(event: any) {
    if (this.flightNumber !== undefined && this.flightNumber !== "") {
      this.filterFormHasValue = true;
    } else {
      this.filterFormHasValue = false;
    }
  }

  selectedOrigin(value: any) {
    this.originAirportId = value.id;
  }

  onClearOrigin(){
    this.originAirportId = undefined;
  }

  selectedDestination(value: any) {
    this.destinationAirportId = value.id;
  }

  onClearDestination(){
    this.destinationAirportId = undefined;
  }
  
  GetAircraftSubType(type: number) {
    return CoreExtensions.GetAircraftSubType(type);
  }

  public onPageChanged(event: any) {
    if (this.flightScheduleFilterQuery?.pageIndex !== event) {
      this.flightScheduleFilterQuery.pageIndex = event;
      this.getFlightScheduleList();
    }
  }
}
