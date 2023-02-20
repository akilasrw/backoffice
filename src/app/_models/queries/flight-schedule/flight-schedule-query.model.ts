import { BaseQuery } from './../../../shared/models/base-query.model';

export class FlightScheduleQuery extends BaseQuery {
  flightScheduleManagementId?: string;
  includeFlightScheduleSectors?: boolean; 
  includeAircrafts?: boolean;
}
