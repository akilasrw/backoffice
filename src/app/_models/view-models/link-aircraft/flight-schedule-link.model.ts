export class FlightScheduleLink {
  id?: string;
  flightNumber? : string;
  daysOfWeek? : string;
  originAirportCode? : string;
  destinationAirportCode? : string;
  scheduleStartDate?:string
  status?: number;
  aircraftSubTypeName?: string;
  originAirportName?: string;
  destinationAirportName?: string;
  aircraftRegNo?: string;
  scheduledDepartureDateTime?: Date;
  scheduledArrivalDateTime?: Date;
  estimatedDepartureDateTime?: Date;
  estimatedArrivalDateTime?: Date;
  actualDepartureDateTime?: Date;
  actualArrivalDateTime?: Date;
  aircraftId?: string;
  aircraftScheduleId?: string;
  isEdit?: boolean;
  stepCount?: number;
  file?: File;
  offLoadCount?: number;
  actualLoadCount?: number;
}
