import { convertBigIntsToStrings } from './convertBigIntsToStrings';
import { User } from './types';

function processUser(user: User): User {
  return convertBigIntsToStrings({
    ...user,
    id: user.id.toString(),
    telegramId: user.telegramId.toString(),
    messagesSent: user.messagesSent.map(message => ({
      ...message,
      messageId: message.messageId.toString(),
      fromId: message.fromId.toString(),
      chatId: message.chatId.toString(),
      chat: {
        ...message.chat,
        telegramId: message.chat.telegramId.toString(),
      },
    })),
  });
}

// Example usage
const user: User = {
  id: BigInt(123),
  telegramId: BigInt(456),
  isBot: false,
  firstName: 'John',
  lastName: 'Doe',
  username: 'johndoe',
  languageCode: 'en',
  messagesSent: [
    {
      id: BigInt(1),
      messageId: BigInt(789),
      fromId: BigInt(101112),
      chatId: BigInt(131415),
      from: {
        id: BigInt(101),
        telegramId: BigInt(112233),
        isBot: false,
        firstName: 'Jane',
        lastName: 'Smith',
        username: 'janesmith',
        languageCode: 'en',
        messagesSent: [],
        sessions: [],
        allCoins: undefined,
        invitationsSent: [],
        invitationsReceived: [],
        acceptedInvitations: [],
      },
      chat: {
        id: BigInt(201),
        telegramId: BigInt(223344),
        firstName: 'ChatGroup',
        lastName: '',
        username: 'chatgroup',
        type: 'group',
        messages: [],
      },
      date: 1633036800,
      text: 'Hello, world!',
      entities: null,
    },
  ],
  sessions: [],
  allCoins: undefined,
  invitationsSent: [],
  invitationsReceived: [],
  acceptedInvitations: [],
};

const processedUser = processUser(user);
console.log(processedUser);
