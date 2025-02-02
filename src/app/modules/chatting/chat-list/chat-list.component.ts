import { Participant } from './../../../_models/view-models/chatting/participant.model';
import { DatePipe, NgForOf } from '@angular/common';
import { Component, EventEmitter, OnInit, Output, SimpleChange, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { AccountService } from 'src/app/account/account.service';
import { ParticipantRm } from 'src/app/_models/request-models/chatting/participant-rm.model';
import { User } from 'src/app/_models/user.model';
import { ChatUser } from 'src/app/_models/view-models/chatting/chat-user.model';
import { ParticipantConversation } from 'src/app/_models/view-models/chatting/participant-conversation.model';
import { ChatService } from 'src/app/_services/chat.service';
import { Conversation } from 'src/app/_models/view-models/chatting/conversation.model';
import { Message } from 'src/app/_models/view-models/chatting/message.model';
import { UserConversation } from 'src/app/_models/view-models/chatting/user-conversation.model';
import { CoreExtensions } from 'src/app/core/extensions/core-extensions.model';
import { MessageList } from 'src/app/_models/view-models/chatting/message-list';
import { CargoAgent } from 'src/app/_models/view-models/cargo-agent/CargoAgent';
import { CargoAgentService } from 'src/app/_services/cargo-agent.service';

@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.scss']
})
export class ChatListComponent implements OnInit {

  currentUser?:User | null;
  subscription?:Subscription;
  chatUsers: ChatUser[]=[];
  participants: Participant[]=[];
  participantConversations:ParticipantConversation[]=[];
  isNewConversation: boolean = false;
  conversationId: string = '';
  conversations?: Conversation[]=[];
  currentUserConversations?: UserConversation[] =[];
  searchText? :string ='';
  filteredMsgs: MessageList[]=[];
  agentList: CargoAgent[]=[];
  timer?:number = 0;
  updatedConversationCount?: number = 0;

  @Output() popupCreate = new EventEmitter<any>();
  @Output() newChatPopup = new EventEmitter<any>();

  constructor(private accountService: AccountService,
              private chatService: ChatService,
              private cargoAgentService: CargoAgentService
              ) { }

  ngOnInit(): void {
    this.initializeChat();
    this.getAgents();
    this.startChattingTimer();
    this.filteredMsg();
  }

  initializeChat() {
    // get the email of logged user
    this.getCurrentUser();
    let userName =  this.currentUser?.username!;

    if(userName) {
      // Get all user from twilio
      this.chatService.getUsers()
      .subscribe(res => {

        this.chatUsers = res;
        var user = this.chatUsers.filter(x=>x.identity == userName);
        // Check exists the user,
        if (user.length == 0) { // user not exists
          // Create user
          // this.chatService.createUser(userName)
          // .subscribe(x=> {
          //   this.loadUserConversation(user,userName);
          //   this.loadParticipantConversation(userName);
          // });
        } else { // user exists
          this.loadUserConversation(user,userName);
          this.loadParticipantConversation(userName)
        }
      });
    }
  }

  getAgents(){
    this.cargoAgentService.getList().subscribe(res=> {
      this.agentList = res;
      this.filteredMsg();
    })
  }

  loadParticipantConversation(userName: string) {
    this.chatService.getParticipantConversation(userName)
    .subscribe(s=> {

      if(s.length>0) {
        this.participantConversations = s;
        console.log('participantConversations', this.participantConversations)
      } else {
      }
      // if no exisiting msgs,
      // create new message
      // else show exisiting msgs
    });
  }

  loadParticipants(conversationId: string) {
    this.chatService.getParticipant(conversationId)
    .subscribe(s=> {
      if(s.length>0) {
        s.forEach(x=>{
          if(this.participants.findIndex(c=>c.sid == x.sid)==-1)
            this.participants.push(x);
        });
        console.log('participantId', s)
      } else {
      }
    });
  }

  loadUserConversation(user: ChatUser[], userName: string) {
    if(user.length > 0)
        this.chatService.getUserConversation(userName)
        .subscribe(o=> {
          if(o.length >0){
            this.currentUserConversations =[]
            o.forEach(el=> {
              if(el.conversationSid){
                this.loadMessages(el.conversationSid);
                this.loadParticipants(el.conversationSid)
              }
            });
          } else {
              // this.createParticipant(userName,)
          }
        });
  }

  createParticipant(username: string, conversationSid: string){
    var participant : ParticipantRm= new ParticipantRm();
    participant.identity = username;
    participant.conversationSid = conversationSid;
    this.chatService.createParticipant(participant)
    .subscribe(y=> {

    });
  }

  // Get all messages by Auther/ identity
  loadMessages (conversationId: string) {
      this.chatService.getMessages(conversationId)
      .subscribe(c=> {
        var messages: Message[]=[];
        c.forEach(el=>{
          messages.push(el);
        });
        const users :UserConversation = {conversationSid: conversationId, messages: messages};
        // remove if already existed.
        if(this.currentUserConversations && this.currentUserConversations?.find(c=>c.conversationSid == conversationId)) {
          const index = this.currentUserConversations.findIndex(obj => obj.conversationSid === conversationId);
          if (index !== -1) {
            this.currentUserConversations.splice(index, 1);
          }
        }
        this.currentUserConversations?.push(users);
        this.onConversationChanges(true);
      });
  }

