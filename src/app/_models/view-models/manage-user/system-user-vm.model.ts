import { AccessPortalLevel, UserRole, UserStatus } from "src/app/core/enums/common-enums";
import { BaseVM } from "src/app/shared/models/base-vm.model";

export class SystemUserVm extends BaseVM {
  city?: string;
  countryName?: string;
  email?: string;
  baseAirportName?: string;
  phoneNumber?: string;
  userName?: string;
  appUserId?: string;
  countryId?: string;
  baseAirportId?: string;
  accessPortalLevel?: AccessPortalLevel;
  userRole?: UserRole;
  userStatus?: UserStatus;
}
