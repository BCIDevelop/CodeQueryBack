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
const answers_validations_1 = __importDefault(require("../validations/answers.validations"));
const answers_controller_1 = __importDefault(require("../controllers/answers.controller"));
const auth_middlewares_1 = require("../middlewares/auth.middlewares");
class AnswerRouter {
    constructor() {
        this.router = (0, express_1.Router)();
    }
    init() {
        this.router.use(auth_middlewares_1.isAuthenticated);
        return this.router
            .get('/question/:question_id', answers_validations_1.default.listRecords(), this.all)
            .post('/', answers_validations_1.default.createRecord(), this.create)
            .get('/:id', this.getById)
            .patch('/:id', answers_validations_1.default.updateRecord(), this.updateById)
            .delete('/:id', this.deleteById)
            .get('/classroom/:classroom_id', answers_validations_1.default.listRecords(), this.allByClassroom)
            .get('/classroom/:classroom_id/student/:user_id', answers_validations_1.default.listRecords(), this.getScoreStudent);
    }
    allByClassroom(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const controllers = new answers_controller_1.default();
            controllers.listRecordsByClassrooms(req, res);
        });
    }
    all(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const controllers = new answers_controller_1.default();
            controllers.listRecords(req, res);
        });
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const controllers = new answers_controller_1.default();
            controllers.createRecords(req, res);
        });
    }
    getById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const controllers = new answers_controller_1.default();
            controllers.getRecordById(req, res);
        });
    }
    updateById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const controllers = new answers_controller_1.default();
            controllers.updateRecordById(req, res);
        });
    }
    deleteById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const controllers = new answers_controller_1.default();
            controllers.deleteRecordById(req, res);
        });
    }
    getScoreStudent(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const controllers = new answers_controller_1.default();
            controllers.listScoreStudent(req, res);
        });
    }
}
exports.default = new AnswerRouter();
