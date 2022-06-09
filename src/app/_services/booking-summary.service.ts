import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from '../core/services/base.service';
import { BookingSummaryQuery } from '../_models/queries/booking-summary/booking-summary-query.model';
import { CargoBookingSummary } from '../_models/view-models/booking-summary/cargo-booking-summary.model';

@Injectable({
  providedIn: 'root'
})
export class BookingSummaryService extends BaseService {

  private readonly endpointEntityName = 'CargoBooking';
  private readonly getSummaryEndpoint = `${this.endpointEntityName}/getSummary`;


  constructor(http: HttpClient){super(http)}

  getSummary(query: BookingSummaryQuery) {
    var params = new HttpParams();
    if (query.flightDate) {
      params = params.append("flightDate", query.flightDate.toDateString());
    }

    if (query.flightNumber) {
      params = params.append("flightNumber", query.flightNumber);
    }

    return this.getWithParams<CargoBookingSummary>(`${this.getSummaryEndpoint}`, params);
  }
}
