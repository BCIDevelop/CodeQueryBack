import {celebrator,Segments,Joi} from "celebrate"
import { RequestHandler } from "express";

class ClassroomValidations{
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
        return this.celebrate({
            [Segments.BODY]:Joi.object().keys({
                classroom_name:Joi.string().required(),
                description:Joi.string().required(),
                owner_id:Joi.number().required()
            }),
            
        })
    }
    updateRecord(){
        return this.celebrate({
            [Segments.BODY]:Joi.object().keys({
                classroom_name:Joi.string().optional(),
                description:Joi.string().optional(),
               
            }),
        })
    }
}
export default new ClassroomValidations()