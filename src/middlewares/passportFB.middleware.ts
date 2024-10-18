import passport from "passport"
import {Strategy}  from 'passport-facebook'
import models from '../models'
import {  createTokens } from "../helpers/jwt"
import { Request,Response,NextFunction} from "express";
import { UserClient } from "../types/user.type";
export const passportFBConfiguration=(req:Request,res:Response,next:NextFunction)=>{
    
    passport.use(new Strategy({
        clientID: process.env.FACEBOOK_APP_ID!,
        clientSecret: process.env.FACEBOOK_APP_SECRET!,
        callbackURL: "http://localhost:8000/auth/facebook/callback",
        scope: ['public_profile', 'email'] ,
        profileFields: [ 'emails','picture','name']

    },async (accessToken:any,refreshToken:any, profile:any,cb:(error:any,body:UserClient|null)=>void)=>{
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
           return cb(error,null)
        }
          
        }))
    passport.authenticate('facebook',{ session: false })(req,res,next)
   

}   

export const passportFBCallback =(req:Request,res:Response,next:NextFunction)=>{
    
    passport.authenticate('facebook',{session:false},(err:any,userBody:UserClient)=>{
        if(err || !userBody) return res.redirect('http://localhost:5173/error')
        const {accessToken,refreshToken}=createTokens({id:userBody.id})
        const {email,id,rol_id,name,last_name,avatar} = userBody
        const url = avatar 
        ?`http://localhost:5173/auth/success?accessToken=${accessToken}&refreshToken=${refreshToken}&email=${email}&id=${id}&rol_id=${rol_id}&last_name=${last_name}&name=${name}&avatar=${avatar}`
        :`http://localhost:5173/auth/success?accessToken=${accessToken}&refreshToken=${refreshToken}&email=${email}&id=${id}&rol_id=${rol_id}&last_name=${last_name}&name=${name}` 
        return res.redirect(url);
    })(req,res,next)
}