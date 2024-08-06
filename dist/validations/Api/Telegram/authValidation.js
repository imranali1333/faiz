"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authSchema = void 0;
// src/validation/authValidation.ts
const joi_1 = __importDefault(require("joi"));
exports.authSchema = joi_1.default.object({
    id: joi_1.default.string().required(),
    first_name: joi_1.default.string().required(),
    last_name: joi_1.default.string().optional(),
    username: joi_1.default.string().optional(),
    photo_url: joi_1.default.string().optional(),
    auth_date: joi_1.default.string().required(),
    hash: joi_1.default.string().required(),
});
