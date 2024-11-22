"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodesLimitReached = exports.CodesNotFound = void 0;
class CodesNotFound {
    constructor() {
        this.message = 'Code Not Allowed';
        this.code = 400;
    }
}
exports.CodesNotFound = CodesNotFound;
class CodesLimitReached {
    constructor() {
        this.message = 'Free Limit Use Spent';
        this.code = 400;
    }
}
exports.CodesLimitReached = CodesLimitReached;
