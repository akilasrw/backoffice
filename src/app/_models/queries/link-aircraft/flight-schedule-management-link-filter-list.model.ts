import { BasePaginationQuery } from './../../../shared/models/base-pagination-query.model';

export class FlightScheduleManagementLinkFilterList extends BasePaginationQuery{
  flightNumber? :string;
  status? :number;
  isHistory?: boolean;
  originAirportId?: string;
  destinationAirportId?: string;
  flightDate?: Date
}
