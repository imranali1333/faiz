import prisma from "../../utilities/prismaclient";

function convertBigIntsToStrings(obj: any): any {
  if (obj === null || obj === undefined) return obj;

  if (typeof obj === 'bigint') return obj.toString();

  if (Array.isArray(obj)) {
    return obj.map(convertBigIntsToStrings);
  }

  if (typeof obj === 'object') {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [key, convertBigIntsToStrings(value)])
    );
  }

  return obj;
}
export async function getUserById(userId: bigint) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      messagesSent: {
        include: {
          chat: true,
        },
      },
      invitationsSent: {
        include: {
          invitedUser: true,
          acceptedBy: true,
        },
      },
      invitationsReceived: {
        include: {
          invitedBy: true,
          acceptedBy: true,
        },
      },
      acceptedInvitations: {
        include: {
          invitedBy: true,
        },
      },
      sessions: true,
      allCoins: true,
    },
  });

  if (user) {
    // Convert all BigInt values to strings
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
      invitationsSent: user.invitationsSent.map(invitation => ({
        ...invitation,
        invitedById: invitation.invitedById.toString(),
        invitedUserId: invitation.invitedUserId?.toString(),
        acceptedById: invitation.acceptedById?.toString(),
        invitedUser: invitation.invitedUser ? {
          ...invitation.invitedUser,
          id: invitation.invitedUser.id.toString(),
        } : null,
        acceptedBy: invitation.acceptedBy ? {
          ...invitation.acceptedBy,
          id: invitation.acceptedBy.id.toString(),
        } : null,
      })),
      invitationsReceived: user.invitationsReceived.map(invitation => ({
        ...invitation,
        invitedById: invitation.invitedById.toString(),
        invitedUserId: invitation.invitedUserId?.toString(),
        acceptedById: invitation.acceptedById?.toString(),
        invitedBy: invitation.invitedBy ? {
          ...invitation.invitedBy,
          id: invitation.invitedBy.id.toString(),
        } : null,
        acceptedBy: invitation.acceptedBy ? {
          ...invitation.acceptedBy,
          id: invitation.acceptedBy.id.toString(),
        } : null,
      })),
      acceptedInvitations: user.acceptedInvitations.map(invitation => ({
        ...invitation,
        invitedById: invitation.invitedById.toString(),
        invitedUserId: invitation.invitedUserId?.toString(),
        acceptedById: invitation.acceptedById?.toString(),
        invitedBy: invitation.invitedBy ? {
          ...invitation.invitedBy,
          id: invitation.invitedBy.id.toString(),
        } : null,
      })),
      sessions: user.sessions.map(session => ({
        ...session,
        id: session.id.toString(),
      })),
      allCoins: user.allCoins ? {
        ...user.allCoins,
        id: user.allCoins.id.toString(),
      } : null,
    });
  }

  return null;
}

