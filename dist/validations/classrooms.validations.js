"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const celebrate_1 = require("celebrate");
class ClassroomValidations {
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
                classroom_name: celebrate_1.Joi.string().required(),
                description: celebrate_1.Joi.string().required(),
                owner_id: celebrate_1.Joi.number().required()
            }),
        });
    }
    updateRecord() {
        return this.celebrate({
            [celebrate_1.Segments.BODY]: celebrate_1.Joi.object().keys({
                classroom_name: celebrate_1.Joi.string().optional(),
                description: celebrate_1.Joi.string().optional(),
            }),
        });
    }
    addStudents() {
        return this.celebrate({
            [celebrate_1.Segments.BODY]: celebrate_1.Joi.object().keys({
                email: celebrate_1.Joi.string().required(),
            }),
        });
    }
    confirmStudent() {
        return this.celebrate({
            [celebrate_1.Segments.BODY]: celebrate_1.Joi.object().keys({
                token: celebrate_1.Joi.string().required(),
            }),
        });
    }
    addBulkStudents() {
        return this.celebrate({
            [celebrate_1.Segments.BODY]: celebrate_1.Joi.object().keys({
                users: celebrate_1.Joi.array().required(),
            }),
        });
    }
}
exports.default = new ClassroomValidations();
