"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const celebrate_1 = require("celebrate");
class CodeValidations {
    constructor() {
        this.celebrate = (0, celebrate_1.celebrator)({ reqContext: true }, { convert: true });
    }
    executeCode() {
        return this.celebrate({
            [celebrate_1.Segments.BODY]: celebrate_1.Joi.object().keys({
                code: celebrate_1.Joi.string().required(),
                language: celebrate_1.Joi.string().required()
            }),
        });
    }
}
exports.default = new CodeValidations();
