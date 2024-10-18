import { Router ,Request,Response} from "express";
import Validation from '../validations/auth.validations'
import AuthController from "../controllers/auth.controller";
import { passportFBCallback, passportFBConfiguration } from "../middlewares/passportFB.middleware";


class AuthRouter{
    private router:Router
   
    constructor(){
        this.router=Router()
    }
    init(){
        return this.router
        .post("/signIn",Validation.signIn(),this.signIn)
        .post("/refresh_token",Validation.refreshtoken(),this.refreshToken)
        .post("/reset_password",Validation.resetPassword(),this.resetPassword)
        .post("/signUp",Validation.signUp(),this.signUp)
        .patch("/confirm",Validation.confirmAccount(),this.confirmAccount)
        /* Facebook OAuth */
        .get("/facebook",(req,res,next)=>passportFBConfiguration(req,res,next))
        .get('/facebook/callback',(req,res,next)=>passportFBCallback(req,res,next))
            

    }
    
    async confirmAccount(req:Request,res:Response){
        const controller=new AuthController()
         controller.confirmAccount(req,res)
     }
    async signIn(req:Request,res:Response){
       const controller=new AuthController()
        controller.signIn(req,res)
    }
    async signUp(req:Request,res:Response){
        const controller=new AuthController()
        controller.signUp(req,res)
    }
    async refreshToken(req:Request,res:Response){
        const controller=new AuthController()
        controller.refreshToken(req,res)
    }
  
    async resetPassword(req:Request,res:Response){
        const controller=new AuthController()
        controller.resetPassword(req,res)
    }
}
export default new AuthRouter()