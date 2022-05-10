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

  signOut() {
    //this.accountService.logout();
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
        this.router.navigate([RouteConstants.DashboardRoute])
      break;
      case MenuType.DashBoard:
        this.router.navigate([RouteConstants.DashboardRoute])
      break;
      default:
        this.router.navigate([RouteConstants.DashboardRoute]);
        break;
    }

  }

}
