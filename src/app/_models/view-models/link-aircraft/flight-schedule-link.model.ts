export class FlightScheduleLink {
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
}
