"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router_1 = __importDefault(require("../../Admin/routers/router"));
const AllCoinsRouter_1 = __importDefault(require("../../AllCoins/routers/AllCoinsRouter"));
const AllCoinsRouter_2 = __importDefault(require("../../CoinsMangment/routers/AllCoinsRouter"));
const router_2 = __importDefault(require("../../Admin/routers/router"));
const videoRoutes_1 = __importDefault(require("../../VideosStreaming/routes/videoRoutes"));
const modification_1 = __importDefault(require("../../VideosStreaming/routes/modification"));
const invitationRoutes_1 = __importDefault(require("../../invite/Crud/routes/invitationRoutes"));
const messageRoutes_1 = __importDefault(require("../../telegramAuthUsers/routes/messageRoutes"));
const UserRoutes_1 = __importDefault(require("../../Users/routes/UserRoutes"));
const authAdminContrller_1 = require("../../Admin/Controller/authAdminContrller");
const invitationRoutes_2 = __importDefault(require("../../UserInvite/routes/invitationRoutes"));
const router = express_1.default.Router();
// Auth routes
router.use('/api', router_2.default);
// API routes
router.use('/api', router_1.default);
// Video routes
router.use('/api', videoRoutes_1.default);
// Telegram routes
router.use('/api', UserRoutes_1.default);
router.use('/api', messageRoutes_1.default);
// Invitation routes
router.use('/api', invitationRoutes_1.default);
// Video modification routes
router.use('/api/modification', modification_1.default);
// All Coins routes  
router.use('/api', AllCoinsRouter_1.default);
router.use('/api', AllCoinsRouter_2.default);
router.use('/api', invitationRoutes_2.default);
// Protected routes
router.use('/api', authAdminContrller_1.isValidToken, router_1.default);
exports.default = router;
