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
const chats_validations_1 = __importDefault(require("../validations/chats.validations"));
const chats_controller_1 = __importDefault(require("../controllers/chats.controller"));
const auth_middlewares_1 = require("../middlewares/auth.middlewares");
class ChatRouter {
    constructor() {
        this.router = (0, express_1.Router)();
    }
    init() {
        this.router.use(auth_middlewares_1.isAuthenticated);
        return this.router
            .get('/', chats_validations_1.default.listRecords(), this.all)
            .post('/', chats_validations_1.default.createRecords(), this.create)
            .delete('/receiver/:id', this.delete);
    }
    all(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const controllers = new chats_controller_1.default();
            controllers.listRecords(req, res);
        });
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const controllers = new chats_controller_1.default();
            controllers.createRecords(req, res);
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const controllers = new chats_controller_1.default();
            controllers.deleteRecordById(req, res);
        });
    }
}
exports.default = new ChatRouter();
