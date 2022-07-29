import { BasePaginationQuery } from './../../../shared/models/base-pagination-query.model';
export class BookingSummaryFilterQuery extends BasePaginationQuery{
    flightNumber?: string;
    flightDate? : Date;
}
