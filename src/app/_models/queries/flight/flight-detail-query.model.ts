import { BaseQuery } from "src/app/shared/models/base-query.model";

export class FlightDetailQuery extends BaseQuery {
  isIncludeFlightSectors?: boolean;
}
