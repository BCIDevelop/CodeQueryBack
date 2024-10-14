import { Router ,Request,Response} from "express";
import Validation from '../validations/auth.validations'
import AuthController from "../controllers/auth.controller";
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