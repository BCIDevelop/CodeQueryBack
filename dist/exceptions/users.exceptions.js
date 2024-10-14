"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserPasswordIncorrectSchema = exports.UserIncorretPassword = exports.UserBadToken = exports.UserActive = exports.UserInactive = exports.UserNotFound = void 0;
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
class UserActive {
    constructor() {
        this.message = 'User already active';
        this.code = 401;
    }
}
exports.UserActive = UserActive;
class UserBadToken {
    constructor() {
        this.message = 'Token doesnt match';
        this.code = 401;
    }
}
exports.UserBadToken = UserBadToken;
class UserIncorretPassword {
    constructor() {
        this.message = 'Incorret password';
        this.code = 401;
    }
}
exports.UserIncorretPassword = UserIncorretPassword;
class UserPasswordIncorrectSchema {
    constructor(message = 'Incorret password') {
        this.message = message;
        this.code = 401;
    }
}
exports.UserPasswordIncorrectSchema = UserPasswordIncorrectSchema;
