import {celebrator,Segments,Joi} from "celebrate"
import { fileExtensions } from "../helpers/fileExtensions";
import { RequestHandler } from "express";

class UserValidations{
    private celebrate: (schema: object) => RequestHandler;
    constructor(){
        this.celebrate=celebrator({ reqContext:true},{convert:true})
    }
    listRecords(){
        return this.celebrate({
            [Segments.QUERY]:{
                page:Joi.number().integer().default(1),
                per_page:Joi.number().integer().default(10),
            }
    })
    }
    createRecord(){
        const joiCustom=Joi.extend(fileExtensions)
        return this.celebrate({
            [Segments.BODY]:Joi.object().keys({
                name:Joi.string().required(),
                last_name:Joi.string().required(),
                password:Joi.string().required(),
                email:Joi.string().required(),
                rol_id:Joi.number().integer().required(),
                avatar:joiCustom.file().optional()
                
            }),
            
        })
    }
    updateRecord(){
        const joiCustom=Joi.extend(fileExtensions)

        return this.celebrate({
            [Segments.BODY]:Joi.object().keys({
                name:Joi.string().optional(),
                last_name:Joi.string().optional(),
                password:Joi.string().optional(),
                email:Joi.string().optional(),
                rol_id:Joi.number().integer().optional(),
                avatar:joiCustom.file().optional()
            }),
        })
    }
}


export default new UserValidations()