import { Component, Input, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { CargoBookingDetailQuery } from 'src/app/_models/queries/cargo-bookings/cargo-booking-detail-query.model';
import { User } from 'src/app/_models/user.model';
import { BookingService } from 'src/app/_services/booking.service';
import { AccountService } from 'src/app/account/account.service';
import { BookingStatus } from 'src/app/core/enums/common-enums';
import { CoreExtensions } from 'src/app/core/extensions/core-extensions.model';

@Component({
  selector: 'app-stand-by-cargo-update',
  templateUrl: './stand-by-cargo-update.component.html',
  styleUrls: ['./stand-by-cargo-update.component.scss']
})
export class StandByCargoUpdateComponent implements OnInit {

  isLoading: boolean= false;
  cargoBookingDetail?: any;
  //currentUser?: User | null;
  //subscription?: Subscription;
  editBookingId?: string;
  @Input() set cargoBookingId(cargoBookingId: string) {
    this.editBookingId = cargoBookingId;
    //this.getCurrentUser();
    this.getBookingDetail();
  }

  constructor(private bookingSerice: BookingService,
    private accountService: AccountService,
    private toastr: ToastrService,) { }

  ngOnInit(): void {
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

  // getCurrentUser() {
  //   this.subscription = this.accountService.currentUser$.subscribe(res => {
  //     this.currentUser = res;
  //   });
  // }

  // getCargoAgentDetails(userId:string){
  //   var query = new CargoAgentQuery();
  //   query.appUserId = userId;
  //   query.isCountryInclude=true;
  //   this.accountService.getUserDetail(query).subscribe(res => {
  //     this.cargoAgent = res;
  //   });
  // }
}
