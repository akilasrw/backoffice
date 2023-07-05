import { AccessPortalLevel, UserRole, UserStatus } from "src/app/core/enums/common-enums";

export class SystemUserCreateRm {
  firstName?: string;
  lastName?: string;
  userName?: string;
  phoneNumber?: string;
  email?: string;
  countryId?: string;
  baseAirportId?: string;
  city?: string;
  accessPortalLevel?: AccessPortalLevel;
  userRole?: UserRole;
  userStatus?: UserStatus;
}
