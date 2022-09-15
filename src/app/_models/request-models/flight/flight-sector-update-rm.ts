import { SectorUpdateRM } from "../sector/sector-update-rm";

export class FlightSectorUpdateRM{
  flightId?: string;
  sectorId?: string;
  sequence?: number;
  originAirportCode?: string;
  destinationAirportCode?: string;
  departureDateTime?: string;
  arrivalDateTime?: string;
  sector?:SectorUpdateRM;
}
