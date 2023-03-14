import { Component, OnInit } from '@angular/core';
import { AssignAircraftViewType } from 'src/app/core/enums/common-enums';

@Component({
  selector: 'app-assign-aircraft-master-view',
  templateUrl: './assign-aircraft-master-view.component.html',
  styleUrls: ['./assign-aircraft-master-view.component.scss']
})
export class AssignAircraftMasterViewComponent implements OnInit {

  assignAircraftType: AssignAircraftViewType = AssignAircraftViewType.UpcomingFlight;
  selectedAssignAircraftType = AssignAircraftViewType;
  constructor() { }

  ngOnInit(): void {
  }

}
