import prisma from "../../utilities/prismaclient";
import { emitCoinsUpdated } from "../../sockets/socketManager";
import { convertBigIntsToStrings } from "../../utils/bigIntUtils";
export async function updateCoinsBalance(userId: bigint, incrementAmount: number): Promise<any> {
    try {
        // Find existing coins
        const existingCoins = await prisma.coinMangment.findUnique({
            where: {
                userId: userId, // Directly use BigInt
            },
        });

        let updatedCoins;
        if (existingCoins) {
            // Update existing coins
            updatedCoins = await prisma.coinMangment.update({
                where: {
                    userId: userId, // Directly use BigInt
                },
                data: {
                    balance: {
                        increment: incrementAmount,
                    },
                },
            });
        } else {
            // Create new coin entry
            updatedCoins = await prisma.coinMangment.create({
                data: {
                    userId: userId, // Directly use BigInt
                    balance: incrementAmount,
                },
            });
        }

        // Convert result to strings
        const updatedCoinsStr = convertBigIntsToStrings(updatedCoins);

        return updatedCoinsStr;
    } catch (error: any) {
        throw new Error(`Failed to update coins balance: ${error.message}`);
    }
}

export async function getCoinsBalance(userId: bigint): Promise<any> {
    try {
        // Convert BigInt to string for Prisma query
        const userIdStr = userId.toString();

        const coins = await prisma.coinMangment.findUnique({
            where: {
                userId: BigInt(userIdStr), // Convert back to BigInt for Prisma query
            },
        });

        if (!coins) {
            throw new Error('Coins not found for the user');
        }

        // Convert result to strings
        const coinsStr = convertBigIntsToStrings(coins);

        return coinsStr;
    } catch (error: any) {
        throw new Error(`Failed to fetch coins balance: ${error.message}`);
    }
}
