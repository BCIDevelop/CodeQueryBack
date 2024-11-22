import { Router,Request,Response } from "express";
import { isAuthenticated } from "../middlewares/auth.middlewares";
import PaymentController from "../controllers/payments.controller";
import Validation from '../validations/payments.validations'

class PaymentRouter{
    private router: Router
    constructor(){
        this.router = Router()
    }
    init(){

        return this.router
        .post('/checkout',Validation.createCheckout(),isAuthenticated,this.getCheckout)
        .post('/webhook',this.getWebhook)
        .get('/customerPortal',isAuthenticated,this.getCustomerPortal)
    }
    async getCheckout(req:Request,res:Response){
        const controller =  new PaymentController()
        await controller.getCheckOut(req,res)
    }
    async getWebhook(req:Request,res:Response){
        const controller =  new PaymentController()
        await controller.getWebhook(req,res)
    }
    async getCustomerPortal(req:Request,res:Response){
        const controller =  new PaymentController()
        await controller.getCustomerPortal(req,res)
    }
}
export default new PaymentRouter()