import { AircraftSubTypes } from "src/app/core/enums/common-enums";
import { BaseVM } from "src/app/shared/models/base-vm.model";
import { FlightSchedule } from "../flight-schedule/flight-schedule";

export class FlightScheduleManagement extends BaseVM{
    flightNumber?: string;
    flightId?:string;
    scheduleStartDate?: Date;
    scheduleEndDate?: Date;
    scheduledTime?:Date;
    daysOfWeek?:string;
    originAirportCode?:string;
    destinationAirportCode?:string;
    originAirportName?:string;
    destinationAirportName?:string;
    aircraftSubType?:AircraftSubTypes;
    flightSchedules?: FlightSchedule[];
}
