import { Component, Input, OnInit } from '@angular/core';
import { CoreExtensions } from 'src/app/core/extensions/core-extensions.model';
import { AgentRateQuery } from 'src/app/_models/queries/rate/agent-rate-query.model';
import { AgentRateManagement } from 'src/app/_models/view-models/rate/agent-rate-management';
import { RateService } from 'src/app/_services/rate.service';

@Component({
  selector: 'app-rate-detail',
  templateUrl: './rate-detail.component.html',
  styleUrls: ['./rate-detail.component.scss']
})
export class RateDetailComponent implements OnInit {

  @Input() rateId?: string;
  rateDetail?: AgentRateManagement ;
  isLoading:boolean = false;

  constructor(private rateService : RateService) { }

  ngOnInit(): void {
    this.getDetail();
  }

  getDetail(){
    if(this.rateId != null){
      this.isLoading=true;
      this.rateService.getDetail({id : this.rateId,includeCargoAgent : true}).subscribe(
        {
          next: (res) => {
            this.rateDetail = res;
            this.isLoading=false;
          },
          error: (error) => {
            this.isLoading=false;
          }
        }
      );
    }
  }

  GetWeightType(type: number) {
    return CoreExtensions.GetWeightType(type);
  }

  GetRateType(type:number){
    return CoreExtensions.GetRateType(type);
  }

  GetCargoType(type:number){
    return CoreExtensions.GetCargoType(type);
  }

}
