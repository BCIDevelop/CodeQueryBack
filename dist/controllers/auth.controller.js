"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = __importDefault(require("../models"));
const users_exceptions_1 = require("../exceptions/users.exceptions");
const jwt_1 = require("../helpers/jwt");
const generate_password_1 = require("generate-password");
const mail_provider_1 = __importDefault(require("../providers/mail.provider"));
class AuthController {
    constructor() {
        this.model = models_1.default.users;
    }
    signIn(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const record = yield this.model.findOne({
                    where: {
                        email
                    }
                });
                // Usuario no existe
                if (!record)
                    throw new users_exceptions_1.UserNotFound();
                //Usario inhabilitado
                if (!record.active_status)
                    throw new users_exceptions_1.UserInactive();
                //Contra incorrecta
                const validatePassword = yield record.validatePassword(password);
                if (!validatePassword)
                    throw new users_exceptions_1.UserIncorretPassword();
                return res.status(200).json((0, jwt_1.createTokens)({ id: record.id }));
            }
            catch (error) {
                return res.status((error === null || error === void 0 ? void 0 : error.code) || 500).json({ message: error.message });
            }
        });
    }
    signUp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { body } = req;
                const email = body.email;
                const record = this.model.build(body);
                yield record.hashPassword();
                yield record.save();
                yield mail_provider_1.default.send(email, "Please confirm you account", `Confirm you account : <button> Confirm account </button>`);
                return res.status(201).json({ record });
            }
            catch (error) {
                return res.status((error === null || error === void 0 ? void 0 : error.code) || 500).json({ message: error.message });
            }
        });
    }
    refreshToken(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { refresh_token } = req.body;
                const resultToken = (0, jwt_1.verifyToken)(refresh_token);
                const { id } = (0, jwt_1.verifyToken)(refresh_token);
                const { accessToken } = (0, jwt_1.createTokens)({ id });
                return res.status(200).json({ accessToken });
            }
            catch (error) {
                return res.status((error === null || error === void 0 ? void 0 : error.code) || 500).json({ message: error.message });
            }
        });
    }
    resetPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                const record = yield this.model.findOne({
                    where: {
                        email
                    }
                });
                if (!record)
                    throw new users_exceptions_1.UserNotFound();
                if (!record.status)
                    throw new users_exceptions_1.UserInactive();
                const newPassword = (0, generate_password_1.generate)({ length: 8, numbers: true, symbols: true });
                record.password = newPassword;
                yield record.hashPassword();
                yield mail_provider_1.default.resetPassword(email, newPassword);
                record.save();
                return res.status(200).json({ message: 'Reset password' });
            }
            catch (error) {
                return res.status((error === null || error === void 0 ? void 0 : error.code) || 500).json({ message: error.message });
            }
        });
    }
}
exports.default = AuthController;
/* if(pm.response.code===200){
    pm.enviroment.set('access_token',pm.response.json().access_token)
} */ 
