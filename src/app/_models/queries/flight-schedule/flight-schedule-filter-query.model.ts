import { BasePaginationQuery } from 'src/app/shared/models/base-pagination-query.model';

export class FlightScheduleFilterQuery extends BasePaginationQuery {
  originAirportId?: string;
  destinationAirportId?: string;
  flightNumber?: string;
}
