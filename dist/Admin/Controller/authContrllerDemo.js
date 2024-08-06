"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginDemo = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: '.variables.env' });
const loginDemo = async (req, res) => {
    try {
        const { email, password } = req.body;
        // validate
        if (!email || !password)
            return res.status(400).json({ msg: "Not all fields have been entered." });
        const token = jsonwebtoken_1.default.sign({
            exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
            id: "60b4e282eb314b0015faf2a9",
        }, process.env.JWT_SECRET);
        res.json({
            success: true,
            result: {
                token,
                admin: {
                    id: "60b4e282eb314b0015faf2a9",
                    name: "admin",
                    isLoggedIn: true,
                },
            },
            message: "Successfully logged in admin",
        });
    }
    catch (err) {
        res
            .status(500)
            .json({ success: false, result: null, message: err.message });
    }
};
exports.loginDemo = loginDemo;
