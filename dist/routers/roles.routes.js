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
const roles_controller_1 = __importDefault(require("../controllers/roles.controller"));
const roles_validations_1 = __importDefault(require("../validations/roles.validations"));
const auth_middlewares_1 = require("../middlewares/auth.middlewares");
class RoleRouter {
    constructor() {
        this.router = (0, express_1.Router)();
    }
    init() {
        this.router.use(auth_middlewares_1.isAuthenticated);
        return this.router
            .get("/", this.all)
            .post("/", roles_validations_1.default.createRecord(), this.create)
            .get('/:id', this.getById)
            .patch('/:id', roles_validations_1.default.updateRecord(), this.updateById)
            .delete('/:id', this.deleteById);
    }
    //listado
    all(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const controller = new roles_controller_1.default();
            yield controller.listRecords(req, res);
        });
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const controller = new roles_controller_1.default();
            yield controller.createRecord(req, res);
        });
    }
    getById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const controller = new roles_controller_1.default();
            yield controller.getRecordById(req, res);
        });
    }
    updateById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const controller = new roles_controller_1.default();
            yield controller.updateRecordById(req, res);
        });
    }
    deleteById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const controller = new roles_controller_1.default();
            yield controller.deleteRecordById(req, res);
        });
    }
}
exports.default = new RoleRouter();
