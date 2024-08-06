"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const allCoinsController_1 = require("../Contrllers/allCoinsController");
const VerifyLogin_1 = require("../../MiddleWare/UserAuth/VerifyLogin");
// import { ensureAuthenticated } from '../../MiddleWare/UserAuth/VerifyLogin';
const router = express_1.default.Router();
// Update coins balance route
// for testing
// {
//   "incrementAmount": 100
// }
router.post('/coins/updateBalance', VerifyLogin_1.ensureAuthenticated, allCoinsController_1.manageHandleUpdateCoins);
// Get coins balance route
router.get('/coins/getBalance', VerifyLogin_1.ensureAuthenticated, allCoinsController_1.manageHandleGetCoins);
exports.default = router;
