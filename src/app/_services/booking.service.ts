import { CoreExtensions } from 'src/app/core/extensions/core-extensions.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from '../core/services/base.service';
import { CargoBooking } from '../_models/view-models/cargo-bookings/cargo-booking.model';
import { CargoBookingListQuery } from '../_models/queries/cargo-bookings/cargo-booking-list-query.model';
import { CargoBookingUld } from '../_models/view-models/booking-summary/cargo-booking-uld.model';
import { CargoBookingStatusUpdateListRm } from '../_models/view-models/cargo-bookings/cargo-booking-status-update-list-rm.model';
import { CargoBookingUpdateRm } from '../_models/view-models/cargo-bookings/cargo-booking-update-rm.model';

@Injectable({
  providedIn: 'root'
})
export class BookingService extends BaseService {


  private readonly endpointEntityName = 'cargoBooking';
  private readonly getListEndpoint = `${this.endpointEntityName}/getList`;
  private readonly getFreighterListEndpoint = `${this.endpointEntityName}/GetFreighterBookingList`;
  private readonly updateStandByStatusEndpoint = `${this.endpointEntityName}/UpdateStandByStatus`;
  private readonly updateDeleteCargoEndpoint = `${this.endpointEntityName}/UpdateDeleteCargo`;


  constructor(http: HttpClient) {
    super(http);
  }

  getBookingList(query: CargoBookingListQuery) {
    var params = new HttpParams();

    if (query.flightDate) {
      params = params.append("flightDate", new Date(query.flightDate).toDateString());
    }
    if (query.flightNumber) {
      params = params.append("flightNumber", query.flightNumber);
    }

    if (query.standByStatus) {
      params = params.append("standByStatus", Number(query.standByStatus));
    }

    return this.getWithParams<CargoBooking[]>(
      this.getListEndpoint,
      params
    );
  }

  getFreighterBookingList(query: CargoBookingListQuery) {
    var params = new HttpParams();

    if (query.flightDate) {
      params = params.append("flightDate", new Date(query.flightDate).toDateString());
    }
    if (query.flightNumber) {
      params = params.append("flightNumber", query.flightNumber);
    }

    return this.getWithParams<CargoBookingUld[]>(
      this.getFreighterListEndpoint,
      params
    );
  }

  updateStandByStatus(cargoBookingStatusUpdateListRM: CargoBookingStatusUpdateListRm){
    return this.put<any>(this.updateStandByStatusEndpoint, cargoBookingStatusUpdateListRM);
  }

  updateDeleteCargo(list: CargoBookingUpdateRm[]){
    return this.put<any>(this.updateDeleteCargoEndpoint, list);
  }
}
