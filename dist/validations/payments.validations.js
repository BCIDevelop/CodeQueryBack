"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const celebrate_1 = require("celebrate");
class SubscriptionValidations {
    constructor() {
        this.celebrate = (0, celebrate_1.celebrator)({ reqContext: true }, { convert: true });
    }
    createCheckout() {
        return this.celebrate({
            [celebrate_1.Segments.BODY]: {
                name: celebrate_1.Joi.string().required()
            }
        });
    }
}
exports.default = new SubscriptionValidations();
