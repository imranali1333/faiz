"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchUsers = searchUsers;
const prismaclient_1 = __importDefault(require("../../utilities/prismaclient"));
// services/userService.ts
async function searchUsers(query, fields) {
    // Construct search criteria based on fields
    const searchCriteria = {
        OR: fields.map(field => ({
            [field]: {
                contains: query,
                mode: 'insensitive',
            },
        })),
    };
    try {
        // Query the user model based on criteria
        const users = await prismaclient_1.default.user.findMany({
            where: searchCriteria,
            orderBy: { firstName: 'asc' }, // Order results by first name
            take: 10, // Limit results to 10
        });
        return users;
    }
    catch (error) {
        console.error('Error searching for users:', error);
        throw new Error('Error searching for users');
    }
}
