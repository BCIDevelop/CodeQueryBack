"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserIncorretPassword = exports.UserInactive = exports.UserNotFound = void 0;
class UserNotFound {
    constructor() {
        this.message = 'User Not Found';
        this.code = 404;
    }
}
exports.UserNotFound = UserNotFound;
class UserInactive {
    constructor() {
        this.message = 'User Inactive';
        this.code = 401;
    }
}
exports.UserInactive = UserInactive;
class UserIncorretPassword {
    constructor() {
        this.message = 'Incorret password';
        this.code = 401;
    }
}
exports.UserIncorretPassword = UserIncorretPassword;
