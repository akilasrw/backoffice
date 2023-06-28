import { Component, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AccountService } from './account/account.service';
import { Constants } from './core/constants/constants';
import { CryptoService } from './core/services/crypto.service';
import { User } from './_models/user.model';
import { UserConversation } from './_models/view-models/chatting/user-conversation.model';
import { ChatListComponent } from './modules/chatting/chat-list/chat-list.component';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'aeroclub cargo backoffice client';
  isLoaded = false;
  public showCollapseMenu:boolean=true;
  notificationModalVisible = false;
  notificationModalVisibleAnimate = false;
  chatModalVisible = false;
  chatModalVisibleAnimate = false;
  chatCreateModalVisible = false;
  chatCreateModalVisibleAnimate = false;
  currentUserConversation?: UserConversation;
  isNewChat: boolean = false;
  agentUserName?: string;

  @ViewChild(ChatListComponent) child:any;

  constructor(
    public translate: TranslateService,
    public accountService: AccountService,
    private cryptoService: CryptoService
  ) {
    translate.addLangs(['en', 'vi']);
    var userSelectedLanguage = localStorage.getItem(Constants.LANGUAGE)
    if (userSelectedLanguage == null) {
      userSelectedLanguage = "en";
    }
    translate.setDefaultLang(userSelectedLanguage);
    translate.currentLang = userSelectedLanguage;
  }
  ngOnInit(): void {
    this.setCurrentUser();
  }

  switchLang(lang: string) {
    localStorage.setItem('UserSelectedLanguage', lang);
    this.translate.use(lang);
  }

  setCurrentUser() {
    let user: User;
    const userValue = localStorage.getItem('user');
    if (userValue && userValue != "null") {
      var decUser = this.cryptoService.decrypt(userValue);
      user = JSON.parse(decUser);
      this.accountService.setCurrentUser(user);
    } else {
      this.accountService.removeCurrentUser();
    }
    this.isLoaded = true;
  }

  hideMenu(value:any){
    this.showCollapseMenu=value;
  }

  showNotificationModal(value:any){
    this.notificationModalVisible = true;
    setTimeout(() => (this.notificationModalVisibleAnimate = true));
  }

  cancelNotificationModal() {
    this.notificationModalVisibleAnimate = false;
    setTimeout(() => (this.notificationModalVisible = false), 300);
  }

  showChatBox(val: any) {
    this.chatModalVisible = true;
    setTimeout(() => (this.chatModalVisibleAnimate = true));
  }

  showMsgCreatePopup(event: any,) { debugger
    this.isNewChat = false;
    this.currentUserConversation = event.con;
    this.agentUserName = event.username;

    this.chatCreateModalVisible= true;
    setTimeout(() => (this.chatCreateModalVisibleAnimate = true));
  }

  showNewChatPopup(username: string){
    this.isNewChat = true;
    this.currentUserConversation = undefined;
    this.agentUserName = username;
    this.chatCreateModalVisible= true;
    setTimeout(() => (this.chatCreateModalVisibleAnimate = true));
  }

  cancelchatModal() {
    this.chatModalVisibleAnimate = false;
    setTimeout(() => (this.chatModalVisible = false), 300);
  }

  closeChatCreate() {
    this.chatCreateModalVisibleAnimate = false;
    setTimeout(() => (this.chatCreateModalVisible = false), 300);
    this.child.initializeChat();
  }

}
