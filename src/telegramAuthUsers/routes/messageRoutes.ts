// src/routes/messageRoutes.ts

import { Router } from 'express';
import { handleMessage } from '../controllers/messageController';
import { getUser } from '../controllers/GetUserController';
import { ensureAuthenticated } from '../../MiddleWare/UserAuth/VerifyLogin';
import { login } from '../controllers/loginController';
import { getAllUsers } from '../controllers/AllUSerController';
import { searchUsersController } from '../controllers/serachUSerController';

const router: Router = Router();

router.post('/telegram/message', handleMessage);
router.post('/telegram/login', login);
router.get('/telegram/user', ensureAuthenticated,getUser);
router.get('/client/list', getAllUsers); 
router.get('/client/search', searchUsersController);


export default router;
