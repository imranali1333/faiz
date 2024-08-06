import express from 'express';
import apiRouter from '../../Admin/routers/router';
import allCoinsRouter from '../../AllCoins/routers/AllCoinsRouter';
import MangmentCoinsRouter from '../../CoinsMangment/routers/AllCoinsRouter';
import authApiRouter from '../../Admin/routers/router';
import videoRoutes from '../../VideosStreaming/routes/videoRoutes';
import videoModificationRoutes from '../../VideosStreaming/routes/modification';
import invitationRoutes from '../../invite/Crud/routes/invitationRoutes';
import MessageHandling from '../../telegramAuthUsers/routes/messageRoutes';
import TeleGramBot from '../../Users/routes/UserRoutes';
import { isValidToken } from '../../Admin/Controller/authAdminContrller';
import userinvitationRoutes from '../../UserInvite/routes/invitationRoutes';

const router = express.Router();

// Auth routes
router.use('/api', authApiRouter);

// API routes
router.use('/api', apiRouter);

// Video routes
router.use('/api', videoRoutes);

// Telegram routes
router.use('/api', TeleGramBot);
router.use('/api', MessageHandling);

// Invitation routes
router.use('/api', invitationRoutes);

// Video modification routes
router.use('/api/modification', videoModificationRoutes);

// All Coins routes  
router.use('/api', allCoinsRouter);

router.use('/api', MangmentCoinsRouter);


router.use('/api', userinvitationRoutes);

// Protected routes
router.use('/api', isValidToken, apiRouter);

export default router;
