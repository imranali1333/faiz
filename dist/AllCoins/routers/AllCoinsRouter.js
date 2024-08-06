"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const allCoinsController_1 = require("../Contrllers/allCoinsController");
const VerifyUserAuth_1 = require("../../MiddleWare/UserAuth/VerifyUserAuth");
const router = express_1.default.Router();
// Update coins balance route
// for testing
// {
//   "incrementAmount": 100
// }
router.post('/updateBalance', VerifyUserAuth_1.ensureAuthenticated, allCoinsController_1.handleUpdateBalance);
// Get coins balance route
router.get('/getBalance', VerifyUserAuth_1.ensureAuthenticated, allCoinsController_1.handleGetBalance);
exports.default = router;
