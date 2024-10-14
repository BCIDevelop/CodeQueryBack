"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatNotFound = exports.ChatFound = void 0;
class ChatFound {
    constructor() {
        this.message = 'Chat already exists';
        this.code = 400;
    }
}
exports.ChatFound = ChatFound;
class ChatNotFound {
    constructor() {
        this.message = 'Chat doesnt exist';
        this.code = 404;
    }
}
exports.ChatNotFound = ChatNotFound;
