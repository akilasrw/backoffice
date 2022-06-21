import { BasePaginationQuery } from "src/app/shared/models/base-pagination-query.model";

export class SectorFilterQuery extends BasePaginationQuery {
    sectorType?: number;
    originAirportId?: string;
    destinationAirportId?: string;
  }