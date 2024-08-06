"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleCorsing = void 0;
const cors_1 = __importDefault(require("cors"));
const corsOptions = {
    origin: 'http://localhost:5173', // Replace with your frontend's origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};
const handleCorsing = (req, res, next) => {
    console.log('Handling CORS for:', req.url);
    (0, cors_1.default)(corsOptions)(req, res, next);
};
exports.handleCorsing = handleCorsing;
