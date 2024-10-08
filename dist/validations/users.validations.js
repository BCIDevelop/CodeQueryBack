"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const celebrate_1 = require("celebrate");
const fileExtensions_1 = require("../helpers/fileExtensions");
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
    createRecord() {
        const joiCustom = celebrate_1.Joi.extend(fileExtensions_1.fileExtensions);
        return this.celebrate({
            [celebrate_1.Segments.BODY]: celebrate_1.Joi.object().keys({
                name: celebrate_1.Joi.string().required(),
                last_name: celebrate_1.Joi.string().required(),
                password: celebrate_1.Joi.string().required(),
                email: celebrate_1.Joi.string().required(),
                rol_id: celebrate_1.Joi.number().integer().required(),
                avatar: joiCustom.file().optional()
            }),
        });
    }
    updateRecord() {
        const joiCustom = celebrate_1.Joi.extend(fileExtensions_1.fileExtensions);
        return this.celebrate({
            [celebrate_1.Segments.BODY]: celebrate_1.Joi.object().keys({
                name: celebrate_1.Joi.string().optional(),
                last_name: celebrate_1.Joi.string().optional(),
                password: celebrate_1.Joi.string().optional(),
                email: celebrate_1.Joi.string().optional(),
                rol_id: celebrate_1.Joi.number().integer().optional(),
                avatar: joiCustom.file().optional()
            }),
        });
    }
}
exports.default = new UserValidations();
