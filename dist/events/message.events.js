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
    socket.on('message', (data, ack) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const chat_id = socket.handshake.query.chatId;
            const { message, owner_id } = data;
            const record = models_1.default.messages.build({ message, chat_id, owner_id });
            yield record.save();
            const recordUser = yield models_1.default.users.findOne({
                where: {
                    id: owner_id
                },
            });
            recordUser.last_message = message;
            yield recordUser.save();
            socket.broadcast.in(chat_id).emit('incommingMessage', record);
            ack({ success: true, record });
        }
        catch (error) {
            console.error("Error saving message:", error);
            ack({ success: false, error: error.message });
        }
    }));
});
