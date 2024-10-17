import  {sign,verify} from 'jsonwebtoken'
import auth from '../config/auth'

export const createTokens=(payload:{})=>{
    const {secretKey,accessExpire,refreshExpire}=auth
    const accessToken=sign(payload,secretKey!,{expiresIn:accessExpire})
    const refreshToken=sign({...payload,refresh:true},secretKey!,{expiresIn:refreshExpire})
    return {
        accessToken,
        refreshToken
    }
}
export const verifyToken=(token:string)=>{
    return verify(token,auth!.secretKey!)
}
export const createToken=(payload:{})=>{
    const {secretKey,refreshExpire}=auth
    const token=sign(payload,secretKey!,{expiresIn:refreshExpire})
    return token
}