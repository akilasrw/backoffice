import { BaseVM } from "src/app/shared/models/base-vm.model";

export class TRUCK extends BaseVM{
    TruckID?: string;
    BookingID?:string;
    CreatedBy?:string;
    // lastUsedDate?:Date;
    // pickupCargoCount?:number;
    // handoverCargoCount?:number;
    // lastTransportPackageCount?:number;
}
