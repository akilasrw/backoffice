import { BaseVM } from "src/app/shared/models/base-vm.model";
import { Sector } from "../sector/sector.model";

export class FlightSector extends BaseVM{
  flightId?: string;
  sectorId?: string;
  sequence?: number;
  departureDateTime?: Date;
  arrivalDateTime?: Date;
  sector?:Sector;
}
