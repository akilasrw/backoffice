import {BasePaginationQuery} from "../../../shared/models/base-pagination-query.model";

export class CargoBookingFilterQuery extends BasePaginationQuery {
  bookingId?: string;
  destination?: string;
  fromDate?: Date;
  toDate?: Date;
}


export class StandyBookingFilterQuery extends BasePaginationQuery {
  CargoBooking?: string;
  CargoAgent?:string;
}