import { UserStatus } from "src/app/core/enums/common-enums";
import { BasePaginationQuery } from "src/app/shared/models/base-pagination-query.model";

export class SystemUserFilterQuery extends BasePaginationQuery {
  name?: string;
  status?:UserStatus;
  isCountryInclude?: boolean;
}
