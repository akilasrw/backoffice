import { Aircraft } from './../../../_models/view-models/aircrafts/aircraft.model';
import { environment } from 'src/environments/environment';
import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { User } from 'src/app/_models/user.model';
import { Subscription } from 'rxjs';
import { RouteConstants } from '../../constants/constants';
import { MenuType } from '../../enums/common-enums';
import { Router } from '@angular/router';
import { AccountService } from 'src/app/account/account.service';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss']
})
export class SideNavComponent implements OnInit, OnDestroy {

  routeConstants = RouteConstants
  logoUrl = environment.mainLogoPath;
  iconUrl = environment.mainIconPath;
  selectedMenu = MenuType.None
  currentUser?: User | null
  subscription?: Subscription;
  public showCollapseMenu: boolean = false;
  public showProfileCard: boolean = true;
  @Output() hideMenu = new EventEmitter<any>();
  @Output() publishNotification = new EventEmitter<any>();
  sideMenuItems=[
                { title:'Manage Booking',expanded: false, icon:'ca-icn-booking',
                  children:[
                    {title:'Booking Summary', menuType:MenuType.BookingSummay},
                    {title:'Standby Cargo', menuType:MenuType.StandByCargo}]},
                { title:'Fleet Management',expanded: false, icon:'ca-icn-flight-schedule',
                  children:[
                    {title:'Flight Schedule', menuType:MenuType.FlightSchedule},
                    {title:'Master Schedule', menuType:MenuType.MasterSchedule},
                    {title:'Assign Aircrafts', menuType:MenuType.LinkAircraft},
                    {title:'Fleet Analysis', menuType:MenuType.FleetReport}]},
                { title:'Agent and Rate',expanded: false, icon:'ca-icn-dollar',
                  children:[
                    {title:'Cargo Agent', menuType:MenuType.UserManagement},
                    {title:'Rate Management', menuType:MenuType.Rate},
                    {title:'AWB Stock Management', menuType:MenuType.AWBStackManagement}]},
                { title:'Settings',expanded: false, icon:'ca-icn-settings',
                  children:[
                    {title:'Manage Airports', menuType:MenuType.Airport},
                    {title:'Manage Sectors', menuType:MenuType.Sector},
                    {title:'Manage Aircrafts', menuType:MenuType.Aircraft},
                    {title:'Flight Creation', menuType:MenuType.Flight}]},
                { title:'ULD Management',expanded: false, icon:'ca-icn-pallet',
                  children:[
                    {title:'ULD Assignement', menuType:MenuType.PalletManagement},
                    {title:'ULD Master', menuType:MenuType.ULDMaster}]},
                { title:'Manage Notifications',expanded: false, icon:'ca-icn-bell',
                  children:[
                    {title:'Publish Notifications', menuType:MenuType.Notification}]}
              ]


  constructor(
    private router: Router,
    private accountService: AccountService,
  ) { }


  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  ngOnInit(): void {
    this.getCurrentUser();
    let currentUrl = window.location.href.split('/').pop();
    if (currentUrl != null) {
      this.selectedMenu = this.getSelectedMenuType(currentUrl);
    }
  }

  getCurrentUser() {
    this.subscription = this.accountService.currentUser$.subscribe(res => {
      this.currentUser = res;
    });
  }

  profileClick() {
    this.showProfileCard = !this.showProfileCard
  }

  signOut() {
    this.accountService.logout();
  }

  settings() {

  }

  edit() {

  }

  menuClickEvent(menu: MenuType) {
    if (MenuType.Notification != menu)
      this.selectedMenu = menu;
    switch (menu) {
      case MenuType.None:
        this.showCollapseMenu = !this.showCollapseMenu;
        this.hideMenu.emit(this.showCollapseMenu);
        if (!this.showCollapseMenu) {
          this.showProfileCard = true;
        } else {
          this.showProfileCard = !this.showProfileCard;
        }
        break;
      case MenuType.DashBoard:
        this.router.navigate([RouteConstants.DashboardRoute])
        break;
      case MenuType.BookingSummay:
        this.router.navigate([RouteConstants.BookingSummaryRoute])
        break;
      case MenuType.AWBStackManagement:
        this.router.navigate([RouteConstants.AirWaybillRoute])
        break;
      case MenuType.PalletManagement:
        this.router.navigate([RouteConstants.PalletRoute])
        break;
      case MenuType.Airport:
        this.router.navigate([RouteConstants.AirportRoute])
        break;
      case MenuType.Sector:
        this.router.navigate([RouteConstants.SectorRoute])
        break;
      case MenuType.Aircraft:
        this.router.navigate([RouteConstants.AircraftRoute])
        break;
      case MenuType.Flight:
        this.router.navigate([RouteConstants.FlightRoute])
        break;
      case MenuType.FlightSchedule:
        this.router.navigate([RouteConstants.FlightSchedule])
        break;
      case MenuType.Rate:
        this.router.navigate([RouteConstants.Rate])
        break;
      case MenuType.UserManagement:
        this.router.navigate([RouteConstants.UserManagement])
        break;
      case MenuType.Notification:
        this.publishNotification.emit();
        break;
      case MenuType.MasterSchedule:
        this.router.navigate([RouteConstants.MasterSchedule])
        break;
      case MenuType.LinkAircraft:
        this.router.navigate([RouteConstants.LinkAircraft])
        break;
      case MenuType.FleetReport:
        this.router.navigate([RouteConstants.FleetReport])
        break;
      case MenuType.ULDMaster:
        this.router.navigate([RouteConstants.ULDMaster])
        break;
      case MenuType.StandByCargo:
        this.router.navigate([RouteConstants.StandByCargo])
        break;
      default:
        this.router.navigate([RouteConstants.DashboardRoute]);
        break;
    }

  }

  getSelectedMenuType(url: string): number {
    let selectedType = MenuType.None
    switch (url) {
      case RouteConstants.DashboardRoute:
        selectedType = MenuType.DashBoard;
        break;
      case RouteConstants.BookingSummaryRoute:
        selectedType = MenuType.BookingSummay;
        break;
      case RouteConstants.AirWaybillRoute:
        selectedType = MenuType.AWBStackManagement;
        break;
      case RouteConstants.PalletRoute:
        selectedType = MenuType.PalletManagement;
        break;
      case RouteConstants.SectorRoute:
        selectedType = MenuType.Sector;
        break;
      case RouteConstants.AirportRoute:
        selectedType = MenuType.Airport;
        break;
      case RouteConstants.FlightRoute:
        selectedType = MenuType.Flight;
        break;
      case RouteConstants.FlightSchedule:
        selectedType = MenuType.FlightSchedule;
        break;
      case RouteConstants.Rate:
        selectedType = MenuType.Rate;
        break;
      case RouteConstants.UserManagement:
        selectedType = MenuType.UserManagement;
        break;
      case RouteConstants.AircraftRoute:
        selectedType = MenuType.Aircraft;
        break;
      case RouteConstants.MasterSchedule:
        selectedType = MenuType.MasterSchedule;
        break;
      case RouteConstants.LinkAircraft:
        selectedType = MenuType.LinkAircraft;
        break;
      case RouteConstants.FleetReport:
        selectedType = MenuType.FleetReport;
        break;
      case RouteConstants.ULDMaster:
        selectedType = MenuType.ULDMaster;
        break;
    }
    return selectedType;
  }

}
