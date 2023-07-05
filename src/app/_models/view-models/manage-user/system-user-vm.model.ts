import { AccessPortalLevel, UserRole, UserStatus } from "src/app/core/enums/common-enums";

export class SystemUserVm {
  city?: string;
  countryName?: string;
  email?: string;
  baseAirportName?: string;
  userName?: string;
  appUserId?: string;
  countryId?: string;
  baseAirportId?: string;
  accessPortalLevel?: AccessPortalLevel;
  userRole?: UserRole;
  userStatus?: UserStatus;
}
