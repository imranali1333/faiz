"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchUsersController = searchUsersController;
const SerchUserService_1 = require("../services/SerchUserService");
async function searchUsersController(req, res) {
    const query = req.query.q;
    const fieldsString = req.query.fields;
    if (!query || !fieldsString || query.trim() === '') {
        return res.status(202).json({
            success: false,
            result: [],
            message: "No document found by this request",
        });
    }
    const fieldsArray = fieldsString.split(',');
    try {
        const users = await (0, SerchUserService_1.searchUsers)(query, fieldsArray);
        if (users.length > 0) {
            return res.status(200).json({
                success: true,
                result: users,
                message: "Successfully found all documents",
            });
        }
        else {
            return res.status(202).json({
                success: false,
                result: [],
                message: "No document found by this request",
            });
        }
    }
    catch (error) {
        console.error('Error in searchUsersController:', error);
        return res.status(500).json({
            success: false,
            result: null,
            message: "Oops there is an Error",
        });
    }
}
