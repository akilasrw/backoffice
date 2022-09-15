import { FlightSectorUpdateRM } from "./flight-sector-update-rm";

export class FlightUpdateRM {
  id?: string;
  flightNumber?: string;
  originAirportCode?: string;
  flightSectors?: FlightSectorUpdateRM[];
}
