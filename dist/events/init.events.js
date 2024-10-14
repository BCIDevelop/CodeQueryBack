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
exports.default = (socket, io) => __awaiter(void 0, void 0, void 0, function* () {
    socket.on('join', () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const chatId = socket.handshake.query.chatId;
            const record = yield models_1.default.messages.findAndCountAll({
                limit: 7,
                offset: 0,
                attributes: {
                    exclude: ['chat_id']
                },
                where: {
                    chat_id: chatId
                },
                order: [
                    ['created_at', 'DESC']
                ]
            });
            io.to(chatId).emit('allMessages', { results: record.rows });
        }
        catch (error) {
            console.log(error);
        }
    }));
});
