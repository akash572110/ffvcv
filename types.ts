export enum Sender {
  User = 'user',
  AI = 'ai',
}

export interface Message {
  id: string;
  text: string;
  sender: Sender;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
}
