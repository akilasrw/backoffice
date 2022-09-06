import { BaseService } from './../core/services/base.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { SectorFilterQuery } from '../_models/queries/sector/sector-filter-query.model';
import { CoreExtensions } from '../core/extensions/core-extensions.model';
import { IPagination } from '../shared/models/pagination.model';
import { Sector } from '../_models/view-models/sector/sector.model';
import { SectorCreateRM } from '../_models/request-models/sector/sector-create-rm';
import { SectorUpdateRM } from '../_models/request-models/sector/sector-update-rm';

@Injectable({
  providedIn: 'root'
})
export class SectorService extends BaseService{

  private readonly endpointEntityName = 'Sector';
  private readonly getFilteredListEndpoint = `${this.endpointEntityName}/GetFilteredList`;
  private readonly getListEndpoint = `${this.endpointEntityName}/GetList`;

  constructor(http: HttpClient) { super(http)}

  create(sectorCreateRM: SectorCreateRM){
    return this.post<any>(this.endpointEntityName, sectorCreateRM);
  }

  update(sectorUpdateRM: SectorUpdateRM){
    return this.put<any>(this.endpointEntityName, sectorUpdateRM);
  }

  getFilteredList(query: SectorFilterQuery){
    var params = new HttpParams();
    if (query.sectorType) {
      params = params.append("sectorType", query.sectorType);
    }

    if (query.originAirportId) {
      params = params.append("originAirportId", query.originAirportId);
    }

    if (query.destinationAirportId) {
      params = params.append("destinationAirportId", query.destinationAirportId);
    }

    params = CoreExtensions.AsPaginate(params, query);

    return this.getWithParams<IPagination<Sector>>(
      this.getFilteredListEndpoint,
      params
    );
  }

  getList(sectorType: number = 0) {
    var params = new HttpParams();
    if (sectorType) {
      params = params.append("sectorType", sectorType);
    }
    return this.getWithParams<Sector[]>(this.getListEndpoint, params);
  }

  deleteSector(id:string){
    return this.delete<boolean>(`${this.endpointEntityName}?id=${id}`, null);
  }
}
