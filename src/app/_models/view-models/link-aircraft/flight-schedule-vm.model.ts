import { SelectList } from "src/app/shared/models/select-list.model";
import { Aircraft } from "../aircrafts/aircraft.model";

export class FlightScheduleVm {
  id?:string;
  aircraftId?: string
  aircraftScheduleId?: string
  scheduledDepartureDateTime?: string;
  aircrafts?: Aircraft[];
  aircraftList?: SelectList[];
  isEdited?: boolean;
  editAircraftIndex?: number
}
