import { AwbStackManagementComponent } from './../../../modules/air-waybill/awb-stack-management/awb-stack-management.component';
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

  selectedMenu = MenuType.None
  currentUser?:User | null
  subscription?:Subscription;
  public showCollapseMenu:boolean=false;
  public showProfileCard:boolean=true;
  @Output() hideMenu = new EventEmitter<any>();
  
  constructor(
    private router: Router,
    private accountService: AccountService,
  ) { }


  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  ngOnInit(): void {
    this.getCurrentUser();
  }

  getCurrentUser() {
    this.subscription = this.accountService.currentUser$.subscribe(res => {
      this.currentUser = res;
    });
  }

  profileClick(){
    this.showProfileCard = !this.showProfileCard
  }

  signOut() {
    this.accountService.logout();
  }

  settings(){

  }

  edit(){

  }

  menuClickEvent(menu: MenuType){
    this.selectedMenu = menu;
    switch(menu){
      case MenuType.None:
        this.showCollapseMenu=!this.showCollapseMenu;
        this.hideMenu.emit(this.showCollapseMenu);
        if(!this.showCollapseMenu){
          this.showProfileCard = true;
        }else{
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
      default:
        this.router.navigate([RouteConstants.DashboardRoute]);
        break;
    }

  }

}
