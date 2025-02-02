import { AircraftType } from './../_models/view-models/aircrafts/aircraft-type.model';
import { BaseService } from './../core/services/base.service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { AircraftFilterQuery } from '../_models/queries/aircraft/aircraft-filter-query.model';
import { IPagination } from '../shared/models/pagination.model';
import { Aircraft } from '../_models/view-models/aircrafts/aircraft.model';
import { CoreExtensions } from '../core/extensions/core-extensions.model';
import { AircraftCreateRM } from '../_models/request-models/aircraft/aircraft-create-rm';
import { AircraftUpdateRM } from '../_models/request-models/aircraft/aircraft-update-rm';
import { AircraftQuery } from '../_models/queries/aircraft/aircraft-query.model';
import { SelectList } from '../shared/models/select-list.model';

@Injectable({
  providedIn: 'root'
})

export class AircraftService extends BaseService {

  private readonly endpointEntityName = 'Aircraft';
  private readonly getFilteredListEndpoint = `${this.endpointEntityName}/GetFilteredList`;
  private readonly getSelectListEndpoint = `${this.endpointEntityName}/GetSelectList`;
  private readonly getAircraftTypesEndpoint = `${this.endpointEntityName}/GetAircraftTypes`;


  aircraftTypes$: Observable<AircraftType[]| null>;
  private aircraftTypeSource: BehaviorSubject<AircraftType[]|null>;

  constructor(http: HttpClient) { super(http)
    this.aircraftTypeSource = new BehaviorSubject<AircraftType[]|null>(null);
    this.aircraftTypes$ = this.aircraftTypeSource.asObservable();
  }

  getAircraftDetail(query: AircraftQuery) {
    var params = new HttpParams();
    if (query.id) {
      params = params.append("id", query.id);
    }
    return this.getWithParams<Aircraft>(this.endpointEntityName,params);
  }

  getAircraftTypes() {
    return this.get(this.getAircraftTypesEndpoint).pipe(
      map((response: any) => {
        const aircraftTypes = response;
        if (aircraftTypes) {
          this.aircraftTypeSource.next(aircraftTypes);
          return aircraftTypes;
        }
      })
    )
  }

  getFilteredList(query: AircraftFilterQuery){
    var params = new HttpParams();
    if (query.regNo) {
      params = params.append("regNo", query.regNo);
    }

    if (query.activeType) {
      params = params.append("activeType", query.activeType);
    }

    if (query.aircraftType) {
      params = params.append("aircraftType", query.aircraftType);
    }

    params = CoreExtensions.AsPaginate(params, query);

    return this.getWithParams<IPagination<Aircraft>>(
      this.getFilteredListEndpoint,
      params
    );
  }

  create(aircraftCreateRM: AircraftCreateRM){
    return this.post<any>(this.endpointEntityName, aircraftCreateRM);
  }

  update(aircraftUpdateRM: AircraftUpdateRM){
    return this.put<any>(this.endpointEntityName, aircraftUpdateRM);
  }

  getAircraftSelectList() {
    return this.get<SelectList[]>(`${this.getSelectListEndpoint}`);
  }

}
