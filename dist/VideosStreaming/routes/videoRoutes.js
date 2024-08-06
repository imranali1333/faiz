"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// routes/videoRoutes.ts
const express_1 = __importDefault(require("express"));
const videoController_1 = require("../controllers/videoController"); // Adjust the import path as needed
const authAdminContrller_1 = require("../../Admin/Controller/authAdminContrller");
const Serching_1 = require("../controllers/Serching");
const updateContrller_1 = require("../controllers/updateContrller");
const deleteVideo_1 = require("../controllers/deleteVideo");
const PostVieo_1 = require("../controllers/PostVieo");
// import { authenticateAdmin } from '../../MiddleWare/Token/validateToken';
const router = express_1.default.Router();
router.get('/lead/read/:id', authAdminContrller_1.isValidTokens, Serching_1.getVideoById);
router.get('/lead/search', authAdminContrller_1.isValidTokens, Serching_1.searchVideos);
router.post('/lead/create', authAdminContrller_1.isValidTokens, PostVieo_1.postVideo);
router.get('/lead/list', authAdminContrller_1.isValidTokens, videoController_1.videoController.getAllVideos);
router.put('/lead/update/:id', authAdminContrller_1.isValidTokens, updateContrller_1.updateVideo);
router.route("/lead/delete/:id").delete(deleteVideo_1.deleteVideo);
exports.default = router;
