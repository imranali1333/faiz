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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const errorhandler_1 = require("../handlers/errorhandler");
const adminController = __importStar(require("../Controller/Admin.contrller"));
const adminControllerAuth = __importStar(require("../Controller/authAdminContrller"));
const router = express_1.default.Router();
//_______________________________ Admin management_______________________________
router.route("/register").post((0, errorhandler_1.catchErrors)(adminControllerAuth.register));
router.route("/login").post((0, errorhandler_1.catchErrors)(adminControllerAuth.login));
router.route("/logout").post(adminControllerAuth.isValidToken, (0, errorhandler_1.catchErrors)(adminControllerAuth.logout));
// for development & production don't use this line router.route("/login").post(catchErrors(loginDemo)); (you should remove it) , this is just demo login contoller
// router.route("/login").post(catchErrors(loginDemo));
router.route('/admin/create').post((0, errorhandler_1.catchErrors)(adminController.create));
router.route('/admin/read/:id').get((0, errorhandler_1.catchErrors)(adminController.read));
router.route('/admin/update/:id').patch((0, errorhandler_1.catchErrors)(adminController.update));
router.route('/admin/delete/:id').delete((0, errorhandler_1.catchErrors)(adminController.deleteAdmin));
router.route('/admin/search').get((0, errorhandler_1.catchErrors)(adminController.search));
router.route('/admin/list').get((0, errorhandler_1.catchErrors)(adminController.list));
router.route('/admin/password-update/:id')
    .patch((0, errorhandler_1.catchErrors)(adminController.updatePassword));
router.route("/login").post((0, errorhandler_1.catchErrors)(adminControllerAuth.login));
router.route("/register").post((0, errorhandler_1.catchErrors)(adminControllerAuth.register));
router.route("/logout").post(adminControllerAuth.isValidToken, (0, errorhandler_1.catchErrors)(adminControllerAuth.logout));
// _________________________________________________________________________________
exports.default = router;
