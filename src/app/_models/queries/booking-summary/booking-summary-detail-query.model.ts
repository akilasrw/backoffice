import { BaseQuery } from './../../../shared/models/base-query.model';
export class BookingSummaryDetailQuery extends BaseQuery{
    isIncludeAircraft?: boolean;
    isIncludeFlightScheduleSectors? : boolean;
}
