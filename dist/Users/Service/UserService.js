"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userAuthentication = userAuthentication;
const prismaclient_1 = __importDefault(require("../../utilities/prismaclient"));
async function userAuthentication(authData) {
    try {
        // Ensure required fields are present and provide defaults for optional fields
        const { id, first_name, last_name = '', username = '', photo_url = '', auth_date, phone_number = '', // Default to empty if not provided
        telegramId, hash, language_code = '', // Default to empty if not provided
        is_bot = false // Default to false if not provided
         } = authData;
        // Log the incoming data for debugging
        console.log('AuthData:', authData);
        await prismaclient_1.default.userTeleGram.upsert({
            where: { telegramId: telegramId },
            update: {
                firstName: first_name.slice(0, 64), // Ensure length fits
                lastName: last_name.slice(0, 64), // Ensure length fits
                telegramUsername: username.slice(0, 64), // Ensure length fits
                profilePicture: photo_url.slice(0, 128), // Ensure length fits
                authDate: auth_date.slice(0, 32), // Ensure length fits
                phoneNumber: phone_number.slice(0, 32), // Ensure length fits
                languageCode: language_code.slice(0, 16), // Ensure length fits
                isBot: is_bot, // Use provided value or default
                lastLogin: new Date(), // Set the last login to now
                hash
            },
            create: {
                telegramId: telegramId.slice(0, 32), // Ensure length fits
                firstName: first_name.slice(0, 64), // Ensure length fits
                lastName: last_name.slice(0, 64), // Ensure length fits
                telegramUsername: username.slice(0, 64), // Ensure length fits
                profilePicture: photo_url.slice(0, 128), // Ensure length fits
                authDate: auth_date.slice(0, 32), // Ensure length fits
                phoneNumber: phone_number.slice(0, 32), // Ensure length fits
                languageCode: language_code.slice(0, 16), // Ensure length fits
                isBot: is_bot, // Use provided value or default
                hash
            },
        });
        console.log('User authentication successful');
    }
    catch (error) {
        console.error('Error in userAuthentication:', error);
        throw error; // Optionally handle the error or rethrow
    }
}
//  export async function userAuthentication(authData: AuthData): Promise<void> {
//   try {
//     // Define maximum allowed lengths based on schema
//     const MAX_LENGTHS = {
//       firstName: 64,
//       lastName: 64,
//       telegramId: 32,
//       telegramUsername: 64,
//       profilePicture: 128,
//       phoneNumber: 32,
//       authDate: 16, // Adjust this based on the updated schema
//     };
//     // Truncate values to fit schema constraints
//     const truncatedData: AuthData = {
//       first_name: authData.first_name?.slice(0, MAX_LENGTHS.firstName),
//       last_name: authData.last_name?.slice(0, MAX_LENGTHS.lastName),
//       telegramId: authData.telegramId.slice(0, MAX_LENGTHS.telegramId),
//       username: authData.username?.slice(0, MAX_LENGTHS.telegramUsername),
//       photo_url: authData.photo_url?.slice(0, MAX_LENGTHS.profilePicture),
//       phone_number: authData.phone_number?.slice(0, MAX_LENGTHS.phoneNumber),
//       auth_date: authData.auth_date?.slice(0, MAX_LENGTHS.authDate),
//     };
//     await prisma.userTeleGram.upsert({
//       where: { telegramId: truncatedData.telegramId },
//       update: {
//         firstName: truncatedData.first_name,
//         lastName: truncatedData.last_name,
//         telegramUsername: truncatedData.username,
//         profilePicture: truncatedData.photo_url,
//         authDate: truncatedData.auth_date,
//         phoneNumber: truncatedData.phone_number,
//       },
//       create: {
//         firstName: truncatedData.first_name,
//         lastName: truncatedData.last_name,
//         telegramId: truncatedData.telegramId,
//         telegramUsername: truncatedData.username,
//         profilePicture: truncatedData.photo_url,
//         authDate: truncatedData.auth_date,
//         phoneNumber: truncatedData.phone_number,
//       },
//     });
//   } catch (error) {
//     console.error('Error in userAuthentication:', error);
//     throw error;
//   }
// }
