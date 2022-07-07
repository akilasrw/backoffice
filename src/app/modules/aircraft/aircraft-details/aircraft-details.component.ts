import { Component, Input, OnInit } from '@angular/core';
import { AircraftService } from 'src/app/_services/aircraft.service';

@Component({
  selector: 'app-aircraft-details',
  templateUrl: './aircraft-details.component.html',
  styleUrls: ['./aircraft-details.component.scss']
})
export class AircraftDetailsComponent implements OnInit {

  @Input() aircraftId?: string;

  constructor(private aircraftService: AircraftService) { }

  ngOnInit(): void {
  }

}
