import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CoreExtensions } from '../core/extensions/core-extensions.model';
import { BaseService } from '../core/services/base.service';
import { IPagination } from '../shared/models/pagination.model';
import { BookingSummaryFilterQuery } from '../_models/queries/booking-summary/booking-summary-filter-query.model';
import { BookingSummaryQuery } from '../_models/queries/booking-summary/booking-summary-query.model';
import { CargoBookingSummaryDetail } from '../_models/view-models/booking-summary/cargo-booking-summary-detail.model';
import { CargoBookingSummary } from '../_models/view-models/booking-summary/cargo-booking-summary.model';

@Injectable({
  providedIn: 'root'
})
export class BookingSummaryService extends BaseService {

  private readonly endpointEntityName = 'CargoBooking';
  private readonly endpointCargoBookingSummary = 'CargoBookingSummary';
  private readonly getSummaryEndpoint = `${this.endpointEntityName}/getSummary`;
  private readonly getFilteredListEndpoint = `${this.endpointCargoBookingSummary}/GetFilteredList`;


  constructor(http: HttpClient){super(http)}

  getSummary(query: BookingSummaryQuery) {
    var params = new HttpParams();
    if (query.flightDate) {
      params = params.append("flightDate", query.flightDate.toDateString());
    }

    if (query.flightNumber) {
      params = params.append("flightNumber", query.flightNumber);
    }

    return this.getWithParams<CargoBookingSummaryDetail>(`${this.getSummaryEndpoint}`, params);
  }

  getFilteredList(query: BookingSummaryFilterQuery){
    var params = new HttpParams();
    if (query.flightNumber) {
      params = params.append("flightNumber", query.flightNumber);
    }

    if (query.flightDate) {
      params = params.append("flightDate", query.flightDate.toDateString());
    }
      
    params = CoreExtensions.AsPaginate(params, query);

    return this.getWithParams<IPagination<CargoBookingSummary>>(
      this.getFilteredListEndpoint,
      params
    );
  }

}
