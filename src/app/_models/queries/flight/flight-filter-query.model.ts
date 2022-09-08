import { BasePaginationQuery } from "src/app/shared/models/base-pagination-query.model";

export class FlightFilterQuery extends BasePaginationQuery {
  flightNumber?: string;
  originAirportId?: string;
  destinationAirportId?: string;
}
