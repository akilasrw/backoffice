import { Component, OnInit } from '@angular/core';
import { RateViewType } from 'src/app/core/enums/common-enums';

@Component({
  selector: 'app-rate-master-view',
  templateUrl: './rate-master-view.component.html',
  styleUrls: ['./rate-master-view.component.scss']
})
export class RateMasterViewComponent implements OnInit {

  rateViewType: RateViewType = RateViewType.Rate;
  selectedRateViewType = RateViewType;
  constructor() { }

  ngOnInit(): void {
  }

}
