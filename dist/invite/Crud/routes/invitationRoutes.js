"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const VerifyUserAuth_1 = require("../../../MiddleWare/UserAuth/VerifyUserAuth");
const invitationController_1 = __importDefault(require("../controllers/invitationController"));
const router = (0, express_1.Router)();
// Create an invitation
router.post('/invitations', VerifyUserAuth_1.ensureAuthenticated, invitationController_1.default.createInvitation);
// Accept an invitation using the invitation code
router.post('/invitations/accept/:code', VerifyUserAuth_1.ensureAuthenticated, invitationController_1.default.acceptInvitation);
router.get('/invitationss', VerifyUserAuth_1.ensureAuthenticated, invitationController_1.default.getUserInvitations);
// Get all invitations for the logged-in user
router.get('/invitations', VerifyUserAuth_1.ensureAuthenticated, invitationController_1.default.getInvitations);
exports.default = router;
