"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_session_1 = __importDefault(require("express-session"));
const { PrismaSessionStore } = require('@quixo3/prisma-session-store');
const prismaclient_1 = __importDefault(require("./prismaclient"));
const Middlewaresession = (0, express_session_1.default)({
    cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
    },
    secret: process.env.SESSION_SECRET || 'your-secret',
    resave: false,
    saveUninitialized: true,
    store: new PrismaSessionStore(prismaclient_1.default, {
        checkPeriod: 2 * 60 * 1000, // 2 minutes
        dbRecordIdIsSessionId: true,
        dbRecordIdFunction: undefined,
    }),
});
exports.default = Middlewaresession;
