import { BasePaginationQuery } from './../../../shared/models/base-pagination-query.model';
export class AWBStckRequest extends BasePaginationQuery {
  startSequenceNumber?: number;
  endSequenceNumber?:number;
  cargoAgentId?: string;
}


