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
const users_exceptions_1 = require("../exceptions/users.exceptions");
class UserController {
    constructor() {
        this.model = models_1.default.users;
        this.bucket = new s3_provider_1.default('avatars');
    }
    listRecords(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { page, per_page } = req.query;
                const { limit, offset } = (0, pagination_1.paginationField)(Number(page), Number(per_page));
                const records = yield this.model.findAndCountAll({
                    limit,
                    offset,
                    attributes: {
                        exclude: ['password']
                    },
                    where: {
                        active_status: true
                    },
                    order: [
                        ['id', 'ASC']
                    ],
                    include: [{
                            model: models_1.default.roles,
                            attributes: ['id', 'name']
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
            const transaction = yield this.model.sequelize.transaction();
            try {
                const record = this.model.build(req.body);
                yield record.hashPassword();
                yield record.save();
                if (req.files) {
                    const acceptedMimetypes = ['application/jpg', 'image/png', 'application/jpeg'];
                    const avatar = req.files.avatar;
                    if (!acceptedMimetypes.includes(avatar.mimetype))
                        throw new Error("File must be png,jpeg,jpg");
                    /* const urlAvatar=await this.bucket.uploadFile(avatar,record.id) */
                    req.body['avatar'] = "test";
                }
                yield transaction.commit();
                return res.status(201).json(record);
            }
            catch (error) {
                yield transaction.rollback();
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
                        exclude: ["password"]
                    },
                    where: {
                        id,
                    }
                });
                if (!record)
                    throw new users_exceptions_1.UserNotFound();
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
                        exclude: ["password"]
                    },
                    where: {
                        id,
                    }
                });
                if (!record)
                    throw new users_exceptions_1.UserNotFound();
                if (files) {
                    const avatar = req.files.avatar;
                    const urlAvatar = yield this.bucket.uploadFile(avatar, id);
                    body["avatar"] = urlAvatar;
                }
                record.update(body);
                return res.status(200).json({ message: 'User Updated' });
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
                    throw new users_exceptions_1.UserNotFound();
                record.update({ status: false });
                return res.status(200).json({});
            }
            catch (error) {
                return res.status((error === null || error === void 0 ? void 0 : error.code) || 500).json({ message: error.message });
            }
        });
    }
}
exports.default = UserController;
