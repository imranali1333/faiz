import { Request, Response } from 'express';
import prisma from '../../utilities/prismaclient';
import { convertBigIntsToStrings } from '../../utils/bigIntUtils';

export async function getAllUsers(req: Request, res: Response): Promise<Response> {
  // Retrieve pagination parameters
  const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
  const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
  const skip = (page - 1) * limit;

  console.log(`Page: ${page}, Limit: ${limit}, Skip: ${skip}`); // Debug logging

  try {
    // Query users with pagination and include related messages
    const users = await prisma.user.findMany({
      skip,
      take: limit,
      orderBy: { id: 'desc' }, // Assuming 'id' is the primary key for ordering
      select: {
        id: true,
        telegramId: true,
        isBot: true,
        firstName: true,
        lastName: true,
        username: true,
        languageCode: true,
        messagesSent: {
          select: {
            id: true,
            messageId: true,
            date: true,
            text: true,
          },
        },
      },
    });

    // console.log(`Fetched Users: ${JSON.stringify(users)}`); // Debug logging

    // Convert BigInts to strings
    const usersWithBigIntFixed = convertBigIntsToStrings(users);

    // Count total users
    const count = await prisma.user.count();

    // Calculate total pages
    const pages = Math.ceil(count / limit);

    // Construct pagination object
    const pagination = { page, pages, count };

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        result: [],
        pagination,
        message: 'No users found',
      });
    }

    return res.status(200).json({
      success: true,
      result: usersWithBigIntFixed,
      pagination,
      message: 'Successfully found all users',
    });
  } catch (error) {
    console.error('Error retrieving users:', error);
    return res.status(500).json({
      success: false,
      result: [],
      message: 'Internal Server Error',
    });
  }
}
