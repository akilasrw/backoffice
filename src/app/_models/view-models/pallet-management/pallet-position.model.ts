import { CargoPositionType } from "src/app/core/enums/common-enums";

export interface PalletPosition {
    name: string;
    zoneAreaId: string;
    cargoPositionType: CargoPositionType;
    maxWeight: number;
    currentWeight: number;
    maxVolume: number;
    currentVolume: number;
}
