import { CargoAgentStatus } from './../../../core/enums/common-enums';
import { BasePaginationQuery } from "src/app/shared/models/base-pagination-query.model";

export class CargoAgentFilterQuery extends BasePaginationQuery {
    cargoAgentName?: string;
    status?:CargoAgentStatus;
    isCountryInclude?: boolean;
    isAirportInclude?: boolean;
  }