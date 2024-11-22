import {celebrator,Segments,Joi} from "celebrate"
import { RequestHandler } from "express";
class SubscriptionValidations{
    private celebrate: (schema: object) => RequestHandler;
    constructor(){
        this.celebrate=celebrator({ reqContext:true},{convert:true})
    }
    
    createCheckout(){
        return this.celebrate({
            [Segments.BODY]:{
                name:Joi.string().required()
            }
        })
    }
    
}


export default new SubscriptionValidations()