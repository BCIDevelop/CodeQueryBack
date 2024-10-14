"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const celebrate_1 = require("celebrate");
class UserValidations {
    constructor() {
        this.celebrate = (0, celebrate_1.celebrator)({ reqContext: true }, { convert: true });
    }
    listRecords() {
        return this.celebrate({
            [celebrate_1.Segments.QUERY]: {
                page: celebrate_1.Joi.number().integer().default(1),
                per_page: celebrate_1.Joi.number().integer().default(10),
            }
        });
    }
    createRecords() {
        return this.celebrate({
            [celebrate_1.Segments.BODY]: {
                message: celebrate_1.Joi.string().required(),
                chat_id: celebrate_1.Joi.number().required()
            }
        });
    }
}
exports.default = new UserValidations();
