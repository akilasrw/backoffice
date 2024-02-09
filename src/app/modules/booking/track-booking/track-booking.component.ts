import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {Subscription} from "rxjs";
import {User} from "../../../_models/user.model";
import {BookingService} from "../../../_services/booking.service";
import {AccountService} from "../../../account/account.service";
import {ToastrService} from "ngx-toastr";
import {NgxSpinnerService} from "ngx-spinner";
import {BookingShipment} from "../../../_models/view-models/booking-shipment/booking-shipment.model";
import {CargoBookingShipmentQuery} from "../../../_models/queries/booking-shipment/cargo-booking-shipment-query.model";

@Component({
  selector: 'app-track-booking',
  templateUrl: './track-booking.component.html',
  styleUrls: ['./track-booking.component.scss']
})
export class TrackBookingComponent implements OnInit {

  public searchForm!: FormGroup;
  public selectionForm!: FormGroup;
  cargoBookingLookup?: BookingShipment;
  cargoBookingShipmentList?: BookingShipment[] = [];
  subscription?: Subscription;
  currentUser?: User | null;
  isAWBChecked: boolean = false;
  packageItemCount = 0;
  packageStatus: number = 0;
  isSplitBooking: boolean = false;
  packageItemShipment: number = 0;



  constructor(private fb: FormBuilder,
              private bookingService: BookingService,
              private accountService: AccountService,
              private toastr: ToastrService,
              private spinner: NgxSpinnerService) {
  }

  ngOnInit(): void {
    this.getCurrentUser();
    this.initializeForm();
    this.initializeSelectionForm();
    this.selectionForm.get('packageItemShipment')?.valueChanges?.subscribe(value => {
      this.getShipmentDetail(value);
    });
    const screenWidth = window.innerWidth - 315;
    const rowElement = document.querySelector('.awb_checked') as HTMLElement;
    if (rowElement) {
      rowElement.style.width = screenWidth + 'px';
    }

  }

  initializeForm() {
    this.searchForm = this.fb.group({
      referenceNumber: new FormControl(null)
    });
  }

  initializeSelectionForm() {
    this.selectionForm = this.fb.group({
      packageItemShipment: -1
    });
  }

  check() {
    this.isAWBChecked = !this.isAWBChecked

  }

  getBookingDetail() {
    if (this.searchForm.value.referenceNumber != null) {
      var query = new CargoBookingShipmentQuery();
      if (this.isAWBChecked) {
        query.packageID = this.searchForm.value.referenceNumber;
      } else {
        query.AWBNumber = this.searchForm.value.referenceNumber;
      }

      this.bookingService.getBookingShipmentDetail(query).subscribe(
        {
          next: (res) => {
            this.cargoBookingShipmentList = res;
            if (null != this.cargoBookingShipmentList && this.cargoBookingShipmentList.length > 0) {
              if (this.cargoBookingShipmentList?.length > 1) {
                this.isSplitBooking = true;
              } else {
                this.cargoBookingLookup = this.cargoBookingShipmentList[0];
              }
            }
          },
          error: (error) => {
            this.cargoBookingLookup = undefined;
          }
        });
    } else {
      this.toastr.error('Please enter booking number or package number.');
    }
  }


  getCurrentUser() {
    this.subscription = this.accountService.currentUser$.subscribe(res => {
      this.currentUser = res;
    });
  }

  getShipmentDetail(selectedShipment: BookingShipment) {
    this.cargoBookingLookup = selectedShipment;
  }


}
