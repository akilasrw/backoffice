import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-manage-user-list',
  templateUrl: './manage-user-list.component.html',
  styleUrls: ['./manage-user-list.component.scss']
})
export class ManageUserListComponent implements OnInit {
  modalVisible = false;
  modalVisibleAnimate = false;
  constructor() { }

  ngOnInit(): void {
    this.getUserList();
  }

  getUserList() {

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
    this.getUserList();
  }

}
