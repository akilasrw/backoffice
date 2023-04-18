import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { CargoBookingDetailQuery } from 'src/app/_models/queries/cargo-bookings/cargo-booking-detail-query.model';
import { User } from 'src/app/_models/user.model';
import { BookingService } from 'src/app/_services/booking.service';
import { FlightService } from 'src/app/_services/flight.service';
import { AccountService } from 'src/app/account/account.service';
import { BookingStatus } from 'src/app/core/enums/common-enums';
import { CoreExtensions } from 'src/app/core/extensions/core-extensions.model';
import { SelectList } from 'src/app/shared/models/select-list.model';

@Component({
  selector: 'app-stand-by-cargo-update',
  templateUrl: './stand-by-cargo-update.component.html',
  styleUrls: ['./stand-by-cargo-update.component.scss']
})
export class StandByCargoUpdateComponent implements OnInit {

  public flightForm!: FormGroup;
  keyword = 'value';
  isLoading: boolean= false;
  cargoBookingDetail?: any;
  flightList: SelectList[] = [];
  editBookingId?: string;
  startMinDate = new Date();

  @Input() set cargoBookingId(cargoBookingId: string) {
    this.editBookingId = cargoBookingId;;
    this.getBookingDetail();
  }
  @Output() closePopup = new EventEmitter<any>();
  @Output() submitSuccess = new EventEmitter<any>();

  constructor(private bookingSerice: BookingService,
    private accountService: AccountService,
    private toastr: ToastrService,
    private flightService: FlightService) { }

  ngOnInit(): void {
    this.initializeForm();
    this.loadFlights();
  }

  initializeForm() {
    this.flightForm = new FormGroup({
      flightId: new FormControl(null, [Validators.required]),
      departureFlightDate: new FormControl(null, [Validators.required]),
    });
  }

  loadFlights() {
    this.isLoading = true;
    this.flightService.getSelectList()
      .subscribe(res => {
        this.isLoading = false;
        if (res.length > 0) {
          this.flightList = res;
        }
      });
  }

  selectedFlight(value: any) {
    this.flightForm.get('flightId')?.patchValue(value.id);
  }

  onClearFlight() {
    this.flightForm.get('flightId')?.patchValue(null);
  }

  getBookingDetail() { debugger;
    if (this.editBookingId != null) {
      var query = new CargoBookingDetailQuery;

      query.id = this.editBookingId;
      query.isIncludeFlightDetail = true;
      query.isIncludePackageDetail = true;
      //query.isIncludeAWBDetail=true;
      //query.userId = this.currentUser?.id;

      this.bookingSerice.getBookingDetail(query).subscribe(
        res => {
          this.cargoBookingDetail = res;
        }
      );
    }
  }

  getBookingStatus(status: number): string {
    return CoreExtensions.GetBookingStatus(status)
  }

  get bookingStatus(): typeof BookingStatus {
    return BookingStatus;
  }

  closeModal(){
    this.closePopup.emit();
  }

  save() {
    if (this.flightForm.get('flightId')?.value === null || this.flightForm.get('flightId')?.value === "") {
      this.toastr.error('Please select flight.');
      return;
    }

    if (this.flightForm.get('departureFlightDate')?.value == null) {
      this.toastr.error('Please select date.');
      return;
    }


    if (this.flightForm.valid) {
      //this.isLoading = true;

    } else {
      this.flightForm.markAllAsTouched();
    }
  }
}
