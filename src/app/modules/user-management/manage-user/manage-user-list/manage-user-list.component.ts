import { ToastrService } from 'ngx-toastr';
import { SystemUserFilterQuery } from 'src/app/_models/queries/manage-user/system-user-filter-query.model';
import { SystemUserService } from './../../../../_services/system-user.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { SystemUserVm } from 'src/app/_models/view-models/manage-user/system-user-vm.model';
import { CoreExtensions } from 'src/app/core/extensions/core-extensions.model';
import { UserStatus } from 'src/app/core/enums/common-enums';
import { SelectList } from 'src/app/shared/models/select-list.model';
import { AutoCompleteDropdownComponent } from 'src/app/shared/components/forms/auto-complete-dropdown/auto-complete-dropdown.component';

@Component({
  selector: 'app-manage-user-list',
  templateUrl: './manage-user-list.component.html',
  styleUrls: ['./manage-user-list.component.scss']
})
export class ManageUserListComponent implements OnInit {
  modalVisible = false;
  modalVisibleAnimate = false;
  modalVisibleAnimateSuspendUser = false;
  modalVisibleSuspendUser = false;
  modalVisibleAnimateAcceptUser= false;
  modalVisibleAcceptUser= false;
  query: SystemUserFilterQuery = new SystemUserFilterQuery();
  users: SystemUserVm[] = [];
  totalCount: number = 0;
  isLoading: boolean=false;
  filterFormHasValue: boolean = false;
  selectedUser?: SystemUserVm;
  statusList: SelectList[] = [];
  keyword = 'value';
  @ViewChild('statusDropdown') statusDropdown!: AutoCompleteDropdownComponent;

  constructor(private systemUserService: SystemUserService,
            private toastr:ToastrService) { }

  ngOnInit(): void {
    this.getFilterList();
    this.loadStatusList();
    this.query.status = UserStatus.None
  }

  loadStatusList() {
    this.statusList.push(
      { id: UserStatus.None.toString(), value: "All" },
      { id: UserStatus.Active.toString(), value: CoreExtensions.GetUserStatus(UserStatus.Active) },
      { id: UserStatus.Pending.toString(), value: CoreExtensions.GetUserStatus(UserStatus.Pending) },
      { id: UserStatus.Suspended.toString(), value: CoreExtensions.GetUserStatus(UserStatus.Suspended) },

    );
  }

  selectedStatus(value: any) {
    this.query.status = Number(value.id);
    this.onChangeFilterFrm(value);
  }

  onClearStatus() {
    this.query.status = UserStatus.None;;
  }

  getFilterList() {
    this.query.isCountryInclude = true;
    this.systemUserService.getFilteredList(this.query)
    .subscribe({
      next: (res)=> {
        this.users = res.data;
        this.totalCount = res.count
        this.isLoading = false;
      },
      error: (err) => {
        this.totalCount = 0;
        this.isLoading = false;
      },
    })
  }

  getUserStatus(type:number){
    return CoreExtensions.GetUserStatus(type);
  }

  getUserRole(type:number){
    return CoreExtensions.GetUserRole(type);
  }

  getAccessPortalLevel(type:number){
    return CoreExtensions.GetAccessPortalLevel(type);
  }

  viewAddNewUser() {
    this.modalVisible = true;
    setTimeout(() => (this.modalVisibleAnimate = true));
  }

  onSuspend(id:string) {
    var user = new SystemUserVm();
    user.id = id;
    user.userStatus = UserStatus.Suspended;
    this.selectedUser = user;
    this.modalVisibleSuspendUser = true;
    setTimeout(() => (this.modalVisibleAnimateSuspendUser = true));
  }

  onAction() {
    if (this.selectedUser != undefined) {
      this.isLoading=true;
      this.systemUserService.statusUpdate({id:this.selectedUser.id, userStatus: this.selectedUser.userStatus})
        .subscribe({
          next: (res) => {
            this.toastr.success((this.selectedUser!.userStatus == UserStatus.Active)?"User successfully activated.":"User successfully suspended.");
            (this.selectedUser!.userStatus == UserStatus.Active)? this.cancelActive() : this.cancelSuspend();
            this.users = [];
            this.isLoading=false;
            this.getFilterList();
          },
          error: (error) => {
            this.toastr.error((this.selectedUser!.userStatus == UserStatus.Active)?"User unable to activate.":"User unable to suspend.");
            (this.selectedUser!.userStatus == UserStatus.Active)? this.cancelActive() : this.cancelSuspend();
            this.isLoading=false;
          }
        });
    }
  }

  cancelActive() {
    this.selectedUser = undefined;
    this.modalVisibleAnimateAcceptUser = false;
    setTimeout(() => (this.modalVisibleAcceptUser = false), 300);
  }

  cancelSuspend() {
    this.selectedUser = undefined;
    this.modalVisibleAnimateSuspendUser= false;
    setTimeout(() => (this.modalVisibleSuspendUser = false), 300);
  }

  onChangeFilterFrm(event: any) {
    if ((this.query.name !== undefined && this.query.name !== "") ||
    this.query.status !== undefined) {
      this.filterFormHasValue = true;
    }
    else {
      this.filterFormHasValue = false;
    }
  }

  clearFilter() {
    this.query.name = undefined;
    this.query.status= undefined;
    this.statusDropdown.clear();
    this.filterFormHasValue = false;
  }

  close() {
    this.modalVisibleAnimate = false;
    setTimeout(() => (this.modalVisible = false), 300);
  }

  onUserAdd() {
    this.getFilterList();
  }

  get UserStatus(): typeof UserStatus {
    return UserStatus;
  }

}
