import passport from "passport"
import {Strategy}  from 'passport-google-oauth20'
import models from '../models'
import {  createTokens } from "../helpers/jwt"
import { Request,Response,NextFunction} from "express";
import { UserClient } from "../types/user.type";
export const passportGmailConfiguration=(req:Request,res:Response,next:NextFunction)=>{
    
    passport.use(new Strategy({
        clientID: process.env.GOOGLE_APP_ID!,
        clientSecret: process.env.GOOGLE_APP_SECRET!,
        callbackURL: `${process.env.SERVER_URL}/auth/gmail/callback`,
        scope: ['profile','email'] ,
        state:false,
        passReqToCallback:true

    },async (req:Request,res:any,accessToken:any,refreshToken:any, profile:any,cb:(error:any,body:UserClient|undefined)=>void)=>{
        console.log(profile)
        try {
            
           
            const profile_email =profile.emails[0].value
            const name = profile.name.givenName
            const last_name = profile.name.familyName
            const avatar = profile.photos[0].value ? profile.photos[0].value : null
            const userBody = {name,last_name,avatar,rol_id:1,active_status:true,password:"testpassword",email:profile_email} as UserClient 
            const record = await models.users.findOne({
                where:{
                    email:profile_email
                }
            })
            
            if(!record) {
                const userRecord = models.users.build(userBody)
                await userRecord.hashPassword()
                const userStored=await userRecord.save()
                userBody.id=userStored.id
            } else userBody.id=record.id
            
            return cb(null,userBody)
        } catch (error) {
            console.log(error)
           return cb(error,undefined)
        }
          
        }))
    passport.authenticate('google',{ session: false })(req,res,next)
   

}   

export const passportGmailCallback =(req:Request,res:Response,next:NextFunction)=>{
    
    passport.authenticate('google',{session:false},(err:any,userBody:UserClient)=>{
        if(err || !userBody) return res.redirect(`${process.env.CLIENT_URL}/error`)
        const {accessToken,refreshToken}=createTokens({id:userBody.id})
        const {email,id,rol_id,name,last_name,avatar} = userBody
        const url = avatar 
        ?`${process.env.CLIENT_URL}/auth/success?accessToken=${accessToken}&refreshToken=${refreshToken}&email=${email}&id=${id}&rol_id=${rol_id}&last_name=${last_name}&name=${name}&avatar=${avatar}`
        :`${process.env.CLIENT_URL}/auth/success?accessToken=${accessToken}&refreshToken=${refreshToken}&email=${email}&id=${id}&rol_id=${rol_id}&last_name=${last_name}&name=${name}` 
        return res.redirect(url);
    })(req,res,next)
}