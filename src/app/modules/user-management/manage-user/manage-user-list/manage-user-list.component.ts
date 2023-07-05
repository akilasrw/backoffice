import { SystemUserFilterQuery } from 'src/app/_models/queries/manage-user/system-user-filter-query.model';
import { SystemUserService } from './../../../../_services/system-user.service';
import { Component, OnInit } from '@angular/core';
import { SystemUserVm } from 'src/app/_models/view-models/manage-user/system-user-vm.model';

@Component({
  selector: 'app-manage-user-list',
  templateUrl: './manage-user-list.component.html',
  styleUrls: ['./manage-user-list.component.scss']
})
export class ManageUserListComponent implements OnInit {
  modalVisible = false;
  modalVisibleAnimate = false;
  query: SystemUserFilterQuery = new SystemUserFilterQuery();
  users: SystemUserVm[] = [];
  totalCount: number = 0;
  isLoading: boolean=false;
  filterFormHasValue: boolean = false;
  selectedULD?: SystemUserVm;

  constructor(private systemUserService: SystemUserService) { }

  ngOnInit(): void {
    this.getFilterList();
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


  viewAddNewUser() {
    this.modalVisible = true;
    setTimeout(() => (this.modalVisibleAnimate = true));
  }

  close() {
    this.modalVisibleAnimate = false;
    setTimeout(() => (this.modalVisible = false), 300);
  }

  onUserAdd() {
    this.getFilterList();
  }

}
