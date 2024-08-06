"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productionErrors = exports.developmentErrors = exports.notFound = void 0;
const notFound = (req, res, next) => {
    res.status(404).json({ error: 'Not Found' });
};
exports.notFound = notFound;
const developmentErrors = (err, req, res, next) => {
    res.status(500).json({
        message: err.message,
        error: err,
    });
};
exports.developmentErrors = developmentErrors;
const productionErrors = (err, req, res, next) => {
    res.status(500).json({
        message: 'An unexpected error occurred',
    });
};
exports.productionErrors = productionErrors;
