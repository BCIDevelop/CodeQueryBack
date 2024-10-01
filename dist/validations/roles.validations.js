"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const celebrate_1 = require("celebrate");
class RoleValidations {
    constructor() {
        this.celebrate = (0, celebrate_1.celebrator)({ reqContext: true }, { convert: true });
    }
    createRecord() {
        return this.celebrate({
            [celebrate_1.Segments.BODY]: celebrate_1.Joi.object().keys({
                name: celebrate_1.Joi.string().required()
            }),
        });
    }
    updateRecord() {
        return this.celebrate({
            [celebrate_1.Segments.BODY]: celebrate_1.Joi.object().keys({
                name: celebrate_1.Joi.string().optional(),
            }),
        });
    }
}
exports.default = new RoleValidations();
