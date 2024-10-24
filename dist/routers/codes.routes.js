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
const codes_validations_1 = __importDefault(require("../validations/codes.validations"));
const codes_controller_1 = __importDefault(require("../controllers/codes.controller"));
const auth_middlewares_1 = require("../middlewares/auth.middlewares");
class CodeRouter {
    constructor() {
        this.router = (0, express_1.Router)();
    }
    init() {
        this.router.use(auth_middlewares_1.isAuthenticated);
        return this.router
            .post('/execute', codes_validations_1.default.executeCode(), this.listCodeExecuted);
    }
    listCodeExecuted(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const controllers = new codes_controller_1.default();
            controllers.getExecutedCode(req, res);
        });
    }
}
exports.default = new CodeRouter();
