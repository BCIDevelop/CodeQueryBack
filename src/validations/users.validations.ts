import {celebrator,Segments,Joi} from "celebrate"

import { RequestHandler } from "express";
const fileExtensions = (joi: any) => ({
    type: 'file',
    base: joi.any(),
    messages: {
        'file.base': '"{{#label}}" debe ser un archivo',
        'file.invalidType': '"{{#label}}" debe ser un archivo PNG o JPG',
    },
    coerce(value: any, helpers: any) {
        
        if (value && value.size && value.path) {
           
            const fileExtension = value.path.split('.').pop().toLowerCase();
            
            // Verificar si la extensión es PNG o JPG
            if (fileExtension[1] === 'png' || fileExtension[1] === 'jpg' || fileExtension[1] === 'jpeg') {
                return { value }
            } else {
                return { value, errors: helpers.error('file.invalidType') }
            }
        }
        return { value, errors: helpers.error('file.base') }
    },
    
});
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
                avatar:joiCustom.file().contents().optional()
            }),
        })
    }
}


export default new UserValidations()