"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emitCoinsUpdated = emitCoinsUpdated;
const http_1 = __importDefault(require("http"));
const express_1 = __importDefault(require("express"));
const socket_io_1 = require("socket.io");
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server);
io.on('connection', (socket) => {
    console.log('A user connected');
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});
// Your other routes and middleware setup
// Emit Socket.IO event for balance update
function emitCoinsUpdated(userId, updatedBalance) {
    io.emit('coinsUpdated', {
        userId: userId,
        balance: updatedBalance,
    });
}
exports.default = server;
