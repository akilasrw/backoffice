import { BaseVM } from "src/app/shared/models/base-vm.model";

export class AWBNumberStack extends BaseVM {
    awbTrackingNumber?: number;
    isUsed?: boolean;
    cargoAgentName?:string;
    cargoAgentId?:string;
}
