import models from '../models'
import {UserNotFound,UserInactive,UserIncorretPassword, UserPasswordIncorrectSchema, UserActive, UserBadToken} from '../exceptions/users.exceptions'
import {createTokens,verifyToken} from '../helpers/jwt'
import {generate} from 'generate-password'
import EmailServer from '../providers/mail.provider'
import { Request,Response } from 'express'
import { JwtPayload } from 'jsonwebtoken'
import { validateEmail, validatePassword } from '../helpers/validateRequest'

class AuthController{
    private model:any
    constructor(){
        this.model=models.users
    }
    async signIn(req:Request,res:Response){
        try{
            const {email,password}=req.body
            const record=await this.model.findOne({
                where:{
                    email
                }
            })
            if(!record) throw new UserNotFound()
            if (!record.active_status) throw new UserInactive()
            const validatePassword=await record.validatePassword(password)
            if (!validatePassword) throw new UserIncorretPassword()
            const {rol_id,last_name,name} = record
            return res.status(200).json({...createTokens({id:record.id}),rol_id,last_name,name,id:record.id})
        }   
        catch(error:any){
            return res.status(error?.code || 500).json({message:error.message})
        }
    }
    async signUp(req:Request,res:Response){
        try{
            const {body}=req
            const {email,password} =body
            //Validate
            const{valid,text} =validatePassword(password)
            if(!valid) throw new UserPasswordIncorrectSchema(text)
            const {valid : validEmail,text:textEmail} =  validateEmail(email)
            if(!validEmail) throw new UserPasswordIncorrectSchema(textEmail)
            const record=this.model.build(body)
            await record.hashPassword()
            const token=generate({length:8,numbers:true})
            record.token = token
            await record.save()
            await EmailServer.send(email,"Please confirm you account",`Confirm you account : <button> <a href='http://localhost:5173/confirm?email=${email}&token=${token}'>Confirm account</a> </button>`)
            return res.status(201).json({record})
        }
        catch(error:any){
            return res.status(error?.code || 500).json({message:error.message})

        }
    }
    async refreshToken(req:Request,res:Response){
        try{
            const {refresh_token}=req.body
            const resultToken = verifyToken(refresh_token)
            const {id}=verifyToken(refresh_token) as JwtPayload
            const {accessToken}=createTokens({id})
            return res.status(200).json({accessToken})
        }
        catch(error:any){
            return res.status(error?.code || 500).json({message:error.message})

        }
    }
    async resetPassword(req:Request,res:Response){
        try{
            const {email}=req.body
            const record=await this.model.findOne({
                where:{
                    email
                }
            })
            if(!record) throw new UserNotFound()
            if (!record.active_status) throw new UserInactive()
            const newPassword=generate({length:15,numbers:true})
            record.password=newPassword
            await record.hashPassword()
            await EmailServer.resetPassword(email,newPassword)
           
            record.save()
            return res.status(200).json({message:'Reset password'})
        }
        catch(error:any){
            return res.status(error?.code || 500).json({message:error.message})

        }
    }
    async confirmAccount(req:Request,res:Response){
        try{
            const {email,token}=req.body
            const record=await this.model.findOne({
                where:{
                    email
                }
            })
            if(!record) throw new UserNotFound()
            if (record.active_status) throw new UserActive()
            if(token !== record.token) throw new UserBadToken()
            record.active_status = true
            record.save()
            return res.status(200).json({message:'Confirmed account successfully'})
        }
        catch(error:any){
            return res.status(error?.code || 500).json({message:error.message})

        }
    }

    /* OAuth */

    /* Facebook */
 
}
export default AuthController

/* if(pm.response.code===200){
    pm.enviroment.set('access_token',pm.response.json().access_token)
} */