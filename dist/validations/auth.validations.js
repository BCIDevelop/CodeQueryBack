"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const celebrate_1 = require("celebrate");
class AuthValidation {
    constructor() {
        this.celebrate = (0, celebrate_1.celebrator)({ reqContext: true }, { convert: true });
    }
    signIn() {
        return this.celebrate({
            [celebrate_1.Segments.BODY]: celebrate_1.Joi.object().keys({
                email: celebrate_1.Joi.string().required(),
                password: celebrate_1.Joi.string().required(),
            })
        });
    }
    signUp() {
        return this.celebrate({
            [celebrate_1.Segments.BODY]: celebrate_1.Joi.object().keys({
                name: celebrate_1.Joi.string().required(),
                last_name: celebrate_1.Joi.string().required(),
                email: celebrate_1.Joi.string().required(),
                password: celebrate_1.Joi.string().required(),
                rol_id: celebrate_1.Joi.number().integer().default(3),
                active_status: celebrate_1.Joi.boolean().default(false)
            })
        });
    }
    refreshtoken() {
        return this.celebrate({
            [celebrate_1.Segments.BODY]: celebrate_1.Joi.object().keys({
                refresh_token: celebrate_1.Joi.string().required(),
            })
        });
    }
    resetPassword() {
        return this.celebrate({
            [celebrate_1.Segments.BODY]: celebrate_1.Joi.object().keys({
                email: celebrate_1.Joi.string().required()
            })
        });
    }
    confirmAccount() {
        return this.celebrate({
            [celebrate_1.Segments.BODY]: celebrate_1.Joi.object().keys({
                email: celebrate_1.Joi.string().required(),
                token: celebrate_1.Joi.string().required()
            })
        });
    }
}
exports.default = new AuthValidation();
