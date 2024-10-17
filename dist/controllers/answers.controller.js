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
const s3_provider_1 = __importDefault(require("../providers/s3.provider"));
const imageManage_1 = require("../helpers/imageManage");
const answers_exceptions_1 = require("../exceptions/answers.exceptions");
const questions_exceptions_1 = require("../exceptions/questions.exceptions");
class AnswerController {
    constructor() {
        this.model = models_1.default.answers;
        this.bucket = new s3_provider_1.default('answers');
    }
    listRecordsByClassrooms(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { page, per_page } = req.query;
                const { limit, offset } = (0, pagination_1.paginationField)(Number(page), Number(per_page));
                const { classroom_id } = req.params;
                const records = yield this.model.findAndCountAll({
                    limit,
                    offset,
                    attributes: ['created_at'],
                    where: {
                        classroom_id
                    },
                    order: [
                        ['id', 'ASC']
                    ],
                });
                return res.status(200).json((0, pagination_1.paginatioResults)(records, Number(page), Number(per_page)));
            }
            catch (error) {
                console.log(error);
                return res.status(500).json({ message: error.message });
            }
        });
    }
    listRecords(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { page, per_page } = req.query;
                const { limit, offset } = (0, pagination_1.paginationField)(Number(page), Number(per_page));
                const { question_id } = req.params;
                const records = yield this.model.findAndCountAll({
                    limit,
                    offset,
                    attributes: {
                        exclude: ['question_id', 'user_id'],
                    },
                    where: {
                        question_id
                    },
                    order: [
                        ['id', 'ASC']
                    ],
                    include: [{
                            model: models_1.default.users,
                            attributes: ['id', 'name', 'last_name', 'avatar', 'rol_id']
                        },
                    ]
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
                req.body.user_id = req.current_user;
                if (req.files) {
                    const name = (0, imageManage_1.validateImage)(req.files.image);
                    /* const urlImage=await this.bucket.uploadFile(req.files.image as UploadedFile ,addSugar(name,req.current_user as string)) */
                    req.body['image'] = "test";
                }
                const record = this.model.build(req.body);
                yield record.save();
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
                        exclude: ['question_id', 'user_id']
                    },
                    where: {
                        id
                    },
                    include: [{
                            model: models_1.default.users,
                            attributes: ['id', 'name', 'last_name', 'avatar', 'rol_id']
                        },
                    ]
                });
                if (!record)
                    throw new answers_exceptions_1.AnswerNotFound();
                return res.status(200).json(record);
            }
            catch (error) {
                return res.status((error === null || error === void 0 ? void 0 : error.code) || 500).json({ message: error.message });
            }
        });
    }
    updateRecordById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const transaction = yield this.model.sequelize.transaction();
            try {
                let { body, files, params } = req;
                const { id } = params;
                const record = yield this.model.findOne({
                    attributes: {
                        exclude: ['user_id']
                    },
                    where: {
                        id,
                    }
                });
                if (!record)
                    throw new answers_exceptions_1.AnswerNotFound();
                if (files) {
                    (0, imageManage_1.validateImage)(files.image);
                    /* const urlImage=await this.bucket.uploadFile(req.files.image as UploadedFile ,record.image) */
                    req.body['image'] = "test";
                }
                if (body.is_accepted) {
                    const record_question = yield models_1.default.questions.findOne({
                        attributes: {
                            exclude: ["user_id", "classroom_id"]
                        },
                        where: {
                            id: record.question_id
                        }
                    });
                    if (!record_question)
                        throw new questions_exceptions_1.QuestionNotFound();
                    record_question.status = 'SOLVED';
                    yield record_question.update(record_question.dataValues, { transaction });
                }
                yield record.update(body, { transaction });
                yield transaction.commit();
                return res.status(200).json({ message: 'Answer Updated' });
            }
            catch (error) {
                yield transaction.rollback();
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
                    throw new answers_exceptions_1.AnswerNotFound();
                record.destroy();
                return res.status(200).json({ message: 'Answer Eliminated' });
            }
            catch (error) {
                return res.status((error === null || error === void 0 ? void 0 : error.code) || 500).json({ message: error.message });
            }
        });
    }
}
exports.default = AnswerController;
