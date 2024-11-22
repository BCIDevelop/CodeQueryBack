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
const socket_io_1 = require("socket.io");
const events_1 = __importDefault(require("../events"));
const eventsLive_1 = __importDefault(require("../eventsLive"));
class SocketIO {
    constructor(express) {
        this.express = express;
        this.server = new socket_io_1.Server(this.express, {
            cors: {
                origin: "*",
            }
        });
    }
    init() {
        this.events();
    }
    events() {
        this.server.on('connection', (socket) => __awaiter(this, void 0, void 0, function* () {
            console.log(`Conexion con el socket --> ${socket.id}`);
            const chatId = socket.handshake.query.chatId;
            if (chatId)
                socket.join(chatId);
            yield (0, events_1.default)(socket, this.server);
        }));
        this.server.of('live').on('connection', (socket) => __awaiter(this, void 0, void 0, function* () {
            console.log(`Conexion con el socket live --> ${socket.id}`);
            const questionId = socket.handshake.query.questionId;
            if (questionId)
                socket.join(`question${questionId}`);
            yield (0, eventsLive_1.default)(socket, this.server.of('live'));
        }));
    }
}
exports.default = SocketIO;
