"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const celebrate_1 = require("celebrate");
const fileExtensions = (joi) => ({
    type: 'file',
    base: joi.any(),
    messages: {
        'file.base': '"{{#label}}" debe ser un archivo',
        'file.invalidType': '"{{#label}}" debe ser un archivo PNG o JPG',
    },
    coerce(value, helpers) {
        if (value && value.size && value.path) {
            const fileExtension = value.path.split('.').pop().toLowerCase();
            // Verificar si la extensión es PNG o JPG
            if (fileExtension[1] === 'png' || fileExtension[1] === 'jpg' || fileExtension[1] === 'jpeg') {
                return { value };
            }
            else {
                return { value, errors: helpers.error('file.invalidType') };
            }
        }
        return { value, errors: helpers.error('file.base') };
    },
});
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
        const joiCustom = celebrate_1.Joi.extend(fileExtensions);
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
        const joiCustom = celebrate_1.Joi.extend(fileExtensions);
        return this.celebrate({
            [celebrate_1.Segments.BODY]: celebrate_1.Joi.object().keys({
                name: celebrate_1.Joi.string().optional(),
                last_name: celebrate_1.Joi.string().optional(),
                password: celebrate_1.Joi.string().optional(),
                email: celebrate_1.Joi.string().optional(),
                rol_id: celebrate_1.Joi.number().integer().optional(),
                avatar: joiCustom.file().contents().optional()
            }),
        });
    }
}
exports.default = new UserValidations();
