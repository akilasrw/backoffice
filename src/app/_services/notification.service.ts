import { BaseService } from './../core/services/base.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NotificationRM } from '../_models/request-models/notification/notification-rm.model';

@Injectable({
  providedIn: 'root'
})
export class NotificationService extends BaseService{

  private readonly endpointEntityName = 'notification';

  constructor(http: HttpClient) { super(http)}

  create(notificationRM: NotificationRM){
    return this.post<any>(this.endpointEntityName, notificationRM);
  }
}
