import { Component, OnInit } from '@angular/core';
import { SelectList } from 'src/app/shared/models/select-list.model';
import { AirportService } from 'src/app/_services/airport.service';
import { CargoAgentService } from 'src/app/_services/cargo-agent.service';

@Component({
  selector: 'app-rate-create',
  templateUrl: './rate-create.component.html',
  styleUrls: ['./rate-create.component.scss']
})
export class RateCreateComponent implements OnInit {

  cargoAgents: SelectList[] = [];
  originAirpots: SelectList[] = [];
  destinationAirpots: SelectList[] = [];
  isLoading: boolean = false;
  cargoAgentId?: string;
  originAirportId?: string;
  destinationAirportId?: string;
  keyword = 'value';

  constructor(
    private cargoAgentService: CargoAgentService,
    private airportService: AirportService,
  ) { }

  ngOnInit(): void {
    this.loadAirports();
    this.loadCargoAgents();
  }

  loadAirports() {
    this.isLoading = true;
    this.airportService.getSelectList()
      .subscribe(res => {
        if (res.length > 0) {
          this.originAirpots = res;
          Object.assign(this.destinationAirpots, res);
        }
        this.isLoading = false;
      });
  }

  loadCargoAgents() {
    this.isLoading = true;
    this.cargoAgentService.getAgentList()
      .subscribe({
        next: (res) => {
          if (res.length > 0) {
            this.cargoAgents = res;
          }
          this.isLoading = false;
        },
        error: (error) => {
          this.isLoading = false;
        }
      }
      );
  }

  selectedCargoAgent(value: any) {
    this.cargoAgentId = value.id;
  }

  onClearCargoAgent() {
    this.cargoAgentId = undefined;
  }

  selectedOrigin(value: any) {
    this.originAirportId = value.id;
  }

  onClearOrigin() {
    this.originAirportId = undefined;
  }

  selectedDestination(value: any) {
    this.destinationAirportId = value.id;
  }

  onClearDestination() {
    this.destinationAirportId = undefined;
  }

}
