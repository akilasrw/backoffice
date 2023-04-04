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
  Rate = 10,
  UserManagement = 11,
  Notification=12,
  MasterSchedule=13,
  LinkAircraft=14,
  FleetReport=15,
  ULDMaster=16
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
  B737800 = 4,
  B737300 = 5,
}

export enum AircraftSubTypes {
  None = 0,
  B7879TypeOne = 1,
  A320200TypeOne = 2,
  B737400TypeOne = 3,
  B737800TypeOne = 4,
  B737300TypeOne = 5,
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

export enum AWBNumberStatus {
  None = 0,
  All = 1,
  Available = 2,
  Used = 3
}

export enum CargoAgentStatus {
  None = 0,
  Pending = 1,
  Active = 2,
  Suspended = 3
}

export enum CalendarType
{
    None = 0,
    Daily = 1,
    Weekly = 2,
    Monthly = 3,
}

export enum ScheduleStatus
{
    None = 0,
    Schedule = 1,
    Chartered = 2,
    Maintainance = 3,
}

export enum LinkAircraftFliterStatus {
  None = 0,
  Pending = 1,
  PartiallyCompleted = 2,
  Completed = 3
}

export enum MasterSheduleReportType {
  None = 0,
  IdleTimeReport = 1,
  Running = 2
}

export enum RateType{
  None=0,
  SpotRate =1,
  PromotionalRate=2,
  ContractRate=3,
  MarketPublishRate=4
}

export enum CargoType{
  None=0,
  General =1,
}
export enum AssignAircraftViewType {
  None = 0,
  History = 1,
  UpcomingFlight =2
}

export enum ULDType
{
    None = 0,
    Pallet = 1,
    Container = 2
}

export enum ULDOwnershipType
{
    None = 0,
    OwnByAirline = 1,
    Other = 2
}

export enum ULDLocateStatus
{
    None = 0,
    OnGround = 1,
    OnBoard = 2,
    Maintenance = 3,
    Lend = 4,
}


