import { BaseQuery } from "src/app/shared/models/base-query.model";

export class AgentRateQuery extends BaseQuery {
    includeCargoAgent?: boolean;
}