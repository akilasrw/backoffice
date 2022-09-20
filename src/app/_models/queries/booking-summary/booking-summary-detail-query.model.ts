import { BaseQuery } from './../../../shared/models/base-query.model';
export class BookingSummaryDetailQuery extends BaseQuery{
    isIncludeAircraftType?: boolean;
    isIncludeFlightScheduleSectors? : boolean;
}
