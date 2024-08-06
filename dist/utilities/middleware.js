"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleCors = exports.setLocals = void 0;
// Middleware to set response locals
const setLocals = (req, res, next) => {
    res.locals.admin = req.adminId || null;
    res.locals.currentPath = req.path;
    next();
};
exports.setLocals = setLocals;
// Middleware for handling CORS
const handleCors = (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Methods", "GET,PATCH,PUT,POST,DELETE");
    res.header("Access-Control-Expose-Headers", "Content-Length");
    res.header("Access-Control-Allow-Headers", "Accept, Authorization,x-auth-token, Content-Type, X-Requested-With, Range");
    if (req.method === "OPTIONS") {
        return res.sendStatus(200);
    }
    else {
        return next();
    }
};
exports.handleCors = handleCors;
