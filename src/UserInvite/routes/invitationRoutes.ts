import { Router } from 'express';
import invitationController from '../controllers/invitationController';
import { ensureAuthenticated } from '../../MiddleWare/UserAuth/VerifyLogin';

const router = Router();

// Create an invitation
router.post('/user/invitations', ensureAuthenticated, invitationController.createInvitation);


// Accept an invitation using the invitation code
router.post('/user/invitations/accept/:code', ensureAuthenticated, invitationController.acceptInvitation);

router.get('/user/invitationss', ensureAuthenticated, invitationController.getUserInvitations);


// Get all invitations for the logged-in user
router.get('/user/invitations', ensureAuthenticated, invitationController.getInvitations);

export default router;
