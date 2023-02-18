export class Constants{
    public static get LANGUAGE(): string { return "UserSelectedLanguage"; };  
}

export class RouteConstants{
    public static DefaultRoute : string = "";
    public static AccountRoute : string = "account";
    public static DashboardRoute : string = "home";
    public static BookingSummaryRoute : string = "booking-summary";
    public static AirWaybillRoute : string = "air-waybill";
    public static PalletRoute : string = "pallet-management";
    public static AirportRoute : string = "airport";
    public static SectorRoute : string = "sector";
    public static AircraftRoute : string = "aircraft";
    public static FlightRoute : string = "flight";
    public static FlightSchedule : string = "flight-schedule";
    public static Rate : string = "rate";
    public static UserManagement : string = "user-management";
    public static Notification : string = "publish-notification";
    public static MasterSchedule: string = "master-schedule";
  }