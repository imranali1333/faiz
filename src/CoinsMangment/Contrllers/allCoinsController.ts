import { Request, Response } from 'express';
import { getCoinsBalance, updateCoinsBalance } from '../services/allCoinsService';
import { convertBigIntsToStrings } from '../../utils/bigIntUtils';

export async function manageHandleUpdateCoins(req: Request, res: Response): Promise<void> {
    try {
        // Extract userId from session
        const userId = req.session.userId;

        // Check if userId exists in the session
        if (!userId) {
            res.status(401).json({ error: 'Unauthorized: userId not found in session' });
            return;
        }

        // Validate incrementAmount
        const incrementAmount = req.body.incrementAmount;
        if (typeof incrementAmount !== 'number') {
            res.status(400).json({ error: 'Invalid input: incrementAmount must be a number' });
            return;
        }

        // Convert userId to BigInt
        const userIdBigInt = BigInt(userId); // userId should be a string representing a BigInt

        const updatedCoins = await updateCoinsBalance(userIdBigInt, incrementAmount);

        res.status(200).json(updatedCoins); // Updated coins are already in string format
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}



export async function manageHandleGetCoins(req: Request, res: Response): Promise<void> {
    try {
        // Extract userId from session
        const userId = req.session.userId;

        // Check if userId exists in the session
        if (!userId) {
            res.status(401).json({ error: 'Unauthorized: userId not found in session' });
            return;
        }

        // Convert userId to BigInt
        const userIdBigInt = BigInt(userId); // Convert from string to BigInt

        // Retrieve coins balance
        const coins = await getCoinsBalance(userIdBigInt);

        // Convert result to strings
        const coinsStr = convertBigIntsToStrings(coins);

        res.status(200).json(coinsStr);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}
