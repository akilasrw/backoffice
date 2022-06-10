export interface CargoPositionSummary {
    id: string;
    totalBookedWeight: number;
    totalWeight: number;
    weightPercentage: number;
    totalOccupiedOnSeats: number;
    totalOnSeats: number;
    onSeatsPercentage: number;
    totalOccupiedUnderSeats: number;
    totalUnderSeats: number;
    underSeatsPercentage: number;
    totalOccupiedOverheads: number;
    totalOverheads: number;
    overheadPercentage: number;
}
