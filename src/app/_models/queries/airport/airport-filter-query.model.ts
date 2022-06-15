import { BasePaginationQuery } from 'src/app/shared/models/base-pagination-query.model';

export class AirportFilterQuery extends BasePaginationQuery {
  countryName?: string;
  airportName?: string;
  airportCode?: string;
  isCountryInclude?: boolean;
}
