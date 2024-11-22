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
const tags_controller_1 = __importDefault(require("../controllers/tags.controller"));
const tags_validation_1 = __importDefault(require("../validations/tags.validation"));
const auth_middlewares_1 = require("../middlewares/auth.middlewares");
class TagRouter {
    constructor() {
        this.router = (0, express_1.Router)();
    }
    init() {
        this.router.use(auth_middlewares_1.isAuthenticated);
        return this.router
            .get("/", tags_validation_1.default.listRecords(), this.all)
            .get('/:id', this.getById)
            .post('/', tags_validation_1.default.createRecord(), this.create);
    }
    all(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const controller = new tags_controller_1.default();
            yield controller.listRecords(req, res);
        });
    }
    getById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const controller = new tags_controller_1.default();
            yield controller.getRecordById(req, res);
        });
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const controller = new tags_controller_1.default();
            yield controller.createRecord(req, res);
        });
    }
}
exports.default = new TagRouter();
