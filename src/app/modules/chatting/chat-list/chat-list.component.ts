import { DatePipe, NgForOf } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { AccountService } from 'src/app/account/account.service';
import { ConversationRm } from 'src/app/_models/request-models/chatting/conversation-rm.model';
import { ParticipantRm } from 'src/app/_models/request-models/chatting/participant-rm.model';
import { User } from 'src/app/_models/user.model';
import { ChatUser } from 'src/app/_models/view-models/chatting/chat-user.model';
import { ParticipantConversation } from 'src/app/_models/view-models/chatting/participant-conversation.model';
import { Participant } from 'src/app/_models/view-models/chatting/participant.model';
import { ChatService } from 'src/app/_services/chat.service';
import { formatDate } from '@angular/common';
import { Conversation } from 'src/app/_models/view-models/chatting/conversation.model';
import { Message } from 'src/app/_models/view-models/chatting/message.model';
import { MessageRm } from 'src/app/_models/view-models/chatting/message-rm.model';
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

  @Output() popupCreate = new EventEmitter<any>();
  @Output() newChatPopup = new EventEmitter<any>();

  constructor(private accountService: AccountService,
              private chatService: ChatService,
              private cargoAgentService: CargoAgentService
              ) { }

  ngOnInit(): void {
    // this.LoadConversations()
    this.initializeChat();
    this.filteredMsg();
    this.getAgents();
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
      console.log('agents',res)
    })
  }

  loadParticipantConversation(userName: string) {
    this.chatService.getParticipantConversation(userName)
    .subscribe(s=> {

      if(s.length>0) {
        this.participantConversations = s;
      } else {
      }
      // if no exisiting msgs,
      // create new message
      // else show exisiting msgs
    });
  }

  loadUserConversation(user: ChatUser[], userName: string) {
    if(user.length > 0)
        this.chatService.getUserConversation(userName)
        .subscribe(o=> {
          if(o.length >0){
            this.currentUserConversations =[]
            o.forEach(el=> {
              if(el.conversationSid)
                this.loadMessages(el.conversationSid);
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
        this.currentUserConversations?.push(users);
      });
  }

  getCurrentUser() {
    this.subscription = this.accountService.currentUser$.subscribe(res => {
      this.currentUser = res;
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  getFirstLetters(str: string) {
      return CoreExtensions.GetFirstLetters(str);
  }

  popupMessage(conversationId: string) {
    var con = this.getUserConversation(conversationId);
    if(con) {
      this.updateMsgReadStatus(con);
      this.popupCreate.emit(con);
    }else {
      this.newChat();
    }
  }

  newChat() {
    this.newChatPopup.emit();
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

  filteredMsg(val?: string) {
    this.filteredMsgs =[];
    if(this.currentUserConversations) {
      this.currentUserConversations?.forEach(el => {
        if(el.messages) {
          this.filteredMsgs.push({
            'conversationId' : el?.conversationSid!,
            'created': el?.messages[el?.messages?.length-1]?.created,
            'lastMessageBody': el?.messages[el?.messages?.length-1]?.body,
            'userName': el?.messages[el?.messages?.length-1]?.auther,
            'isNew' : false});
        }
      });
    }
    // Get All cargo Users
    var users =this.agentList;
    if(this.searchText != undefined && this.searchText !='') {
      var text = this.searchText;
      users.forEach(user=> {
        if(this.filteredMsgs.filter(x=>x.userName == user.userName).length == 0 && user?.userName && user?.userName?.indexOf(text)>-1) {
            this.filteredMsgs.push({'conversationId' : '' ,'created': '', 'lastMessageBody': '', 'userName': user.userName, 'isNew' : true});
        }
      });
    }
      //console.log('filteredMsgs',this.filteredMsgs);
      return this.filteredMsgs;
  }

  getUserName(username: string) {
    var agent = this.agentList.filter(x=>x.userName == username);
    if(agent){
      return agent[0]?.agentName;
    }
    return username;
  }
}
