import { Component, OnInit } from '@angular/core';
import {CargoBookingFilterQuery} from "../../../_models/queries/cargo-bookings/cargo-booking-filter-query.model";
import {PackageItemStatus} from "../../../core/enums/common-enums";
import {User} from "../../../_models/user.model";
import {Subscription} from "rxjs";
import {BookingService} from "../../../_services/booking.service";
import {AccountService} from "../../../account/account.service";
import {Router} from "@angular/router";
import {CargoBookingAgent} from "../../../_models/view-models/cargo-bookings/cargo-booking-agent.model";
import {CoreExtensions} from "../../../core/extensions/core-extensions.model";

@Component({
  selector: 'app-booking-agent',
  templateUrl: './booking-agent.component.html',
  styleUrls: ['./booking-agent.component.scss']
})
export class BookingAgentComponent implements OnInit {

  modalVisible = false;
  modalVisibleAnimate = false;
  filterFormHasValue = false
  totalCount: number = 0;
  bookingListfilterQuery: CargoBookingFilterQuery = new CargoBookingFilterQuery();
  bookingId?: string;
  destination?: string;
  fromDate?: Date;
  toDate?: Date;
  cargoBookingList: CargoBookingAgent[] = []
  cargoBooking?: CargoBookingAgent;
  bookingStatus = PackageItemStatus;
  currentUser?: User | null;
  subscription?: Subscription;
  isLoading :boolean= false;
  redirectToTrackBooking: boolean=false;

  constructor(
    private bookingService: BookingService,
    private accountService: AccountService,
    private router: Router) { }

  ngOnInit(): void {
    this.getCurrentUser();
    this.getFilteredList();
  }

  getFilteredList() {
    this.isLoading=true;
    this.bookingListfilterQuery.bookingId = this.bookingId;
    this.bookingListfilterQuery.destination = this.destination;
    this.bookingListfilterQuery.fromDate = this.fromDate;
    this.bookingListfilterQuery.toDate = this.toDate;
    this.bookingListfilterQuery.userId = this.currentUser?.id != null ? this.currentUser?.id : "";

    this.bookingService.getFilteredBookingList(this.bookingListfilterQuery).subscribe(
      {
        next: (res) => {
          res.data.forEach((x)=>{
            if(x.flightDate&&new Date(x.flightDate).getFullYear() == 1){
              x.flightDate = null
            }
          })
          this.cargoBookingList = res.data;
          this.totalCount = res.count;
          this.isLoading=false;
        },
        error: () => {
          this.cargoBookingList = [];
          this.totalCount = 0;
          this.isLoading=false;
        }
      }
    )
  }

  onChangeFilterFrm(event:any) {
    if ((this.bookingId !== undefined && this.bookingId !== "") ||
      (this.destination !== undefined && this.destination !== "") ||
      (this.fromDate !== null) || (this.toDate !== null)) {
      this.filterFormHasValue = true;
    } else {
      this.filterFormHasValue = false;
    }

  }

  show(booking:CargoBookingAgent) {
    this.cargoBooking = booking;
    this.modalVisible = true;
    setTimeout(() => (this.modalVisibleAnimate = true));
  }

  hide() {
    this.modalVisibleAnimate = false;
    setTimeout(() => (this.modalVisible = false), 300);
  }

  cancel() {
    this.hide();
  }

  goToCreateBooking() {
    this.router.navigate(['booking/search']);
  }

  getBookingStatus(status: PackageItemStatus): string {
    return CoreExtensions.GetPackageStatus(status)
  }

  clearFilter() {
    this.bookingId=undefined;
    this.destination = undefined;
    this.fromDate = undefined;
    this.toDate = undefined;
    this.filterFormHasValue = false;
  }
  public onPageChanged(event: any) {
    if (this.bookingListfilterQuery?.pageIndex !== event) {
      this.bookingListfilterQuery.pageIndex = event;
      this.getFilteredList();
    }
  }

  getCurrentUser() {
    this.subscription = this.accountService.currentUser$.subscribe(res => {
      this.currentUser = res;
    });
  }
  showTrackBooking(awbNumber: any){
    // this.redirectToTrackBooking = true;
    console.log(awbNumber)
    this.router.navigate(['booking-summary/track-booking', awbNumber])
  }

}
