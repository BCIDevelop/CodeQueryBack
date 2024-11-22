import { Request, Response, Router } from "express";
import HealthController from "../controllers/health.controller";


class HealthRouter{
    private router:Router
  
    constructor(){
        this.router = Router()
    }
    init(){
        return this.router.get('/',this.success)
    }
    success(req:Request,res:Response){
        const controller = new HealthController()
        controller.check(req,res)
    }
}
export default new HealthRouter()