import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CoreExtensions } from '../core/extensions/core-extensions.model';
import { BaseService } from '../core/services/base.service';
import { IPagination } from '../shared/models/pagination.model';
import { ULDFilterQuery } from '../_models/queries/uld/uld-filter-query.model';
import { UldCreateRM } from '../_models/request-models/uld-master/uld-create-rm';
import { ULD } from '../_models/view-models/uld-master/ulsd.model';
import { UldUpdateRM } from '../_models/request-models/uld-master/uld-update-rm';

@Injectable({
  providedIn: 'root'
})
export class ULDService  extends BaseService{

  private readonly endpointEntityName = 'uld';
  private readonly getFilteredListEndpoint = `${this.endpointEntityName}/GetFilteredList`;


  constructor(http: HttpClient) {
    super(http);
  }

  getFilteredList(query: ULDFilterQuery){
    var params = new HttpParams();
    if (query.uLDNumber) {
      params = params.append("uLDNumber", query.uLDNumber);
    }
    if (query.station) {
      params = params.append("station", query.station);
    }

    params = CoreExtensions.AsPaginate(params, query);

    return this.getWithParams<IPagination<ULD>>(
      this.getFilteredListEndpoint,
      params
    );
  }

  create(uldCreateRM: UldCreateRM){
    return this.post<any>(this.endpointEntityName, uldCreateRM);
  }

  update(uldUpdateRM: UldUpdateRM){
    return this.put<any>(this.endpointEntityName, uldUpdateRM);
  }

}
