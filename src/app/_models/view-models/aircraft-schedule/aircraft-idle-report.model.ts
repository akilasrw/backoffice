export class AircraftIdleReport {
    day!: number;
    month!: number;
    noOfHours!: number;
    aircraftRegNo!: string;
    aircraftId?: string;
    totalFlightTimeHrs?: number;
    origin?: string;
    destination?: string;
    showHover?: boolean;
    scheduleStatus?: number;
}
