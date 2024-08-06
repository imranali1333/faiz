"use strict";
// register, login, isValidToken, and logout functions in 
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.isValidTokens = exports.isValidToken = exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const prismaclient_1 = __importDefault(require("../../utilities/prismaclient"));
dotenv_1.default.config({ path: '.variables.env' });
const register = async (req, res) => {
    try {
        let { email, password, passwordCheck, name, surname } = req.body;
        if (!email || !password || !passwordCheck)
            return res.status(400).json({ msg: 'Not all fields have been entered.' });
        if (password.length < 5)
            return res.status(400).json({ msg: 'The password needs to be at least 5 characters long.' });
        if (password !== passwordCheck)
            return res.status(400).json({ msg: 'Enter the same password twice for verification.' });
        const existingAdmin = await prismaclient_1.default.admin.findUnique({ where: { email } });
        if (existingAdmin)
            return res.status(400).json({ msg: 'An account with this email already exists.' });
        if (!name)
            name = email;
        const salt = await bcryptjs_1.default.genSalt();
        const passwordHash = await bcryptjs_1.default.hash(password, salt);
        const newAdmin = await prismaclient_1.default.admin.create({
            data: {
                email,
                password: passwordHash,
                name,
                surname,
            },
        });
        res.status(200).send({
            success: true,
            admin: {
                id: newAdmin.id,
                name: newAdmin.name,
                surname: newAdmin.surname,
            },
        });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            result: null,
            message: err.message,
        });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        // validate
        if (!email || !password)
            return res.status(400).json({ msg: 'Not all fields have been entered.' });
        const admin = await prismaclient_1.default.admin.findUnique({ where: { email } });
        if (!admin)
            return res.status(400).json({
                success: false,
                result: null,
                message: 'No account with this email has been registered.',
            });
        const isMatch = await bcryptjs_1.default.compare(password, admin.password);
        if (!isMatch)
            return res.status(400).json({
                success: false,
                result: null,
                message: 'Invalid credentials.',
            });
        const token = jsonwebtoken_1.default.sign({
            exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
            id: admin.id,
        }, process.env.JWT_SECRET);
        const result = await prismaclient_1.default.admin.update({
            where: { id: admin.id },
            data: { isLoggedIn: true },
        });
        res.json({
            success: true,
            result: {
                token,
                admin: {
                    id: result.id,
                    name: result.name,
                    isLoggedIn: result.isLoggedIn,
                },
            },
            message: 'Successfully logged in admin',
        });
    }
    catch (err) {
        res.status(500).json({ success: false, result: null, message: err.message });
    }
};
exports.login = login;
const isValidToken = async (req, res, next) => {
    try {
        const token = req.header('x-auth-token');
        if (!token)
            return res.status(401).json({
                success: false,
                result: null,
                message: 'Wrong or No authentication token, authorization denied.',
                jwtExpired: true,
            });
        const verified = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        if (!verified)
            return res.status(401).json({
                success: false,
                result: null,
                message: 'Token verification failed, authorization denied.',
                jwtExpired: true,
            });
        const admin = await prismaclient_1.default.admin.findUnique({ where: { id: verified.id } });
        if (!admin)
            return res.status(401).json({
                success: false,
                result: null,
                message: "Admin doesn't exist, authorization denied.",
                jwtExpired: true,
            });
        if (!admin.isLoggedIn)
            return res.status(401).json({
                success: false,
                result: null,
                message: 'Admin is already logged out, try to login, authorization denied.',
                jwtExpired: true,
            });
        // @ts-ignore
        req.admin = admin;
        next();
    }
    catch (err) {
        res.status(500).json({
            success: false,
            result: null,
            message: err.message,
            jwtExpired: true,
        });
    }
};
exports.isValidToken = isValidToken;
const isValidTokens = async (req, res, next) => {
    try {
        const token = req.header('x-auth-token');
        if (!token) {
            return res.status(401).json({
                success: false,
                result: null,
                message: 'Wrong or No authentication token, authorization denied.',
                jwtExpired: true,
            });
        }
        const verified = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        if (!verified) {
            return res.status(401).json({
                success: false,
                result: null,
                message: 'Token verification failed, authorization denied.',
                jwtExpired: true,
            });
        }
        const admin = await prismaclient_1.default.admin.findUnique({ where: { id: verified.id } });
        if (!admin) {
            return res.status(401).json({
                success: false,
                result: null,
                message: "Admin doesn't exist, authorization denied.",
                jwtExpired: true,
            });
        }
        if (!admin.isLoggedIn) {
            return res.status(401).json({
                success: false,
                result: null,
                message: 'Admin is already logged out, try to login, authorization denied.',
                jwtExpired: true,
            });
        }
        // @ts-ignore
        req.adminId = admin.id;
        next();
    }
    catch (err) {
        res.status(500).json({
            success: false,
            result: null,
            message: err.message,
            jwtExpired: true,
        });
    }
};
exports.isValidTokens = isValidTokens;
const logout = async (req, res) => {
    try {
        const result = await prismaclient_1.default.admin.update({
            // @ts-ignore
            where: { id: req.admin.id },
            data: { isLoggedIn: false },
        });
        res.status(200).json({ isLoggedIn: result.isLoggedIn });
    }
    catch (err) {
        res.status(500).json({
            success: false,
            result: null,
            message: err.message,
        });
    }
};
exports.logout = logout;
