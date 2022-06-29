import { AircraftTypes } from 'src/app/core/enums/common-enums';
import { BasePaginationQuery } from 'src/app/shared/models/base-pagination-query.model';

export class AircraftFilterQuery extends BasePaginationQuery {
  regNo?: string;
  isActive?: boolean;
  aircraftType?: AircraftTypes;
}
