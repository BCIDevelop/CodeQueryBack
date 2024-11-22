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
const auth_middlewares_1 = require("../middlewares/auth.middlewares");
const payments_controller_1 = __importDefault(require("../controllers/payments.controller"));
const payments_validations_1 = __importDefault(require("../validations/payments.validations"));
class PaymentRouter {
    constructor() {
        this.router = (0, express_1.Router)();
    }
    init() {
        return this.router
            .post('/checkout', payments_validations_1.default.createCheckout(), auth_middlewares_1.isAuthenticated, this.getCheckout)
            .post('/webhook', this.getWebhook)
            .get('/customerPortal', auth_middlewares_1.isAuthenticated, this.getCustomerPortal);
    }
    getCheckout(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const controller = new payments_controller_1.default();
            yield controller.getCheckOut(req, res);
        });
    }
    getWebhook(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const controller = new payments_controller_1.default();
            yield controller.getWebhook(req, res);
        });
    }
    getCustomerPortal(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const controller = new payments_controller_1.default();
            yield controller.getCustomerPortal(req, res);
        });
    }
}
exports.default = new PaymentRouter();
