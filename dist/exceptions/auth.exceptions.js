"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthorizationNotFound = void 0;
class AuthorizationNotFound {
    constructor() {
        this.message = 'Header Authorzation not found';
        this.code = 401;
    }
}
exports.AuthorizationNotFound = AuthorizationNotFound;
