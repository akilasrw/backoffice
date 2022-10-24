export enum MenuType {
  None = 0,
  DashBoard = 1,
  BookingSummay = 2,
  AWBStackManagement = 3,
  PalletManagement = 4,
  Airport = 5,
  Sector = 6,
  Aircraft = 7,
  Flight = 8,
  FlightSchedule = 9,
  Rate = 10
}

export enum SectorType {
  None = 0,
  Domestic = 1,
  International = 2
}

export enum BookingSummaryType {
  None = 0,
  OnSeat = 1,
  UnderSeat = 2,
  Overhead = 3
}

export enum CargoPositionType {
  None = 0,
  OnFloor = 1,
  OnSeat = 2,
  UnderSeat = 3,
  Overhead = 4
}

export enum AircraftTypes {
  None = 0,
  B7879 = 1,
  A320200 = 2,
  B737400 = 3,
}

export enum AircraftSubTypes {
  None = 0,
  B7879TypeOne = 1,
  A320200TypeOne = 2,
  B737400TypeOne = 3,
}


export enum AircraftConfigType {
  None = 0,
  P2C = 1,
  Freighter = 2,
}

export enum AircraftStatus {
  None = 0,
  Charter = 1,
  Schedule = 2,
  Maintenance = 3,
}

export enum AircraftActiveTypes {
  None = 0,
  Active = 1,
  Inactive = 2
}

export enum LoaderImageSize {
  Small = 1,
  Medium = 2,
  Large = 3
}

export enum UnitType {
  None = 0,
  Length = 1,
  Mass = 2
}

export enum FlightScheduleStatus {
  None = 0,
  OnTime = 1,
  Delayed = 2
}

export enum WeightType {
  None = 0,
  M = 1,
  Minus45K = 2,
  Plus45K = 3,
  Plus100K = 4,
  Plus300K = 5,
  Plus500K = 6,
  Plus1000K = 7
}

export enum BookingStatus {
  None = 0,
  Pending = 10,
  Accepted = 20,
  Loading = 30,
  Invoiced = 40,
  Dispatched = 50,
  Exported = 60
}

export enum AWBNumberStatus
{
    None = 0,
    All = 1,
    Avilable = 2,
    Used = 3
}
