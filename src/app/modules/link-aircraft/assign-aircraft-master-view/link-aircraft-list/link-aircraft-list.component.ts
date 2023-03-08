import { SelectList } from 'src/app/shared/models/select-list.model';
import { FlightScheduleLink } from '../../../../_models/view-models/link-aircraft/flight-schedule-link.model';
import { Component, OnInit } from '@angular/core';
import { FlightScheduleManagementLinkFilterList } from 'src/app/_models/queries/link-aircraft/flight-schedule-management-link-filter-list.model';
import { LinkAircraftFliterStatus } from 'src/app/core/enums/common-enums';
import { CoreExtensions } from 'src/app/core/extensions/core-extensions.model';
import { LinkAircraftToScheduleService } from 'src/app/_services/link-aircraft-to-schedule.service';


@Component({
  selector: 'app-link-aircraft-list',
  templateUrl: './link-aircraft-list.component.html',
  styleUrls: ['./link-aircraft-list.component.scss']
})
export class LinkAircraftListComponent implements OnInit {


  modalVisible = false;
  modalVisibleAnimate = false;
  flightScheduleLinks: FlightScheduleLink[]=[];
  query: FlightScheduleManagementLinkFilterList=  new FlightScheduleManagementLinkFilterList();
  selectedId?: string;
  isLoading :boolean= false;
  totalCount: number = 0;
  isFiltered: boolean = false;
  keyword = 'value';
  //selectedStatus?: number;
  statusList: SelectList[] = [];


  constructor(private linkAircraftToScheduleService: LinkAircraftToScheduleService) { }

  ngOnInit(): void {
    this.getFilterList();
    this.loadLinkAircraftStatusList();
  }

  show(id:string) {
    this.selectedId=id;
    this.modalVisible = true;
    setTimeout(() => (this.modalVisibleAnimate = true));
  }

  close() {
    this.modalVisibleAnimate = false;
    setTimeout(() => (this.modalVisible = false), 300);
  }

  getFilterList() {
    this.isLoading = true;
    this.query.isHistory = true;
    this.linkAircraftToScheduleService.getFilteredList(this.query)
    .subscribe(res => {
      if (res != null) { console.log(res);

        this.flightScheduleLinks = res.data;
        this.totalCount = res.count
        this.checkFiltered();
        this.isLoading = false;
      }
    });
  }

  clearFilter() {
    this.query=  new FlightScheduleManagementLinkFilterList();
    this.getFilterList();
    this.isFiltered = false;
  }

  checkFiltered() {
    if(this.query.flightNumber == undefined || this.query.flightNumber == '') {
      this.isFiltered = false;
    } else {
      this.isFiltered = true;
    }
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
    return diffInHours+ ' Hrs';
  }
}
