import { AirportService } from './../../../../_services/airport.service';
import { SelectList } from './../../../../shared/models/select-list.model';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FlightScheduleManagementLinkFilterList } from 'src/app/_models/queries/link-aircraft/flight-schedule-management-link-filter-list.model';
import { FlightScheduleLink } from 'src/app/_models/view-models/link-aircraft/flight-schedule-link.model';
import { AutoCompleteDropdownComponent } from 'src/app/shared/components/forms/auto-complete-dropdown/auto-complete-dropdown.component';
import { LinkAircraftToScheduleService } from 'src/app/_services/link-aircraft-to-schedule.service';
import { VerifyInputBase } from 'src/app/core/enums/common-enums';

@Component({
  selector: 'app-upcoming-assign-aircraft',
  templateUrl: './upcoming-assign-aircraft.component.html',
  styleUrls: ['./upcoming-assign-aircraft.component.scss']
})
export class UpcomingAssignAircraftComponent implements OnInit {
  modalVisible = false;
  modalVisibleAnimate = false;
  verifyBookingModalVisible = false;
  verifyBookingModalVisibleAnimate = false;
  modalVisibleSummary = false;
  modalVisibleAnimateSummary = false;
  updateATAModalVisible = false;
  updateATAModalVisibleAnimate = false;
  flightScheduleLinks: FlightScheduleLink[]=[];
  query: FlightScheduleManagementLinkFilterList=  new FlightScheduleManagementLinkFilterList();
  selectedFlightScheduleLink?: FlightScheduleLink;
  isLoading :boolean= false;
  totalCount: number = 0;
  isFiltered: boolean = false;
  keyword = 'value';
  //selectedStatus?: number;
  statusList: SelectList[] = [];
  originAirpots: SelectList[] = [];
  destinationAirpots: SelectList[] = [];
  ATAValue: string ='';
  stepCount: number= 1;
  inputBase: VerifyInputBase = VerifyInputBase.FromUpcoming;
  isVerifiedClicked =false;

  @ViewChild('originAirportAutoComplete') originAirportDropdown!: AutoCompleteDropdownComponent;
  @ViewChild('destinationAirportAutoComplete') destinationAirportDropdown!: AutoCompleteDropdownComponent;

  constructor(private linkAircraftToScheduleService: LinkAircraftToScheduleService,
    private airportService: AirportService) { }

  ngOnInit(): void {
    this.loadAirports();
    this.getFilterList();
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

  getFilterList() {
    this.isLoading = true;
    this.query.isHistory = false;
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

  onChangeFilter() {
    this.isFiltered= true;
    if((this.query.flightNumber == undefined || this.query.flightNumber == '') &&
    (this.query.originAirportId == undefined || this.query.originAirportId == '') &&
    (this.query.destinationAirportId == undefined || this.query.destinationAirportId == '') &&
    this.query.flightDate == undefined){
      this.isFiltered = false;
    }
  }

  public onPageChanged(event: any) {
    if (this.query?.pageIndex !== event) {
      this.query.pageIndex = event;
      this.getFilterList();
    }
  }

  show(fs:FlightScheduleLink) {
    this.selectedFlightScheduleLink=fs;
    this.stepCount = 1;
    if(this.selectedFlightScheduleLink?.aircraftId)
      this.stepCount = 2;
    (this.selectedFlightScheduleLink as FlightScheduleLink).stepCount = this.stepCount;
    this.modalVisible = true;
    setTimeout(() => (this.modalVisibleAnimate = true));
  }

  close() {
    this.modalVisibleAnimate = false;
    setTimeout(() => (this.modalVisible = false), 300);
  }

  closeSummary() {
    this.modalVisibleAnimateSummary = false;
    setTimeout(() => (this.modalVisibleSummary = false), 300);
  }

  closeVerifyBooking(){
    this.verifyBookingModalVisibleAnimate = false;
    setTimeout(() => (this.verifyBookingModalVisible = false), 300);
  }

  showSummary(fs:FlightScheduleLink) {
    this.selectedFlightScheduleLink=fs;
    this.modalVisibleSummary = true;
    setTimeout(() => (this.modalVisibleAnimateSummary = true));
  }

  viewBooking(event: any){
    console.log('viewBooking', event);
    this.verifyBookingModalVisible = true;
    setTimeout(() => (this.verifyBookingModalVisibleAnimate = true));
  }

  onVerified() {
    this.isVerifiedClicked = true;
  }

}
