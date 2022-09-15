import { BaseVM } from "src/app/shared/models/base-vm.model";
import { FlightSector } from "../flight-sector/flight-sector.model";

export class Flight extends BaseVM{
  flightNumber?: string;
  originAirportId?: string;
  destinationAirportId?: string;
  originAirportCode?: string;
  destinationAirportCode?: string;
  originAirportName?: string;
  destinationAirportName?: string;
  sectorCount?: number;
  flightSectors?:FlightSector[];
}
