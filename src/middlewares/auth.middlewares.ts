import { AuthorizationNotFound } from "../exceptions/auth.exceptions"
import { verifyToken } from "../helpers/jwt"
import { Response,NextFunction } from "express"
import { JwtPayload } from "jsonwebtoken"
import { AuthenticatedRequest } from "../types/request.type"

export const isAuthenticated=(request:AuthenticatedRequest,response:Response,next:NextFunction):any =>{
    try{
        const {authorization}=request.headers
        if(!authorization) throw new AuthorizationNotFound()
        const accessToken=authorization.split(" ")[1]
        const {id}=verifyToken(accessToken) as JwtPayload
        request.current_user=id
        return next()
    }
    catch(error:any){
        return response.status(error?.code||403).json({message:error.message})
    }
}