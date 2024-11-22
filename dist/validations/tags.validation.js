"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const celebrate_1 = require("celebrate");
class TagValidations {
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
    createRecord() {
        return this.celebrate({
            [celebrate_1.Segments.BODY]: celebrate_1.Joi.object().keys({
                name: celebrate_1.Joi.string().required(),
            }),
        });
    }
}
exports.default = new TagValidations();
