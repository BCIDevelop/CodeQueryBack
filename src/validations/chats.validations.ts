import {celebrator,Segments,Joi} from "celebrate"

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
    createRecords(){
        return this.celebrate({
            [Segments.BODY]:{
            email:Joi.string().required()
            }
        })
    }
    
}


export default new UserValidations()