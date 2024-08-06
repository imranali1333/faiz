"use strict";
// src/routes/messageRoutes.ts
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const messageController_1 = require("../controllers/messageController");
const GetUserController_1 = require("../controllers/GetUserController");
const VerifyLogin_1 = require("../../MiddleWare/UserAuth/VerifyLogin");
const loginController_1 = require("../controllers/loginController");
const AllUSerController_1 = require("../controllers/AllUSerController");
const serachUSerController_1 = require("../controllers/serachUSerController");
const router = (0, express_1.Router)();
router.post('/telegram/message', messageController_1.handleMessage);
router.post('/telegram/login', loginController_1.login);
router.get('/telegram/user', VerifyLogin_1.ensureAuthenticated, GetUserController_1.getUser);
router.get('/client/list', AllUSerController_1.getAllUsers);
router.get('/client/search', serachUSerController_1.searchUsersController);
exports.default = router;
