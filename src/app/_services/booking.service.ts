import { CoreExtensions } from 'src/app/core/extensions/core-extensions.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from '../core/services/base.service';
import { CargoBooking } from '../_models/view-models/cargo-bookings/cargo-booking.model';
import { CargoBookingListQuery } from '../_models/queries/cargo-bookings/cargo-booking-list-query.model';
import { CargoBookingUld } from '../_models/view-models/booking-summary/cargo-booking-uld.model';

@Injectable({
  providedIn: 'root'
})
export class BookingService extends BaseService {


  private readonly endpointEntityName = 'cargoBooking';
  private readonly getListEndpoint = `${this.endpointEntityName}/getList`;
  private readonly getFreighterListEndpoint = `${this.endpointEntityName}/GetFreighterBookingList`;


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
}
