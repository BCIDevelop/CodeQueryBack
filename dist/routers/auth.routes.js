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
const express_1 = require("express");
const auth_validations_1 = __importDefault(require("../validations/auth.validations"));
const auth_controller_1 = __importDefault(require("../controllers/auth.controller"));
const passportFB_middleware_1 = require("../middlewares/passportFB.middleware");
const passportGmail_middleware_1 = require("../middlewares/passportGmail.middleware");
class AuthRouter {
    constructor() {
        this.router = (0, express_1.Router)();
    }
    init() {
        return this.router
            .post("/signIn", auth_validations_1.default.signIn(), this.signIn)
            .post("/refresh_token", auth_validations_1.default.refreshtoken(), this.refreshToken)
            .post("/reset_password", auth_validations_1.default.resetPassword(), this.resetPassword)
            .post("/signUp", auth_validations_1.default.signUp(), this.signUp)
            .patch("/confirm", auth_validations_1.default.confirmAccount(), this.confirmAccount)
            /* Facebook OAuth */
            .get("/facebook", (req, res, next) => (0, passportFB_middleware_1.passportFBConfiguration)(req, res, next))
            .get('/facebook/callback', (req, res, next) => (0, passportFB_middleware_1.passportFBCallback)(req, res, next))
            .get("/gmail", (req, res, next) => (0, passportGmail_middleware_1.passportGmailConfiguration)(req, res, next))
            .get('/gmail/callback', (req, res, next) => (0, passportGmail_middleware_1.passportGmailCallback)(req, res, next));
    }
    confirmAccount(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const controller = new auth_controller_1.default();
            controller.confirmAccount(req, res);
        });
    }
    signIn(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const controller = new auth_controller_1.default();
            controller.signIn(req, res);
        });
    }
    signUp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const controller = new auth_controller_1.default();
            controller.signUp(req, res);
        });
    }
    refreshToken(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const controller = new auth_controller_1.default();
            controller.refreshToken(req, res);
        });
    }
    resetPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const controller = new auth_controller_1.default();
            controller.resetPassword(req, res);
        });
    }
}
exports.default = new AuthRouter();
