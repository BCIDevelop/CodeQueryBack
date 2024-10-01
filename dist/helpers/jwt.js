"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.createTokens = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const auth_1 = __importDefault(require("../config/auth"));
const createTokens = (payload) => {
    const { secretKey, accessExpire, refreshExpire } = auth_1.default;
    const accessToken = (0, jsonwebtoken_1.sign)(payload, secretKey, { expiresIn: accessExpire });
    const refreshToken = (0, jsonwebtoken_1.sign)(Object.assign(Object.assign({}, payload), { refresh: true }), secretKey, { expiresIn: refreshExpire });
    return {
        accessToken,
        refreshToken
    };
};
exports.createTokens = createTokens;
const verifyToken = (token) => {
    return (0, jsonwebtoken_1.verify)(token, auth_1.default.secretKey);
};
exports.verifyToken = verifyToken;
