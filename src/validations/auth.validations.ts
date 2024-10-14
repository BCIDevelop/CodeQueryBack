import {celebrator,Segments,Joi } from "celebrate"
import { RequestHandler } from "express"
class AuthValidation{
    private celebrate: (schema: object) => RequestHandler;
    constructor(){
        this.celebrate=celebrator({ reqContext:true},{convert:true})
    }
    signIn(){
        return this.celebrate({
            [Segments.BODY]:Joi.object().keys({
                email:Joi.string().required(),
                password:Joi.string().required(),
            })
        })
    }
    signUp(){
        return this.celebrate({
            [Segments.BODY]:Joi.object().keys({
                name:Joi.string().required(),
                last_name:Joi.string().required(),
                email:Joi.string().required(),
                password:Joi.string().required(),
                rol_id:Joi.number().integer().default(3),
                active_status:Joi.boolean()
            })
        })
    }
    refreshtoken(){
        return this.celebrate({
            [Segments.BODY]:Joi.object().keys({
                refresh_token:Joi.string().required(),
            })
        })
    }
    resetPassword(){
        return this.celebrate({
            [Segments.BODY]:Joi.object().keys({
                email:Joi.string().required()
                
            })
        })
    }
    confirmAccount(){
        return this.celebrate({
            [Segments.BODY]:Joi.object().keys({
                email:Joi.string().required(),
                token:Joi.string().required()
                
            })
        })
    }

}

export default new AuthValidation()