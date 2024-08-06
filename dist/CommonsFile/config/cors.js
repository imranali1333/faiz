"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.corsForUserFrontEnd = exports.corsForAdmin = void 0;
const cors_1 = __importDefault(require("cors"));
const corsForAdmin = (req, res, next) => {
    const origin = req.get('Origin');
    if (origin === 'http://localhost:3000') {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Credentials', 'true');
        res.header('Access-Control-Allow-Methods', 'GET,PATCH,PUT,POST,DELETE');
        res.header('Access-Control-Expose-Headers', 'Content-Length');
        res.header('Access-Control-Allow-Headers', 'Accept, Authorization, x-auth-token, Content-Type, X-Requested-With, Range');
        if (req.method === 'OPTIONS') {
            return res.sendStatus(200);
        }
    }
    next();
};
exports.corsForAdmin = corsForAdmin;
const corsForUserFrontEnd = (0, cors_1.default)({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
});
exports.corsForUserFrontEnd = corsForUserFrontEnd;
