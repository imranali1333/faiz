"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emitCoinsUpdated = emitCoinsUpdated;
const socket_io_1 = require("socket.io");
const http_1 = __importDefault(require("http"));
const server = http_1.default.createServer();
const io = new socket_io_1.Server(server);
io.on('connection', (socket) => {
    console.log('A user connected');
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});
function emitCoinsUpdated(userId, updatedBalance) {
    io.emit('coinsUpdated', {
        userId: userId,
        balance: updatedBalance,
    });
}
exports.default = server;
