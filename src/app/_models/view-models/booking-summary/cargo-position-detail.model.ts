import { BaseVM } from './../../../shared/models/base-vm.model';
export class CargoPositionDetail extends BaseVM {
    isPalletAssigned?:boolean;
    uldNumber?:string;
    maxWeight?: number;
    weight?: number;
    volume?: number;
    maxVolume?: number;
    destinationAirportCode?: string;
    position?:number;
}
