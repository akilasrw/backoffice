import { BaseVM } from "src/app/shared/models/base-vm.model";
export class AircraftScheduleFlight extends BaseVM{
    flightNumber?:string;
    originAirportId?:string;
    destinationAirportId?:string;
    originAirportCode?:string;
    destinationAirportCode?:string;
    originAirportName?:string;
    destinationAirportName?:string;
    flightScheduleStartDateTime?:Date;
    flightScheduleEndDateTime?:Date;
  }