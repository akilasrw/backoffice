import { FlightScheduleStatus } from "src/app/core/enums/common-enums";
import { BaseVM } from "src/app/shared/models/base-vm.model";

export class FlightSchedule extends BaseVM{
    flightNumber?: string;
    scheduledDepartureDateTime?: Date;
    actualDepartureDateTime?: Date;
    flightScheduleStatus?:FlightScheduleStatus;
    originAirportCode?:string;
    destinationAirportCode?:string;
    originAirportName?:string;
    destinationAirportName?:string;
    aircraftRegNo?:string;
}
