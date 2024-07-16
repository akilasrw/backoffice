import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CargoBookingListQuery } from 'src/app/_models/queries/cargo-bookings/cargo-booking-list-query.model';
import { CargoBooking } from 'src/app/_models/view-models/cargo-bookings/cargo-booking.model';
import { BookingService } from 'src/app/_services/booking.service';
import { CargoAgentService } from 'src/app/_services/cargo-agent.service';
import { BookingStatus, PackageItemStatus, StandByCargoType } from 'src/app/core/enums/common-enums';
import { CoreExtensions } from 'src/app/core/extensions/core-extensions.model';
import { NumberExtension } from 'src/app/core/extensions/number-extension.model';
import { SelectList } from 'src/app/shared/models/select-list.model';

@Component({
  selector: 'app-stand-by-cargo-master',
  templateUrl: './stand-by-cargo-master.component.html',
  styleUrls: ['./stand-by-cargo-master.component.scss']
})
export class StandByCargoMasterComponent implements OnInit {

  query: CargoBookingListQuery = new CargoBookingListQuery();
  cargoBookingList: CargoBooking[] = [];
  selectedStandByStatus = StandByCargoType;
  standByCargoType: PackageItemStatus = PackageItemStatus.Offloaded;
  bookingStatus = BookingStatus;
  updateStandByModalVisibleAnimate: boolean = false;
  updateStandByModalVisible: boolean = false;
  bookingId?: string;
  isLoading: boolean = false;
  filterFormHasValue?: boolean= false;
  keyword = 'value';
  cargoAgents: SelectList[] = [];
  editAgentIndex?: number;

  constructor(private bookingService: BookingService,
    private toastr: ToastrService,
    private cargoAgentService: CargoAgentService,) { }

  ngOnInit(): void {
    this.getBookingList();
    this.loadCargoAgents();
  }

  loadCargoAgents() {
    this.isLoading = true;
    this.cargoAgentService.getAgentList()
      .subscribe({
        next: (res) => {
          if (res.length > 0) {
            this.cargoAgents = res;
          }
          this.isLoading = false;
        },
        error: (error) => {
          this.isLoading = false;
        }
      }
      );
  }


  getBookingList() {
    console.log(this.standByCargoType)
    this.isLoading = true;
    //this.query.standByStatus = Number(this.standByCargoType);
    this.bookingService.getBookingByPackage(this.standByCargoType).subscribe(
      {
        next: (res) => {
          this.cargoBookingList = res
          this.isLoading = false;
        },
        error: () => {
          this.cargoBookingList = [];
          this.isLoading = false;
        }
      }
    )
  }

  changeMenu(type: PackageItemStatus) {
    if(this.standByCargoType != type) {
      this.standByCargoType = type;
      this.getBookingList();
    }
  }

  getBookingStatus(status: number): string {
    return CoreExtensions.GetBookingStatus(status)
  }

  convertcm3Tom3(volume: number): number {
    return NumberExtension.convertcm3Tom3(volume);
  }

  closeUpdateStandBy(){
    this.updateStandByModalVisibleAnimate = false;
    setTimeout(() => (this.updateStandByModalVisible = false), 300);
  }

  onSubmitSuccess(event:any) {
    this.getBookingList();
  }

  showUpdate(val: any) {
    this.bookingId = val.id;
    this.updateStandByModalVisibleAnimate = true;
    this.updateStandByModalVisible = true;

  }

  clearFilter() {
    this.query.bookingNumber = undefined;
    this.query.agentId = undefined;
    this.editAgentIndex = undefined;
    this.getBookingList();
    this.filterFormHasValue = false;
  }

  onChangeFilterFrm(event: any) {
    this.checkFilterStatus();
  }

  checkFilterStatus(){
     if(this.query.bookingNumber != undefined ||
      this.query.agentId != undefined) {
        this.filterFormHasValue = true;
      } else {
        this.filterFormHasValue = false;
      }
  }

  selectedCargoAgent(value: any) {
    this.query.agentId = value.id;
    this.checkFilterStatus();
  }

  onClearCargoAgent() {
    this.query.agentId = undefined;
    this.checkFilterStatus();
  }

}
