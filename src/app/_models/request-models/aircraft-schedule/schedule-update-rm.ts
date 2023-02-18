import { CalendarType, ScheduleStatus } from "src/app/core/enums/common-enums";

export class ScheduleUpdateRM {
  id?: string;
  aircraftId?: string;
  scheduleStartDate?: string;
  scheduleEndDate?: string;
  scheduleStartTime?: string;
  scheduleEndTime?: string;
  scheduleStatus?: ScheduleStatus;
  isCompleted?: boolean;
}
