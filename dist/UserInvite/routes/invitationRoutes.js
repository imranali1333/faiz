"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const invitationController_1 = __importDefault(require("../controllers/invitationController"));
const VerifyLogin_1 = require("../../MiddleWare/UserAuth/VerifyLogin");
const router = (0, express_1.Router)();
// Create an invitation
router.post('/user/invitations', VerifyLogin_1.ensureAuthenticated, invitationController_1.default.createInvitation);
// Accept an invitation using the invitation code
router.post('/user/invitations/accept/:code', VerifyLogin_1.ensureAuthenticated, invitationController_1.default.acceptInvitation);
router.get('/user/invitationss', VerifyLogin_1.ensureAuthenticated, invitationController_1.default.getUserInvitations);
// Get all invitations for the logged-in user
router.get('/user/invitations', VerifyLogin_1.ensureAuthenticated, invitationController_1.default.getInvitations);
exports.default = router;
