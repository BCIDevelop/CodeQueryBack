"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionActive = exports.SubscriptionProductFound = exports.SubscriptionNotFound = void 0;
class SubscriptionNotFound {
    constructor() {
        this.message = 'Subscription Not Found, Please create product in your dashboard';
        this.code = 404;
    }
}
exports.SubscriptionNotFound = SubscriptionNotFound;
class SubscriptionProductFound {
    constructor() {
        this.message = 'Subscription already exist';
        this.code = 404;
    }
}
exports.SubscriptionProductFound = SubscriptionProductFound;
class SubscriptionActive {
    constructor() {
        this.message = 'Already hava a Subscription with your account';
        this.code = 400;
    }
}
exports.SubscriptionActive = SubscriptionActive;
