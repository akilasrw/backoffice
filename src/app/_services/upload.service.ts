import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  private readonly endpointEntityName = 'LinkAircraftToSchedule';
  private readonly uploadEndpoint = `${this.endpointEntityName}/Upload`;

  constructor(private http: HttpClient) { }

  upload(formData:FormData){
    return this.http.post(environment.baseEndpoint+this.uploadEndpoint, formData, {reportProgress: true});
  }
}
