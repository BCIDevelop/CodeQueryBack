"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const celebrate_1 = require("celebrate");
const fileExtensions_1 = require("../helpers/fileExtensions");
class QuestionValidations {
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
                classroom_id: celebrate_1.Joi.number().required(),
                body: celebrate_1.Joi.string().required(),
                title: celebrate_1.Joi.string().required(),
                image: joiCustom.file().optional(),
                tags: celebrate_1.Joi.array().optional(),
                created_at: celebrate_1.Joi.string().optional(), // TODO: TESTING PURPOSE
            }),
        });
    }
    updateRecord() {
        const joiCustom = celebrate_1.Joi.extend(fileExtensions_1.fileExtensions);
        return this.celebrate({
            [celebrate_1.Segments.BODY]: celebrate_1.Joi.object().keys({
                body: celebrate_1.Joi.string().optional(),
                title: celebrate_1.Joi.string().optional(),
                image: joiCustom.file().optional(),
                tags: celebrate_1.Joi.array().optional()
            }),
        });
    }
}
exports.default = new QuestionValidations();
