// types.ts
export interface Chat {
    id: BigInt;
    telegramId: BigInt;
    firstName: string;
    lastName: string;
    username?: string;
    type: string;
    messages: Message[];
  }
  
  export interface Message {
    id: BigInt;
    messageId: BigInt;
    fromId: BigInt;
    chatId: BigInt;
    from: User;
    chat: Chat;
    date: number; 
    text: string;
    entities?: any; 
  }
  
  export interface Session {
    id: BigInt;
    sid: string;
    expiresAt: Date;
    data: any;
    userId?: BigInt;
    user?: User;
  }
  
  export interface UserInvitation {
    id: BigInt;
    invitedById: BigInt;
    invitedUserId?: BigInt;
    acceptedById?: BigInt;
    code: string;
    createdAt: Date;
    expiresAt?: Date;
    invitedBy: User;
    invitedUser?: User;
    acceptedBy?: User;
  }
  
  export interface User {
    id: BigInt;
    telegramId: BigInt;
    isBot: boolean;
    firstName: string;
    lastName: string;
    username?: string;
    languageCode: string;
    messagesSent: Message[];
    sessions: Session[];
    allCoins?: any; 
    invitationsSent: UserInvitation[];
    invitationsReceived: UserInvitation[];
    acceptedInvitations: UserInvitation[];
  }
  