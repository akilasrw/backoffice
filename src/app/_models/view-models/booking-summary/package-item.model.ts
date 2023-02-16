import { BaseVM } from "src/app/shared/models/base-vm.model";

export class PackageItem extends BaseVM {
  packageRefNumber?: string;
  width?: number;
  length?: number;
  height?: number;
  volumeUnitId?: string;
  weight?: number;
  weightUnitId?: string;
  uldContainerId?: string;
  cargoBookingId?: string;
  cargoPositionId?: string;
}
