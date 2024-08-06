export interface FromData {
    id: bigint; 
    is_bot: boolean;
    first_name: string;
    last_name: string;
    username?: string;
    language_code: string;
  }
  
 export interface ChatData {
    id: bigint;
    first_name: string;
    last_name: string;
    username?: string;
    type: string;
  }
  
export  interface MessageData {
    message_id: bigint; 
    from: FromData;
    chat: ChatData;
    date: number;
    text: string;
    entities?: any;
  }
  