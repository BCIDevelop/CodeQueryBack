import {celebrator,Segments,Joi} from "celebrate"
import { RequestHandler } from "express";
import { fileExtensions } from "../helpers/fileExtensions";
class AnswerValidations{
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
                question_id:Joi.number().required(),
                body:Joi.string().required(),
                image:joiCustom.file().optional(),
            }),
            
        })
    }
    updateRecord(){
        const joiCustom=Joi.extend(fileExtensions)
        return this.celebrate({
            [Segments.BODY]:Joi.object().keys({
                body:Joi.string().optional(),
                image:joiCustom.file().optional(),
                is_accepted:Joi.boolean().optional()
               
            }),
        })
    }
}
export default new AnswerValidations()