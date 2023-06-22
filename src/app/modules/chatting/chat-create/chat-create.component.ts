import { formatDate } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { AccountService } from 'src/app/account/account.service';
import { CoreExtensions } from 'src/app/core/extensions/core-extensions.model';
import { ConversationRm } from 'src/app/_models/request-models/chatting/conversation-rm.model';
import { ParticipantRm } from 'src/app/_models/request-models/chatting/participant-rm.model';
import { User } from 'src/app/_models/user.model';
import { ChatStatus } from 'src/app/_models/view-models/chatting/chat-status.model';
import { MessageRm } from 'src/app/_models/view-models/chatting/message-rm.model';
import { Message } from 'src/app/_models/view-models/chatting/message.model';
import { UserConversation } from 'src/app/_models/view-models/chatting/user-conversation.model';
import { ChatService } from 'src/app/_services/chat.service';
import { CargoAgentService } from 'src/app/_services/cargo-agent.service';

@Component({
  selector: 'app-chat-create',
  templateUrl: './chat-create.component.html',
  styleUrls: ['./chat-create.component.scss']
})
export class ChatCreateComponent implements OnInit {

  currentUser?:User | null;
  subscription?:Subscription;
  chatbox: string ='';
  msgUser: string = 'agent name';
  timer?:number = 0;

  @Input() currentUserConversation?: UserConversation;
  @Input() set isNewConversation(isNewConversation: boolean) {
    if(isNewConversation == true) {
      // this.createConversation();
    }
  }
  @Output() closeChatCreation = new EventEmitter<any>();


  constructor(private accountService: AccountService,
    private chatService: ChatService) { }

  ngOnInit(): void {
    this.getCurrentUser();
    this.startChattingTimer();
  }

  getChatUsername() {
    var msgs = this.currentUserConversation?.messages?.filter(x=>x.auther != this.currentUser?.email);
    if(msgs && msgs?.length>0)
      return msgs[0].auther;

    return this.msgUser;
  }

  sendMsg() {
    var msg: MessageRm = new MessageRm();
    msg.auther =  this.currentUser?.username;
    msg.body = this.chatbox;
    msg.pathConversationSid = this.currentUserConversation?.conversationSid;
    msg.chatStatus = new ChatStatus();
    msg.chatStatus.isRead = false;
    this.chatService.createMessage(msg)
    .subscribe(res=> {
      if(msg?.pathConversationSid){
        this.loadMessages(msg?.pathConversationSid);
        this.chatbox = '';
      }
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
      this.currentUserConversation = users;

    });

}

createConversation() {
  // create conversation
  var conversation: ConversationRm = new ConversationRm();
  var userName = this.currentUser?.username;
  let currentDateTime = formatDate(new Date().toString(), 'yyyy-MM-dd', 'en-US');
  let name = userName + '_'+ currentDateTime?.toString();
  conversation.friendlyName = name;
  conversation.uniqueName = name;

  this.chatService.createConversation(conversation)
  .subscribe(t=> {
    if(userName) {
      this.currentUserConversation = { conversationSid : t.sid};
      // Create particpant
      this.createParticipant(userName, t.sid);
      // add Admin to the conservation
      if(this.currentUser?.email)
        this.createParticipant(this.currentUser?.email, t.sid);
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

  getFirstLetters(str: string) {
    return CoreExtensions.GetFirstLetters(str);
}

  getCurrentUser() {
    this.subscription = this.accountService.currentUser$.subscribe(res => {
      this.currentUser = res;
    });
  }

  ngOnDestroy(): void { 
    this.subscription?.unsubscribe();
    window.clearInterval(this.timer);
  }

  startChattingTimer() {
    this.timer = window.setInterval(() => {
      this.callLoadMsgs();
    }, 2000);
  }

  callLoadMsgs() {
    if(this.currentUserConversation?.conversationSid) {
      var chId = this.currentUserConversation?.conversationSid;
      this.loadMessages(chId);
    }
  }

  backButtonClicked() {
    window.clearInterval(this.timer);
    this.closeChatCreation.emit();
  }
}
