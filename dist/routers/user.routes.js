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
const users_controller_1 = __importDefault(require("../controllers/users.controller"));
const express_1 = require("express");
const users_validations_1 = __importDefault(require("../validations/users.validations"));
/* import Validation from '../validations/users.validations' */
class UserRouter {
    constructor() {
        this.router = (0, express_1.Router)();
    }
    init() {
        return this.router
            .get('/', users_validations_1.default.listRecords(), this.all)
            .post('/', users_validations_1.default.createRecord(), this.create)
            .get('/:id', this.getById)
            .patch('/:id', this.updateById)
            .delete('/:id', this.deleteById);
    }
    all(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('entre');
            const controllers = new users_controller_1.default();
            controllers.listRecords(req, res);
        });
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const controllers = new users_controller_1.default();
            controllers.createRecords(req, res);
        });
    }
    getById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const controllers = new users_controller_1.default();
            controllers.getRecordById(req, res);
        });
    }
    updateById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const controllers = new users_controller_1.default();
            controllers.updateRecordById(req, res);
        });
    }
    deleteById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const controllers = new users_controller_1.default();
            controllers.deleteRecordById(req, res);
        });
    }
}
exports.default = new UserRouter();
