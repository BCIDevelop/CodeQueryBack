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
const subscriptions_controller_1 = __importDefault(require("../controllers/subscriptions.controller"));
const auth_middlewares_1 = require("../middlewares/auth.middlewares");
const subscriptions_validations_1 = __importDefault(require("../validations/subscriptions.validations"));
class SubscriptionRouter {
    constructor() {
        this.router = (0, express_1.Router)();
    }
    init() {
        this.router.use(auth_middlewares_1.isAuthenticated);
        return this.router
            .get('/', subscriptions_validations_1.default.listRecords(), this.listRecords)
            .post('/', subscriptions_validations_1.default.createRecord(), this.createRecord);
    }
    listRecords(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const controller = new subscriptions_controller_1.default();
            yield controller.getRecords(req, res);
        });
    }
    createRecord(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const controller = new subscriptions_controller_1.default();
            yield controller.createRecord(req, res);
        });
    }
}
exports.default = new SubscriptionRouter();
