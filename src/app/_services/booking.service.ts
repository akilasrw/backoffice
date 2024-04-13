import { CoreExtensions } from 'src/app/core/extensions/core-extensions.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from '../core/services/base.service';
import { CargoBooking } from '../_models/view-models/cargo-bookings/cargo-booking.model';
import { CargoBookingListQuery } from '../_models/queries/cargo-bookings/cargo-booking-list-query.model';
import { CargoBookingUld } from '../_models/view-models/booking-summary/cargo-booking-uld.model';
import { CargoBookingStatusUpdateListRm } from '../_models/view-models/cargo-bookings/cargo-booking-status-update-list-rm.model';
import { CargoBookingUpdateRm } from '../_models/view-models/cargo-bookings/cargo-booking-update-rm.model';
import { CargoBookingDetailQuery } from '../_models/queries/cargo-bookings/cargo-booking-detail-query.model';
import {CargoBookingShipmentQuery} from "../_models/queries/booking-shipment/cargo-booking-shipment-query.model";
import {BookingShipment} from "../_models/view-models/booking-shipment/booking-shipment.model";
import {CargoBookingFilterQuery} from "../_models/queries/cargo-bookings/cargo-booking-filter-query.model";
import {IPagination} from "../shared/models/pagination.model";
import {CargoBookingAgent} from "../_models/view-models/cargo-bookings/cargo-booking-agent.model";

@Injectable({
  providedIn: 'root'
})
export class BookingService extends BaseService {


  private readonly endpointEntityName = 'cargoBooking';
  private readonly getListEndpoint = `${this.endpointEntityName}/getList`;
  private readonly getStandByCargoListEndpoint = `${this.endpointEntityName}/GetStandByCargoList`;
  private readonly getFreighterListEndpoint = `${this.endpointEntityName}/GetFreighterBookingList`;
  private readonly updateStandByStatusEndpoint = `${this.endpointEntityName}/UpdateStandByStatus`;
  private readonly updateDeleteCargoEndpoint = `${this.endpointEntityName}/UpdateDeleteCargo`;
  private readonly getCargoEndpoint = `${this.endpointEntityName}/GetDetail`;
  private readonly getVerifyBookingListEndpoint = `${this.endpointEntityName}/GetVerifyBookingList`;
  private readonly getShipmentListEndpoint = `${this.endpointEntityName}/getShipments`;
  private readonly getFilteredListEndpoint = `${this.endpointEntityName}/getFilteredList`;


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

  getVerifyBookingList(flightScheduleId: string) {
    var params = new HttpParams();

    if (flightScheduleId) {
      params = params.append("flightScheduleId", flightScheduleId );
    }

    return this.getWithParams<CargoBooking[]>(
      this.getVerifyBookingListEndpoint,
      params
    );
  }

  getstandByStatusList(query: CargoBookingListQuery) {
    var params = new HttpParams();

    if (query.standByStatus) {
      params = params.append("standByStatus", Number(query.standByStatus));
    }

    if (query.bookingNumber) {
      params = params.append("bookingNumber", query.bookingNumber);
    }

    if (query.agentId) {
      params = params.append("agentId", query.agentId);
    }

    return this.getWithParams<CargoBooking[]>(
      this.getStandByCargoListEndpoint,
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

  getBookingDetail(query: CargoBookingDetailQuery) {
    var params = new HttpParams();
    if (query.id) {
      params = params.append("id", query.id);
    }

    if (query.isIncludeFlightDetail) {
      params = params.append("isIncludeFlightDetail", query.isIncludeFlightDetail);
    }

    if (query.isIncludePackageDetail) {
      params = params.append("isIncludePackageDetail", query.isIncludePackageDetail);
    }

    return this.getWithParams<any>(this.getCargoEndpoint,params);
  }
  getBookingShipmentDetail(query: CargoBookingShipmentQuery) {
    var params = new HttpParams();
    if (query.packageID) {
      params = params.append("packageID", query.packageID);
    }

    if (query.AWBNumber) {
      params = params.append("AWBNumber", query.AWBNumber);
    }
    return this.getWithParams<Array<BookingShipment>>(this.getShipmentListEndpoint,params);
  }
  getFilteredBookingList(query: CargoBookingFilterQuery){
    var params = new HttpParams();
    // if (query.bookingId) {
    //   params = params.append("bookingId", query.bookingId);
    // }
    if (query.bookingId) {
      params = params.append("awbNumber", query.bookingId);
    }
    if (query.userId) {
      params = params.append("userId", query.userId);
    }

    if (query.destination) {
      params = params.append("destination", query.destination);
    }

    if (query.fromDate) {
      params = params.append("fromDate", query.fromDate.toDateString());
    }
    if (query.toDate) {
      params = params.append("toDate", query.toDate.toDateString());
    }
    params = CoreExtensions.AsPaginate(params, query);

    return this.getWithParams<IPagination<CargoBookingAgent>>(
      this.getFilteredListEndpoint,
      params
    );
  }

}
