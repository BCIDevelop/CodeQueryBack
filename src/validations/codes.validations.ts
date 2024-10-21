import {celebrator,Segments,Joi} from "celebrate"
import { RequestHandler } from "express";
class CodeValidations{
    private celebrate: (schema: object) => RequestHandler;
    constructor(){
        this.celebrate=celebrator({ reqContext:true},{convert:true})
    }
    executeCode(){
        return this.celebrate({
            [Segments.BODY]:Joi.object().keys({
                code:Joi.string().required(),
                language:Joi.string().required()
            }),
        })
    }
   
}


export default new CodeValidations()