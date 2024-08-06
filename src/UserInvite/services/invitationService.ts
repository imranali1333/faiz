import crypto from 'crypto';
import winston from 'winston';
import { convertBigIntsToStrings } from '../../utils/bigIntUtils';
import prisma from '../../utilities/prismaclient';
import { UserInvitation } from '../../utils/userinvitation/types';


// Custom error classes for specific invitation errors
export class InvitationNotFoundError extends Error {
  constructor(message: string = 'Invitation not found') {
    super(message);
    this.name = 'InvitationNotFoundError';
  }
}

export class InvitationAlreadyAcceptedException extends Error {
  constructor(message: string = 'Invitation has already been accepted') {
    super(message);
    this.name = 'InvitationAlreadyAcceptedException';
  }
}
export class InvitatedUserTrytoAcceptedException extends Error {
  constructor(message: string = 'Invitation has already been accepted') {
    super(message);
    this.name = 'InvitatedUserTrytoAcceptedException';
  }
}

export class InvitationExpiredError extends Error {
  constructor(message: string = 'Invitation has expired') {
    super(message);
    this.name = 'InvitationExpiredError';
  }
}

export class UserNotInvitedError extends Error {
  constructor(message: string = 'Only the invited user can accept this invitation') {
    super(message);
    this.name = 'UserNotInvitedError';
  }
}

export class InvitedBySameAsUserError extends Error {
  constructor(message: string = 'InvitedById cannot be the same as invitedUserId') {
    super(message);
    this.name = 'InvitedBySameAsUserError';
  }
}

export class GenericInvitationError extends Error {
  constructor(message: string = 'An error occurred while accepting the invitation') {
    super(message);
    this.name = 'GenericInvitationError';
  }
}

export class InternalServerError extends Error {
  constructor(message: string = 'Internal Server Error') {
    super(message);
    this.name = 'InternalServerError';
  }
}
// Logger setup
export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.simple(),
  transports: [new winston.transports.Console()],
});
export const Errors = {
  INVITATION_NOT_FOUND: 'Invitation not found',
  INVITATION_ALREADY_ACCEPTED: 'Invitation has already been accepted',
  INVITATION_EXPIRED: 'Invitation has expired',
  USER_NOT_INVITED: 'Only the invited user can accept this invitation',
  INVITED_BY_SAME_AS_USER: 'InvitedById is same as invitedUserId',
  GENERIC_ERROR: 'An error occurred while accepting the invitation',
};
class InvitationService {
  private readonly CODE_EXPIRY_HOURS = 24;

  private readonly logger = winston.createLogger({
    level: 'info',
    format: winston.format.simple(),
    transports: [new winston.transports.Console()],
  });

  // Generate a unique invitation code
  private generateCode(): string {
    return crypto.randomBytes(3).toString('hex').toUpperCase();
  }

  // Get the expiration date for the invitation code
  private getCodeExpiryDate(): Date {
    const expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours() + this.CODE_EXPIRY_HOURS);
    return expiryDate;
  }

  // Create an invitation for a user
  async createInvitation(invitedById: bigint): Promise<UserInvitation> {
    try {
      // Check for an existing active invitation for the user
      const existingInvitation = await prisma.userInvitation.findFirst({
        where: {
          invitedById: invitedById,
          acceptedById: null,
          expiresAt: {
            gte: new Date(),
          },
        },
      });

      if (existingInvitation) {
        // An active invitation already exists for the user
        this.logger.info('Returning existing invitation', { id: existingInvitation.id, code: existingInvitation.code });
        return convertBigIntsToStrings(existingInvitation);
      }

      // No active invitation exists; create a new one
      const code = this.generateCode();
      const newInvitation = await prisma.userInvitation.create({
        data: {
          invitedById: invitedById,
          code,
          createdAt: new Date(),
          expiresAt: this.getCodeExpiryDate(),
        },
      });

      this.logger.info('Created new invitation', { id: newInvitation.id, code });
      return convertBigIntsToStrings(newInvitation);
    } catch (error) {
      console.error('Error creating invitation:', error);
      throw new Error('An error occurred while creating the invitation');
    }
  }


  async acceptInvitation(code: string, userId: bigint): Promise<UserInvitation> {
    try {
      const updatedInvitation = await prisma.$transaction(async (prisma) => {
        const invitation = await prisma.userInvitation.findUnique({
          where: { code },
        });

        if (!invitation) {
          throw new InvitationNotFoundError();
        }

        if (invitation.expiresAt && new Date() > new Date(invitation.expiresAt)) {
          throw new InvitationExpiredError();
        }

        // Check if the user has already accepted this invitation
        if (invitation.acceptedById) {
          if (invitation.acceptedById === userId) {
            throw new InvitationAlreadyAcceptedException();
          }
          throw new InvitationAlreadyAcceptedException(); // Or handle multiple accepted cases if allowed
        }


        const updatedInvitation = await prisma.userInvitation.update({
          where: { code },
          data: {
            acceptedById: userId,
            invitedUserId: userId,
          },
        });

        return convertBigIntsToStrings(updatedInvitation);
      });

      return updatedInvitation;
    } catch (error: any) {
      console.error('Error in acceptInvitation service:', { code, userId, error: error.message });
      throw new GenericInvitationError();
    }
  }
  // Get invitations where the user is the invited user
  async getUserInvitations(userId: bigint): Promise<UserInvitation[]> {
    try {
      const invitations = await prisma.userInvitation.findMany({
        where: {
          invitedUserId: userId,
        },
        include: {
          invitedBy: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
          acceptedBy: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      return invitations.map(convertBigIntsToStrings);
    } catch (error: any) {
      console.error('Error retrieving user invitations:', { userId, error: error.message });
      throw new GenericInvitationError();
    }
  }
  // Get all invitations created by a user
  async getInvitationsByUser(userId: bigint): Promise<UserInvitation[]> {
    try {
      const invitations = await prisma.userInvitation.findMany({
        where: { invitedById: userId },
        orderBy: { createdAt: 'desc' },
      });

      return invitations.map(convertBigIntsToStrings);
    } catch (error) {
      console.error('Error fetching invitations:', error);
      throw new Error('An error occurred while fetching invitations');
    }
  }
}

export default new InvitationService();
