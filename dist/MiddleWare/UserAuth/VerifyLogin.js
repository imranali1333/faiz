"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureAuthenticated = ensureAuthenticated;
function ensureAuthenticated(req, res, next) {
    if (req.session.loggedIn) {
        next();
    }
    else {
        res.status(401).json({ message: 'Unauthorized' });
    }
}
