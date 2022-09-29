import { WeightType } from "src/app/core/enums/common-enums";
import { BaseVM } from "src/app/shared/models/base-vm.model";

export class AgentRate extends BaseVM{
    rate?: number;
    weightType?:WeightType;
}
