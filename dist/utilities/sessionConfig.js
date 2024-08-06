"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/sessionConfig.ts
const express_session_1 = __importDefault(require("express-session"));
const connect_pg_simple_1 = __importDefault(require("connect-pg-simple"));
const pg_1 = __importDefault(require("pg"));
// PostgreSQL client for connect-pg-simple
const pgPool = new pg_1.default.Pool({
    connectionString: process.env.DATABASE_URL,
});
// Session store using PostgreSQL
const PgStore = (0, connect_pg_simple_1.default)(express_session_1.default);
// Configure session middleware
const sessionMiddleware = (0, express_session_1.default)({
    store: new PgStore({
        pool: pgPool,
        tableName: 'sessions',
    }),
    secret: process.env.SECRET || 'default_secret', // Provide a fallback default value
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production', // Set to true if using HTTPS
    },
});
exports.default = sessionMiddleware;
