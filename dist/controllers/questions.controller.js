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
const models_1 = __importDefault(require("../models"));
const pagination_1 = require("../helpers/pagination");
const questions_exceptions_1 = require("../exceptions/questions.exceptions");
const sequelize_1 = require("sequelize");
class ClassroomController {
    constructor() {
        this.model = models_1.default.questions;
    }
    listRecords(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { page, per_page } = req.query;
                const { limit, offset } = (0, pagination_1.paginationField)(Number(page), Number(per_page));
                const { id } = req.params;
                const records = yield this.model.findAndCountAll({
                    limit,
                    offset,
                    attributes: {
                        exclude: ['user_id', 'classroom_id'],
                    },
                    where: {
                        classroom_id: id,
                        status: {
                            [sequelize_1.Op.ne]: 'SOLVED'
                        }
                    },
                    order: [
                        ['id', 'ASC']
                    ],
                    include: [{
                            model: models_1.default.users,
                            attributes: ['id', 'name', 'last_name', 'avatar', 'rol_id']
                        }]
                });
                return res.status(200).json((0, pagination_1.paginatioResults)(records, Number(page), Number(per_page)));
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    createRecords(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const transaction = yield this.model.sequelize.transaction();
                console.log(req.body);
                req.body.user_id = req.current_user;
                const record = this.model.build(req.body);
                yield record.save();
                if (req.body.tagIds) {
                    yield record.addTags(req.body.tags, { transaction });
                }
                yield transaction.commit();
                return res.status(201).json(record);
            }
            catch (error) {
                return res.status(500).json({ message: error.message });
            }
        });
    }
    getRecordById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const record = yield this.model.findOne({
                    attributes: {
                        exclude: ['owner_id']
                    },
                    where: {
                        [sequelize_1.Op.and]: [
                            { owner_id: req.current_user },
                            { id }
                        ]
                    }
                });
                if (!record)
                    throw new questions_exceptions_1.QuestionNotFound();
                return res.status(200).json(record);
            }
            catch (error) {
                return res.status((error === null || error === void 0 ? void 0 : error.code) || 500).json({ message: error.message });
            }
        });
    }
    updateRecordById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { body, files, params } = req;
                const { id } = params;
                const record = yield this.model.findOne({
                    attributes: {
                        exclude: ["owner_id"]
                    },
                    where: {
                        id,
                    }
                });
                if (!record)
                    throw new questions_exceptions_1.QuestionNotFound();
                record.update(body);
                return res.status(200).json({ message: 'Classroom Updated' });
            }
            catch (error) {
                return res.status((error === null || error === void 0 ? void 0 : error.code) || 500).json({ message: error.message });
            }
        });
    }
    deleteRecordById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const record = yield this.model.findOne({
                    where: {
                        id,
                    }
                });
                if (!record)
                    throw new questions_exceptions_1.QuestionNotFound();
                record.destroy();
                return res.status(200).json({ message: 'Classroom Eliminated' });
            }
            catch (error) {
                return res.status((error === null || error === void 0 ? void 0 : error.code) || 500).json({ message: error.message });
            }
        });
    }
}
exports.default = ClassroomController;
