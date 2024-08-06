"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// routes/videoRoutes.ts
const express_1 = __importDefault(require("express"));
const modificationcontrller_1 = require("../controllers/modificationcontrller");
const authAdminContrller_1 = require("../../Admin/Controller/authAdminContrller");
const router = express_1.default.Router();
router.put('/videos', authAdminContrller_1.isValidToken, modificationcontrller_1.videoController.updateVideo);
router.delete('/videos', authAdminContrller_1.isValidToken, modificationcontrller_1.videoController.deleteVideo);
exports.default = router;
