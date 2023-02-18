import { CalendarType, ScheduleStatus } from "src/app/core/enums/common-enums";

export class ScheduleCreateRM {
  aircraftId?: string;
  scheduleStartDate?: string;
  scheduleEndDate?: string;
  scheduleStartTime?: string;
  numberOfHours?: number;
  daysOfWeek?:string;
  scheduleStatus?:ScheduleStatus;
  calendarType?:CalendarType;
}
