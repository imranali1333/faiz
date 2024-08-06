// controllers/userController.ts
import { Request, Response } from 'express';
import { searchUsers } from '../services/SerchUserService';

export async function searchUsersController(req: Request, res: Response): Promise<Response> {
  const query = req.query.q as string;
  const fieldsString = req.query.fields as string;

  if (!query || !fieldsString || query.trim() === '') {
    return res.status(202).json({
      success: false,
      result: [],
      message: "No document found by this request",
    });
  }

  const fieldsArray = fieldsString.split(',');

  try {
    const users = await searchUsers(query, fieldsArray);

    if (users.length > 0) {
      return res.status(200).json({
        success: true,
        result: users,
        message: "Successfully found all documents",
      });
    } else {
      return res.status(202).json({
        success: false,
        result: [],
        message: "No document found by this request",
      });
    }
  } catch (error) {
    console.error('Error in searchUsersController:', error);
    return res.status(500).json({
      success: false,
      result: null,
      message: "Oops there is an Error",
    });
  }
}
