import { ScheduleStatus } from "src/app/core/enums/common-enums";
import { BaseVM } from "src/app/shared/models/base-vm.model";
import { AircraftScheduleFlight } from "./aircraft_schedule_flight.model";

export class AircraftSchedule extends BaseVM{
    scheduleStartDateTime? : Date;
    scheduleEndDateTime? : Date;
    isCompleted? : boolean;
    aircraftId? : string;
    regNo?:string;
    scheduleStatus?: ScheduleStatus;
    aircraftScheduleFlights? : AircraftScheduleFlight[];
  }