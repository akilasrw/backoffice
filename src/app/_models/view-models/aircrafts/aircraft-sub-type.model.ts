import { AircraftSubTypes} from "src/app/core/enums/common-enums";
import { BaseVM } from 'src/app/shared/models/base-vm.model';

export class AircraftSubType extends BaseVM {
    name?: string;
    type?: AircraftSubTypes;
}