"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuthenticated = void 0;
const auth_exceptions_1 = require("../exceptions/auth.exceptions");
const jwt_1 = require("../helpers/jwt");
const isAuthenticated = (request, response, next) => {
    try {
        const { authorization } = request.headers;
        if (!authorization)
            throw new auth_exceptions_1.AuthorizationNotFound();
        const accessToken = authorization.split(" ")[1];
        const { id } = (0, jwt_1.verifyToken)(accessToken);
        request.current_user = id;
        return next();
    }
    catch (error) {
        return response.status((error === null || error === void 0 ? void 0 : error.code) || 403).json({ message: error.message });
    }
};
exports.isAuthenticated = isAuthenticated;
