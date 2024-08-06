"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const invitationService_1 = __importStar(require("../services/invitationService"));
const invitationService_2 = require("../services/invitationService");
class InvitationController {
    // Create an invitation
    async createInvitation(req, res) {
        try {
            // Ensure the user is logged in
            if (!req.session.loggedIn || !req.session.userId) {
                res.status(401).json({ message: 'Unauthorized: User not logged in' });
                return;
            }
            const invitedById = req.session.userId;
            // Create an invitation
            const invitation = await invitationService_1.default.createInvitation(invitedById);
            // Respond with the invitation details
            res.status(201).json({
                message: 'Invitation created successfully',
                code: invitation.code, // Return the invitation code
                expiresAt: invitation.expiresAt, // Optional: Return the expiration date if needed
            });
        }
        catch (error) {
            console.error('Error creating invitation:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
    // Accept an invitation using the invitation code
    async acceptInvitation(req, res) {
        try {
            const { code } = req.params;
            const userId = req.session.userId;
            if (!userId) {
                res.status(401).json({ message: 'Unauthorized: User not logged in' });
                return;
            }
            const invitation = await invitationService_1.default.acceptInvitation(code, userId);
            res.status(200).json({
                message: 'Invitation accepted successfully',
                invitation,
            });
        }
        catch (error) {
            console.error('Error accepting invitation:', error);
            let statusCode = 500;
            let errorMessage = 'Internal Server Error';
            if (error instanceof invitationService_2.InvitationNotFoundError) {
                statusCode = 404;
                errorMessage = 'Invitation not found';
            }
            else if (error instanceof invitationService_2.InvitationAlreadyAcceptedException) {
                statusCode = 400;
                errorMessage = 'Invitation has already been accepted';
            }
            else if (error instanceof invitationService_1.InvitatedUserTrytoAcceptedException) {
                statusCode = 400;
                errorMessage = 'Invitation has already been accepted';
            }
            else if (error instanceof invitationService_2.InvitationExpiredError) {
                statusCode = 400;
                errorMessage = 'Invitation has expired';
            }
            else if (error instanceof invitationService_2.UserNotInvitedError) {
                statusCode = 403;
                errorMessage = 'Only the invited user can accept this invitation';
            }
            else if (error instanceof invitationService_2.InvitedBySameAsUserError) {
                statusCode = 400;
                errorMessage = 'Invalid operation: invitedById cannot be the same as invitedUserId';
            }
            else if (error instanceof invitationService_2.GenericInvitationError) {
                statusCode = 500;
                errorMessage = 'An error occurred while accepting the invitation';
            }
            res.status(statusCode).json({ message: errorMessage });
        }
    }
    // Get all invitations for a user
    async getInvitations(req, res) {
        try {
            // Ensure the user is logged in
            if (!req.session.loggedIn || !req.session.userId) {
                res.status(401).json({ message: 'Unauthorized: User not logged in' });
                return;
            }
            const userId = req.session.userId;
            // Fetch the invitations
            const invitations = await invitationService_1.default.getInvitationsByUser(userId);
            // Respond with the list of invitations
            res.status(200).json(invitations);
        }
        catch (error) {
            console.error('Error fetching invitations:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
    async getUserInvitations(req, res) {
        try {
            const userId = req.session.userId;
            // Check if user is logged in
            if (!userId) {
                res.status(401).json({ message: 'Unauthorized: User not logged in' });
                return;
            }
            // Fetch the invitations for the logged-in user
            const invitations = await invitationService_1.default.getUserInvitations(userId);
            res.status(200).json({
                message: 'Invitations retrieved successfully',
                invitations,
            });
        }
        catch (error) {
            console.error('Error retrieving user invitations:', error);
            let statusCode = 500;
            let errorMessage = 'Internal Server Error';
            if (error instanceof invitationService_2.GenericInvitationError) {
                statusCode = 500;
                errorMessage = 'An error occurred while retrieving user invitations';
            }
            res.status(statusCode).json({ message: errorMessage });
        }
    }
}
exports.default = new InvitationController();
