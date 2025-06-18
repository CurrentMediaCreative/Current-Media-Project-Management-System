"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncHandler = exports.authorize = exports.authenticate = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const authenticate = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            res.status(401).json({ error: 'Authentication required' });
            return;
        }
        const decoded = (0, jsonwebtoken_1.verify)(token, process.env.JWT_SECRET);
        req.user = {
            userId: decoded.id,
            email: decoded.email,
            role: decoded.role
        };
        next();
    }
    catch (error) {
        console.error('Authentication error:', error);
        res.status(401).json({ error: 'Invalid token' });
    }
};
exports.authenticate = authenticate;
const authorize = (roles) => {
    return (req, res, next) => {
        try {
            const authReq = req;
            if (!roles.includes(authReq.user.role)) {
                res.status(403).json({ error: 'Insufficient permissions' });
                return;
            }
            next();
        }
        catch (error) {
            console.error('Authorization error:', error);
            res.status(401).json({ error: 'Invalid token' });
        }
    };
};
exports.authorize = authorize;
const asyncHandler = (fn) => {
    return (req, res, next) => {
        return Promise.resolve(fn(req, res, next)).catch(next);
    };
};
exports.asyncHandler = asyncHandler;
//# sourceMappingURL=authMiddleware.js.map