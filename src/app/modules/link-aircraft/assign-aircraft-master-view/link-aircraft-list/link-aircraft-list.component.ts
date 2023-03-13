import { SelectList } from 'src/app/shared/models/select-list.model';
import { FlightScheduleLink } from '../../../../_models/view-models/link-aircraft/flight-schedule-link.model';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FlightScheduleManagementLinkFilterList } from 'src/app/_models/queries/link-aircraft/flight-schedule-management-link-filter-list.model';
import { LinkAircraftFliterStatus } from 'src/app/core/enums/common-enums';
import { CoreExtensions } from 'src/app/core/extensions/core-extensions.model';
import { LinkAircraftToScheduleService } from 'src/app/_services/link-aircraft-to-schedule.service';
import { AutoCompleteDropdownComponent } from 'src/app/shared/components/forms/auto-complete-dropdown/auto-complete-dropdown.component';
import { AirportService } from 'src/app/_services/airport.service';


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
  flightScheduleLinks: FlightScheduleLink[]=[];
  query: FlightScheduleManagementLinkFilterList=  new FlightScheduleManagementLinkFilterList();
  selectedId?: string;
  isLoading :boolean= false;
  totalCount: number = 0;
  isFiltered: boolean = false;
  keyword = 'value';
  //selectedStatus?: number;
  statusList: SelectList[] = [];
  originAirpots: SelectList[] = [];
  destinationAirpots: SelectList[] = [];
  ATAValue: string ='';

  @ViewChild('originAirportAutoComplete') originAirportDropdown!: AutoCompleteDropdownComponent;
  @ViewChild('destinationAirportAutoComplete') destinationAirportDropdown!: AutoCompleteDropdownComponent;

  constructor(private linkAircraftToScheduleService: LinkAircraftToScheduleService,
    private airportService: AirportService,) { }

  ngOnInit(): void {
    this.loadAirports();
    this.getFilterList();
    this.loadLinkAircraftStatusList();
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
    // this.updateATAModalVisible = true;
    // setTimeout(() => (this.updateATAModalVisibleAnimate = true));

  }

  close() {
    this.modalVisibleAnimate = false;
    setTimeout(() => (this.modalVisible = false), 300);
  }

  closeUpdateATA() {
    this.updateATAModalVisibleAnimate = false;
    setTimeout(() => (this.updateATAModalVisible = false), 300);
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
    //this.selectedStatus = Number(value.id);
    this.query.status = Number(value.id);
  }

  onClearStatus() {
    //this.selectedStatus = undefined;
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

}
