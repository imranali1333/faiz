"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Errors = exports.logger = exports.InternalServerError = exports.GenericInvitationError = exports.InvitedBySameAsUserError = exports.UserNotInvitedError = exports.InvitationExpiredError = exports.InvitatedUserTrytoAcceptedException = exports.InvitationAlreadyAcceptedException = exports.InvitationNotFoundError = void 0;
const crypto_1 = __importDefault(require("crypto"));
const winston_1 = __importDefault(require("winston"));
const bigIntUtils_1 = require("../../utils/bigIntUtils");
const prismaclient_1 = __importDefault(require("../../utilities/prismaclient"));
// Custom error classes for specific invitation errors
class InvitationNotFoundError extends Error {
    constructor(message = 'Invitation not found') {
        super(message);
        this.name = 'InvitationNotFoundError';
    }
}
exports.InvitationNotFoundError = InvitationNotFoundError;
class InvitationAlreadyAcceptedException extends Error {
    constructor(message = 'Invitation has already been accepted') {
        super(message);
        this.name = 'InvitationAlreadyAcceptedException';
    }
}
exports.InvitationAlreadyAcceptedException = InvitationAlreadyAcceptedException;
class InvitatedUserTrytoAcceptedException extends Error {
    constructor(message = 'Invitation has already been accepted') {
        super(message);
        this.name = 'InvitatedUserTrytoAcceptedException';
    }
}
exports.InvitatedUserTrytoAcceptedException = InvitatedUserTrytoAcceptedException;
class InvitationExpiredError extends Error {
    constructor(message = 'Invitation has expired') {
        super(message);
        this.name = 'InvitationExpiredError';
    }
}
exports.InvitationExpiredError = InvitationExpiredError;
class UserNotInvitedError extends Error {
    constructor(message = 'Only the invited user can accept this invitation') {
        super(message);
        this.name = 'UserNotInvitedError';
    }
}
exports.UserNotInvitedError = UserNotInvitedError;
class InvitedBySameAsUserError extends Error {
    constructor(message = 'InvitedById cannot be the same as invitedUserId') {
        super(message);
        this.name = 'InvitedBySameAsUserError';
    }
}
exports.InvitedBySameAsUserError = InvitedBySameAsUserError;
class GenericInvitationError extends Error {
    constructor(message = 'An error occurred while accepting the invitation') {
        super(message);
        this.name = 'GenericInvitationError';
    }
}
exports.GenericInvitationError = GenericInvitationError;
class InternalServerError extends Error {
    constructor(message = 'Internal Server Error') {
        super(message);
        this.name = 'InternalServerError';
    }
}
exports.InternalServerError = InternalServerError;
// Logger setup
exports.logger = winston_1.default.createLogger({
    level: 'info',
    format: winston_1.default.format.simple(),
    transports: [new winston_1.default.transports.Console()],
});
exports.Errors = {
    INVITATION_NOT_FOUND: 'Invitation not found',
    INVITATION_ALREADY_ACCEPTED: 'Invitation has already been accepted',
    INVITATION_EXPIRED: 'Invitation has expired',
    USER_NOT_INVITED: 'Only the invited user can accept this invitation',
    INVITED_BY_SAME_AS_USER: 'InvitedById is same as invitedUserId',
    GENERIC_ERROR: 'An error occurred while accepting the invitation',
};
class InvitationService {
    constructor() {
        this.CODE_EXPIRY_HOURS = 24;
        this.logger = winston_1.default.createLogger({
            level: 'info',
            format: winston_1.default.format.simple(),
            transports: [new winston_1.default.transports.Console()],
        });
    }
    // Generate a unique invitation code
    generateCode() {
        return crypto_1.default.randomBytes(3).toString('hex').toUpperCase();
    }
    // Get the expiration date for the invitation code
    getCodeExpiryDate() {
        const expiryDate = new Date();
        expiryDate.setHours(expiryDate.getHours() + this.CODE_EXPIRY_HOURS);
        return expiryDate;
    }
    // Create an invitation for a user
    async createInvitation(invitedById) {
        try {
            // Check for an existing active invitation for the user
            const existingInvitation = await prismaclient_1.default.userInvitation.findFirst({
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
                return (0, bigIntUtils_1.convertBigIntsToStrings)(existingInvitation);
            }
            // No active invitation exists; create a new one
            const code = this.generateCode();
            const newInvitation = await prismaclient_1.default.userInvitation.create({
                data: {
                    invitedById: invitedById,
                    code,
                    createdAt: new Date(),
                    expiresAt: this.getCodeExpiryDate(),
                },
            });
            this.logger.info('Created new invitation', { id: newInvitation.id, code });
            return (0, bigIntUtils_1.convertBigIntsToStrings)(newInvitation);
        }
        catch (error) {
            console.error('Error creating invitation:', error);
            throw new Error('An error occurred while creating the invitation');
        }
    }
    async acceptInvitation(code, userId) {
        try {
            const updatedInvitation = await prismaclient_1.default.$transaction(async (prisma) => {
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
                return (0, bigIntUtils_1.convertBigIntsToStrings)(updatedInvitation);
            });
            return updatedInvitation;
        }
        catch (error) {
            console.error('Error in acceptInvitation service:', { code, userId, error: error.message });
            throw new GenericInvitationError();
        }
    }
    // Get invitations where the user is the invited user
    async getUserInvitations(userId) {
        try {
            const invitations = await prismaclient_1.default.userInvitation.findMany({
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
            return invitations.map(bigIntUtils_1.convertBigIntsToStrings);
        }
        catch (error) {
            console.error('Error retrieving user invitations:', { userId, error: error.message });
            throw new GenericInvitationError();
        }
    }
    // Get all invitations created by a user
    async getInvitationsByUser(userId) {
        try {
            const invitations = await prismaclient_1.default.userInvitation.findMany({
                where: { invitedById: userId },
                orderBy: { createdAt: 'desc' },
            });
            return invitations.map(bigIntUtils_1.convertBigIntsToStrings);
        }
        catch (error) {
            console.error('Error fetching invitations:', error);
            throw new Error('An error occurred while fetching invitations');
        }
    }
}
exports.default = new InvitationService();