  getCurrentUser() {
    this.subscription = this.accountService.currentUser$.subscribe(res => {
      this.currentUser = res;
    });
  }

  getFirstLetters(str: string) {
      return CoreExtensions.GetFirstLetters(str);
  }

  popupMessage(conversationId: string, username: string) {
    var con = this.getUserConversation(conversationId);
    if(con) {
      this.updateMsgReadStatus(con);
      this.popupCreate.emit({con:con,username:username});
    }else {
      this.newChat(username);
    }
  }

  newChat(username: string) {
    this.newChatPopup.emit(username);
  }

  getUserConversation(conversationId: string) {
    return this.currentUserConversations?.filter(x=> x.conversationSid == conversationId)[0];
  }

  updateMsgReadStatus(con: UserConversation) {
    con.messages?.forEach(msg=> {
      if(msg.chatStatus.isRead != true) {
        msg.chatStatus = { isRead : true}
        this.updateMessage(msg);
      }
    });
  }

  updateMessage(msg: Message) {
    this.chatService.updateMessage(msg)
    .subscribe(res=>{

    });
  }

  unreadCount(conversationId: string) {
    var con = this.getUserConversation(conversationId);
    if(!con || con.messages?.length==0) {
      return 0;
    }

    if(con?.messages && con?.messages[con?.messages?.length-1]?.auther != this.currentUser?.username) {
      return con.messages?.filter(x=>x.chatStatus?.isRead == undefined || x.chatStatus?.isRead == false).length;
    }
    return 0;
  }

  onConversationChanges(isUpdated: boolean) {
    if(isUpdated == true && Number(this.updatedConversationCount) < Number(this.currentUserConversations?.length)) {
      this.filteredMsg();
      this.updatedConversationCount = Number(this.updatedConversationCount) + 1;
      // this.currentUserConversations?.forEach(con=> {
      //   if(con?.conversationSid)
      //     this.loadParticipants(con?.conversationSid)
      // });

    }
  }

  filteredMsg(val?: string) {
    this.filteredMsgs =[];
    this.fillExistingMsgs();
    this.fillAgentList(false);

    console.log('filteredMsgs',this.filteredMsgs)
    return this.filteredMsgs;
  }

  fillExistingMsgs() {
    if(this.currentUserConversations) {
      this.currentUserConversations?.forEach(el => {
        if(el.messages) {
          this.filteredMsgs.push({
            'conversationId' : el?.conversationSid!,
            'created': el?.messages[el?.messages?.length-1]?.created,
            'lastMessageBody': el?.messages[el?.messages?.length-1]?.body,
            'userName': this.getMsgUserName(el?.messages),
            'isNew' : false});
        }
      });
    }
  }

  fillAgentList(allUsers: boolean) {
    // Get All cargo Users
    var users =this.agentList;
      users.forEach(user=> {
        if(this.filteredMsgs.filter(x=>x.userName == user.userName).length == 0 && user?.userName) {
          var msg = {'conversationId' : '' ,'created': '', 'lastMessageBody': '', 'userName': user.userName, 'isNew' : true};

          if(allUsers) {
            this.filteredMsgs.push(msg);
          } else if((this.searchText != undefined && this.searchText !='') && this.filteredMsgs.filter(x=>x.userName == user.userName).length == 0 && user?.userName && user?.userName?.indexOf(this.searchText)>-1) {
            this.filteredMsgs.push(msg);
          }
        }
      });
  }

  getMsgUserName(messages: Message[]) {
    var res = messages.filter(x=>x.auther != this.currentUser?.username);
    if(res.length > 0)
      return res[0].auther;

      // if backoffice user initialize the chat. messages havent included the other user.
    if(this.participants.length> 0) {
      var msg = messages.filter(x=>x.auther == this.currentUser?.username);
      if(msg.length> 0) {
        var user = this.participants.filter(c=>c.pathConversationSid == msg[0].pathConversationSid && c.identity != this.currentUser?.username);
        if(user.length> 0)
          return user[0].identity;
      }
    }

    return "";
  }

  getUserName(username: string) {
    var agent = this.agentList.filter(x=>x.userName == username);
    if(agent){
      return agent[0]?.agentName;
    }
    return username;
  }

  startChattingTimer() {
    this.timer = window.setInterval(() => {
      this.callLoadMsgs();
    }, 2000);
  }

  callLoadMsgs() {
    this.currentUserConversations?.forEach(currentUserConversation=>{
      if(currentUserConversation?.conversationSid) {
        var chId = currentUserConversation?.conversationSid;
        this.loadMessages(chId);
      }
    });
  }

  ngOnDestroy(): void {
    console.log('ngOnDestroy-ChatListComponent');
    window.clearInterval(this.timer);
    this.subscription?.unsubscribe();
  }

}
