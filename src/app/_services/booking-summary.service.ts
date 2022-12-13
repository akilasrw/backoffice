import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CoreExtensions } from '../core/extensions/core-extensions.model';
import { BaseService } from '../core/services/base.service';
import { IPagination } from '../shared/models/pagination.model';
import { BookingSummaryDetailQuery } from '../_models/queries/booking-summary/booking-summary-detail-query.model';
import { BookingSummaryFilterQuery } from '../_models/queries/booking-summary/booking-summary-filter-query.model';
import { BookingSummaryQuery } from '../_models/queries/booking-summary/booking-summary-query.model';
import { CargoPositionULDContainerListQuery } from '../_models/queries/booking-summary/cargo-position-uld-container-list-query.model';
import { CargoBookingSummaryDetail } from '../_models/view-models/booking-summary/cargo-booking-summary-detail.model';
import { CargoBookingSummary } from '../_models/view-models/booking-summary/cargo-booking-summary.model';
import { UldContainerCargoPosition } from '../_models/view-models/booking-summary/uld-container-cargo-position.model';
import { ULDCargoBooking } from '../_models/view-models/cargo-bookings/uld-cargo-booking.model';

@Injectable({
  providedIn: 'root'
})
export class BookingSummaryService extends BaseService {

  private readonly endpointEntityName = 'CargoBooking';
  private readonly endpointCargoBookingSummary = 'CargoBookingSummary';
  private readonly endpointULDCargoBookingSummary = 'ULDCargoBooking';
  private readonly getSummaryEndpoint = `${this.endpointEntityName}/getSummary`;
  private readonly getSeatSummaryEndpoint = `${this.endpointEntityName}/getSeatSummary`;
  private readonly getFilteredListEndpoint = `${this.endpointCargoBookingSummary}/GetFilteredList`;
  private readonly assignCargoToULDEndpoint = `${this.endpointULDCargoBookingSummary}/AssignCargoToULD`;
  private readonly getULDBookingListEndpoint = `${this.endpointULDCargoBookingSummary}/getULDBookingList`;



  constructor(http: HttpClient){super(http)}

  getSummary(query: BookingSummaryQuery) {
    var params = new HttpParams();
    if (query.flightScheduleId) {
      params = params.append("flightScheduleId", query.flightScheduleId);
    }

    return this.getWithParams<CargoBookingSummaryDetail>(`${this.getSummaryEndpoint}`, params);
  }

  getSeatSummary(query: BookingSummaryQuery) {
    var params = new HttpParams();
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

  getBookingSummaryDetail(query: BookingSummaryDetailQuery) {
    var params = new HttpParams();
    if (query.id) {
      params = params.append("id", query.id);
    }

    if (query.isIncludeAircraftType) {
      params = params.append("isIncludeAircraftType", query.isIncludeAircraftType);
    }

    if (query.isIncludeFlightScheduleSectors) {
      params = params.append("isIncludeFlightScheduleSectors", query.isIncludeFlightScheduleSectors);
    }

    return this.getWithParams<CargoBookingSummaryDetail>(`${this.endpointCargoBookingSummary}`, params);
  }

  assignCargoToUld(uldContainerCargoPosition: UldContainerCargoPosition){
    return this.post<any>(this.assignCargoToULDEndpoint, uldContainerCargoPosition);
  }

  getULDBookingList(query: CargoPositionULDContainerListQuery) {
    var params = new HttpParams();

    if (query.cargoPositionId) {
      params = params.append("cargoPositionId", query.cargoPositionId);
    }
    return this.getWithParams<ULDCargoBooking[]>(
      this.getULDBookingListEndpoint,
      params
    );
  }


}
