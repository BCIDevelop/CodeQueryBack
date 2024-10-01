import models from '../models'
import {UserNotFound,UserInactive,UserIncorretPassword} from '../exceptions/users.exceptions'
import {createTokens,verifyToken} from '../helpers/jwt'
import {generate} from 'generate-password'
import EmailServer from '../providers/mail.provider'
import { Request,Response } from 'express'
import { JwtPayload } from 'jsonwebtoken'

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
            // Usuario no existe
            if(!record) throw new UserNotFound()
            //Usario inhabilitado
            if (!record.active_status) throw new UserInactive()
            //Contra incorrecta
            const validatePassword=await record.validatePassword(password)

            if (!validatePassword) throw new UserIncorretPassword()
            return res.status(200).json(createTokens({id:record.id}))
        }   
        catch(error:any){
            return res.status(error?.code || 500).json({message:error.message})
        }
    }
    async signUp(req:Request,res:Response){
        try{
            const {body}=req
            const email =body.email
            const record=this.model.build(body)
            await record.hashPassword()
            await record.save()
            await EmailServer.send(email,"Please confirm you account",`Confirm you account : <button> Confirm account </button>`)
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
            if (!record.status) throw new UserInactive()
            const newPassword=generate({length:8,numbers:true,symbols:true})
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
}
export default AuthController

/* if(pm.response.code===200){
    pm.enviroment.set('access_token',pm.response.json().access_token)
} */