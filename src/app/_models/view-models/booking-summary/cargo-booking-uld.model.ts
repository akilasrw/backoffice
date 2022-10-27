import { BaseVM } from "src/app/shared/models/base-vm.model";
import { PackageItem } from "./package-item.model";

export class CargoBookingUld extends BaseVM {
  bookingNumber?: string;
  awbTrackingNumber?: number;
  totalWeight?: number;
  totalVolume?: number;
  packageItems?: PackageItem[];
}
