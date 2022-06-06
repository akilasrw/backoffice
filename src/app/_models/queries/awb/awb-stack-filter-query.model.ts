import { BasePaginationQuery } from 'src/app/shared/models/base-pagination-query.model';

export class AWBStackFilterQuery extends BasePaginationQuery {
  cargoAgentName?: string;
  isAgentInclude?: boolean;
}
