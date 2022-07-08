import { Component, Input, OnInit } from '@angular/core';
import { AircraftSubTypes } from 'src/app/core/enums/common-enums';
import { CoreExtensions } from 'src/app/core/extensions/core-extensions.model';
import { Aircraft } from 'src/app/_models/view-models/aircrafts/aircraft.model';
import { AircraftService } from 'src/app/_services/aircraft.service';

@Component({
  selector: 'app-aircraft-details',
  templateUrl: './aircraft-details.component.html',
  styleUrls: ['./aircraft-details.component.scss']
})
export class AircraftDetailsComponent implements OnInit {

  @Input() aircraftId?: string;
  aircraftDetails?:Aircraft;

  constructor(private aircraftService: AircraftService) { }

  ngOnInit(): void {
    this.getAircraftDetails();
  }


  getAircraftDetails(){
    if(this.aircraftId != null){
      this.aircraftService.getAircraftDetail({id : this.aircraftId}).subscribe({
        next: (res) => {
          this.aircraftDetails = res
        },
        error: (error) => {
          
        }
      });
    }
  }

  GetAircraftType(type: number) {
    return CoreExtensions.GetAircraftType(type);
  }

  GetAircraftSubType(type: number) {
    return CoreExtensions.GetAircraftSubType(type);
  }

  GetAircraftConfigType(type: number) {
    return CoreExtensions.GetAircraftConfigType(type);
  }

  GetAircraftStaus(type: number) {
    return CoreExtensions.GetAircraftStaus(type);
  }

  get aircraftSubTypes(): typeof AircraftSubTypes {
    return AircraftSubTypes;
  }

}
