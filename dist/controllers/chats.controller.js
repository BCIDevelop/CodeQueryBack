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
const chats_exceptions_1 = require("../exceptions/chats.exceptions");
const users_exceptions_1 = require("../exceptions/users.exceptions");
const sequelize_1 = require("sequelize");
class ChatController {
    constructor() {
        this.model = models_1.default.chats;
        this.userModel = models_1.default.users;
    }
    listRecords(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { page, per_page } = req.query;
                const { limit, offset } = (0, pagination_1.paginationField)(Number(page), Number(per_page));
                const user_id = req.current_user;
                const records = yield this.model.findAndCountAll({
                    limit,
                    offset,
                    attributes: {
                        exclude: ['sender_id']
                    },
                    include: [{
                            model: models_1.default.users,
                            attributes: ['id', 'name', 'last_name', 'avatar', 'rol_id'],
                        },
                    ],
                    where: {
                        [sequelize_1.Op.or]: [
                            { sender_id: user_id, },
                            { receiver_id: user_id }
                        ]
                    },
                    order: [
                        ['id', 'ASC']
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
                const { email } = req.body;
                const record_user = yield this.userModel.findOne({
                    attributes: {
                        exclude: ['password', 'token']
                    },
                    where: {
                        email
                    }
                });
                if (!record_user)
                    throw new users_exceptions_1.UserNotFound();
                const sender_id = req.current_user;
                const receiver_id = record_user.id;
                const record_chat = yield this.model.findOne({
                    where: {
                        receiver_id,
                        sender_id
                    }
                });
                if (record_chat)
                    throw new chats_exceptions_1.ChatFound();
                const record = this.model.build({ sender_id, receiver_id });
                yield record.save();
                return res.status(201).json({ id: record.id, user: record_user });
            }
            catch (error) {
                return res.status(500).json({ message: error.message });
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
                    throw new chats_exceptions_1.ChatNotFound();
                record.destroy();
                return res.status(200).json({ message: 'Chat Eliminated' });
            }
            catch (error) {
                return res.status((error === null || error === void 0 ? void 0 : error.code) || 500).json({ message: error.message });
            }
        });
    }
}
exports.default = ChatController;
