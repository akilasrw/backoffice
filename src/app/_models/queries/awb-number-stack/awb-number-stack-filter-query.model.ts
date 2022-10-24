import { AWBNumberStatus } from 'src/app/core/enums/common-enums';
import { BasePaginationQuery } from 'src/app/shared/models/base-pagination-query.model';

export class AWBNumberStackFilterQuery extends BasePaginationQuery {
  cargoAgentName?: string;
  isAgentInclude?: boolean;
  aWBNumberStatus?: AWBNumberStatus;
}
