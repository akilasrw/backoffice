import { FlightScheduleStatus } from "src/app/core/enums/common-enums";
import { BaseVM } from "src/app/shared/models/base-vm.model";

export class FlightSchedule extends BaseVM{
    flightNumber?: string;
    scheduledDepartureDateTime?: Date;
    actualDepartureDateTime?: Date;
    originAirportCode?:string;
    originAirportName?:string;
    destinationAirportCode?:string;
    destinationAirportName?:string;
    aircraftRegNo?:string;
    flightScheduleStatus?:FlightScheduleStatus;
}
