export enum MenuType {
    None = 0,
    DashBoard = 1,
    BookingSummay = 2,
    AWBStackManagement = 3,
    Airport = 4,
    Sector = 5,
    Aircraft = 6
 
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

  export enum AircraftTypes{
    None = 0,
    B7879 = 1,
    A320200 = 2,
  }

  export enum AircraftSubTypes
  {
      None = 0,
      B7879TypeOne = 1,
      B7879TypeTwo = 2,
      A320200TypeOne = 3,
      A320200TypeTwo = 4,
  }


  export enum AircraftConfigType
  {
      None = 0,
      P2C = 1,
      Freighter = 2,
      Passenger = 3,
  }

  export enum AircraftStatus
  {
      None = 0,
      Charter = 1,
      Schedule = 2,
      Maintenance = 3,
  }