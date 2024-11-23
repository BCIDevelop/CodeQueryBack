"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const health_controller_1 = __importDefault(require("../controllers/health.controller"));
class HealthRouter {
    constructor() {
        this.router = (0, express_1.Router)();
    }
    init() {
        return this.router.get('/', this.success);
    }
    success(req, res) {
        const controller = new health_controller_1.default();
        controller.check(req, res);
    }
}
exports.default = new HealthRouter();
