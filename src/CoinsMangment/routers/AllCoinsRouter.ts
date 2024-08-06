import express from 'express';
import { manageHandleGetCoins, manageHandleUpdateCoins } from '../Contrllers/allCoinsController';
import { ensureAuthenticated } from '../../MiddleWare/UserAuth/VerifyLogin';
// import { ensureAuthenticated } from '../../MiddleWare/UserAuth/VerifyLogin';

const router = express.Router();

// Update coins balance route
// for testing
// {

//   "incrementAmount": 100
// }
router.post('/coins/updateBalance', ensureAuthenticated, manageHandleUpdateCoins);

// Get coins balance route
router.get('/coins/getBalance', ensureAuthenticated, manageHandleGetCoins);

export default router;
