import { BaseQuery } from './../../../shared/models/base-query.model';

export class FlightQuery extends BaseQuery {
  flightNumber?: string;
  includeSectors?: boolean;
}
