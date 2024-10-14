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
const messages_exceptions_1 = require("../exceptions/messages.exceptions");
class MessageController {
    constructor() {
        this.model = models_1.default.messages;
        this.chatModel = models_1.default.chats;
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
                        exclude: ['chat_id']
                    },
                    where: {
                        chat_id: id
                    },
                    order: [
                        ['created_at', 'ASC']
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
                const { message, chat_id } = req.body;
                const owner_id = req.current_user;
                const record_chat = yield this.chatModel.findOne({
                    where: {
                        id: chat_id
                    }
                });
                if (!record_chat)
                    throw new chats_exceptions_1.ChatNotFound();
                const record = this.model.build({ message, chat_id, owner_id });
                yield record.save();
                return res.status(201).json(record);
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
                    throw new messages_exceptions_1.MessageNotFound();
                record.destroy();
                return res.status(200).json({ message: 'Message Eliminated' });
            }
            catch (error) {
                return res.status((error === null || error === void 0 ? void 0 : error.code) || 500).json({ message: error.message });
            }
        });
    }
}
exports.default = MessageController;
