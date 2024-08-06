"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAdmin = exports.read = exports.profile = exports.update = exports.updatePassword = exports.search = exports.list = exports.create = void 0;
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma = new client_1.PrismaClient();
const create = async (req, res) => {
    try {
        const { email, password, name, surname } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                result: null,
                message: "Email or password fields they don't have been entered.",
            });
        }
        const existingAdmin = await prisma.admin.findUnique({ where: { email } });
        if (existingAdmin) {
            return res.status(400).json({
                success: false,
                result: null,
                message: "An account with this email already exists.",
            });
        }
        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                result: null,
                message: "The password needs to be at least 8 characters long.",
            });
        }
        const passwordHash = await bcryptjs_1.default.hash(password, 10);
        const result = await prisma.admin.create({
            data: {
                email,
                password: passwordHash,
                name,
                surname,
                enabled: true,
            },
        });
        return res.status(200).send({
            success: true,
            result: {
                id: result.id,
                enabled: result.enabled,
                email: result.email,
                name: result.name,
                surname: result.surname,
            },
            message: "Admin document saved correctly",
        });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: "There is an error" });
    }
};
exports.create = create;
const list = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.items) || 10;
    const skip = (page - 1) * limit;
    try {
        // Query the database for a list of all results
        const [result, count] = await Promise.all([
            prisma.admin.findMany({
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            prisma.admin.count(),
        ]);
        // Calculating total pages
        const pages = Math.ceil(count / limit);
        // Getting Pagination Object
        const pagination = { page, pages, count };
        if (count > 0) {
            // Remove password from the result
            const sanitizedResult = result.map(user => {
                const { password, ...rest } = user;
                return rest;
            });
            return res.status(200).json({
                success: true,
                result: sanitizedResult,
                pagination,
                message: "Successfully found all documents",
            });
        }
        else {
            return res.status(203).json({
                success: false,
                result: [],
                pagination,
                message: "Collection is Empty",
            });
        }
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            result: [],
            message: "Oops there is an Error",
        });
    }
};
exports.list = list;
const search = async (req, res) => {
    try {
        const query = req.query.q;
        if (typeof query !== 'string' || query.trim() === '') {
            return res.status(202).json({
                success: false,
                result: [],
                message: 'No document found by this request',
            }).end();
        }
        const fieldsArray = req.query.fields.split(',');
        const orConditions = fieldsArray.map((field) => ({
            [field]: { contains: query, mode: 'insensitive' },
        }));
        const result = await prisma.admin.findMany({
            where: {
                removed: false,
                OR: orConditions,
            },
            orderBy: {
                name: 'asc',
            },
            take: 10,
        });
        if (result.length >= 1) {
            return res.status(200).json({
                success: true,
                result,
                message: 'Successfully found all documents',
            });
        }
        else {
            return res.status(202).json({
                success: false,
                result: [],
                message: 'No document found by this request',
            });
        }
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            result: [],
            message: 'Oops there is an Error',
        });
    }
};
exports.search = search;
const updatePassword = async (req, res) => {
    try {
        const { password } = req.body;
        if (!password) {
            return res.status(400).json({ msg: 'Not all fields have been entered.' });
        }
        if (password.length < 8) {
            return res.status(400).json({
                msg: 'The password needs to be at least 8 characters long.',
            });
        }
        const salt = bcryptjs_1.default.genSaltSync();
        const passwordHash = bcryptjs_1.default.hashSync(password, salt);
        // Find document by id and update with the required fields
        const result = await prisma.admin.update({
            where: { id: Number(req.params.id) },
            data: { password: passwordHash },
        });
        if (!result) {
            return res.status(404).json({
                success: false,
                result: null,
                message: 'No document found by this id: ' + req.params.id,
            });
        }
        return res.status(200).json({
            success: true,
            result: {
                id: result.id,
                enabled: result.enabled,
                email: result.email,
                name: result.name,
                surname: result.surname,
            },
            message: 'We updated the password for this id: ' + req.params.id,
        });
    }
    catch (error) {
        // Server Error
        return res.status(500).json({
            success: false,
            result: null,
            message: 'Oops there is an Error',
        });
    }
};
exports.updatePassword = updatePassword;
const update = async (req, res) => {
    try {
        const { email, role } = req.body;
        if (email) {
            const existingAdmin = await prisma.admin.findUnique({ where: { email } });
            if (existingAdmin && existingAdmin.id !== Number(req.params.id)) {
                return res.status(400).json({ message: 'An account with this email already exists.' });
            }
        }
        const updates = {};
        if (role) {
            updates.role = role;
        }
        if (email) {
            updates.email = email;
        }
        // Find document by id and update with the required fields
        const result = await prisma.admin.update({
            where: { id: Number(req.params.id) },
            data: updates,
        });
        if (!result) {
            return res.status(404).json({
                success: false,
                result: null,
                message: 'No document found by this id: ' + req.params.id,
            });
        }
        return res.status(200).json({
            success: true,
            result: {
                id: result.id,
                enabled: result.enabled,
                email: result.email,
                name: result.name,
                surname: result.surname,
            },
            message: 'We updated this document by this id: ' + req.params.id,
        });
    }
    catch (error) {
        // Server Error
        return res.status(500).json({
            success: false,
            result: null,
            message: 'Oops there is an Error',
        });
    }
};
exports.update = update;
const profile = async (req, res) => {
    try {
        if (!req.admin) {
            return res.status(404).json({
                success: false,
                result: null,
                message: "Couldn't find admin profile",
            });
        }
        const result = {
            id: req.admin.id,
            enabled: req.admin.enabled,
            email: req.admin.email,
            name: req.admin.name,
            surname: req.admin.surname,
        };
        return res.status(200).json({
            success: true,
            result,
            message: 'Successfully found profile',
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            result: null,
            message: 'Oops there is an error',
        });
    }
};
exports.profile = profile;
const read = async (req, res) => {
    try {
        // Find document by id
        const tmpResult = await prisma.admin.findUnique({
            where: { id: Number(req.params.id) },
        });
        // If no results found, return document not found
        if (!tmpResult) {
            return res.status(404).json({
                success: false,
                result: null,
                message: 'No document found by this id: ' + req.params.id,
            });
        }
        else {
            // Return success response
            const result = {
                id: tmpResult.id,
                enabled: tmpResult.enabled,
                email: tmpResult.email,
                name: tmpResult.name,
                surname: tmpResult.surname,
            };
            return res.status(200).json({
                success: true,
                result,
                message: 'We found this document by this id: ' + req.params.id,
            });
        }
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            result: null,
            message: 'Oops there is an error',
        });
    }
};
exports.read = read;
const deleteAdmin = async (req, res) => {
    try {
        // Update the 'removed' field to true
        const updates = {
            removed: true,
        };
        // Find the document by id and update the 'removed' field
        const result = await prisma.admin.delete({
            where: { id: Number(req.params.id) }
        });
        // If no results found, return document not found
        if (!result) {
            return res.status(404).json({
                success: false,
                result: null,
                message: 'No document found by this id: ' + req.params.id,
            });
        }
        else {
            return res.status(200).json({
                success: true,
                result,
                message: 'Successfully deleted the document by id: ' + req.params.id,
            });
        }
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            result: null,
            message: 'Oops there is an error',
        });
    }
};
exports.deleteAdmin = deleteAdmin;
